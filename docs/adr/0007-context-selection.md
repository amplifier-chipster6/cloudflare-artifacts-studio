# ADR-0007: Context selection and privacy

Status: Proposed. Date: 2026-10-06. Owner: Context steward + operator.

## Context

Repository tokens cannot enforce per-path selection, and personal memory may contain unrelated material.

## Proposal

Freeze operator-selected context in a separately scoped packet repo; memory retrieval remains a proposal until selection.

## Alternatives

Give workers the complete record repo; auto-ingest all personal history; authorize by path naming.

## Rationale

Least-privilege repository boundaries and explicit selection bound disclosure.

## Consequences

Validate provenance/scope/digests; provide preview and revocation policy; secrets remain outside records.

## Dependencies and evidence

See [canonical detail](../CONTEXT-POLICY.md), [source register](../SOURCES.md), [contract registry](../CONTRACTS-README.md), and [pins](../../PINS.md). Current implementation limits are in [project status](../../PROJECT_STATUS.md).

## Ratification

Pending owner assignment, seam review, and relevant [conformance gates](../VERIFICATION.md). No live capability is established by this proposal. Supersede through a new ADR; preserve this record and its decision history.
