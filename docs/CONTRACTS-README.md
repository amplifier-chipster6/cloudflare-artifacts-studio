# Contract registry

All five contracts are **v1-candidate drafts** authored 2026-10-06. Operator authorization to write documentation does not ratify APIs or establish live compatibility.

| Contract | Responsible seams | Conformance gate |
|---|---|---|
| [Record model](../contracts/record-model.v1-candidate.md) | Studio writer ↔ Artifacts ↔ projections | Schema, authority, supersession, provenance, rebuild |
| [Context packet](../contracts/context-packet.v1-candidate.md) | Operator selector ↔ worker | Selected-only content, immutable identity, least privilege |
| [Runner adapter](../contracts/runner-adapter.v1-candidate.md) | Studio ↔ Unified/Converge | Single custody, pinned runtime, isolation, failure recovery |
| [Memory integration](../contracts/memory-integration.v1-candidate.md) | Record reader ↔ actual memory service | Source locators, idempotence, scope, deletion, cited retrieval |
| [Review integration](../contracts/review-integration.v1-candidate.md) | Candidate/verifier ↔ operator ↔ delivery | Final-SHA evidence and separate decision/integration/deployment |

## Ratification process

Identify both seam owners and the actual host/service revisions. Resolve open questions, run positive/negative conformance fixtures plus real adapter checks, record an ADR/decision and effective version, then mark the contract ratified. Converge's locked-candidate/contract discipline should enforce this in execution. Presence of a draft document is not a lock.

Candidate schemas are in [schemas](../schemas/README.md). They validate sample shapes, not the complete runtime policy. Runtime semantic/auth checks remain necessary. Changes before ratification may be breaking; after ratification use an explicit version/migration.

Shared rules: stable logical IDs and revisions; immutable source occurrences; UTC timestamps with producer versus observation time distinguished; structured errors with safe details; idempotent writes; no credential material; accepted decisions never inferred from summaries.
