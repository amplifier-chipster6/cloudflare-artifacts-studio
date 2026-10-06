# Integration ownership

Status: proposed responsibility model. Individuals and custom memory endpoints are not yet assigned.

| Seam | Authority / permitted writer | IDs crossing boundary | Conflict/recovery rule |
|---|---|---|---|
| Project intent, milestone, task revision, criteria | Studio record writer following operator action | project/milestone/task/criterion IDs and revisions | New revision supersedes; never rewrite an approved packet silently |
| Selected context | Operator/Studio selector | context ID, source occurrence, manifest/packet ID, digest | Missing or changed source blocks freezing; selection remains explicit |
| Native conversations/history | Unified host | host session/run reference | Do not duplicate ownership; import only approved excerpts with source provenance |
| Active execution custody | One qualified runtime manager | Studio assignment/attempt IDs ↔ native work-tracker/session IDs | Compare-and-swap custody; expiry requires reconciliation before reassigning |
| Agent code/report | Assigned worker, its repository token | run ID, approved base, contribution SHA | No authority over candidate, trusted evidence, or review records |
| Combined candidate | Trusted candidate builder | candidate ID, contributions, ordered merge inputs, candidate SHA | Rebuild deterministically or preserve conflict record; no production ref write |
| Verification | Independent verifier | candidate ID/SHA, criteria, commands, environment fingerprint | Check final identity; agent reports cannot satisfy this seam |
| Review decision | Operator, persisted by trusted record writer | decision ID, candidate and verification references | Acceptance cannot be inferred from prose or tests |
| Integration and deployment | Separately authorized delivery service/operator | destination repo/ref, expected base, resulting SHA, receipt IDs | Compare-and-swap; unknown outcome blocks retry until readback |
| Operational projections/outbox | Studio coordinator | source locator and projection cursor | Git record authority wins; projections are rebuildable |
| Memory projection/retrieval | Memory service under policy | logical ID/revision, repo/commit/path, blob/content digest | Derived assertions cite sources; conflicting evidence is preserved |
| Secrets and credentials | Operator secret manager/platform bindings | credential reference and scope only | Never serialize the secret into any record, packet, receipt, or journal |

Converge helpers are development assistance, not automatically product worker lanes. Converge's native work-tracker manages workflow custody where qualified. The Studio adapter must map one run to one manager and explicit workers; two competing schedulers are unacceptable.

The application maintainer owns API/storage contracts. The runtime maintainer owns host/bundle compatibility and OS isolation. The memory maintainer owns derived projections, deletion, and retrieval policy. The operator owns scope, context release, acceptance, and delivery authorization. [Contracts](CONTRACTS-README.md) require joint review at seams.

Reconciliation may repair indexes and retry idempotent intents. It cannot invent an operator decision, overwrite an unexpected destination head, or renew custody based only on an expired worker's claim.
