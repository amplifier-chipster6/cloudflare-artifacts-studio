# Artifacts Studio

A private engineering workspace for Cody's projects, task briefs, selected context and reviewed agent contributions. Version 0.1.0 — runnable locally; live deployment and Amplifier execution remain unverified.

**Continuation, October 6:** Start with [the conversation handoff](docs/HANDOFF.md). The user-created `artifacts-studio` namespace exists. Repository creation and Worker upload failed before reauthentication; the latest connection attempt instead failed with “Unknown tool” before reaching Cloudflare. The deployment template `wrangler.jsonc` and [launch steps](DEPLOY.md) are ready; no hosted Studio URL has been verified.

## Use it now

Requires Node.js 24 or newer. No npm installation is needed for the local app.

From the extracted `artifacts-studio` directory:

```bash
node build.mjs
node server.mjs
```

`node build.mjs` packages the interface and database schema. `node server.mjs` starts the local app at **http://127.0.0.1:8787**. It listens only on loopback and stores your records in `data/studio.sqlite`. Stop it with Ctrl+C. Re-running it preserves your records.

1. Open **Website Studio**, **Amplifier Lab**, or **Context & Memory**.
2. Add project-specific context, labeling evidence, decisions and hypotheses.
3. Create a task with a goal, allowed scope, acceptance criteria and one or two assignments.
4. Select exactly the context that task needs, then download its JSON packet.
5. Connect Artifacts and the runner when ready to execute; disconnected controls explain what is missing.

The local app is intended for your own machine. Do not place the local server behind a public reverse proxy: local mode deliberately supplies a local owner identity. The Cloudflare entrypoint uses verified Access identity instead.

## What is implemented

| Area | Behavior |
|---|---|
| Projects | Durable records, GitHub links, delivery paths, explicit stage selection |
| Tasks | Goals, acceptance criteria, scope, one/two assignments, immutable queued packets |
| Context | Project-scoped evidence, decisions, hypotheses, references and memory excerpts |
| Artifacts | Native Worker binding or server-side REST adapter; repo create/list/history/file reads; isolated per-run forks |
| Runner protocol | Outbound claims, separate credential, two concurrent runs, 15-minute leases, heartbeat, bounded reports |
| Review | Runner-reported diff/tests, commit existence/ancestry checks, exact-head review, source-baseline freshness |
| Export | JSON export of Studio records without platform credentials or lease secrets |
| Interface | Responsive desktop/mobile workspace; no external fonts, trackers or UI libraries |

Creating a task does not run an agent. Stage selection does not deploy anything. **Accept** records your review decision; it does not merge Git branches, advance the next stage, push to GitHub, or deploy customer work.

## Connection state at delivery

- Cloudflare account read access was verified.
- A successful listing confirmed the user-created `artifacts-studio` namespace, jurisdiction `unrestricted`, with zero repositories.
- After namespace creation, repository creation returned Cloudflare authentication error 10000.
- Uploading the complete Worker with SQLite Durable Object storage and native Artifacts binding returned “No access to the specified resource.”
- After the user reauthenticated, both Cloudflare connector actions returned “Unknown tool” before reaching the API. The new permissions therefore remain unverified.
- Earlier D1 creation also failed; the supplied account-specific configuration uses Durable Object storage instead.
- The user created the namespace. No Studio Worker, repository, or deployment was confirmed created by the assistant.
- No user VPS, Amplifier installation, model provider, Context Intelligence server or personal session corpus was connected or changed.

The application has real integration code, but its tests use local storage and controlled Artifacts responses. That is not evidence of successful live Artifacts access or overlapping production agents.

## Connect Artifacts to the local app

Set these in the server process environment using your normal secret manager, then restart the server:

| Variable | Meaning |
|---|---|
| `CLOUDFLARE_ACCOUNT_ID` | Your 32-character account ID |
| `CLOUDFLARE_API_TOKEN` | Server-side API token with the required Artifacts access |
| `ARTIFACTS_NAMESPACE` | Namespace; defaults to `artifacts-studio` |
| `STUDIO_RUNNER_TOKEN` | Random secret of at least 32 characters shared only with the trusted runner |
| `STUDIO_DB` | Optional SQLite path; default `data/studio.sqlite` |
| `PORT` | Optional loopback port; default `8787` |

Never paste credentials into a task, project, browser field, repository remote URL or Git commit. Tokens for the API and repo-scoped Git tokens have different purposes. The adapter uses the documented `api.cloudflare.com/client/v4/accounts/.../artifacts` routes. It does not call namespace creation directly; creating the first repository can create an unrestricted namespace implicitly. Choose any required jurisdiction before doing that.

For a private GitHub repository, use authenticated Git in your trusted execution environment to seed the Artifacts repo. This version stores a GitHub link; it does not perform private GitHub import or synchronize GitHub changes automatically. The documented built-in Artifacts import path is for public HTTPS remotes.

## Cloudflare deployment

Both storage entrypoints are included:

- `src/worker.mjs` + `wrangler.example.jsonc`: D1 database binding.
- `src/cloud.mjs` + `wrangler.durable.example.jsonc`: one SQLite Durable Object for this single-owner workspace.

For deployment, set `account_id` and `OWNER_EMAILS` in the included `wrangler.jsonc`, then follow `DEPLOY.md`. This public backup replaces the private account ID and owner email with placeholders. It selects Durable Object storage. The two example templates remain available for other accounts or storage choices. Do not change the access policy of unrelated Workers.

Artifacts currently requires Workers Paid. Its [pricing page](https://developers.cloudflare.com/artifacts/platform/pricing/) says usage billing starts October 14, 2026, with 10,000 monthly operations and 1 GB included, then $0.15 per 1,000 operations and $0.50 per GB-month. Other services and model execution can add separate costs. No plan upgrade was performed.

Use project-local Wrangler 4.145.0 or later for the current Artifacts binding. Before deployment, run `wrangler types` and compare the generated binding types with the adapter: the Artifacts product is in beta and its API can change. Choose any required namespace jurisdiction before its first repository. The templates keep `workers_dev` and preview URLs disabled until private Access is configured.

For D1, create the database and execute `schema.sql` remotely using the current Wrangler D1 commands. For the Durable Object entrypoint, the SQLite schema initializes inside the object and the included migration creates its storage class. No D1 resource is required for that option.

Protect production and previews with a **Worker-level Cloudflare Access policy** restricted to your verified email, and configure `OWNER_EMAILS` to match. The Worker rejects owner requests if `ctx.access` is absent or the authenticated identity does not match. Enable the private route only after this policy is attached. Runner access requires both its separate `RUNNER_TOKEN` secret and, when applicable, an Access service-token policy. No token is embedded in this package.

This package has not been deployed successfully. Do not assume these configuration placeholders are a deployment receipt. The original account-specific configuration remains in the private source ZIP; this public repository contains a sanitized source snapshot and no private Git history.

## Amplifier runner

See [bridge/README.md](bridge/README.md). The runner is a separate process in your existing isolated execution environment, not an Amplifier runtime inside Workers. It can claim two assignments concurrently and uses separate Git checkouts and Artifacts forks. **Git forks and directories are not a security sandbox**; use separate constrained containers for untrusted generated code.

The bridge does not install or upgrade Amplifier, change your global bundles, open inbound VPS access, merge changes or deploy sites. Real model execution needs your existing installed Amplifier runtime and provider configuration.

## Review and recovery boundaries

- Diff and test output are evidence submitted by the trusted runner; the Studio does not independently execute tests or reconstruct the full diff from Git objects.
- Successful reports must identify a commit present in the assigned repo and descended from the approved base within a bounded 1,000-commit first-parent history.
- Acceptance additionally requires reported passing tests and unchanged source/fork heads. It is a human decision record, not a merge lock.
- The same run cannot be claimed twice or accept a stale report. Expired attempts fail visibly and do not retry automatically.
- For a failed, rejected or stale attempt, create a revised task. Completed packets retain the context snapshot even if current context changes.
- Forks are retained for inspection. There is no automatic cleanup, retention policy, cost ceiling, cancellation endpoint or production integration/merge service in v0.1.
- Context Intelligence and broader memory systems are not connected. Only manually selected project context leaves Studio in a task packet.

## Verification

```bash
npm test
npm run test:bridge
```

The first command runs the backend and adapter suite against SQLite and controlled service responses. The second runs the bridge's tests. See `PROJECT_STATUS.md` for the delivered test results and live-verification limits.

## Source guide

`docs/DESIGN.md` documents the workflow and API; `docs/ARTIFACTS-REVIEW.md` records the documentation review; `src/api.mjs` owns domain behavior; `public/` owns the UI; `bridge/` owns execution integration. `schema.sql` is the relational schema. Generated `src/assets.mjs` and `src/schema.mjs` are reproduced by the build command.

## Remaining before a complete agent platform

Resolve Cloudflare deployment permissions, verify Artifacts binding access, pair the isolated runner, demonstrate real overlapping Amplifier work, and implement a tested explicit integration/merge operation. Competition submission, a public launch, and production website deployment are outside this delivery.
