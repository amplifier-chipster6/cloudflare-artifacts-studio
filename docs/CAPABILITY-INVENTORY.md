# Capability inventory

Snapshot: 2026-10-06. “Declared” means documented/source-present; “loaded” means a host actually activated it; “demonstrated” means observed execution. A declaration or discoverable agent name does not establish the latter two.

| Capability | Declared/source-present | Loaded here | Demonstrated here | Approach / qualification |
|---|---|---|---|---|
| Local Studio CRUD, packets, queue, decisions | v0.1 code | Local entrypoint only | Controlled tests; see validation/status | Reuse |
| Artifacts binding and REST adapter | v0.1 code + current docs | No live binding | No live Git roundtrip | Qualify existing adapter; extend record writer |
| SQL Durable Object storage | Selected deployment template | Not deployed | Local SQLite tests only | Reuse and qualify private cloud deployment |
| Unified native sessions/configuration | Reviewed host source | No | No real host run | Discover current seam; configure before extending |
| Core/Foundation | Upstream declarations | No | No | Resolve transitive commits in actual host |
| Converge manager/workers/work-tracker | Bundle/protocol declarations | No | No | Compose project-locally; qualify custody and modes |
| Converge collaborative guidance | Separate behavior/instructions | No | No | Do not substitute guidance-only entrypoint for manager workflow |
| Cloudflare specialist starter | Private baseline bundle | No | Structural review only | Coordinate with operator's active development; pin actual content |
| OS-isolated execution | Design requirement | No qualified environment | No | Constrained containers/VMs; directories/forks insufficient |
| Combined candidate/trusted verifier | Proposed; private prototype patterns | No | No live evidence | Port deliberately and extend |
| Artifacts events/Builds | Current platform docs | No subscriptions | No | Qualify schemas, refs, queue semantics, Worker compatibility |
| Memory/Context Intelligence | Referenced host dependencies; custom system unspecified | No | No | Inspect actual memory architecture, then map explicit port |
| Artifacts record/memory projection | Draft contracts/schemas | No implementation | Examples validated only | Implement after ratification |
| GitHub publication | Existing source backup | Connector access | Source publication; no automatic code integration | Explicit destination/ref/notes mapping |
| Real browser accessibility/mobile | Responsive app source | No browser qualification | DOM smoke only | Browser checks required for pilot |

For every actual run, capture host commit, lockfile/resolved dependencies, bundle content revisions, mode/behavior activation, native tracker IDs, environment image digest, and verification commands. [PINS](../PINS.md) records observations and unresolved inputs.

The Unified fork/upstream revisions differ. Frequent upstream releases suggest active development but do not prove compatibility or select an upgrade. Inventory capabilities again on any new pin.
