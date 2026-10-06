# Runner adapter v1-candidate

Status: draft. Owners: Studio coordinator and qualified Unified/Converge runtime.

## Inputs and outputs

Input: assignment/attempt ID, immutable task/packet reference, approved base SHA, worker repo, allowed paths, runtime/bundle fingerprint, deadlines, and credential references. Output: claim/heartbeat/custody receipts, native session/work-tracker mappings, attributed contribution/report, and terminal status.

## State and custody

Queued → claimed → running → submitted, failed, cancelled, or expired. Provisioning may remain pending/outcome-unknown; do not let a retry create competing workers. One manager owns one attempt. Map Studio IDs to actual native tracker/session IDs. Native Converge scheduling and Studio scheduling must not both independently assign the same worker.

Current bridge implements outbound claims, two-run cap, leases/heartbeats, and bounded reports. It is not yet a demonstrated Unified/Converge adapter.

## Invariants

Worker receives only packet and its repository credentials; no verifier/production secrets. Qualify constrained OS isolation. Record exact baseline and final SHA, changed paths, diff/report, actual tool environment, exit status, and interrupted processes. Distinct sessions/workspaces establish worker lanes; helper-agent calls alone do not.

A stale or expired worker cannot publish an authoritative completion. Preserve its attributed report if useful, reconcile custody, and create a new attempt under policy. Failed tests cannot become successful delivery through summary wording.

## Errors, versions, and conformance

Errors: `unsupported_host`, `bundle_not_loaded`, `custody_conflict`, `lease_lost`, `baseline_mismatch`, `isolation_unqualified`, `report_rejected`, `outcome_unknown`. Draft version 1-candidate must coexist with the current bridge protocol until an explicit migration.

Conformance: real single run, overlapping lanes, cancellation/lease loss, failed provisioning, token expiry, exact base readback, duplicate claims, runtime pins, and contribution identity. Resolve supported host command/API, adapter envelope, actual native work-tracker semantics, cancellation, and credential delivery before ratification.
