# Ordered documentation TODO

Snapshot: 2026-10-06. All twenty authoring deliverables are created on `initial-documentation-creation`; validation/review evidence is in [VALIDATION](VALIDATION.md). These checkboxes mean **authored**, not ratified or implemented. Owner labels are roles awaiting assignment. Machine-readable coverage: [coverage](documentation-coverage.json).

| ID | Authoring deliverable | Owner | Dependencies | Canonical entry |
|---|---|---|---|---|
| DOC-01 ✓ | Repository roles and baseline | Application architect | — | [Document](REPOSITORY-ROLES.md) |
| DOC-02 ✓ | Bounded Unified pilot | Product steward | DOC-01, DOC-07 | [Document](PILOT.md) |
| DOC-03 ✓ | Vision | Project steward | DOC-01, DOC-02 | [Document](VISION.md) |
| DOC-04 ✓ | Decision register and eight proposed ADRs | Architect | DOC-01, DOC-02, DOC-03 | [Document](adr/README.md) |
| DOC-05 ✓ | Reconcile baseline documents | Application maintainer | DOC-01, DOC-03 | [Document](../README.md) |
| DOC-06 ✓ | Agent guidance | Application maintainer | DOC-03, DOC-05 | [Document](../AGENTS.md) |
| DOC-07 ✓ | Pins and capability inventory | Runtime/bundle maintainer | DOC-01 | [Document](../PINS.md) |
| DOC-08 ✓ | Contribution, review, CI, and templates | Application maintainer | DOC-06, DOC-07 | [Document](../CONTRIBUTING.md) |
| DOC-09 ✓ | Roadmap and durable TODO | Project coordinator | DOC-02, DOC-04 | [Document](ROADMAP.md) |
| DOC-10 ✓ | Architecture and five diagrams | Architect | DOC-01, DOC-03 | [Document](ARCHITECTURE.md) |
| DOC-11 ✓ | Integration ownership | Seam owners | DOC-10 | [Document](INTEGRATION-OWNERSHIP.md) |
| DOC-12 ✓ | Contract registry and five draft seam contracts | Seam owners | DOC-11 | [Document](CONTRACTS-README.md) |
| DOC-13 ✓ | Candidate schemas, examples, and validation | Data/integration architect | DOC-12 | [Document](../schemas/README.md) |
| DOC-14 ✓ | Artifacts integration and official source review | Cloudflare specialist | DOC-07, DOC-12 | [Document](ARTIFACTS-INTEGRATION.md) |
| DOC-15 ✓ | Memory intake, provenance, and reconstruction proposal | Memory maintainer (unassigned) | DOC-11, DOC-13 | [Document](MEMORY-INTEGRATION.md) |
| DOC-16 ✓ | Execution adapter and bundle composition | Runtime/bundle maintainer | DOC-07, DOC-11, DOC-12 | [Document](EXECUTION-ADAPTER.md) |
| DOC-17 ✓ | Verification and acceptance matrix | Independent verifier | DOC-02, DOC-12, DOC-13, DOC-14, DOC-15, DOC-16 | [Document](VERIFICATION.md) |
| DOC-18 ✓ | Operations, recovery, retention, locality | Operations + memory maintainers | DOC-11, DOC-14, DOC-15 | [Document](OPERATIONS.md) |
| DOC-19 ✓ | Security and context/data handling | Access/data steward | DOC-11, DOC-14, DOC-18 | [Document](../SECURITY.md) |
| DOC-20 ✓ | Journal, source register, and continuation | Knowledge steward | DOC-13, DOC-15 | [Document](JOURNAL.md) |

## Qualification and administration still TODO

- [x] Create the pinned Converge [source-reference wiki](reference/converge/README.md), full inventory, verified local text cache, factual claims, API map, reuse/gap assessment and offline checker results (2026-10-07).
- [ ] Resolve existing Converge UX reuse, native record ownership, hosting and acceptance/integration policy before implementing overlapping Studio components; revise the affected proposed ADRs/contracts/diagrams/pilot after that decision.
- [ ] Ratify the pilot and ADR/contract choices; assign actual seam owners.
- [ ] Discover the supported Unified seam and freeze its file allowlist (DOC-02).
- [ ] Resolve actual host/transitive/bundle/tool/image pins and prove loaded composition (DOC-07/16).
- [ ] Identify/inspect the custom memory repository/service and map the draft port to its schema/API (DOC-15).
- [ ] Configure desired GitHub main protections and verify required CI check names (DOC-08); no settings were applied here.
- [ ] Implement/qualify the Artifacts record writer, packets, projection/outbox migration, and live Git roundtrip (M1).
- [ ] Qualify OS isolation, custody, final-candidate verifier, and explicit delivery recovery (M2–M3).
- [ ] Decide namespace locality, concrete retention intervals, budgets, and deletion policy.
- [ ] Demonstrate the pilot in a real desktop/mobile browser and reconstruct it in a fresh session (M4).
- [ ] Run a second website task and evaluate transfer (M5).

Use [roadmap](ROADMAP.md) gates in order. The twenty documents are a reviewable foundation; incomplete discovery or live adapters remain visible instead of being marked completed through documentation alone. Add future execution tasks with stable IDs, owner, dependencies, acceptance evidence, and source revision.
