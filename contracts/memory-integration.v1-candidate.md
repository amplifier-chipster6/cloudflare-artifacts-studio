# Memory integration v1-candidate

Status: draft port proposal; the custom memory system has not been inspected. Owners: record reader and memory maintainer.

## Inputs and outputs

Input: confirmed authored record plus external source occurrence, schema/type, ID/revision, timestamps, attribution/authority, release scope, supersession, and relationships. Output: ingestion receipt with idempotency key/cursor; derived entries retain source citations. Retrieval returns scoped excerpts with exact source references, derivation type/confidence, freshness, and inclusion eligibility.

Source key: repository ID + commit + path; logical grouping: entity ID + revision. Blob/content digests verify content but do not replace occurrence identity.

## State and invariants

Unseen → validated → projected or rejected; later superseded/deleted under policy. Summaries, embeddings, graph edges, and caches are derived. They cannot mint decisions or own native conversation history. Multiple observations of the same source are deduplicated; a repeated logical revision with different content is a conflict.

Retrieve default current authoritative records within access scope; preserve rejected/superseded attempts for audit without presenting them as current approval. Explicit task selection freezes any chosen excerpt and citations.

## Errors, versioning, conformance

Errors: `unsupported_schema`, `identity_conflict`, `scope_denied`, `source_missing`, `projection_failed`, `deletion_pending`. Retry with stable idempotency key; quarantine invalid content. A source tombstone is not proof that derived caches were purged.

Conformance: replay/duplicate ingestion, source verification, lineage, current-versus-superseded retrieval, scope isolation, deletion cascade, and reconstruction from Git alone. Map this abstract port to the actual service before ratification; do not infer API method names from these docs. See [memory guide](../docs/MEMORY-INTEGRATION.md).
