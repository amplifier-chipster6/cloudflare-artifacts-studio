import io
import json
import os
from pathlib import Path
import tempfile
import signal
import sys
import threading
import time
import unittest
from unittest.mock import patch
import urllib.error
import runner


class FakeResponse:
    status = 200
    def __init__(self, raw): self.raw = raw
    def __enter__(self): return self
    def __exit__(self, *args): pass
    def read(self, size): return self.raw[:size]


class FakeOpener:
    def __init__(self, result): self.result = result; self.request = None
    def open(self, request, timeout):
        self.request = request
        if isinstance(self.result, Exception): raise self.result
        return FakeResponse(self.result)


class BridgeTests(unittest.TestCase):
    def test_remote_rejects_credentials_and_nonaccount_destinations(self):
        host = 'abc123.artifacts.cloudflare.net'
        good = 'https://' + host + '/repo'
        self.assertEqual(runner.validate_remote(good, host), good)
        for remote in ['http://' + host + '/repo', 'https://user:token@' + host + '/repo', good + '?token=x', good + '#token', 'https://evil.example/repo', 'https://' + host + '.evil.example/repo', 'https://' + host + ':444/repo', 'https://' + host + '/%2e%2e/repo', 'https://' + host + '/a/../repo', good + '\n']:
            with self.subTest(remote=remote), self.assertRaises(runner.BridgeError):
                runner.validate_remote(remote, host)

    def test_argv_never_accepts_shell_string_or_embedded_prompt(self):
        self.assertEqual(runner.validate_argv(['amplifier', 'run', '{prompt}'], True), ['amplifier', 'run', '{prompt}'])
        for command in ['amplifier run {prompt}', ['bash', '-c', '{prompt}'], ['amplifier', '--prompt={prompt}'], ['amplifier', 'run'], ['amplifier', '{prompt}', '{prompt}']]:
            with self.subTest(command=command), self.assertRaises(runner.BridgeError): runner.validate_argv(command, True)
        with self.assertRaises(runner.BridgeError): runner.validate_argv(['npm', 'test', '{prompt}'])

    def test_child_does_not_receive_connection_credentials(self):
        env = {'PATH': '/bin', 'HOME': '/home/runner', 'RUNNER_TOKEN': 'runner-secret', 'CF_ACCESS_CLIENT_SECRET': 'cf-secret', 'GIT_TOKEN': 'git-secret', 'ANTHROPIC_API_KEY': 'model-secret', 'OTHER_SECRET': 'other-secret'}
        with patch.dict(os.environ, env, clear=True):
            actual = runner.child_env({'agent_env': ['ANTHROPIC_API_KEY', 'RUNNER_TOKEN']})
        self.assertEqual(actual, {k: env[k] for k in ['PATH', 'HOME', 'ANTHROPIC_API_KEY']})

    def test_http_errors_withhold_potentially_sensitive_body(self):
        failure = urllib.error.HTTPError('https://example.com', 403, 'Forbidden', {}, io.BytesIO(b'runner-secret body'))
        client = runner.StudioClient({'studio_url': 'https://example.com'}, {'RUNNER_TOKEN': 'runner-secret'}, FakeOpener(failure))
        with self.assertRaisesRegex(runner.BridgeError, 'HTTP 403') as caught: client.post('/api/runner/claim', {})
        self.assertNotIn('runner-secret', str(caught.exception))

    def test_invalid_json_and_network_errors_fail(self):
        for value in [b'<html>Sign in</html>', b'[]', urllib.error.URLError('contains-secret')]:
            client = runner.StudioClient({'studio_url': 'https://example.com'}, {'RUNNER_TOKEN': 'runner-secret'}, FakeOpener(value))
            with self.assertRaises(runner.BridgeError): client.post('/api/runner/claim', {})

    def test_https_redirect_refused(self):
        with self.assertRaises(runner.BridgeError):
            runner.NoRedirect().redirect_request(None, None, 302, '', {}, 'https://attacker.example')

    def test_valid_request_uses_separate_access_and_runner_headers(self):
        opener = FakeOpener(b'{"run":null}')
        client = runner.StudioClient({'studio_url': 'https://example.com'}, {'RUNNER_TOKEN': 'runner-secret', 'CF_ACCESS_CLIENT_ID': 'cf-id', 'CF_ACCESS_CLIENT_SECRET': 'cf-secret'}, opener)
        self.assertEqual(client.post('/api/runner/claim', {'runner_id': 'a'}), {'run': None})
        self.assertEqual(opener.request.get_header('Authorization'), 'Bearer runner-secret')
        self.assertEqual(opener.request.get_header('Cf-access-client-secret'), 'cf-secret')
        self.assertNotIn('runner-secret', opener.request.full_url)

    def test_modified_git_config_removed_before_transport(self):
        with tempfile.TemporaryDirectory() as temp:
            work = Path(temp); (work / '.git').mkdir()
            (work / '.git/config').write_text('[url "https://attacker.example/"]\n insteadOf = https://abc.artifacts.cloudflare.net/\n')
            runner.reset_repository_config(work)
            self.assertNotIn('attacker', (work / '.git/config').read_text())

    def test_git_config_symlinks_rejected(self):
        with tempfile.TemporaryDirectory() as temp:
            work = Path(temp); (work / '.git').mkdir()
            victim = work / 'outside'; victim.write_text('do not touch')
            (work / '.git/config').symlink_to(victim)
            with self.assertRaises(runner.BridgeError): runner.reset_repository_config(work)
            self.assertEqual(victim.read_text(), 'do not touch')

    def test_check_is_local_only_and_execution_is_explicit(self):
        config = {'studio_url': 'https://example.com', 'artifacts_host': 'abc.artifacts.cloudflare.net', 'runner_id': 'a', 'amplifier_argv': ['amplifier', 'run', '{prompt}']}
        with tempfile.TemporaryDirectory() as temp:
            path = Path(temp) / 'config.json'; path.write_text(json.dumps(config))
            with patch('runner.shutil.which', return_value='/bin/test'), patch('runner.StudioClient') as client:
                self.assertEqual(runner.main(['--config', str(path)]), 0)
                client.assert_not_called()
                self.assertEqual(runner.main(['--config', str(path), '--execute']), 1)
                client.assert_not_called()


class RunBoundsTests(unittest.TestCase):
    def test_configured_budget_must_fit_before_credential_expiry(self):
        config = {'studio_url': 'https://example.com', 'artifacts_host': 'abc.artifacts.cloudflare.net', 'runner_id': 'a', 'amplifier_argv': ['amplifier', 'run', '{prompt}'], 'agent_timeout_seconds': 2100, 'test_timeout_seconds': 300, 'test_commands': [['npm', 'test'], ['npm', 'test']]}
        with tempfile.TemporaryDirectory() as temp:
            path = Path(temp) / 'config.json'; path.write_text(json.dumps(config))
            self.assertEqual(runner.load_config(path)['agent_timeout_seconds'], 2100)
            config['test_commands'].append(['npm', 'test'])
            path.write_text(json.dumps(config))
            with self.assertRaisesRegex(runner.BridgeError, '2700'): runner.load_config(path)

    def test_whole_run_deadline_cancels_running_command(self):
        finished, cancel = threading.Event(), threading.Event()
        watcher = threading.Thread(target=runner.watch_deadline, args=(finished, cancel, 0.05))
        watcher.start()
        try:
            with tempfile.TemporaryDirectory() as temp:
                with self.assertRaisesRegex(runner.BridgeError, 'cancelled'):
                    runner.execute([sys.executable, '-c', 'import time; time.sleep(30)'], temp, os.environ.copy(), 30, cancel, [])
            self.assertTrue(cancel.is_set())
        finally:
            finished.set(); watcher.join(timeout=1)

    def test_git_commondir_cannot_redirect_credential_transport(self):
        with tempfile.TemporaryDirectory() as temp:
            work = Path(temp) / 'checkout'; work.mkdir(); (work / '.git').mkdir()
            alternate = Path(temp) / 'alternate'; alternate.mkdir()
            (alternate / 'config').write_text('[url "https://attacker.example/"]\n insteadOf = https://abc.artifacts.cloudflare.net/\n')
            (work / '.git/commondir').write_text(str(alternate))
            with patch('runner.git_call') as git:
                with self.assertRaisesRegex(runner.BridgeError, 'indirection'):
                    runner.transport(['push', '--', 'https://abc.artifacts.cloudflare.net/repo', 'HEAD:refs/heads/main'], work, {}, 'secret', threading.Event(), ['secret'])
                git.assert_not_called()
            self.assertIn('attacker.example', (alternate / 'config').read_text())

    def test_cancelled_command_never_spawns(self):
        cancel = threading.Event(); cancel.set()
        with patch('runner.subprocess.Popen') as popen:
            with self.assertRaises(runner.BridgeError):
                runner.execute(['unused'], '.', {}, 1, cancel, [])
            popen.assert_not_called()

    def test_timeout_kills_descendant_even_when_leader_exits_on_term(self):
        # A file beacon avoids /proc PID namespace mismatches in sandboxed runtimes.
        child_code = 'import pathlib,signal,sys,time; signal.signal(signal.SIGTERM, signal.SIG_IGN); p=pathlib.Path(sys.argv[1]); n=0\nwhile True:\n n+=1; p.write_text(str(n)); time.sleep(0.02)'
        parent_code = 'import os,pathlib,subprocess,sys,time; child=subprocess.Popen([sys.executable,"-c",sys.argv[1],sys.argv[3]]); pathlib.Path(sys.argv[2]).write_text(str(os.getpid())+" "+str(child.pid)); time.sleep(30)'
        with tempfile.TemporaryDirectory() as temp:
            pids, beacon = Path(temp) / 'pids', Path(temp) / 'beacon'
            try:
                with self.assertRaisesRegex(runner.BridgeError, 'timeout'):
                    runner.execute([sys.executable, '-c', parent_code, child_code, str(pids), str(beacon)], temp, os.environ.copy(), 1, threading.Event(), [])
                self.assertTrue(beacon.exists())
                time.sleep(0.1)
                stopped_at = beacon.read_text()
                self.assertGreater(int(stopped_at), 1)
                time.sleep(0.15)
                self.assertEqual(beacon.read_text(), stopped_at, 'Timed-out descendant is still executing')
            finally:
                if pids.exists():
                    leader = int(pids.read_text().split()[0])
                    try: os.killpg(leader, signal.SIGKILL)
                    except ProcessLookupError: pass

    def test_shutdown_during_heartbeat_prevents_claim_and_submission(self):
        routes = []
        class FakeClient:
            def __init__(self, config): pass
            def post(self, route, payload):
                routes.append(route)
                if route.endswith('/heartbeat'):
                    signal.getsignal(signal.SIGTERM)(signal.SIGTERM, None)
                    return {'ok': True}
                return {'run': None}
        config = {'isolated_environment': True, 'max_agents': 2, 'runner_id': 'a', 'poll_seconds': 1}
        handlers = {s: signal.getsignal(s) for s in (signal.SIGINT, signal.SIGTERM)}
        try:
            with patch('runner.load_config', return_value=config), patch('runner.check'), patch('runner.StudioClient', FakeClient), patch('runner.run_claim') as run:
                self.assertEqual(runner.main(['--execute']), 0)
                run.assert_not_called()
            self.assertEqual(routes, ['/api/runner/heartbeat'])
        finally:
            for sig, handler in handlers.items(): signal.signal(sig, handler)


if __name__ == '__main__': unittest.main()
