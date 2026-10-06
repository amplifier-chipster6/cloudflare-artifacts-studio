# Context packet v1-candidate

Status: draft. Owners: operator/context selector and runtime maintainer.

## Inputs and outputs

Input: one task revision, approved source base, criteria/assignments, explicit context selection, runtime/bundle pins, and access policy. Output: immutable packet manifest plus selected bytes or controlled immutable references, canonical packet digest, repository/source locator, and worker read-only access reference.

Every included context item records its ID/revision, source locator, classification, inclusion decision, digest, and release scope. Optional memory excerpts include citations and derivation status. Excluded items are absent from worker content; do not leak private titles or source locations through an exclusion list.

## Lifecycle and invariants

Draft selection → validated → frozen → assigned → retained/superseded. A frozen packet never follows a moving branch or live memory query. Material changes require a new revision and review.

The worker sees exactly selected content, not the full project records repo. Enforce task/project scope, byte budgets, reference availability, digest agreement, expiry, and least-privilege repository tokens. Secrets, auth headers, personal-history bulk exports, and unapproved context are forbidden.

## Errors, versions, and conformance

Safe errors: `selection_required`, `source_changed`, `digest_mismatch`, `scope_denied`, `packet_too_large`, `reference_unavailable`. The current app's 200 KB packet budget is a v0.1 limit, not a platform limit. Draft v1-candidate must select an explicit policy budget.

Tests: selected-only packet, rejected cross-project/private item, stable digest after freezing, changed-source rejection, worker cannot read record/verifier repositories. Resolve canonical JSON/byte hashing, reference fetching, revocation, and practical size budget before ratification. See [context policy](../docs/CONTEXT-POLICY.md).
