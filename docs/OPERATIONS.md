# Operations and recovery

Status: proposed runbooks. Current app has no integration/merge service or automated cleanup.

## Safe recovery sequence

1. Stop new work for the affected attempt/destination; preserve known receipts and safe logs.
2. Identify authoritative record revision, repository/ref, expected base, candidate SHA, custody owner, and pending intent.
3. Read actual state from Artifacts/runtime/destination. Treat an interrupted response as outcome-unknown.
4. Reconcile against the stable intent/idempotency key; confirm success, record conflict/failure, or retry only when safe.
5. Record recovery action and source evidence; renew/reassign custody only under policy.
6. Rebuild projections and resume bounded work.

| Failure | Recovery |
|---|---|
| Repo create/fork response lost | Locate/read back stored intent and repo identity; do not create uncontrolled duplicates |
| Git push timed out | Read exact destination ref; match candidate and expected base before retry |
| Destination advanced | Block integration; construct/reverify a new candidate or obtain a revised decision |
| Lease expired / worker disconnected | Reject authoritative stale completion; preserve attributed report; reconcile native tracker before new attempt |
| Tests or candidate merge failed | Preserve contribution/conflict/evidence; request revised task rather than claim acceptance |
| Memory projection failed | Keep source confirmed; retry projection idempotently; quarantine invalid records |
| Duplicate/truncated events | Deduplicate effect, reread full source, reconcile cursors; never infer missing business events |
| Deletion partially completed | Revoke access, record pending purge, verify each Git/object/memory/cache target; do not claim global deletion |
| Cloud auth/tool failure | Diagnose current connection and token scope separately from historical errors; do not alter unrelated resources |

## Backup, export, and restore

Export all required refs and Git objects, including selected notes refs; include logical-ID/source-occurrence mapping, schema versions, lifecycle decisions, object-storage digests, and projection cursors. Store backups under the same privacy/residency policy. Do not export tokens or lease secrets.

Restore into an isolated environment; verify objects/ref hashes, validate records and relationships, rebuild SQL/memory from source, compare current decisions and selected packets, and test a fresh-session handoff. Backups that only copy default-branch files may lose notes or historical evidence.

The v0.1 JSON export preserves relational business records; it is not a full future Git/object/memory backup. Retain the original SQL export during migration.

## Operational visibility

Track pending/unknown intents, lease age, projection lag, rejected records, queue retries/dead letters, token expiry, retained repo/object sizes, and budget. Artifacts metrics complement these signals; they do not verify task correctness.

Assign operators, retention intervals, costs, service limits, and escalation thresholds before live unattended operation. Concrete schedules are not chosen by these drafts. See [lifecycle](DATA-LIFECYCLE.md) and [ownership](INTEGRATION-OWNERSHIP.md).
