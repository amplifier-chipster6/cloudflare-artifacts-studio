# ADR-0004: Execution isolation and trusted verification

Status: Proposed. Date: 2026-10-06. Owner: Runtime + verification maintainers.

## Context

Worker-supplied test reports and separate directories do not establish trustworthy candidate evidence.

## Proposal

Use constrained OS environments and independent final-candidate verification credentials.

## Alternatives

Trust agent reports; run everything in one host; infer isolation from CLI flags.

## Rationale

Final-SHA checks and separation protect evidence from worker control.

## Consequences

Implementation and environment qualification are required; separate worker/verifier secrets and budgets.

## Dependencies and evidence

See [canonical detail](../VERIFICATION.md), [source register](../SOURCES.md), [contract registry](../CONTRACTS-README.md), and [pins](../../PINS.md). Current implementation limits are in [project status](../../PROJECT_STATUS.md).

## Ratification

Pending owner assignment, seam review, and relevant [conformance gates](../VERIFICATION.md). No live capability is established by this proposal. Supersede through a new ADR; preserve this record and its decision history.
