# App API source reference

Pinned static route inventory: **36 production-handler declarations**. Optional mounts and runtime conditions still apply. Dev stubs and test harness routes are excluded. This is not a downloaded live OpenAPI schema.

All private routes pass the sign-in middleware. Unsafe requests pass its supplied-origin/CSRF checks; absent values have the permissive behavior documented in [security](SECURITY-AND-HOSTING.md). Steward-only operations are distinguished below. The exception is the exact cookie-exempt webhook with its own secret check.

## Route inventory

| Method | Full route | Handler / source |
|---|---|---|
| GET | `/api/collab/{mid}/pulls` | [list_pulls](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/collab.py#L517) |
| GET | `/api/collab/{mid}/pulls/{number}` | [one_pull](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/collab.py#L547) |
| POST | `/api/collab/{mid}/pulls/{number}/comments` | [ask_on_the_host](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/collab.py#L562) |
| POST | `/api/collab/{mid}/pulls/{number}/answer` | [answer_a_pull](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/collab.py#L595) |
| POST | `/api/collab/webhooks/host` | [host_called](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/collab.py#L672) |
| GET | `/api/collab/{mid}/freshness` | [how_it_stays_fresh](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/collab.py#L702) |
| POST | `/api/managers/{mid}/feedback/{form}` | [feedback_in_this_form](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/feedback_voice.py#L156) |
| GET | `/login` | [login_form](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/serve.py#L424) |
| POST | `/login` | [login](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/serve.py#L459) |
| POST | `/logout` | [logout](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/serve.py#L494) |
| GET | `/healthz` | [healthz](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/serve.py#L534) |
| GET | `/ca.crt` | [ca_cert](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/serve.py#L539) |
| GET | `/setup` | [setup_page](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/serve.py#L560) |
| GET | `/` | [shell](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/serve.py#L584) |
| GET | `/api/boot` | [boot](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/serve.py#L589) |
| GET | `/api/managers/{mid}` | [manager](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/serve.py#L609) |
| GET | `/api/managers/{mid}/operation` | [operation](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/serve.py#L618) |
| GET | `/api/managers/{mid}/docs/{repo_ident}/{doc_ident}` | [document](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/serve.py#L682) |
| POST | `/api/managers/{mid}/docs/{repo_ident}/{doc_ident}/read` | [mark_read](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/serve.py#L709) |
| POST | `/api/managers/{mid}/docs/{repo_ident}/{doc_ident}/changes/{change_id}/keep` | [keep_change](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/serve.py#L727) |
| POST | `/api/managers/{mid}/docs/{repo_ident}/{doc_ident}/changes/{change_id}/edit` | [edit_change](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/serve.py#L799) |
| POST | `/api/managers/{mid}/docs/{repo_ident}/{doc_ident}/changes/{change_id}/restore` | [restore_change](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/serve.py#L804) |
| POST | `/api/managers/{mid}/docs/{repo_ident}/{doc_ident}/lock` | [lock_document](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/serve.py#L813) |
| POST | `/api/managers/{mid}/presence` | [presence_beat](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/serve.py#L857) |
| GET | `/api/managers/{mid}/presence` | [presence_here](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/serve.py#L885) |
| POST | `/api/managers/{mid}/presence/queue` | [presence_queue](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/serve.py#L898) |
| GET | `/api/needs/{mid}` | [needs](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/serve.py#L934) |
| POST | `/api/managers/{mid}/decision` | [decision](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/serve.py#L942) |
| POST | `/api/managers/{mid}/feedback` | [feedback](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/serve.py#L966) |
| POST | `/api/managers/{mid}/priority` | [priority](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/serve.py#L984) |
| POST | `/api/managers/{mid}/ask` | [ask](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/serve.py#L1021) |
| POST | `/api/managers/{mid}/steer` | [steer](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/serve.py#L1061) |
| GET | `/manifest.webmanifest` | [manifest](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/serve.py#L1094) |
| GET | `/sw.js` | [service_worker](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/serve.py#L1098) |
| GET | `/api/tmux/{socket}/{session}` | [get_session](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/tmux_view.py#L498) |
| POST | `/api/tmux/{socket}/{session}/keys` | [post_keys](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/tmux_view.py#L513) |

## Principal action payloads and effects

| Action | Principal inputs | Authority and actual effect |
|---|---|---|
| decision | repoId, docId, proposalId, decision, note | Registered steward. Append dated local ratification record; no candidate application/merge/automatic Git publication. |
| feedback | text, context, imageDataUrl | Authenticated participant. Dated feedback note and optional image in repo-local .converge/feedback. |
| feedback/{form} | Multipart/body audio plus supported note attachment fields | Authenticated participant. Original audio retained; MIME/path/size checks; no transcription claim. Read handler for exact wire form. |
| priority | item, direction=raise/lower, note, title | Registered steward. Append HIGHWAY weave-in request; tracker priority number unchanged. |
| ask | repoId, docId, scope=paragraph/document/all, text, section | Authenticated participant. Candidate creation/update; agent drafter explicitly opt-in. |
| steer | objective, lanes, fill, note | Registered steward. Requested width written, intent logged; no lane launch in route. |
| read / keep | doc route identifiers; kept boolean on change | Personal reading state; not a shared ratification. |
| edit / restore | change ID, text for edit, optional since history commit | Authenticated participant. Resolve change; draft path commit or locked candidate; stale/dirty conflicts refuse. |
| lock | conditions: list of nonempty strings | Registered steward. Requires at least four submitted statements; commit H1/changelog then separate decision record. Does not run four proofs. |
| tmux keys | keys:string, enter:boolean | Registered steward of exact registered manager console. Literal bounded code points; exact target and sent/state receipt. |
| PR comments | repoId, body | Authenticated participant. Host comment through gh. |
| PR answer | repoId, decision, note, docId | Registered steward. Local record then host comment; separate partial outcomes. |
| host webhook | custom secret header; repository/repoId, event, note | Secret-checked ingress. Arrival hint; not inspected native GitHub HMAC delivery. |

Routes mostly parse JSON from Request directly rather than declaring complete Pydantic request contracts. Field tables are a read guide, not a ratified cross-host schema. Terminal keys have a declared KeysIn model. For response fields and validation, use cited handlers and writers.

## Reading responses

Boot identifies the authenticated user, manager list and configuration. Manager payload gathers repos/doc lists, lane/needs/operation facts. Document payload includes raw, rendered sections, standing, lock, changes, reading, proposals and history. Operation supplies plan/waves/lanes, narrative, throughput, limits and evidence. These are the current app wire shapes; stable external collaborative Direction/Operations contracts are separate.

## Partial effects and retries

A decision record can exist even if returning its comment to GitHub fails. A lock commit can exist even if appending the daily ratification record fails. A draft edit restores the original bytes when its commit fails. Priority and steering express intent rather than confirmed manager execution. Preserve each receipt and reconcile before repeating an uncertain effect. No general idempotency/request-ID contract was established for these ordinary app endpoints.
