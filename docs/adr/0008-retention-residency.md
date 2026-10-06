# ADR-0008: Retention and residency

Status: Proposed. Date: 2026-10-06. Owner: Operations + memory maintainers.

## Context

Git history, derived memory, forks, object storage, and provider logs retain data differently.

## Proposal

Choose namespace jurisdiction before creation and govern retention/deletion across every projection and artifact.

## Alternatives

Unrestricted forever; assume branch deletion purges Git; let memory retain everything.

## Rationale

Declared lifecycle and readback prevent false deletion and locality claims.

## Consequences

Existing unrestricted namespace cannot be relabeled; select new namespace for required jurisdiction and test purge/rebuild.

## Dependencies and evidence

See [canonical detail](../DATA-LIFECYCLE.md), [source register](../SOURCES.md), [contract registry](../CONTRACTS-README.md), and [pins](../../PINS.md). Current implementation limits are in [project status](../../PROJECT_STATUS.md).

## Ratification

Pending owner assignment, seam review, and relevant [conformance gates](../VERIFICATION.md). No live capability is established by this proposal. Supersede through a new ADR; preserve this record and its decision history.
