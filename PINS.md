# Observed revisions and qualification pins

Snapshot date: 2026-10-06. These are **reviewed source observations**, not a complete runtime lockfile. A run must resolve and record every moving/transitive input before claiming reproducibility.

| Input | Observed revision/version | Qualification |
|---|---|---|
| Cloudflare Studio baseline | `1a493cb9c6b7618fbd714c50eff059c9ffe3bce2`, v0.1.0 | Local source baseline; current documentation branch adds to it |
| Private prototype | `4b399f44387e745dd6d1d58783a71c37416074c8`, default `feat/vertical-slice` | Comparison only |
| Amplified Design | `335abd4f4d79415185d81b5498547c59582f91c6` | Knowledge snapshot |
| Own Unified | `696d5145480a2695ffcafa118cacf32c4081ec7b`, 0.20.44 | Pilot fork; not run here |
| Microsoft Unified | `dff378190cf02a2f82e87b283b2c1bd2f96ff266`, 0.20.56 | Compatibility reference; Python >=3.13 |
| Converge | `41679679fd449ecc16b6af58d0ce8ec2cb2d29ad` | Not loaded/executed here |
| Specialist starter | Prototype SHA above, `.amplifier/bundles/amplifier-bundle-artifacts-studio`, declared 0.1 | Operator actively changing it; require fresh content pin |
| Core | Unified declares >=2.0.1 | Actual resolved commit/version unknown |
| Foundation | Referenced moving `main` | Resolve commit/lock in actual host |
| Work-tracker | Converge composition dependency | Resolve actual source and loaded activation |
| Memory | Unified references `microsoft/amplifier-bundle-memory@main` | Different from uninspected custom memory system; resolve actual revision |
| Context Intelligence | Referenced client dependency at moving `main` | Actual service/schema/loaded state unknown |
| Node | App >=24; authoring environment 24.19.0 | Run receipt must capture actual version |
| Python | Bridge stdlib; authoring environment 3.12.14 | Unified runtime needs >=3.13; do not use bridge requirement as host requirement |
| Wrangler | Artifacts docs require >=4.145.0 | Not installed/pinned here; select exact project-local version before cloud qualification |
| Artifacts SDK/types | Native binding, generated types | No resolved SDK package lock; generate/compare on selected Wrangler |
| Documentation validator | `jsonschema==4.26.0` | Dev-only; `requirements-docs.txt` |
| CI checkout | `11d5960a326750d5838078e36cf38b85af677262` (v4) | Verified action ref |
| CI setup-node | `49933ea5288caeca8642d1e84afbd3f7d6820020` (v4) | Verified action ref |
| CI setup-python | `a26af69be951a213d495a4c3e4e4022e16d87065` (v5) | Verified action ref |

The app has no npm dependencies; no dependency lockfile is needed for its existing build. If dependencies are introduced, commit the appropriate lockfile and runtime constraints.

## Required run fingerprint

Capture repo/ref/base and final SHAs, actual host/runtime versions, resolved Core/Foundation/work-tracker/bundle commits, configuration digest (secrets redacted), container/image digest, platform, selected context digest, tools/check versions, and native custody IDs. Pin sources before executing. A date, branch name, or declared version alone is insufficient.

Upgrading a pin requires compatibility discovery, candidate checks, and a recorded decision. Do not update global bundles to “latest” as a side effect of this project. Source URLs: [register](docs/SOURCES.md).
