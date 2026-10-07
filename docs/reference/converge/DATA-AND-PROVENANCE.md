# Records, persistence and provenance

**Contract:** the app must not become a second authoritative copy of project truth. It reads documents, code history, queue, lanes, return log and decisions from their owning systems. Personal reading is kept per person outside the repository: [contracts/experience.v1.md](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/contracts/experience.v1.md#L37).

## Ordinary app and manager layout

| Record/fact | Owner and location | Implication for Artifacts/memory |
|---|---|---|
| Vision and contracts | Registered Git repo: `docs/VISION.md`, `contracts/*.v1.md` | Preserve file identity, Git revision and contract status |
| Proposal | Candidate sibling of its target | Preserve exact proposed bytes, target and decision; never promote by summarizing |
| Ratification | `docs/workflow/owner-ratifications-YYYY-MM-DD.md` | Record verbatim word and actor; distinguish local file from commit/publication |
| Return/check evidence | `docs/workflow/OWNER-RETURN-LOG.md`, manager check records | Separate worker claim, manager observation and human decision |
| Clause standing | `ledger/rows.yaml` with check references | Derived observation against exact contract bytes |
| Work/custody | External work-tracker and service | Avoid a competing task owner/lease in Studio |
| Operating picture | Workspace `.converge/<manager>/HIGHWAY.md`, `.width`, lane records | Distinguish ephemeral operations from product content |
| Registration | Workspace `.converge/<manager>/registration.toml` | Binds manager, repos, workspace, steward, console and last-seen |
| Worker evidence | Goal, lane log, DONE/BLOCKED marker, branch commits, tmux | Marker and liveness are claims/signals, not independent proof |
| Personal reading | Default `~/.amplifier/converge-app.state.json` | Reading/kept marks are not ratification or shared project truth |
| Authentication | Signing secret, revocation registry; optional instance directory | Access-control state, not project memory |
| Presence | In-memory courtesy leases/queues | Not a lock or durable decision |
| Browser cache | Dated, principal-scoped offline copies | Derived read cache, not authoritative memory |

Layout/evidence sources: [README.md](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/README.md#L224), [app/README.md](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/README.md#L139), [app/serve.py](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/serve.py#L220), [app/config.py](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/config.py#L58).

The library's queue reader also writes a dated managers cache and can return it with an explicit stale note. This does not make it an authoritative queue: [src/amplifier_converge/reading/queue.py](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/src/amplifier_converge/reading/queue.py#L143). “The app owns no project truth” must not be paraphrased as “nothing writes any local or browser state.”

## Ledger model

The starter ledger is a **draft convention**, not a ratified storage/API contract. Rows form a top-level YAML list. Stable row ID, contract file, clause number and verbatim quote bind the observation; assertion references say how it is checked. GAP/VIOLATION require a work reference. A SYNC row pins contract hashes and changes require a real re-review: [docs/LEDGER-FORMAT.md](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/docs/LEDGER-FORMAT.md#L1), [docs/LEDGER-FORMAT.md](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/docs/LEDGER-FORMAT.md#L34).

States: CONFORMS, GAP, VIOLATION, OPEN-PINNED, NOT-ASSERTABLE, EXCLUDED; DIVERGED is an extension only for externally governed decisions. Keep draft/locked document status separate from whether its promises are kept.

## Collaborative profile is a separate layout

Portable collaborative guidance explicitly delegates configured state to runtime/domain owners and preserves native transcripts. It does not silently adopt the ordinary root's `.converge` layout: [packages/collaborative/METHOD-PROTOCOL.md](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/packages/collaborative/METHOD-PROTOCOL.md#L195).

Its guidance describes revision-bound Direction attachments captured before lane admission, immutable original intent, plans, attempts, returns, checks, exact receipts and native history. Those executable stores/APIs belong to external consuming implementations; this repository delivers the instructions. Do not assign their schemas to the Python app without tracing the actual consumer.

## Proposed memory projection

An Artifacts-backed memory projection should link **source**, **proposal**, **decision**, **execution**, **verification** and **delivery** as distinct records. Include repository/commit/path or public-record ID/revision, producer, observation time, original bytes/hash where appropriate, status and visibility. A reading edition or summary carries its own derivation reference and cannot overwrite the original.

Only explicitly selected context should enter a worker packet or memory projection. Access and retention policy must cover private feedback/audio, native history and personal reading. These are Studio recommendations, not implemented Converge memory integrations.
