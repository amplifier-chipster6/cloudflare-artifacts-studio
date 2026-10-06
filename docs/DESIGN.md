# Artifacts Studio — Cody's private engineering workspace

## Intent and evidence
A task-centred Git workspace for website modernization, Amplifier compositions, selected context and reviewed agent contributions. It complements GitHub and the private Website Studio rather than claiming GitHub feature parity. Website Studio owns project lifecycle; Amplifier executes bounded technical work; context/memory supplies task inputs and execution insight. Acceptance never automatically initiates the next stage.

Grounded in the user's current request, `amplifier-artifacts-platform-build-prompt.txt` (2026-10-04), and the private Website Studio architecture. The current GitHub repository exists and is private. No running Amplifier service is accessible from this environment.

## Architecture
- Private Cloudflare Worker: owner authorization, JSON API and bundled static interface.
- Cloudflare D1: projects, tasks, selected context, run attempts and immutable receipts.
- Cloudflare Artifacts binding: repository management, isolated forks, history and file reads. Git operations remain the data plane; the app never invents a REST commit-write or merge endpoint.
- Optional outbound Amplifier runner adapter, running in the user's isolated execution environment, claims work and reports evidence. The cloud app does not open inbound access to the VPS or graph.
- No provider credentials or repository tokens in browser state. Owner and runner capabilities are distinct. Runs record base commit and exact returned head before review.

## First usable surface
1. Home: next action, project cards, honest connection state.
2. Projects: create projects, link a GitHub URL, select a delivery path, record explicit stages.
3. Work: task brief, acceptance criteria, paths, selected context, planned assignments; prepare a downloadable task packet or queue a run when infrastructure is available.
4. Repositories: browse live Artifacts repositories and commit history, create a repo, read files.
5. Context: project-scoped evidence, decisions and hypotheses with source and explicit inclusion. No automatic upload of session history.
6. Review: compare submitted diff and test evidence, accept/reject/request revision. Acceptance is a recorded decision, not a Git merge or deployment.
7. Connections: Artifacts, GitHub links, Amplifier runner and Context Intelligence status; configuration instructions and export.

## Core API
All owner APIs require verified Cloudflare Access identity in `ctx.access` and an explicit owner email allowlist. Writes require same-origin JSON requests. Runner uses a separate secret and `/api/runner/*` routes only, with leases and attempt identity. Responses `{error,code}` on errors.

GET /api/state -> {projects,tasks,contexts,runs,events,connections,owner,version}
POST /api/projects {name,description,github_url,path} -> project
PATCH /api/projects/:id {stage} -> project
POST /api/contexts {project_id,title,kind,content,source} -> context
DELETE /api/contexts/:id -> {ok:true}
POST /api/tasks {project_id,title,goal,acceptance,scope,context_ids,assignments:[{role,instruction}]} -> task
GET /api/tasks/:id/packet -> structured JSON task packet (only selected context)
POST /api/tasks/:id/queue -> {runs:[...]}, requires project Artifacts repo and healthy runner; no inferred execution
GET /api/repos -> {repos:[{name,description,default_branch,remote,...}],cursor}
POST /api/repos {name,description,project_id?} -> metadata, excludes token
GET /api/repos/:name/log?ref=main -> {commits:[...]}
GET /api/repos/:name/file?ref=main&path=README.md -> {content,path,ref}
POST /api/runs/:id/review {decision:'accepted'|'rejected'|'revision_requested',note,expected_head} -> run
GET /api/export -> all owner records (no secrets)
POST /api/runner/heartbeat {runner_id} -> {ok:true}
POST /api/runner/claim {runner_id} -> {run,packet,repo:{remote,token}} or {run:null}
POST /api/runner/runs/:id/report {attempt,lease_token,status,head_commit,diff,tests,summary} -> run
POST /api/runner/runs/:id/heartbeat {attempt,lease_token} -> {ok:true}

## Limits and failure handling
Two assignments per task initially; concurrency 2; lease 15 minutes refreshed by runner; no automatic retries or integration. Claims are conditional SQL updates and reports must match a current unexpired lease. Failed or expired runs need an explicit new attempt. A review requires evidence and exact head. Empty data and disconnected services are honest first-class states. App metadata and uploaded reports are untrusted text and never rendered as HTML.

## Delivery boundary
Implement and test the application and Artifacts adapter, publish privately only if supported deployment succeeds, save complete source and operational instructions. Live overlapping Amplifier execution cannot be claimed until the user's runner is paired and provider credentials are configured there. No competition submission, public launch, new plan purchase, upstream push, global Amplifier changes or personal-memory migration.
