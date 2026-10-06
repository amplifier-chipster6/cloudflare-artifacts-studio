# Data lifecycle and locality

Status: proposed policy; concrete retention periods require operator/data-steward decisions.

| Data class | Retention intent | Deletion/reconstruction obligation |
|---|---|---|
| Project intent, task revisions, decisions, delivery receipts | Preserve accountable history under project policy | Versioned supersession; legal/privacy purge is a separate operation |
| Selected packets and excerpts | Retain enough to reproduce approved work, subject to release policy | Expiry/revocation must govern copies, not only token access |
| Failed runs, forks, test logs | Bounded diagnostic retention | Export needed evidence, revoke, then delete; no silent loss of accepted provenance |
| Large assets/previews | Explicit object-storage lifecycle | Digest/reference tracking; purge copies and backups under policy |
| Memory summaries/embeddings/graph/cache | Derived from allowed source | Cascade supersession/deletion; confirm purge and filter retrieval immediately |
| Tokens/credentials | Short-lived operational material | Never retain secrets in Git; revoke/rotate through provider |
| Backups/exports | Policy-aligned recovery window | Govern residency/access and restore-delete reconciliation |

Deleting a branch or file does not purge Git history. Deleting a repository is a different operation and may be asynchronous; verify completion and provider policy. A tombstone can block retrieval but is not proof that every retained object, cache, or backup has been erased.

Namespace jurisdiction is selected at creation and cannot be changed. Publicly documented restricted choices are `us` and `eu`; default unrestricted is not a locality guarantee. The existing observed namespace is unrestricted. Do not infer that Artifacts locality also governs R2, memory, runtime logs, GitHub, model providers, or backups; qualify each service.

Define project closure, active-run cleanup, accepted-evidence retention, rejected-context handling, emergency revocation, and final purge verification before launch. Large assets are separately governed. Platform replica billing rules do not eliminate logical retention costs.

Reconstruction depends on preserved record/code/note objects and access policy. Purge policy may deliberately limit reconstruction; record that consequence. [Operations](OPERATIONS.md) defines export/restore, and [context policy](CONTEXT-POLICY.md) governs release.
