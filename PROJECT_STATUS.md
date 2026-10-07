# Project status

Snapshot: 2026-10-06. The locally runnable **v0.1** application remains the implementation baseline. The new architecture is a **documented proposal**.

**2026-10-07 source-review correction:** Converge ships a web app and collaborative integration guidance that overlap the proposed Studio control surface. The [pinned reference](docs/reference/converge/README.md) now documents that foundation and its limits. Resolve the [reuse/ownership decisions](docs/reference/converge/STUDIO-REUSE-AND-GAPS.md) before implementing the earlier proposal; this review does not adopt a replacement architecture.

## Implemented

Persistent SQL-backed project/task/context storage, project-scoped selected packets/export, native Artifacts binding and local REST adapter, per-run repository provisioning, two-run concurrency, atomic claims/leases/heartbeats, attributed reports, exact-head/freshness review, owner/runner auth boundaries, responsive UI, and an outbound Python bridge.

The selected cloud template uses SQLite Durable Object storage. D1 is an alternate entrypoint. No automatic GitHub synchronization, memory retrieval, integration/merge service, or production delivery is implemented.

## Documentation foundation

The twenty ordered authoring tasks now have indexed deliverables: vision, bounded Unified pilot, roles, eight proposed ADRs, pins/capabilities, agent/contribution conventions, roadmap, diagrams, ownership, five draft contracts, eighteen candidate schemas and sixteen inert record examples, Artifacts/memory/execution guides, verification, recovery/privacy, and journal/handoff conventions.

[TODO](docs/TODO.md) distinguishes authoring from ratification/qualification. [VALIDATION](docs/VALIDATION.md) records this branch's checks and independent review. The read-only CI workflow and offline documentation checker are developer tooling, not production adapters.

## Historical evidence

The delivered v0.1 reported 11 Node backend/API/REST/regression tests, 10 API-backed frontend smoke groups, and 16 Python bridge tests passing. Frontend smoke uses a minimal DOM stub and controlled service responses. It does not establish browser behavior or live cloud execution.

Original review fixed orphan-commit acceptance, expired provisioning leases, project-relink races, non-atomic queueing, and bridge Git/configuration/time-budget/shutdown defects with regression coverage. Historical results are not substituted for current branch validation.

The expanded official Artifacts review covers 32 source files including index pages, plus relevant Builds/Queues references: [review](docs/ARTIFACTS-REVIEW.md).

## Live qualification and material limits

No successful hosted Studio deployment, live Artifacts Git operation, real Amplifier/model run, independent final-candidate verifier, or custom memory adapter was demonstrated. Browser rendering/accessibility/mobile interaction remain unverified.

The current bridge runs tests before its final commit, and separate clones/forks do not prove OS isolation. Current Studio ancestry validation is bounded first-parent history. Worker reports are attributed evidence, not independent checks. Acceptance records a decision and does not merge/deploy.

Historical cloud attempts included authentication/resource-access errors, then a tool-level “Unknown tool” failure after reauthentication. Later read-only review access is not proof of write/deploy permission. Recheck actual resources before any future mutation. The user-created namespace was observed unrestricted; it does not establish a new residency choice. Full history: [deployment status](docs/DEPLOYMENT-STATUS.json).

## Next sequence

Resolve Converge UX and record-owner reuse; review/ratify the resulting scope and contracts; identify the actual memory system; resolve runtime/bundle pins and supported Unified seam; qualify durable Artifacts records/private access; run one real isolated worker; verify a combined candidate; explicitly review and deliver the pilot; evaluate transfer to a website project.

Follow [roadmap](docs/ROADMAP.md), [verification](docs/VERIFICATION.md), and [handoff](docs/HANDOFF.md). No cloud deployment or unrelated repository/runtime mutation is part of this documentation change.
