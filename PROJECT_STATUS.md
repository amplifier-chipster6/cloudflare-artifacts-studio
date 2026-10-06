# Artifacts Studio — project status

As of 2026-10-06. This is a locally runnable v0.1 implementation, not a verified live agent platform.

## Delivered scope

- Personalized single-operator UI: Overview, Projects, Work, Repositories, Context, Review, Connections.
- Durable project/task/context storage, scoped task packets and JSON export.
- Native Artifacts binding integration plus a local server-side REST adapter.
- Isolated-repository run queue, atomic claim, two-run concurrency cap, lease/heartbeat/report protocol.
- Review decisions bound to exact reported commit and unchanged source/fork heads.
- D1 and SQLite Durable Object deployment entrypoints, both fail closed on owner access.
- Outbound Amplifier runner adapter; no global Amplifier installation changes.

## Evidence

- Backend/API/REST and adversarial regression suite: 11 passed.
- API-backed frontend smoke harness: 10 groups passed against real local SQLite.
- Outbound runner adapter: 16 Python unit tests passed; compilation passed. These cover local validation, credential handling, Git indirection rejection, time budgets and process cancellation, not a live Amplifier run.
- Frontend JavaScript syntax and static CSP checks passed.
- Independent review identified orphan-commit acceptance, expired provisioning lease, project-relink race and non-atomic queuing. These are fixed with regression coverage.
- Runner review identified alternate Git configuration redirection, token lifetime budget and process shutdown issues. Fixes have focused regression coverage.
- Browser engine unavailable: pixel layout, native event behavior, keyboard navigation and accessibility remain unverified.
- No actual Amplifier/model execution, live Artifacts Git operation or concurrent product-agent demonstration has run.
- All 26 indexed Artifacts documentation pages reviewed; coverage and current API discrepancies are recorded in `docs/ARTIFACTS-REVIEW.md`.

The frontend smoke harness uses a minimal DOM stub. It is not a browser screenshot or end-to-end browser test. Artifacts test responses are controlled fixtures, not observed cloud repository activity.

## Account/deployment findings

The user's screenshot showed Workers Paid as the current plan. The user later created namespace `artifacts-studio`; a successful listing confirmed jurisdiction `unrestricted` and zero repositories. Subsequent repository creation returned authentication error 10000; uploading the complete private Worker returned “No access to the specified resource.” After the user reauthenticated, both connector actions returned “Unknown tool” before reaching the Cloudflare API. The new API permissions remain unverified. Dashboard fallback is blocked by the execution environment's browser policy. No Studio Worker or repository was confirmed created by the assistant, no endpoint was published, and no existing Worker was changed. See `docs/HANDOFF.md` for continuation.

The October 6 deployment follow-up re-ran all 11 Node tests, 10 frontend smoke groups, and 16 Python bridge tests successfully. It added account-specific `wrangler.jsonc` and explicit `DEPLOY.md` instructions. These configuration/documentation changes do not establish a successful cloud deployment, browser rendering, or live agent execution.

## Architecture decisions

- Preserve Website Studio's project lifecycle and Amplifier's execution role.
- Keep selected context explicit; do not ingest or expose personal session history.
- Keep GitHub linked while Artifacts owns per-run Git workspaces; no automatic GitHub migration.
- Support a loopback-only local version with SQLite so planning remains usable while cloud access is unresolved.
- Treat runner-produced diffs/tests as attributed evidence; Studio checks Git commit identity, ancestry and freshness, not independent test execution.
- Record acceptance separately from integration and deployment. This version does not merge or deploy contributions.

## Next action and completion criteria

1. Resolve Cloudflare permissions through an authorized connection/dashboard.
2. Deploy one storage variant privately and verify owner access, Artifacts repositories and persistent CRUD.
3. Pair the outbound bridge in isolated execution environments with existing Amplifier/provider access.
4. Demonstrate two real overlapping runs, failure recovery and conflict rejection with timestamp/Git evidence.
5. Add a separately initiated, tested integration/merge operation before describing this as a complete agent coding platform.

No competition submission or public publication has occurred.
