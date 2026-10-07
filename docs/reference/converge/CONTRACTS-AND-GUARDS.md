# Contracts and amendment guards

The current protocol is **v3, RATIFIED 2026-09-03**: [docs/PROTOCOL.md](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/docs/PROTOCOL.md#L1). Some bundle prose still says v2; follow the actual governing document and record the drift.

## Fourteen-file contract register

[Contract titles and source identities are preserved in the inventory](source-inventory.json). Status belongs in each document's H1.

| Contract | Snapshot status | Responsibility |
|---|---|---|
| composition.v1 | FROZEN 2026-09-06 | Lean composition, helpers, isolation of unrelated sessions, guard |
| documents.v1 | DRAFT, held loosely | Readable document anatomy, proposals, participant kit |
| experience.v1 | DRAFT, content owner-ratified | Manager anchor, two places, five actions, truth and platform family |
| experience-direction.v1 | FROZEN 2026-09-06 | Documents, changes, proposals, history, asks and locks |
| experience-operation.v1 | FROZEN 2026-09-06 | Plans, evidence, limits, feedback and steering |
| experience-console.v1 | FROZEN 2026-09-06 | Actual-session pane, no ratification or extra surface |
| experience-collaboration.v1 | FROZEN 2026-09-06 | Git-host collaboration, stewardship and origin |
| operation.v1 | DRAFT, held loosely | Manager/lane/custody/verification workflow |
| platform-web.v1 | DRAFT, held loosely | Responsive/PWA/offline/browser idioms |
| platform-android.v1 | DRAFT, content owner-ratified | Android idioms; native body absent |
| platform-ios.v1 | DRAFT, content owner-ratified | iOS idioms; native body absent |
| platform-macos.v1 | DRAFT, content owner-ratified | macOS idioms; native body absent |
| platform-windows.v1 | DRAFT, content owner-ratified | Windows idioms; native body absent |
| surface.v1 | DRAFT; superseded 2026-09-03 | Historical first surface; build against experience family |

Source summary: [PINS.md](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/PINS.md#L45). “Owner-ratified content” does not erase a DRAFT stamp or make every implementation conform.

## Participant kit and changes

Documents call for a contracts README, AGENTS addendum, pins file and pre-push guard. Converge ships templates under `docs/workspace-template/`. Proposals carry exact before/after text, evidence and what remains unchanged. A locked original stays authoritative until the owner's actual word: [contracts/documents.v1.md](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/contracts/documents.v1.md#L38).

The protocol's lock bar requires written specification, a discriminating machine-checkable good/bad pair, a real conforming implementation and an end-to-end worked example. The app's locking endpoint validates at least four nonempty submitted condition strings, commits the H1/changelog, then appends a record. It **does not execute those four proofs itself**: [app/writes.py](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/writes.py#L1073).

## Two different guards

| Guard | Interception | Limits |
|---|---|---|
| In-session candidate guard | Hook and mounted-tool execute wrappers; write/edit/patch and selected shell-write shapes; FROZEN/RATIFIED markers on configured paths | No OS boundary; obfuscated shell writers, tools mounted later, tool internals and out-of-scope paths have documented limits |
| Repository pre-push hook | Diff guard for locked documents and candidate presence | A local hook must be enabled; candidate presence is not human ratification |

Configuration: [behaviors/converge.yaml](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/behaviors/converge.yaml#L111). Coverage and limits: [modules/hooks-candidate-guard/README.md](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/modules/hooks-candidate-guard/README.md#L452).

The in-session guard permits a matching ratified candidate with target and owner stamp. A candidate already cited in the target's Changelog is spent. Emergency unlock is scoped and off by default. Proposal-name version interpretation remains an explicitly tracked upstream disagreement: [modules/hooks-candidate-guard/README.md](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/modules/hooks-candidate-guard/README.md#L492), [PINS.md](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/PINS.md#L31).

Calling this structural amendment enforcement is justified. Calling it an agent sandbox, cryptographically proven approval, or guaranteed inherited guard on every new host is not. Re-probe mount/child coverage in the chosen host.
