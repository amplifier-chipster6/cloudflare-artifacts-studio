# Studio reuse, overlaps and remaining gaps

**Recommendation, not an adopted redesign:** treat Converge's shipped UX and public workflow seams as candidate foundations for Artifacts Studio. Evaluate them before creating a second dashboard, tracker, document-review system or manager lifecycle. The earlier “development bundle only” framing was incomplete.

## Function-by-function mapping

| Intended Studio function | Existing Converge capability | Remaining Studio-specific qualification/design |
|---|---|---|
| Organize projects | Home lists manager sessions; one can hold several repos/queues | Map project identity and delivery path; project and manager need not be one-to-one |
| Define work | Vision/contracts, ledger gaps, queue, visible plans, bounded lane briefs | Preserve user's task acceptance; inspect native consumer actions before another task store |
| Select context | Manager read-first material; newer profile describes revision-bound Direction source attachments | Arbitrary selected memory/context packets and privacy policy still need a qualified adapter |
| Execute through Amplifier | Manager mode, actual worker copies/branches/sessions, queue custody | Qualify selected Unified host and specialist bundle; OS isolation is separate |
| Review results | Existing Direction review, source changes, history, proposals, calls, evidence and host bridge | Independently verify exact code candidate; define acceptance versus merge/delivery policy |
| Preserve continuity | Repository records, return logs, ledger, native history in collaborative profile | Durable Artifacts backing/export plus memory projection need ownership and reconciliation |
| Website/design work | Converge can carry bounded product work under contracts | Website assessment, design exploration, brand context and output-specific acceptance remain domain features |

Primary sources: [product](PRODUCT-AND-UX.md), [data](DATA-AND-PROVENANCE.md), [packages](COLLABORATION-AND-PACKAGES.md).

## Artifacts remains central

The proposal should preserve Cloudflare Artifacts as a durable Git/evidence foundation, while connecting it to the actual record owners. This review did not discover a shipped Artifacts integration in Converge.

| Proposed Artifacts role | Advantage | Required boundary |
|---|---|---|
| Git backing for project/context/evidence repositories | Commit identity and inspectable version history | Qualify native Git transport, refs, credentials and repository layout |
| Immutable selected-input snapshots and run evidence | Repeatable context and auditable execution | Preserve source revision/hash, access scope and worker claim versus verification |
| Review/candidate and delivery records | Trace decision to exact tested revision | Do not confuse candidate creation, ratification, commit, merge, publication and deployment |
| Durable continuity and memory provenance | Memory can resolve the original record | Project truth has one owner; projection is derived, explicit and access-controlled |
| Event-driven observation where supported | Less polling/hand-carried status | Qualify delivery schemas, idempotency and current-ref reconciliation separately |

These are integration proposals, not claims of native Artifacts support or new API guarantees. Existing Studio [Artifacts design](../../ARTIFACTS-INTEGRATION.md) and [official documentation review](../../ARTIFACTS-REVIEW.md) retain their own evidence; this repository review does not replace them.

## Decisions the old proposal needs revisited

1. **UI foundation:** reuse/extend Converge, consume an existing collaborative host, or deliberately maintain a separate Studio UX. Compare the actual workflows first.
2. **Truth owners:** native queue/Direction/Operations versus Studio's persistent project/task records. Define one authority per fact and explicit projections.
3. **Execution policy:** native manager may integrate after independent checks. Studio's human review and destination controls require a deliberate mapping, without silently changing upstream promises.
4. **Hosting:** qualify OS host dependencies before assuming a Workers port.
5. **Pilot:** choose one reusable path and one bounded result; defer extra surfaces and agent fan-out until it works.

## Suggested bounded reuse pilot

Register one disposable project with one manager; read a vision and one contract in the existing app; create one candidate ask without an agent invocation; answer it and inspect the actual record; exercise a draft edit and locked-edit refusal/candidate behavior. Then, on a qualified host, run one bounded lane with manager verification. Add an Artifacts Git/record roundtrip only after its transport is qualified.

Acceptance should distinguish “source/UI present,” “native workflow observed,” “Artifacts persisted/read back,” “human decision recorded,” and “delivered output usable.” No milestone completion or new architecture ratification is inferred from this review.

This reference does not discard the v0.1 Studio code. Its packet/privacy, candidate verification and Artifacts adapter work may remain useful as adapters or domain extensions once duplicate responsibilities are resolved.
