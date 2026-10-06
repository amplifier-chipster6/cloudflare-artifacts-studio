# Bounded Unified pilot

Status: **proposed objective; capability discovery required before implementation**. Owner: product steward with Unified maintainer. Dependencies: [pins](../PINS.md), [capability inventory](CAPABILITY-INVENTORY.md), [execution contract](../contracts/runner-adapter.v1-candidate.md).

## Objective and benefit

Add one operator-configured **Artifacts Studio** navigation entry through Unified's supported shell configuration or extension seam. The entry opens the operator-approved Studio origin on an explicit click. This gives the personal workspace a dependable entrypoint while preserving Unified's native execution and history.

This is an intentionally small modernization/personalization task. It does not establish that the observed Unified version exposes the required seam. Discovery must cite the current upstream implementation, identify its lifecycle and extension contract, and produce a bounded file allowlist. If the seam is absent, stop and propose an amended pilot; do not expand into a new shell or memory implementation.

## Prerequisites

- Record the actual host/fork SHA, supported Node/Python requirements, and operator's delivery repository/ref.
- Discover and qualify the native configuration/extension surface on that SHA.
- Approve the displayed label and destination. Accept HTTPS; permit a loopback HTTP destination only in explicitly selected local mode. Reject embedded credentials and unsafe URL schemes.
- Decide the concrete file allowlist and freeze a task revision and selected context packet.
- Qualify an isolated runner and a trusted verification environment. A local app URL is not proof of hosted availability.

## Scope

One navigation entry, its validated configuration, native accessible interaction, and focused tests/documentation. Assign one implementation worker and, once the workflow is qualified, an independent verification role. Keep personalization local to the fork. Reuse existing UI primitives.

Exclude a host rewrite, provider changes, global bundle edits, automatic context synchronization, automatic cloud deployment, upstream contribution, and broad visual redesign. These exclusions bound this pilot's acceptance.

## Acceptance criteria

| ID | Required outcome | Independent evidence |
|---|---|---|
| PILOT-01 | The supported seam and allowed files are identified before coding | Source citations pinned to the host SHA and reviewed task scope |
| PILOT-02 | Exactly one configured entry is displayed; unset/disabled configuration follows native behavior | Configuration tests and desktop/mobile screenshots |
| PILOT-03 | Navigation occurs only on deliberate activation | Interaction tests; no startup/network side effect |
| PILOT-04 | Destination validation enforces the chosen URL policy; no credential storage | Negative URL cases and diff inspection |
| PILOT-05 | Native keyboard access, focus, labeling, and mobile presentation work | Real browser checks; the current DOM stub is insufficient |
| PILOT-06 | Native conversations/execution remain functional; only allowed paths change | Host regression checks and exact candidate diff |
| PILOT-07 | Review can resume from recorded packet, candidate, verification, and decision | Reconstruction exercise with exact source locators |

## Completion

A trusted verifier passes the named checks on the **final combined candidate SHA**, the operator records a decision, and any separately authorized integration produces a receipt for the fork's chosen ref. A rejected or blocked pilot still preserves useful evidence but is not successful delivery. Hosted deployment is optional and separate.

Calendar placement: [M1–M4 roadmap gates](ROADMAP.md). The roadmap estimates do not override failed prerequisites.
