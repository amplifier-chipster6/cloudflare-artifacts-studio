# Documentation map

Architecture authoring date: 2026-10-06. The target architecture and v1-candidate contracts are **proposed**, not a claim of deployed capability. [Project status](../PROJECT_STATUS.md) describes the implementation; [validation](VALIDATION.md) records checks of this branch.

The [Converge source reference](reference/converge/README.md), reviewed through the GitHub connector on 2026-10-07, corrects an architectural omission: Converge ships a substantial web app and newer collaborative integration guidance. Read its [reuse/gap assessment](reference/converge/STUDIO-REUSE-AND-GAPS.md) before implementing overlapping Studio surfaces or stores. The earlier proposed architecture needs this reuse decision; this review does not ratify a redesign.

Start with [vision](VISION.md), [pilot](PILOT.md), [architecture](ARCHITECTURE.md), [repository roles](REPOSITORY-ROLES.md), and [roadmap](ROADMAP.md). [TODO](TODO.md) tracks all twenty ordered documentation tasks and separates authoring from live qualification.

| Area | Canonical document |
|---|---|
| Development | [AGENTS](../AGENTS.md), [contributing](../CONTRIBUTING.md), [pins](../PINS.md), [capabilities](CAPABILITY-INVENTORY.md) |
| Decisions | [ADR register](adr/README.md) |
| Boundaries | [integration ownership](INTEGRATION-OWNERSHIP.md), [contract register](CONTRACTS-README.md) |
| Record formats | [schema guide](../schemas/README.md), [inert examples](../examples/records/README.md) |
| Durable foundation | [Artifacts integration](ARTIFACTS-INTEGRATION.md), [official documentation review](ARTIFACTS-REVIEW.md) |
| Knowledge and continuity | [memory integration](MEMORY-INTEGRATION.md), [context policy](CONTEXT-POLICY.md), [journal](JOURNAL.md), [handoff](HANDOFF.md) |
| Execution | [adapter and bundles](EXECUTION-ADAPTER.md), [bridge baseline](../bridge/README.md), [verification](VERIFICATION.md) |
| Operations | [operations](OPERATIONS.md), [data lifecycle](DATA-LIFECYCLE.md), [security](../SECURITY.md), [deployment](../DEPLOY.md) |
| Implementation | [design](DESIGN.md), [plan](PLAN.md), [source](../README.md) |
| Source evidence | [source register](SOURCES.md) |
| Converge knowledge base | [Pinned wiki](reference/converge/README.md), [coverage](reference/converge/SNAPSHOT-AND-COVERAGE.md), [facts](reference/converge/FACTS.json) |

A document describing a future adapter does not implement it. Machine-readable examples are synthetic. Role names are responsibilities awaiting assignment, not people or agents already running.
