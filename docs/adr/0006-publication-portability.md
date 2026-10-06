# ADR-0006: GitHub publication and notes portability

Status: Proposed. Date: 2026-10-06. Owner: Delivery maintainer.

## Context

Artifacts working repos and GitHub publication have different access and ref semantics.

## Proposal

Publish accepted candidates explicitly to the selected fork/ref with compare-and-swap and explicit notes mapping.

## Alternatives

Automatic bidirectional mirror; direct upstream push; assume Git notes transfer by default.

## Rationale

Explicit delivery preserves approval and prevents unexpected destination changes.

## Consequences

Record source/destination identities, export necessary notes refs, and reconcile ambiguous outcomes.

## Dependencies and evidence

See [canonical detail](../ARTIFACTS-INTEGRATION.md), [source register](../SOURCES.md), [contract registry](../CONTRACTS-README.md), and [pins](../../PINS.md). Current implementation limits are in [project status](../../PROJECT_STATUS.md).

## Ratification

Pending owner assignment, seam review, and relevant [conformance gates](../VERIFICATION.md). No live capability is established by this proposal. Supersede through a new ADR; preserve this record and its decision history.
