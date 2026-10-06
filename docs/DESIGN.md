# Implemented v0.1 design

This document describes the current code. The proposed Artifacts-first record architecture is [ARCHITECTURE](ARCHITECTURE.md), with draft [contracts](CONTRACTS-README.md). Current SQL records have not migrated to Git authority.

## Runtime and storage

Local mode: Node >=24, loopback listener, SQLite storage. Cloud mode: private Worker serving JSON APIs and bundled static interface; selected `src/cloud.mjs` uses a SQLite Durable Object. `src/worker.mjs` retains the D1 alternate.

Artifacts binding or REST adapter manages repositories/forks, tokens, history and files. Standard Git remains the write data plane. The outbound Python bridge claims work in a separately provisioned environment; it is not a runtime inside Workers.

## Operator surface

Overview, projects, work, repositories, context, review, and connections. Projects hold goal/repository/delivery path/stage. Tasks specify goal, scope, criteria, selected context and one/two assignments. Context is project-scoped evidence/decisions/hypotheses/references/excerpts. Queueing freezes the packet.

Review displays submitted diff/tests and records accept/reject/revision request. Stage selection, creating a task, and acceptance do not merge, deploy, or implicitly run the next stage.

## Core API

Cloud owner routes require verified Access identity in `ctx.access` and an explicit owner allowlist. Local owner identity is loopback-only. Writes require same-origin JSON. Runner routes use a separate secret, attempt identity and leases. Error responses include `error` and `code`.

```text
GET /api/state
POST /api/projects
PATCH /api/projects/:id
POST /api/contexts
DELETE /api/contexts/:id
POST /api/tasks
GET /api/tasks/:id/packet
POST /api/tasks/:id/queue
GET /api/repos
POST /api/repos
GET /api/repos/:name/log
GET /api/repos/:name/file
POST /api/runs/:id/review
GET /api/export
POST /api/runner/heartbeat
POST /api/runner/claim
POST /api/runner/runs/:id/heartbeat
POST /api/runner/runs/:id/report
```

Payload details are implemented in [api.mjs](../src/api.mjs) and documented for runner transport in [bridge README](../bridge/README.md). The draft record schemas are separate from today's wire format.

## Limits and trust

Two assignments/concurrent runs, 15-minute renewed leases, bounded packet/report sizes, conditional claims, no automatic retry, and exact returned-head review. Successful reports require a present descendant of the base in bounded first-parent history. Acceptance requires reported passing tests and unchanged source/fork heads.

This does not independently rerun tests or reconstruct a trusted combined candidate. Bridge tests precede its final commit; forks/clones are data separation rather than OS isolation. v0.1 SQL remains project/task/context/decision authority.

## Proposed evolution

Version authoritative records and selected packets in Artifacts; add operational projection/outbox reconciliation, native Unified/Converge custody mapping, independent final-candidate checks, explicit integration receipts, and a cited memory port. These require implementation and conformance evidence. See [roadmap](ROADMAP.md) and [status](../PROJECT_STATUS.md).
