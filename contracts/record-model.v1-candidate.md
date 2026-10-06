# Record model v1-candidate

Status: draft. Owners: application architect, record writer, memory maintainer. Related: [ADR-0002](../docs/adr/0002-record-authority.md), [schema guide](../schemas/README.md).

## Inputs and outputs

Input: an authorized business intent, stable entity ID, next revision, payload, attributed producer, access scope, and optional previous revision. Output: a validated authored record, confirmed Artifacts source occurrence, and a projection intent/receipt. Source occurrence contains repository ID, commit, path, blob hash, content digest, and observation time.

Authored records do **not** contain their own final Git commit hash. That hash is unavailable until the commit is written; ingestion attaches it externally. References to earlier records use ID/revision and, where known, exact source locators.

## State and authority

Entity lifecycle is typed in payloads. Record revisions append/supersede; operational write state is pending → confirmed, failed, or outcome-unknown. Only the trusted record writer commits authoritative operator decisions. Worker code/reports cannot update these refs.

Artifacts is proposed durable authority; SQL and memory are projections. Current SQL authority persists until a verified migration cutover. Preserve original attribution and creation times when migrating; do not attribute old records to a new operator action.

## Invariants

Stable logical identity differs from source occurrence. Duplicate transport does not duplicate business effects. Approved task/packet revisions remain readable. Reject broken relationships, unknown schema versions, invalid revisions, cross-scope releases, and unsupported writer authority. A revision must match its entity type, ID, and previous revision; sequence allocation requires serialized compare-and-swap.

## Errors and versioning

Return safe codes such as `invalid_record`, `scope_denied`, `revision_conflict`, `source_unavailable`, and `outcome_unknown`. Retry only idempotent intents after readback. Schema version is `1-candidate`; no production compatibility promise.

## Conformance and open decisions

Validate shapes/examples, relationship graph and producer authority; replay duplicates; supersede a task; reconstruct a fresh projection; test ambiguous commits. Resolve signed/trusted writer identity, final repository layout, retention, and migration ordering before ratification.
