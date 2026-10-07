# Documentation drift and unresolved questions

These findings preserve disagreements rather than choosing whichever description is convenient. All source references use the fixed commit.

## Verified source/document disagreements

| Finding | Conflicting evidence | Consequence |
|---|---|---|
| Bundle says protocol v2; actual protocol is ratified v3 | [bundle.md](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/bundle.md#L115) vs [docs/PROTOCOL.md](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/docs/PROTOCOL.md#L1) | Use actual protocol; don't copy the stale version claim |
| Library README says CLI has no subcommands; current CLI has start/doctor/register | [src/amplifier_converge/README.md](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/src/amplifier_converge/README.md#L51) vs [src/amplifier_converge/cli.py](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/src/amplifier_converge/cli.py#L32) | Old measurement is historical; current command source governs |
| Behavior description says recipe needs Anchors host; current recipe declares its own closure | [behaviors/converge.yaml](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/behaviors/converge.yaml#L13) vs [README.md](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/README.md#L101), [recipes/seed-reconcile.yaml](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/recipes/seed-reconcile.yaml#L368) | Qualify schema-2 engine; don't assume session helper lookup |
| Collaboration docstring describes cookie-blocked webhook; middleware now exempts exact webhook path | [app/collab.py](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/collab.py#L42) vs [app/serve.py](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/serve.py#L72) | Route exists with separate secret proof; deployment still unqualified |
| Old kit cookie examples sign only user; current session decoder requires sid too | [conformance/README.md](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/conformance/README.md#L82) vs [app/auth.py](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/auth.py#L193) | Do not reuse the stale forged-cookie example as a current login procedure |
| Proposal version convention remains unsettled | [PINS.md](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/PINS.md#L31) | Follow actual folder guidance; don't silently “correct” a contract |
| Root API repo IDs use basenames/fallback; collaboration uses canonical-path hashes | [app/data.py](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/data.py#L605), [app/serve.py](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/serve.py#L949) vs [app/collab.py](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/collab.py#L457) | Normalize identity explicitly in any multi-repo adapter |
| Direction promises diagrams/safe HTML; basic renderer disables raw HTML | [contracts/experience-direction.v1.md](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/contracts/experience-direction.v1.md#L28) vs [app/data.py](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/data.py#L140) | Representative rendered qualification remains needed |
| “Exactly five writes” versus many actual write routes | [contracts/experience.v1.md](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/contracts/experience.v1.md#L28) vs [route index](API-REFERENCE.md) | Count conceptual actions/exemptions; don't assert five HTTP POSTs |

These are observations, not upstream fixes. No Microsoft source was modified.

## Questions needing the actual consuming host

- Which Unified revision provides installed public Direction, Queue, Operations and native history; what are their actual schemas, permission guards and state locations?
- Does the chosen host already mount the collaborative instruction package, preserve its exact digest and expose its required actions?
- Which of the Python app or external collaborative host is the pilot's primary UX?
- Does the selected Git/Artifacts path preserve native collaboration visibility, refs and exact commit identity?
- Who owns project truth, exported evidence, review decisions, delivery and memory projections?
- Does the intended “accept” decision authorize integration into a candidate branch only, a GitHub destination, or neither? Preserve the user's earlier scope.
- What enforcement is available for actual spend, launch limits, worker filesystem/network access, cancellation and observation-only retries?
- Are arbitrary terminal reads restricted appropriately for the selected team/access model?
- Which native/display/browser checks are required for the actual Website Studio use case?

## Evidence still absent from this review

No live app login, browser viewport/PWA test, real tmux session, live GitHub comment/webhook roundtrip, work-tracker service, native lane, provider run, Artifacts roundtrip, memory integration or deployed Cloudflare instance was exercised. Full dependent-repository/security/license audits and binary/media inspection were outside this source-reference task.

Some upstream historical reports contain failures and explicit NOT RUN scenarios. They are not new failures or new passes measured on this host. [Verification](VERIFICATION.md) names both classes.
