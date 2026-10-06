# Memory integration architecture

Status: draft seam proposal for the receiving memory architect. The existing custom memory repository, API, schema, deployment, and privacy model have **not been supplied or inspected**. This document specifies a mapping target, not an adapter already connected.

## Authority and identity

Artifacts stores authored intent/evidence/decision records. Memory derives summaries, embeddings, timelines, and relationship graphs. Unified owns native session history. Studio SQL coordinates runs and projects records for the UI.

Use three distinct identities:

1. **Logical entity:** stable ID, type, revision; survives file renaming.
2. **Source occurrence:** repository ID, full commit SHA, path, blob SHA, SHA-256 content digest.
3. **Derived entry:** memory-system ID, derivation version, source occurrences, ingestion cursor and access scope.

Authored content cannot embed its own final commit SHA. Add a source envelope after Git confirmation. Business timestamps describe when an action happened; `observed_at` describes ingestion. Neither a commit date nor a generated summary replaces an operator decision timestamp.

## Proposed intake port

Read a committed record; verify schema/digest/producer/scope; enrich with immutable source envelope; normalize typed relationships; upsert derived entries with a stable idempotency key; write an ingestion receipt/cursor. Replay safely. Quarantine malformed or conflicting logical revisions. Preserve the raw authoritative source reference.

The [candidate contract](../contracts/memory-integration.v1-candidate.md) defines behavior. It deliberately does not invent method names for the actual memory service.

| Record fields | Meaning for memory | Existing-system mapping |
|---|---|---|
| `id`, `record_type`, `revision`, `supersedes` | Entity identity/current-versus-history | To be mapped |
| `project_id` and typed references | Graph partition and relationships | To be mapped |
| `created_at`, payload lifecycle timestamps | Business timeline | To be mapped |
| `producer`, `authority` | Attribution and trust class | To be mapped |
| `access_scope` | Retrieval/release eligibility | To be mapped |
| Source repo/commit/path/blob/digest | Immutable citation and verification | To be mapped |
| Packet/manifest and run/candidate references | Reproducible selected inputs and results | To be mapped |
| Review/integration/deployment receipts | Distinct decision and delivered state | To be mapped |

## Graph and retrieval

Project → milestone → task revision → criterion/assignment → run → contribution → candidate → verification → review → integration → deployment. Context manifests reference chosen context items; journal/handoff records refer to exact evidence. Encode relationship type and target revision, not just free-text similarity.

Default retrieval prefers current, in-scope authoritative records. Keep rejected/failed/superseded attempts as attributed history; do not present them as accepted implementation. Derived assertions cite exact occurrences and show uncertainty/freshness. Where sources disagree, preserve the conflict for review.

A memory retrieval result is a proposal for context. The operator selects an excerpt; Studio freezes its bytes, scope, citations, and digest into a packet. No automatic bulk release of personal history. Revocation/deletion must invalidate relevant summaries, embeddings, graph edges, caches, and retained packets under policy.

## Events and reconstruction

Consume idempotently from Artifacts notifications/outbox, reread full records, and periodically reconcile source heads/cursors. At-least-once transport is expected. Do not interpret a generic Git push as task acceptance.

Reconstruction exercise: given a project/task ID, retrieve the effective revision; selected manifest; native custody mapping; contributions; combined candidate; independent checks; operator decision; actual delivery receipts; superseded attempts; and next authorized work. Every claim must link to an exact source occurrence. Rebuild a fresh memory projection from records without trusting the previous summary cache.

## Migration from v0.1 SQL

Freeze/export current SQL records and attachments; inventory IDs/relationships and original attribution; classify sensitive content; write initial record revisions and verify digests/counts; generate source envelopes after commit; rebuild a fresh SQL/memory projection; compare decisions/context; record explicit authority cutover. Keep rollback/export retention policy. Do not silently make migrated “accepted” decisions into integration receipts.

## Questions for the receiving architect

Identify the real repository/API and current authority model; map IDs, types, revisions and scope; choose graph and embedding behavior; design conflict/cursor and deletion handling; qualify native Unified history references; agree custody/run mapping; assign port owners; then ratify and implement. Existing Unified references to `amplifier-memory` or Context Intelligence are not evidence that this custom memory system is that service.

See [ADR-0002](adr/0002-record-authority.md), [ownership](INTEGRATION-OWNERSHIP.md), [schema guide](../schemas/README.md), and [lifecycle](DATA-LIFECYCLE.md).
