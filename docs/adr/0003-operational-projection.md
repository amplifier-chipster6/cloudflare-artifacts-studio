# ADR-0003: SQL projection and reconciliation

Status: Proposed. Date: 2026-10-06. Owner: Application maintainer.

## Context

Claims and multi-system writes require coordination; no cross-system transaction exists.

## Proposal

Use the selected SQLite Durable Object for serialized operational state, projections, and a recoverable outbox.

## Alternatives

D1 only; Git refs as job queue; synchronous multi-service transaction.

## Rationale

Current selected entrypoint uses a Durable Object; operational coordination and durable record authority have different jobs.

## Consequences

Require idempotence, outcome-unknown recovery, and rebuildable indexes; current SQL authority persists until cutover.

## Dependencies and evidence

See [canonical detail](../OPERATIONS.md), [source register](../SOURCES.md), [contract registry](../CONTRACTS-README.md), and [pins](../../PINS.md). Current implementation limits are in [project status](../../PROJECT_STATUS.md).

## Ratification

Pending owner assignment, seam review, and relevant [conformance gates](../VERIFICATION.md). No live capability is established by this proposal. Supersede through a new ADR; preserve this record and its decision history.
