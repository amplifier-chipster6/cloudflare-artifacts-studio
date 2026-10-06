# Repository roles and implementation baseline

Status: proposed boundaries; source snapshots observed 2026-10-06. Decision: [ADR-0001](adr/0001-repository-baseline.md). Exact revisions: [PINS](../PINS.md).

| Repository/component | Job and authority | Maintenance responsibility | Boundary |
|---|---|---|---|
| [cloudflare-artifacts-studio](https://github.com/amplifier-chipster6/cloudflare-artifacts-studio) | Selected application continuation baseline; v0.1 source, APIs, UI, bridge, and these contracts | Application maintainer | Owns Studio behavior; does not become the Amplifier host or custom memory service |
| [artifacts-studio](https://github.com/amplifier-chipster6/artifacts-studio) | Earlier private vertical slice and starter specialist bundle; evidence of stronger candidate/integration patterns | Prototype/bundle maintainer | Compare and deliberately port reviewed capabilities; do not merge unrelated histories wholesale |
| [amplified-design](https://github.com/amplifier-chipster6/amplified-design) | Larger Website Studio intent, design manual, capability maps, learning worksheets, knowledge provenance | Design/knowledge steward | Source-backed requirements and journal practices; no executable capability implied by prose |
| [own amplifier-unified fork](https://github.com/amplifier-chipster6/amplifier-unified) | Pilot target and operator's host personalization | Unified maintainer | Preserve native sessions, supported configuration, and execution custody |
| [Microsoft amplifier-unified](https://github.com/microsoft/amplifier-unified) | Upstream host implementation and compatibility reference | Upstream maintainers | Rebase/upgrade is an explicit compatibility task, not automatic synchronization |
| [amplifier-bundle-converge](https://github.com/microsoft/amplifier-bundle-converge) | Development protocol, worker coordination, candidate and contract discipline | Upstream plus project composition owner | Workflow bundle; not the Git store, OS sandbox, or production deployment authority |
| Cloudflare-development starter | Foundation at the private prototype's `.amplifier/bundles/amplifier-bundle-artifacts-studio` | Operator and bundle maintainer, actively developing it | Project-local specialist knowledge and composition; current content needs a fresh pin before each run |
| [amplifier-wiki](https://github.com/amplifier-chipster6/amplifier-wiki) | Referenced knowledge/reading edition | Knowledge steward | Preserve source citations and frontmatter; generated copies are not competing canonical specs |
| Custom memory architecture | Existing work in progress; repository/API identity not supplied | Memory maintainer, to be identified | Owns derived knowledge and retrieval; must map to the proposed record contract before implementation |

The user also wrote “artifact-studio” and “amplifier-design.” The reviewed identities are **artifacts-studio** and **amplified-design**; do not silently provision similarly named replacements.

## Local ownership

`src/api.mjs` owns domain behavior; `src/artifacts-rest.mjs` owns the REST adapter; `src/cloud.mjs` and `src/durable-sql.mjs` provide the selected SQLite Durable Object option; `src/worker.mjs` preserves the D1 option. `public/` owns the UI; `bridge/` owns outbound execution; `schema.sql` is the current relational schema. Build-generated modules are ignored.

The private prototype's exact-candidate checks, compare-and-swap integration, and outbox recovery are design evidence, not features already ported here. Its scripted local tests do not establish live Cloudflare or Amplifier execution.

## Publication and migration

GitHub remains the source/publication location. Artifacts holds durable Studio records and workspaces in the proposed design. Imports, private authenticated Git seeding, and accepted-code publication require explicit destination and ref mappings. No automatic GitHub mirror exists.

Before porting code, compare contract versions, auth, storage, test evidence, licensing, and failure behavior. Preserve a baseline SHA and a bounded scope. The larger vision does not authorize changes to every related repository.
