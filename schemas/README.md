# Candidate record schemas

Status: **draft v1-candidate**, JSON Schema 2020-12. Schema IDs use an intentionally nonresolving example domain; the validator resolves local files without network access.

[common](1-candidate/common.schema.json) defines stable identity, revision, project, attribution, authority class, release scope, timestamp, supersession, and payload. Each typed schema constrains its payload and producer class. These are candidate design contracts, not APIs the current app consumes.

| Planning | Execution / evidence | Continuity |
|---|---|---|
| [project](1-candidate/project.schema.json) | [run](1-candidate/run.schema.json) | [context](1-candidate/context.schema.json) |
| [milestone](1-candidate/milestone.schema.json) | [contribution](1-candidate/contribution.schema.json) | [context manifest](1-candidate/context_manifest.schema.json) |
| [task](1-candidate/task.schema.json) | [candidate](1-candidate/candidate.schema.json) | [journal](1-candidate/journal.schema.json) |
| [criterion](1-candidate/criterion.schema.json) | [verification](1-candidate/verification.schema.json) | [handoff](1-candidate/handoff.schema.json) |
| [assignment](1-candidate/assignment.schema.json) | [review](1-candidate/review_decision.schema.json) | [source envelope](1-candidate/source-envelope.schema.json) |
| | [integration](1-candidate/integration_receipt.schema.json), [deployment](1-candidate/deployment_receipt.schema.json) | |

## Identity and provenance

An authored record has a stable ID/revision; filenames are not identity. `supersedes` points to the prior revision when present. Source occurrence is attached externally after commit creation: repository, commit, path, blob SHA, content digest, observed time. It does not require a self-referential own-commit hash.

The source-envelope schema currently demonstrates **task ingestion**. Generalize to the other typed records when the real memory port is mapped and ratified. Source hashes in examples are synthetic; only the content-digest calculations are real.

## Validation and limits

Install [dev requirements](../requirements-docs.txt), then `npm run check:docs`. The checker validates all schema definitions, sixteen record examples, the task source envelope, links, and DOC coverage. It checks sample graph references, context selection/digests, candidate identity, required criteria, review/integration relationships, and negative fixtures.

Schema labels do not authenticate a writer. Actual authorization, commit/ref verification, signatures if selected, concurrency, migration, and remote source existence are runtime requirements. The checker does not claim to implement them.

For the synthetic packet, `packet_digest` hashes UTF-8 compact JSON (sorted keys, no extra whitespace) containing `task`, `base_commit`, and `selected_items`. The proposed production packet includes actual frozen content; its full canonicalization/size policy remains a contract ratification question. `text_sha256` hashes exact UTF-8 excerpt bytes.

Failed/unknown delivery receipt identities describe the intended candidate; they do not prove publication. Confirmed status requires runtime readback. See [record contract](../contracts/record-model.v1-candidate.md).
