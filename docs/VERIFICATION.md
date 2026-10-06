# Verification and acceptance strategy

Status: test strategy for proposed integrations. Performed branch checks are recorded in [VALIDATION](VALIDATION.md); historical delivery evidence is in [project status](../PROJECT_STATUS.md).

## Evidence classes

Controlled unit/adapter fixtures, local API/DOM smoke, real browser checks, live Artifacts operations, real model/runtime execution, and production delivery are distinct. A passing lower-level class does not establish a higher one.

A trusted verifier has a clean checkout of the final combined candidate SHA, restricted execution, independent credentials, and prescribed checks. Record commands/exit codes, environment fingerprint, start/end times, candidate identity, and criterion results. The worker cannot write this receipt.

## Acceptance-to-evidence matrix

| Gate / criterion | Required evidence | Current qualification |
|---|---|---|
| DOC-01–20 authoring | File coverage, local links, schema/examples, independent review | This branch's validation ledger |
| v0.1 regression | Build, Node backend/adapter, frontend DOM smoke, bridge tests | Historical passes; rerun recorded separately |
| PILOT-01 / host seam | Pinned source discovery and concrete allowlist | Not performed |
| PILOT-02–05 / UX and URL policy | Focused positive/negative tests plus real desktop/mobile browser/keyboard evidence | Not performed |
| PILOT-06 / exact candidate | Actual diff, allowed paths, native regressions, clean checkout/final SHA | Not performed |
| PILOT-07 / continuity | Rebuild task/evidence/current decision from immutable records | Not performed |
| Artifacts foundation | Private create/info/token/push/fetch/read/fork/base identity/expiry/revoke roundtrip | Not performed live |
| Context boundary | Selected-only packet; cross-scope rejection; worker cannot read record/verifier repo | Candidate example checks only |
| Custody/isolation | Actual host load/run, image restrictions, duplicate claims, lease loss, cancellation | Not demonstrated |
| Combined candidate | Conflict handling, actual merge inputs, clean final checkout, tests after final commit | Not implemented here |
| Trusted review | Reject wrong-SHA/tampered evidence; separate operator decision | Candidate semantic fixtures only |
| Integration | Expected-base compare-and-swap, stale/unknown/duplicate recovery, notes portability | Not implemented here |
| Memory | Replay, scopes, current/superseded retrieval, cited reconstruction, deletion | Port proposal only |
| Events/operations | Duplicate/out-of-order/truncated events, loop filtering, outbox/reconcile, export/restore | Not connected |
| Private cloud app | Access denial/owner identity/runner policy, persistent CRUD, restart, preview protection | No verified deployment |

## Required negative scenarios

Wrong repository or baseline; orphan/unrelated commit; changed source/fork head; out-of-scope file; secret leakage; tests on an earlier worker commit; verifier impersonation; stale/expired report; ambiguous push/deploy; contradictory logical revision; unselected memory excerpt; truncated event commit list; duplicate effect; purged source with surviving derived cache.

The current ancestry check is bounded to 1,000 first-parent commits. Qualify full intended DAG/ref policy before using it as general integration proof.

## Completion record

A milestone receipt lists each required gate, final tested revision, source locators, verifier identity, result, blocked checks, operator decision, and actual delivery receipts. “Not performed,” “blocked,” and “failed” are valid results; none can be rewritten to “passed” through summaries.

The documentation checker validates draft shapes and sample graph invariants only. It is not the production record writer, authorization service, or full runtime conformance implementation.
