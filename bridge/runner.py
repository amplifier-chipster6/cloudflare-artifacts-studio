#!/usr/bin/env python3
"""Outbound, explicitly enabled Artifacts Studio execution adapter (stdlib only)."""
from __future__ import annotations

import argparse
import concurrent.futures
import json
import os
from pathlib import Path
import re
import shutil
import signal
import subprocess
import sys
import tempfile
import threading
import time
import urllib.error
import urllib.parse
import urllib.request

MAX_RUN_SECONDS = 3000
MAX_COMMAND_BUDGET_SECONDS = 2700
MAX_DIFF = 120_000
MAX_LOG = 6_000
SECRET_NAMES = {"RUNNER_TOKEN", "CF_ACCESS_CLIENT_ID", "CF_ACCESS_CLIENT_SECRET", "GIT_TOKEN", "STUDIO_RUNNER_TOKEN"}
SHELLS = {"sh", "bash", "zsh", "fish", "dash", "cmd", "cmd.exe", "powershell", "pwsh"}


class BridgeError(Exception):
    pass


def validate_origin(value):
    p = urllib.parse.urlsplit(value)
    if p.scheme != "https" or not p.hostname or p.username or p.password or p.query or p.fragment or p.path not in ("", "/") or p.port not in (None, 443):
        raise BridgeError("studio_url must be an HTTPS origin without credentials, path, query or custom port")
    return value.rstrip("/")


def validate_remote(value, allowed_host):
    if not isinstance(value, str) or re.search(r"[\s\\%]", value):
        raise BridgeError("Invalid repository remote")
    p = urllib.parse.urlsplit(value)
    if not re.fullmatch(r"[a-z0-9-]+\.artifacts\.cloudflare\.net", allowed_host):
        raise BridgeError("artifacts_host must be an explicit account hostname")
    if p.scheme != "https" or p.hostname != allowed_host or p.port not in (None, 443) or p.username or p.password or p.query or p.fragment or not p.path or p.path == "/" or any(x in (".", "..") for x in p.path.split("/")):
        raise BridgeError("Repository remote is outside the configured Artifacts account")
    return value


def validate_argv(value, prompt=False):
    if not isinstance(value, list) or not value or any(not isinstance(x, str) or not x or "\x00" in x for x in value):
        raise BridgeError("Commands must be nonempty arrays of nonempty argv strings")
    if Path(value[0]).name.lower() in SHELLS:
        raise BridgeError("Shell command interpreters are not allowed")
    count = value.count("{prompt}")
    if (prompt and count != 1) or (not prompt and count):
        raise BridgeError("amplifier_argv requires exactly one standalone {prompt}; tests do not accept placeholders")
    if any(("{" in x or "}" in x) and x != "{prompt}" for x in value):
        raise BridgeError("Only the standalone {prompt} placeholder is supported")
    return value


def load_config(path):
    with open(path, encoding="utf-8") as f:
        c = json.load(f)
    validate_origin(c["studio_url"])
    validate_remote("https://" + c["artifacts_host"] + "/configuration-check", c["artifacts_host"])
    validate_argv(c["amplifier_argv"], prompt=True)
    tests = c.get("test_commands", [])
    if not isinstance(tests, list) or len(tests) > 8:
        raise BridgeError("test_commands must be an array with at most eight argv commands")
    for command in tests:
        validate_argv(command)
    for key, default, low, high in [("max_agents", 2, 1, 2), ("agent_timeout_seconds", 1200, 1, 3600), ("test_timeout_seconds", 300, 1, 1800), ("heartbeat_seconds", 30, 5, 60), ("poll_seconds", 15, 1, 300)]:
        value = c.get(key, default)
        if type(value) is not int or not low <= value <= high:
            raise BridgeError(f"{key} must be an integer from {low} to {high}")
        c[key] = value
    budget = c["agent_timeout_seconds"] + len(tests) * c["test_timeout_seconds"]
    if budget > MAX_COMMAND_BUDGET_SECONDS:
        raise BridgeError("Configured agent and test timeouts must total at most 2700 seconds")
    if not re.fullmatch(r"[A-Za-z0-9_.-]{1,80}", c.get("runner_id", "")):
        raise BridgeError("runner_id must be 1-80 letters, digits, dots, underscores or dashes")
    allowed = c.get("agent_env", [])
    if not isinstance(allowed, list) or any(not isinstance(k, str) or not re.fullmatch(r"[A-Z][A-Z0-9_]*", k) or sensitive_name(k) for k in allowed):
        raise BridgeError("agent_env must list model/runtime environment names, never Studio/Cloudflare/Git credentials")
    if c.get("git_username", "x-access-token") != "x-access-token":
        raise BridgeError("git_username must be x-access-token")
    c["base_branch"] = c.get("base_branch", "main")
    if not re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9._/-]{0,100}", c["base_branch"]) or ".." in c["base_branch"] or c["base_branch"].endswith(("/", ".", ".lock")):
        raise BridgeError("Invalid base_branch")
    return c


def sensitive_name(name):
    return name in SECRET_NAMES or name.startswith(("STUDIO_", "CF_", "CLOUDFLARE_", "GIT_", "RUNNER_", "ARTIFACTS_"))


def child_env(config):
    keys = {"PATH", "HOME", "LANG", "LC_ALL", "TMPDIR", "TMP", "TEMP", "SYSTEMROOT"} | set(config.get("agent_env", []))
    return {k: v for k, v in os.environ.items() if k in keys and not sensitive_name(k)}


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        raise BridgeError("HTTP redirects are refused to protect runner credentials")


class StudioClient:
    def __init__(self, config, environ=None, opener=None):
        env = os.environ if environ is None else environ
        self.origin = validate_origin(config["studio_url"])
        token = env.get("RUNNER_TOKEN", "")
        if not token:
            raise BridgeError("RUNNER_TOKEN is required for execution")
        self.headers = {"Authorization": "Bearer " + token, "Content-Type": "application/json", "Accept": "application/json"}
        cid, secret = env.get("CF_ACCESS_CLIENT_ID"), env.get("CF_ACCESS_CLIENT_SECRET")
        if bool(cid) != bool(secret):
            raise BridgeError("Both Cloudflare Access service credential variables are required together")
        if cid:
            self.headers.update({"CF-Access-Client-Id": cid, "CF-Access-Client-Secret": secret})
        self.secrets = [x for x in (token, cid, secret) if x]
        self.opener = opener or urllib.request.build_opener(NoRedirect())

    def post(self, route, payload):
        if not route.startswith("/api/runner/") or "?" in route or "#" in route:
            raise BridgeError("Invalid runner route")
        body = json.dumps(payload).encode()
        if len(body) > 500_000:
            raise BridgeError("Report exceeds request size limit")
        request = urllib.request.Request(self.origin + route, data=body, headers=self.headers, method="POST")
        try:
            with self.opener.open(request, timeout=25) as response:
                if response.status < 200 or response.status >= 300:
                    raise BridgeError(f"Studio HTTP {response.status}")
                raw = response.read(2_000_001)
                if len(raw) > 2_000_000:
                    raise BridgeError("Studio response exceeded size limit")
                result = json.loads(raw)
                if not isinstance(result, dict):
                    raise BridgeError("Studio returned an invalid JSON object")
                return result
        except urllib.error.HTTPError as e:
            raise BridgeError(f"Studio HTTP {e.code}; response body withheld") from None
        except (urllib.error.URLError, TimeoutError, OSError):
            raise BridgeError("Studio network request failed") from None
        except (json.JSONDecodeError, UnicodeDecodeError):
            raise BridgeError("Studio returned invalid JSON") from None


def redacted(value, secrets):
    for secret in secrets:
        if secret:
            value = value.replace(secret, "[REDACTED]")
    return value


def execute(argv, cwd, env, timeout, cancel, secrets):
    """Capture bounded evidence; kill process group on timeout or lost lease."""
    if cancel.is_set():
        raise BridgeError("Run cancelled before command startup")
    with tempfile.TemporaryFile() as output:
        p = subprocess.Popen(argv, cwd=cwd, env=env, stdin=subprocess.DEVNULL, stdout=output, stderr=subprocess.STDOUT, start_new_session=True)
        deadline = time.monotonic() + timeout
        reason = None
        while p.poll() is None:
            if cancel.wait(0.2):
                reason = "Run cancelled or lease heartbeat failed"
                break
            if os.fstat(output.fileno()).st_size > 4_000_000:
                reason = "Command output exceeded 4 MB safety limit"
                break
            if time.monotonic() >= deadline:
                reason = "Command exceeded configured timeout"
                break
        if reason:
            try:
                os.killpg(p.pid, signal.SIGTERM)
                p.wait(timeout=3)
            except (ProcessLookupError, subprocess.TimeoutExpired):
                pass
            # The leader may exit while a same-group descendant ignores SIGTERM.
            # Always kill the remaining group, even when waiting for the leader succeeded.
            try:
                os.killpg(p.pid, signal.SIGKILL)
            except ProcessLookupError:
                pass
            p.wait()
        output.seek(0)
        raw = output.read(MAX_LOG + 1)
        log = redacted(raw[:MAX_LOG].decode("utf-8", "replace"), secrets)
        if len(raw) > MAX_LOG:
            log += "\n[Output truncated]"
        if reason:
            raise BridgeError(reason)
        return p.returncode, log


def git_call(args, cwd, env, cancel, secrets, timeout=120):
    # No inherited git config or hooks, and no redirect that could forward authentication.
    argv = ["git", "-c", "credential.helper=", "-c", "core.hooksPath=/dev/null", "-c", "http.followRedirects=false", "-c", "protocol.file.allow=never", "-c", "protocol.ext.allow=never", *args]
    code, output = execute(argv, cwd, env, timeout, cancel, secrets)
    if code:
        raise BridgeError(f"Git operation {args[0]} failed (exit {code}); inspect the isolated workspace")
    return output.strip()


def reset_repository_config(work):
    """Discard agent-written redirects/helpers/hooks before runner-owned Git calls."""
    gitdir = work / ".git"
    if not gitdir.is_dir() or gitdir.is_symlink():
        raise BridgeError("Checkout Git directory was replaced")
    for name in ("commondir", "gitdir", "worktrees", "config.worktree"):
        path = gitdir / name
        if path.exists() or path.is_symlink():
            raise BridgeError("Checkout Git indirection or worktree configuration is not supported")
    for name in ("config",):
        path = gitdir / name
        if path.is_symlink() or (path.exists() and not path.is_file()):
            raise BridgeError("Checkout Git configuration was replaced")
        if path.exists():
            path.unlink()
    (gitdir / "config").write_text("[core]\nrepositoryformatversion = 0\nbare = false\nlogallrefupdates = true\n", encoding="utf-8")


def git_env(config):
    env = child_env(config)
    # Git transport should not receive provider model keys either.
    for name in config.get("agent_env", []):
        env.pop(name, None)
    env.update({"GIT_CONFIG_NOSYSTEM": "1", "GIT_CONFIG_GLOBAL": os.devnull, "GIT_TERMINAL_PROMPT": "0", "GIT_AUTHOR_NAME": "Artifacts Studio runner", "GIT_AUTHOR_EMAIL": "runner@artifacts-studio.invalid", "GIT_COMMITTER_NAME": "Artifacts Studio runner", "GIT_COMMITTER_EMAIL": "runner@artifacts-studio.invalid"})
    return env


def transport(args, cwd, config, token, cancel, secrets):
    if cancel.is_set():
        raise BridgeError("Run cancelled before Git credential use")
    if args[0] == "push":
        reset_repository_config(Path(cwd))
    # Only this short-lived directory and Git subprocess receive the token.
    with tempfile.TemporaryDirectory(prefix="studio-askpass-") as temp:
        script = Path(temp) / "askpass.py"
        script.write_text("#!" + sys.executable + "\nimport os,sys\nprint('x-access-token' if 'username' in sys.argv[1].lower() else os.environ['STUDIO_GIT_TOKEN'])\n", encoding="utf-8")
        script.chmod(0o700)
        env = git_env(config)
        env.update({"GIT_ASKPASS": str(script), "STUDIO_GIT_TOKEN": token})
        return git_call(args, cwd, env, cancel, secrets)


def watch_deadline(finished, cancel, seconds=MAX_RUN_SECONDS):
    """Cancel the whole run before its server-issued Git credential can expire."""
    if not finished.wait(seconds):
        cancel.set()


def run_claim(client, config, claim, shutdown):
    run = claim.get("run")
    if not isinstance(run, dict) or not re.fullmatch(r"[A-Za-z0-9_-]{1,100}", str(run.get("id", ""))):
        raise BridgeError("Invalid claimed run ID")
    route = "/api/runner/runs/" + run["id"]
    identity = {"attempt": run.get("attempt"), "lease_token": run.get("lease_token")}
    if type(identity["attempt"]) is not int or identity["attempt"] < 1 or not isinstance(identity["lease_token"], str) or not identity["lease_token"]:
        raise BridgeError("Invalid claim attempt or lease token")
    cancel, finished = threading.Event(), threading.Event()
    secrets = client.secrets + [identity["lease_token"]] + [os.environ[k] for k in config.get("agent_env", []) if k in os.environ]
    report = {**identity, "status": "failed", "head_commit": None, "diff": "", "tests": {"configured": bool(config.get("test_commands")), "passed": False, "commands": []}, "summary": "Run did not finish"}

    if shutdown.is_set():
        report["summary"] = "Run cancelled before startup after shutdown."
        client.post(route + "/report", report)
        return "failed"

    def heartbeat():
        while not finished.wait(config["heartbeat_seconds"]):
            if shutdown.is_set():
                cancel.set()
                return
            try:
                client.post(route + "/heartbeat", identity)
                client.post("/api/runner/heartbeat", {"runner_id": config["runner_id"]})
            except BridgeError:
                cancel.set()
                return

    worker = threading.Thread(target=heartbeat, daemon=True)
    worker.start()
    deadline_worker = threading.Thread(target=watch_deadline, args=(finished, cancel), daemon=True)
    deadline_worker.start()
    try:
        repo = claim["repo"]
        remote = validate_remote(repo["remote"], config["artifacts_host"])
        token = repo["token"]
        if not isinstance(token, str) or not token or len(token) > 16_384:
            raise BridgeError("Claim did not provide a repository credential")
        secrets.append(token)
        # Cloudflare Basic Git authentication uses the secret, without expiry metadata.
        token = token.split("?expires=", 1)[0]
        if not token:
            raise BridgeError("Repository token secret is empty")
        secrets.append(token)
        base = run.get("base_commit", "")
        if not isinstance(base, str) or not re.fullmatch(r"[0-9a-f]{40,64}", base):
            raise BridgeError("Claim requires a full base commit ID")
        with tempfile.TemporaryDirectory(prefix="studio-agent-") as temp:
            root = Path(temp)
            work = root / "checkout"
            env = git_env(config)
            transport(["clone", "--no-checkout", "--no-recurse-submodules", "--", remote, str(work)], root, config, token, cancel, secrets)
            branch = config["base_branch"]
            # The claimed fork must still be exactly at the queued base; never force push.
            actual_base = git_call(["rev-parse", "refs/remotes/origin/" + branch], work, env, cancel, secrets)
            if actual_base != base:
                raise BridgeError("Fork branch moved from the claimed base; request an explicit new attempt")
            git_call(["checkout", "--detach", base], work, env, cancel, secrets)
            prompt = "Work only on this assigned task in the current checkout. Do not merge, deploy, push, or change credentials. Return a concise summary.\n" + json.dumps({"assignment": {"role": run.get("role"), "instruction": run.get("instruction")}, "packet": claim.get("packet")}, ensure_ascii=False)
            command = [prompt if part == "{prompt}" else part for part in config["amplifier_argv"]]
            code, output = execute(command, work, child_env(config), config["agent_timeout_seconds"], cancel, secrets)
            report["summary"] = redacted(output[-6000:], secrets)
            if code:
                raise BridgeError(f"Amplifier command exited {code}")
            for command in config.get("test_commands", []):
                code, log = execute(command, work, child_env(config), config["test_timeout_seconds"], cancel, secrets)
                report["tests"]["commands"].append({"argv": command, "exit_code": code, "output": log})
                if code:
                    raise BridgeError(f"Configured verification command exited {code}")
            report["tests"]["passed"] = bool(config.get("test_commands"))
            reset_repository_config(work)
            # Stage ordinary untracked/modified files for the exact review commit.
            git_call(["add", "-A"], work, env, cancel, secrets)
            code, _ = execute(["git", "diff", "--cached", "--quiet"], work, env, 30, cancel, secrets)
            if code not in (0, 1):
                raise BridgeError("Unable to inspect staged work")
            if code == 1:
                git_call(["commit", "-m", "Artifacts Studio: " + run["id"]], work, env, cancel, secrets)
            head = git_call(["rev-parse", "HEAD"], work, env, cancel, secrets)
            git_call(["merge-base", "--is-ancestor", base, head], work, env, cancel, secrets)
            # Dedicated bounded read; never silently present a partial diff as complete.
            with tempfile.TemporaryFile() as output_file:
                result = subprocess.run(["git", "--no-pager", "diff", "--no-ext-diff", "--no-textconv", "--binary", base, head, "--"], cwd=work, env=env, stdout=output_file, stderr=subprocess.DEVNULL, timeout=60, check=False)
                output_file.seek(0)
                diff = output_file.read(MAX_DIFF + 1)
                if result.returncode or len(diff) > MAX_DIFF:
                    raise BridgeError("Diff unavailable or exceeds 120 KB; split the assignment")
                report["diff"] = redacted(diff.decode("utf-8", "replace"), secrets)
            # Agent-modified remote config cannot change where the credential is sent.
            # Use the validated URL directly, never the mutable origin nickname.
            reset_repository_config(work)
            transport(["push", "--", remote, "HEAD:refs/heads/" + branch], work, config, token, cancel, secrets)
            report["head_commit"] = head
            report["status"] = "succeeded"
            report["summary"] = (report["summary"] or "Agent finished and exact commit was pushed for human review.")[:8000]
    except (BridgeError, OSError, KeyError, ValueError, subprocess.SubprocessError) as e:
        report["status"] = "failed"
        report["head_commit"] = None
        report["summary"] = redacted(str(e), secrets)[:8000]
    finally:
        finished.set()
        worker.join(timeout=26)
        deadline_worker.join(timeout=1)
    if cancel.is_set() or shutdown.is_set():
        report["status"] = "failed"
        report["head_commit"] = None
        report["summary"] = "Execution cancelled after the 3000-second run deadline, shutdown or failed lease heartbeat; no result is ready for review."
    if len(json.dumps(report["tests"]).encode()) > 60_000:
        report["tests"]["commands"] = [{"exit_code": x["exit_code"], "output": "Evidence exceeded report limit"} for x in report["tests"]["commands"]]
        report["tests"]["passed"] = False
        report["status"] = "failed"
        report["head_commit"] = None
        report["summary"] = "Verification evidence exceeded report limit"
    client.post(route + "/report", report)
    return report["status"]


def check(config):
    if os.name != "posix":
        raise BridgeError("The bridge requires a POSIX isolated environment")
    for executable in ["git", config["amplifier_argv"][0], *(c[0] for c in config.get("test_commands", []))]:
        if not shutil.which(executable):
            raise BridgeError("A configured executable is unavailable; check Git, Amplifier and test command installation")
    print("Configuration and executable paths checked. No network, models, agents or installation commands were run.")
    print("Model/provider access and actual command compatibility require verification inside your isolated runtime.")


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--config", default=str(Path(__file__).with_name("config.json")))
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument("--check", action="store_true", help="default: local validation only")
    mode.add_argument("--execute", action="store_true", help="claim and execute actual agent work")
    parser.add_argument("--watch", action="store_true", help="continue polling; requires --execute")
    args = parser.parse_args(argv)
    try:
        config = load_config(args.config)
        check(config)
        if not args.execute:
            if args.watch:
                raise BridgeError("--watch requires --execute")
            return 0
        if config.get("isolated_environment") is not True:
            raise BridgeError("Execution requires isolated_environment=true after provisioning an isolated runtime")
        client = StudioClient(config)
        shutdown = threading.Event()
        signal.signal(signal.SIGTERM, lambda *_: shutdown.set())
        signal.signal(signal.SIGINT, lambda *_: shutdown.set())
        futures = set()
        with concurrent.futures.ThreadPoolExecutor(max_workers=config["max_agents"]) as pool:
            while not shutdown.is_set():
                client.post("/api/runner/heartbeat", {"runner_id": config["runner_id"]})
                for f in list(futures):
                    if f.done():
                        futures.remove(f)
                        try:
                            print("Run reported:", f.result())
                        except BridgeError as e:
                            print(str(e), file=sys.stderr)
                while len(futures) < config["max_agents"] and not shutdown.is_set():
                    claim = client.post("/api/runner/claim", {"runner_id": config["runner_id"]})
                    if claim.get("run") is None:
                        break
                    if shutdown.is_set():
                        run_claim(client, config, claim, shutdown)
                        break
                    futures.add(pool.submit(run_claim, client, config, claim, shutdown))
                if not args.watch:
                    for f in futures:
                        print("Run reported:", f.result())
                    break
                shutdown.wait(min(config["poll_seconds"], 30))
        return 0
    except (BridgeError, OSError, KeyError, ValueError) as e:
        # Do not echo malformed config values, HTTP bodies, argv or environment.
        print("Bridge could not continue: " + (str(e) if isinstance(e, BridgeError) else type(e).__name__), file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
