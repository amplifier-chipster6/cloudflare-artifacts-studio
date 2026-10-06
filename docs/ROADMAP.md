# Evidence-gated roadmap

Status: proposed schedule, dated 2026-10-06; estimates assume maintainers are available. Passing a gate matters more than its date. Documentation authoring does not pass a runtime gate.

| Milestone | Indicative window | Owner | Dependencies | Exit evidence |
|---|---|---|---|---|
| M0 — scope and reproducibility | Oct 7–9 | Project steward + maintainers | DOC-01–20 authoring | Review/ratify pilot and seam contracts, assign owners, resolve host/bundle pins and memory identity |
| M1 — durable Artifacts foundation | Oct 12–16 | Cloudflare/application maintainer | M0 | Private access, live repo/token/Git roundtrip, immutable packet and attributed record write; projection rebuild and residency choice |
| M2 — one real Unified worker | Oct 19–23 | Runtime/bundle maintainer | M1 | Supported pilot seam; project-local Converge composition loaded on pinned host; one real isolated run with custody and receipts |
| M3 — candidate and recovery | Oct 26–30 | Runtime + verifier maintainers | M2 | Two bounded lanes if needed, combined final candidate, independent checks; duplicate events, stale base, lease loss and ambiguous publication recovery |
| M4 — usable private pilot | Nov 2–6 | Application + operator | M3 | Owner UI on desktop/mobile; prepare/run/review/resume pilot, explicit accepted integration, reconstruction by a fresh session |
| M5 — Website Studio transfer | Nov 9–13 | Design/knowledge steward | M4 | A second bounded website project reuses the loop; compare results, record gaps, promote justified reusable capabilities |

## Order of engineering work

Discover → define task/criteria → ratify seams → pin inputs → create isolated scope → implement → build candidate → independently verify → operator review → separately integrate → separately deploy → journal and handoff.

Establish memory provenance and context policy during M0/M1. Connect retrieval only after durable IDs, source locators, scope, deletion semantics, and the actual memory port are agreed. Broad UI modernization waits until the bounded loop works.

## Blockers and next decisions

Live Artifacts and private deployment remain unverified. Unified runtime/bundle composition has not been loaded or demonstrated. The custom memory system's identity/schema are unknown. Candidate verification and integration recovery need implementation. Required branch protection is desired configuration, not enabled by these documents.

Use [TODO](TODO.md) for documentation deliverables and [verification](VERIFICATION.md) for runtime gates. Move dates when prerequisite evidence changes; keep decisions and timeline events as records rather than editing history to imply success.
