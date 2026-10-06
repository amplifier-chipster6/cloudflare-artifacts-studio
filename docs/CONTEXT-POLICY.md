# Context and data handling

Status: proposed release policy, building on current explicit selection.

Classify context as source evidence, operator decision, hypothesis, reference, or selected memory excerpt. Attribute it and retain source/revision, access scope, freshness, and uncertainty. A hypothesis is not an approved decision.

Before a packet is frozen, show exactly selected content and references, task/project scope, destination worker, retention, and byte budget. Resolve immutable locators and digests. Any change after freezing creates a new revision. Excluded private content, titles, paths, and retrieval candidates do not enter the packet.

Workers receive only the selected packet and their working repo. Repository-wide tokens cannot enforce path-level privacy. Keep record, verifier, delivery, and secret stores outside worker authority. Repository separation does not establish process isolation.

Never include credentials, token-bearing URLs, auth headers, raw private attachments, or bulk personal session history. Memory retrieval does not authorize release. Prefer a selected excerpt with source citation; preserve native Unified history ownership.

Use explicit retention/residency policy for packets, object storage, logs, backups, and derived memory. Revocation stops future access but cannot retract already read bytes; follow the agreed deletion policy for retained copies. Validate secret redaction without printing discovered values.

See [context contract](../contracts/context-packet.v1-candidate.md), [security](../SECURITY.md), [lifecycle](DATA-LIFECYCLE.md), and [verification](VERIFICATION.md).
