# ADR-0002: Artifacts, memory, and history authority

Status: Proposed. Date: 2026-10-06. Owner: Application architect + memory maintainer.

## Context

Durable intent, runtime history, and derived knowledge can diverge if multiple stores own decisions.

## Proposal

Artifacts authored records are durable authority; SQL is operational; memory is derived; Unified retains native history.

## Alternatives

Keep SQL permanent authority; make memory the task authority; duplicate all native history.

## Rationale

Git supplies explicit immutable versions and portable provenance; memory serves retrieval rather than approval.

## Consequences

Migration and reconstruction are required; no own-commit hash inside authored records.

## Dependencies and evidence

See [canonical detail](../MEMORY-INTEGRATION.md), [source register](../SOURCES.md), [contract registry](../CONTRACTS-README.md), and [pins](../../PINS.md). Current implementation limits are in [project status](../../PROJECT_STATUS.md).

## Ratification

Pending owner assignment, seam review, and relevant [conformance gates](../VERIFICATION.md). No live capability is established by this proposal. Supersede through a new ADR; preserve this record and its decision history.
