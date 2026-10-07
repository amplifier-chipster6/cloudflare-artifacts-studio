# Repository map

All **752** blob paths are inventoried. This map distinguishes the live implementation from contracts, fixtures, historical reports and excluded assets. Every link points to the reviewed commit.

| Path | Files | Role |
|---|---|---|
| [(root)](https://github.com/microsoft/amplifier-bundle-converge/tree/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/) | 12 | README, AGENTS, PINS, LICENSE, packaging, bundle and repository conventions |
| [.githooks](https://github.com/microsoft/amplifier-bundle-converge/tree/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/.githooks) | 1 | Local pre-push frozen-document backstop |
| [.github](https://github.com/microsoft/amplifier-bundle-converge/tree/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/.github) | 1 | CI workflow; source configuration is not a fresh run |
| [agents](https://github.com/microsoft/amplifier-bundle-converge/tree/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/agents) | 4 | Four Converge workflow helpers |
| [app](https://github.com/microsoft/amplifier-bundle-converge/tree/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app) | 150 | Shipped FastAPI/Jinja2/JS/CSS/PWA app, tests and development fixtures |
| [assets](https://github.com/microsoft/amplifier-bundle-converge/tree/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/assets) | 22 | Branding/media/diagrams; text notices cached, binary bodies inventoried |
| [behaviors](https://github.com/microsoft/amplifier-bundle-converge/tree/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/behaviors) | 3 | Ordinary Converge, collaborative instructions and opt-in supervisor observation |
| [bundles](https://github.com/microsoft/amplifier-bundle-converge/tree/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/bundles) | 2 | Optional collaborative supervisor root and its README |
| [conformance](https://github.com/microsoft/amplifier-bundle-converge/tree/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/conformance) | 237 | Seven active kits, common snapshot/report machinery, good/bad fixtures and retired surface |
| [context](https://github.com/microsoft/amplifier-bundle-converge/tree/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/context) | 9 | Thin awareness and manager-scoped operating guidance |
| [contracts](https://github.com/microsoft/amplifier-bundle-converge/tree/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/contracts) | 14 | Fourteen governing/draft/superseded contract files |
| [docs](https://github.com/microsoft/amplifier-bundle-converge/tree/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/docs) | 134 | Current protocol/vision/adoption/templates plus historical design/workflow/presentation evidence |
| [evaluations](https://github.com/microsoft/amplifier-bundle-converge/tree/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/evaluations) | 72 | Ratchet, adopter, turnkey and collaborative trials/oracles/scenarios |
| [ledger](https://github.com/microsoft/amplifier-bundle-converge/tree/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/ledger) | 9 | Derived clause rows and integrity/executable checks |
| [modes](https://github.com/microsoft/amplifier-bundle-converge/tree/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/modes) | 1 | Converge manager overlay and mode-scoped skills/context |
| [modules](https://github.com/microsoft/amplifier-bundle-converge/tree/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/modules) | 15 | Candidate amendment guard and opt-in public-read supervisor observation |
| [packages](https://github.com/microsoft/amplifier-bundle-converge/tree/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/packages) | 12 | Portable collaborative instruction resource distribution |
| [recipes](https://github.com/microsoft/amplifier-bundle-converge/tree/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/recipes) | 1 | Schema-2 seed-reconcile recipe |
| [scripts](https://github.com/microsoft/amplifier-bundle-converge/tree/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/scripts) | 5 | Start, register, install/adopt checks, work-item export |
| [skills](https://github.com/microsoft/amplifier-bundle-converge/tree/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/skills) | 5 | Five manager procedures loaded on demand |
| [src](https://github.com/microsoft/amplifier-bundle-converge/tree/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/src) | 25 | Python read/write library and current app-control CLI |
| [tests](https://github.com/microsoft/amplifier-bundle-converge/tree/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/tests) | 18 | Root library, install, composition/guidance and turnkey regressions |

## Authority and reading order

Read current contracts/protocol and executable source before old design snapshots or lane reports. Upstream prose may describe an earlier revision: see [drift](DRIFT-AND-OPEN-QUESTIONS.md). The active web app is app/, not the retired src/.../web body. The newer portable collaborative package is an instruction distribution for external consumers, not an alternate app backend shipped here.

## Dependency and implementation boundaries

Foundation Anchors supplies the lean host/tools/helpers; work-tracker owns shared queue/custody; the Amplifier host launches native sessions; Method contracts and domain/runtime libraries govern the newer collaborative profile. They are referenced dependencies, not directories fully implemented in this repository. Cloudflare Artifacts and the custom memory system are proposed Studio integrations, not discovered native Converge modules.

## Lookup tools

[source-inventory.json](source-inventory.json) includes every path, blob SHA, size, acquisition status, review depth and immutable source URL. [symbol-index.json](symbol-index.json) maps Python classes/functions and Markdown headings with line locations, plus declared routes. Search these small indexes first; inspect the exact local cache file only when more detail is needed.

## Source categories to preserve

- Active implementation: app, source library/CLI, guards, behavior and resource loader.
- Governing promises: current contract family and protocol, with mixed status.
- Procedure text: agents, mode, skills and context; guidance does not execute itself.
- Synthetic evidence: fixtures, development stubs and deliberately bad samples.
- Historical evidence: dated design/workflow/lane/evaluation results, not fresh certification.
- Indexed excluded bodies: binaries and third-party minified runtime assets.
