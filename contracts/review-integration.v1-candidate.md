# Review and delivery v1-candidate

Status: draft. Owners: candidate builder, independent verifier, operator, delivery maintainer.

## Inputs and outputs

Input: contributions, approved task/packet/base, allowed scope, final combined candidate, and named acceptance checks. Output: candidate receipt, independent verification receipt, operator decision, and separately initiated integration/deployment receipts.

Each decision binds task revision, candidate ID/SHA, trusted verification references, operator role, timestamp, and disposition. “Accepted” requires passing required checks on that exact candidate. An agent's claimed pass cannot satisfy it.

## Lifecycle and authority

Contribution submitted → candidate constructed/conflicted → verified/failed → reviewed accepted/rejected/changes-requested. Acceptance does not advance a destination ref.

Integration intent records destination repository/ref and expected base; compare-and-swap publishes the candidate or rejects a stale head. Readback confirms a receipt. Deployment targets the integrated identity under its own explicit policy and produces a separate receipt. Failed or unknown outcomes never appear as confirmed.

## Invariants

Verifier credentials/environment are outside worker control. Reconstruct actual Git diff, scope, ancestry and final identity; run tests after combination/final commit. Do not treat a bounded first-parent traversal as full DAG validation. Notes portability and ref mappings are explicit when publishing.

## Errors, versions, and conformance

Errors: `candidate_conflict`, `untrusted_evidence`, `verification_stale`, `scope_violation`, `destination_changed`, `authorization_missing`, `outcome_unknown`. Draft 1-candidate adds capabilities beyond current acceptance recording.

Conformance: tampered report, out-of-scope path, tests on wrong SHA, two-worker conflict, rejected review, stale destination, duplicate publication, ambiguous response/readback, and deploy identity mismatch. Resolve verification executor, merge policy, operator identity binding, and delivery authorization mechanism before ratification.
