# Optional outbound Amplifier bridge

This is an operator-run Python 3 adapter for an **already isolated POSIX execution environment** with Git, Amplifier and model access already installed. It makes outbound HTTPS requests to the private Studio and Cloudflare Artifacts. It changes no host installation or global configuration. Nothing runs until `--execute` is specified.

The application and adapter have not been paired with a live Amplifier runtime or provider in this delivery. Local tests verify adapter behavior; they do not establish model availability, Artifacts credentials or a successful live agent run.

## Configure and check

1. Copy `config.example.json` to `config.json` inside your isolated runner environment. Keep it outside agent checkouts. Set your Studio HTTPS origin, exact `<account_id>.artifacts.cloudflare.net` host, stable runner ID and the fork default branch. Do not put secrets in this file or command arguments.
2. Configure `amplifier_argv` for your installed CLI. The official Microsoft Amplifier README documents `amplifier run "prompt"` and `amplifier run --bundle recipes "prompt"`. The sample is `["amplifier", "run", "{prompt}"]`; `{prompt}` must be exactly one standalone argument. Confirm your installed version with `amplifier run --help` yourself before authorizing execution. This adapter never invokes a shell to interpret a command string.
3. Populate `agent_env` with only the environment variable names needed by your model provider/runtime. For example, `ANTHROPIC_API_KEY` must already exist in the isolated environment if that provider is configured. The bridge cannot create provider/model access. Ensure the selected Amplifier bundle has tools/configuration appropriate for the task.
4. Set trusted local `test_commands`, for example `[["npm", "test"]]`, when appropriate for these repositories. These commands come from operator configuration, never from a task prompt. An empty list reports `configured:false, passed:false`, never a successful test result. Test output and command exit codes become review evidence.
5. Run `python3 bridge/runner.py --config /path/to/config.json --check`. The default without either mode flag also checks only local configuration and executable discovery. It does not perform network requests, verify authentication, invoke models or run agents.

Official CLI reference: [microsoft/amplifier README](https://github.com/microsoft/amplifier/blob/main/README.md), retrieved during delivery; README blob SHA `8341dfc81a280562a95f4ff4513cb9bf69f2dbef`.

## Authorize execution

Set `RUNNER_TOKEN` in the runner process environment using your secret manager. It must match Studio's dedicated runner secret. If Cloudflare Access protects the runner routes, also set `CF_ACCESS_CLIENT_ID` and `CF_ACCESS_CLIENT_SECRET` for an authorized Access service token. The Studio application must still require its distinct runner bearer token; do not expose runner routes to owner-browser credentials alone.

After provisioning the isolated environment, set `isolated_environment:true`. Then:

```text
python3 bridge/runner.py --config /path/to/config.json --execute
python3 bridge/runner.py --config /path/to/config.json --execute --watch
```

The first invocation claims up to `max_agents` assignments (one or two), executes them concurrently in **separate clones**, reports them and exits. `--watch` maintains availability and polls for subsequent explicitly queued assignments. Each claim gets a fresh temporary checkout of its Artifacts fork, pinned to the queued full `base_commit`. No automatic task retries occur. Default heartbeat interval is 30 seconds; lost heartbeat cancels command execution and prevents a successful report. The configured agent timeout plus the timeout for every configured test command must total at most **2700 seconds**. A separate **3000-second whole-run watchdog** cancels work, including Git operations, leaving margin before the server-issued repository token's 3600-second expiry. Git commands separately time out after 120 seconds, network calls after 25 seconds, and captured command output is capped. Deadline or lease cancellation terminates the command process group, including descendants that ignore SIGTERM. Shutdown prevents new claims and subprocess startup. A stopped bridge lets its outstanding lease expire; the owner must explicitly queue a new attempt.

Each successful assignment runs the configured verification commands, stages changes, creates a commit if needed, verifies base ancestry, records a bounded exact diff, and normally pushes that commit to the fork's configured branch. Pushes are never forced. A fork that moved before checkout, a non-fast-forward push, or a push error fails the run without claiming a returned head. The adapter never merges, updates an upstream repository, accepts a review or deploys anything. Temporary checkouts are removed at completion, including failure; failed unpublished work is not retained. Execution output is capped and may be truncated in evidence.

## Credential and isolation boundaries

- Studio requests require HTTPS and refuse redirects. Runner credentials and optional Access headers are sent only to the configured Studio origin.
- Repository remotes require HTTPS, exactly the configured account hostname, no userinfo, query, fragment, encoded characters or traversal. The claim token is used by a temporary Git askpass script; the secret exists in that Git subprocess environment, never in its URL, arguments, saved Git configuration or script content. [Cloudflare Git authentication](https://developers.cloudflare.com/artifacts/api/git-protocol/) accepts any nonempty Basic username and requires the token secret with `?expires=...` metadata removed. The bridge uses `x-access-token` and strips that metadata.
- Git redirects, credential helpers, system/global Git configuration, and hooks are disabled for bridge-owned Git commands. Agent-written local Git configuration is replaced before bridge-owned commit/push operations to discard URL rewrites and helper settings. Git common-directory, linked-worktree and Git-directory indirection is rejected before credential-bearing transport; alternate common configuration cannot override that replacement. The validated remote URL is used directly for push. Submodules are not initialized.
- Agent and test subprocesses receive a minimal environment plus the operator's explicit `agent_env` allowlist. Studio, Cloudflare, Artifacts and Git credential variable names are denied even if allowlisted. The model's own provider credential remains available when explicitly allowed. Known credential values are redacted from returned logs and diffs.
- **Separate clones and forks are data separation, not a security sandbox.** This adapter runs agent processes under the runner's OS identity. A malicious same-user process may read parent-process environments or runtime files, inspect other jobs, leave processes behind, modify Git files between checks or bypass environment scrubbing. Treat the entire configured runner as trusted relative to all credentials it holds. Stronger protection requires a separate container/VM and OS identity for each agent, with an external credential-owning broker, restricted mounts and network policy. This adapter does not implement that stronger boundary. Do not run it on a personal host, the Studio service host, or a host containing unrelated secrets.
- `HOME` is retained for already provisioned Amplifier configuration. It must be an isolated runner home and must not expose personal credentials. The `isolated_environment` boolean records operator intent; it does not prove or create isolation.

## Wire contract

All requests use JSON and `Authorization: Bearer $RUNNER_TOKEN`.

| Endpoint | Request / result |
| --- | --- |
| `POST /api/runner/heartbeat` | `{runner_id}`; runner availability |
| `POST /api/runner/claim` | `{runner_id}`; `{run:null}` or `{run, packet, repo:{remote,token}}` |
| `POST /api/runner/runs/:id/heartbeat` | `{attempt,lease_token}`; renew current lease |
| `POST /api/runner/runs/:id/report` | `{attempt,lease_token,status,head_commit,diff,tests,summary}` |

The claim run requires `id`, integer `attempt`, `lease_token`, full `base_commit` and optional `role`/`instruction`. Its `repo.remote` must be the dedicated assignment fork. Status is `succeeded` or `failed`; successful reports are prepared for human review, not accepted automatically. `tests` is `{configured,passed,commands:[{argv,exit_code,output}]}`. Diff is capped at 120,000 bytes and oversized diffs fail rather than silently truncate. Test evidence is limited below 64 KB. Stale/rejected reports and HTTP failures are surfaced with status or generic error without echoing response bodies. The server is responsible for lease exclusivity, its global two-run limit, validating committed heads and exact-head review.

## Local tests

```text
python3 -m unittest discover -s bridge -p 'test_*.py' -v
python3 -m py_compile bridge/runner.py
```

Tests cover remote restrictions, argv validation, environment separation, HTTP failures and redirects, explicit execution, agent-modified Git configuration/commondir, the token lifetime budget, whole-run deadline cancellation, descendant cleanup and shutdown-before-claim handling. No test requires credentials, network access, an Amplifier installation or a model.
