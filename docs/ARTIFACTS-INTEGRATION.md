# Artifacts integration

Status: proposed target integration; v0.1 contains binding/REST code but no verified live Git execution. [Official review](ARTIFACTS-REVIEW.md), [architecture](ARCHITECTURE.md), [record contract](../contracts/record-model.v1-candidate.md).

## Why Artifacts is central

Artifacts provides durable Git repositories, inexpensive forks, standard Git transport, short-lived repository tokens, structured object reads, events, locality controls, and CI integration. Studio uses these primitives to make project intent, task revisions, criteria, assignments, context, code proposals, evidence, decisions, and continuity durable and inspectable.

Artifacts does **not** provide native issue, milestone, acceptance-criterion, or agent-assignment business APIs. Studio makes those first-class using versioned records. It is not an LLM context window, semantic memory service, or job scheduler.

| Studio need | Artifacts use | Advantage and boundary |
|---|---|---|
| Durable project planning | Trusted records repo with versioned JSON/Markdown | Exact history, attribution, portable reconstruction; Studio owns schema/UX |
| Milestones/tasks/criteria | Typed records and relationships | Connect intent to tested outcome without relying on prose summaries |
| Explicit context | Freeze selected packet in separately readable repo | Reproducible context, repo-level access; no automatic personal-memory exposure |
| Source baseline | Import or seed code; preserve approved SHA | Known input; verify fork head rather than assume arbitrary-SHA fork support |
| Independent workers | One fork/repo and scoped token per assignment/attempt | Separate code custody; OS isolation still required |
| Combined candidate | Trusted candidate repo/ref and ordered inputs | Tests can bind to one final identity |
| Review/evidence | Separate trusted receipts and operator records; optional Git notes | Durable provenance; notes refs require explicit preservation |
| Memory intake | Exact commit/path/object reads; events plus reconciliation | Derived knowledge stays cited and rebuildable |
| Delivery | Explicit ref mapping to GitHub, optional Builds/CI | Reviewed publication and receipt; push alone is not operator approval |
| Continuity | Journal/handoff records, Git exports, source occurrences | Fresh agents can recover facts, decisions, and open work |

## Namespace and repository lifecycle

Choose jurisdiction before creating a namespace; documented `us` and `eu` restrictions are immutable. Existing `artifacts-studio` was observed unrestricted; it is not a chosen locality guarantee. A new jurisdiction requirement requires a new namespace/migration.

Persist repository IDs and canonical URLs separately from names. Create → read back metadata/head → seed/import → verify baseline → authorize work → retain/export → revoke → delete under policy. Account/API tokens administer namespaces/repos; Git tokens authorize repo transport. An asynchronous delete needs eventual readback before claiming completion.

Built-in import is for public HTTPS remotes. Private GitHub code needs authenticated Git seeding in a trusted environment, not a presumed private-import API. Validate license and source attribution.

Proposed logical repository classes are records, baseline, packet, per-agent, and candidate. They are not additional bindings configured in today's Worker. Separation costs and lifecycle must be measured.

## API and Git responsibilities

Native Worker binding supplies namespace create/get/list/import/delete and repository info, fork, token, log, commit/tree/blob/file reads. A capability returned by `get` is not proof that the repo exists: call `info()`. Current types expose `readFile` returning a Blob; dispose scoped capabilities where required by generated types.

REST provides namespace/repo/token administration and object/history/file/raw-file reads. Use the account API bearer token server-side. Fresh repo metadata may briefly return 404 after creation; qualify bounded retry/readback instead of treating creation as immediately indexed.

Use standard Git for authored commits, branches, notes, fetch/push, and precise ref operations. There is no binding method that turns a task object into a Git commit automatically. Git fetch v1/v2 and push v1 are documented; filtering/partial clone combinations need qualification.

Fork options include `defaultBranchOnly`; there is no documented `forkAtCommit` option. Prepare a stable source snapshot/copy procedure and verify the result matches the task's approved base. A moving default branch cannot define immutable execution input.

## Credentials

Tokens are repository-wide read/write capabilities, not branch/path ACLs. Explicitly request read versus write and a bounded TTL; the documented default is write/24 hours, with 60 seconds–1 year supported. The current bridge requests a short run token and budgets execution below its expiry.

Store only token IDs, scopes, expiry, and secret-manager references in records. Git Basic authentication uses any nonempty username and the token secret without expiry metadata; Bearer authentication accepts the full token. Use controlled askpass/broker injection, never credential-bearing remote URLs. Revoke and read back as appropriate on completion, cancellation, and incident.

Record writer, worker, verifier, and delivery credentials have different authority. A worker must not acquire trusted record/verifier/production credentials.

## Git notes

Notes may attach metadata to a code commit without changing its SHA, but notes refs are mutable. Keep authoritative business decisions as versioned records. A note citation records the subject code SHA **and** notes-ref commit/path. Fetch/export/push necessary `refs/notes/*` explicitly; ordinary branch publication does not ensure portability.

## Events and reconciliation

Product docs list account-level repo creation/deletion/fork/import events and repo push/clone/fetch/token events. Subscribe only to needed repos/ref classes. Ignore notes/projection writes that would loop.

Queues delivery is at least once. Use a business effect key such as repository ID + ref + after SHA + effect kind; preserve before/after and observed time. Do not assume an event ID or exactly-once order. A push's commit list may be truncated: reread the full authoritative commit/ref and relevant records.

Write event receipt/outbox intent, project idempotently, then acknowledge. Quarantine invalid source records and dead-letter repeated failures. Periodically compare authoritative heads/records with SQL and memory cursors. Events notify; authored records determine task state and acceptance.

## CI choices

- **Repository CI:** this branch adds read-only GitHub checks for the existing app and candidate document examples.
- **Artifacts Workers Builds:** optional for compatible Worker projects; verify supported branch/preview behavior. Unified's Python host is not automatically a Worker build target.
- **Workflow + `@cloudflare/ci`:** optional per-repo checks in isolated Sandbox-backed jobs with cache/lockfile policy and structured status.
- **External qualified runtime:** appropriate for Unified/Amplifier execution; report exact identities back to Studio.

Deploy credentials belong only in a separately authorized final delivery step. Code push, a Git event, and a CI pass do not themselves authorize production deployment.

## Limits, observability, and qualification

Reviewed limits include 1 GB/repo, 32 MB/blob, and 1 TB/account; namespace/repository counts are described as unlimited while storage, rate limits, cost, and execution budgets remain finite. Put large assets in governed object storage and reference digests.

Artifacts requires Workers Paid. [Pricing](https://developers.cloudflare.com/artifacts/platform/pricing/) says usage billing begins October 14, 2026; verify current terms before provisioning. GraphQL `artifactsEventsAdaptiveGroups` supports operational metrics; rate/error/latency graphs do not prove business correctness.

Before adoption, qualify generated binding types on an exact project-local Wrangler >=4.145.0; private Access; create/info/token/Git roundtrip; approved-base preparation; object/file reads; token expiry/revocation; duplicate/truncated events; notes export/restore; retention; and projection rebuild. [Verification](VERIFICATION.md) defines evidence gates.
