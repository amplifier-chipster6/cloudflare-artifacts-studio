# Artifacts Studio

A personal engineering workspace for turning project ideas into defined tasks, agent-produced code, and reviewed results. **v0.1 runs locally; the proposed Artifacts record foundation, live Amplifier execution, and hosted platform are not yet qualified.**

Start with the [documentation map](docs/INDEX.md), [vision](docs/VISION.md), [bounded Unified pilot](docs/PILOT.md), and [project status](PROJECT_STATUS.md). All twenty documentation deliverables are tracked in [TODO](docs/TODO.md).

## Run the existing app

Requires Node >=24. The app has no npm dependencies.

```bash
node build.mjs
node server.mjs
```

Open **http://127.0.0.1:8787**. Local records persist in `data/studio.sqlite`. Keep the local server on loopback; its local owner identity is intended for a trusted operator's machine.

Create a project and task; define scope, acceptance criteria, and one or two assignments; select context; download the packet; review submitted work when a runner is connected. Creating a task does not execute an agent. Accepting a contribution records a decision; integration and deployment are separate.

## Current implementation and proposed architecture

| Area | v0.1 behavior | Proposed next capability |
|---|---|---|
| Planning and context | SQL-backed project/task/context records and immutable queued packets | Authoritative versioned records and packets in Artifacts |
| Artifacts | Binding/REST repo management, history/file reads, per-run forks | Record writer, stable baselines, candidate/evidence topology, events/reconciliation |
| Execution | Outbound Python bridge, two-run cap, leases/heartbeats, separate clones | Qualified Unified/Converge adapter, native custody mapping, constrained OS lanes |
| Review | Attributed test/diff reports, commit/ancestry/freshness checks, decision recording | Independent final-candidate checks and explicit recoverable integration |
| Memory | Manually selected context excerpts | Cited derived projections through the actual custom memory port |
| Delivery | Source backup and GitHub project links | Separately authorized destination/ref publication and deployment receipts |

Artifacts is the proposed primary durable foundation; Studio supplies milestone/task/criterion/assignment schemas using Git primitives. SQL handles coordination and rebuildable views. Memory derives knowledge; Unified retains its native history. These distinctions and the migration are in [architecture](docs/ARCHITECTURE.md).

The first pilot personalizes the operator's Unified fork through a discovered supported navigation seam. Converge is a workflow candidate, composed project-locally with the actively developed Cloudflare specialist bundle. Neither has been demonstrated loaded here.

## Connections and deployment

[DEPLOY](DEPLOY.md) documents private deployment prerequisites and commands; [bridge guidance](bridge/README.md) documents the existing adapter. The selected `wrangler.jsonc` uses a SQLite Durable Object and native Artifacts binding; the D1 alternate remains available. Private account/owner values are placeholders.

Historical cloud attempts failed; an unrestricted `artifacts-studio` namespace was observed, but no hosted Studio, live Git roundtrip, or model run was verified. [Deployment history](docs/DEPLOYMENT-STATUS.json) preserves observations without treating them as current permission diagnostics.

For local REST access, configure `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`, `ARTIFACTS_NAMESPACE`, and `STUDIO_RUNNER_TOKEN` through your secret manager; optional `STUDIO_DB` and `PORT` select local storage/listener. Secrets stay outside browser state, task packets, Git URLs, and records.

Private GitHub code needs trusted authenticated Git seeding; built-in Artifacts import is public HTTPS. GitHub synchronization is not implemented. Repo forks/directories are not an OS sandbox. See [Artifacts integration](docs/ARTIFACTS-INTEGRATION.md) and [security](SECURITY.md).

## Development

```bash
python3 -m pip install -r requirements-docs.txt
npm run check:docs
npm run build
npm test
npm run test:bridge
npm run check:frontend
```

[Contributing](CONTRIBUTING.md), [AGENTS](AGENTS.md), [pins](PINS.md), [contracts](docs/CONTRACTS-README.md), and [validation](docs/VALIDATION.md) define the baseline workflow. The read-only CI workflow performs repository checks without cloud credentials.

Source: `src/api.mjs` domain/API; `src/artifacts-rest.mjs` REST; `src/cloud.mjs` Durable Object entrypoint; `src/worker.mjs` D1 alternate; `public/` UI; `bridge/` execution; `schema.sql` relational schema. Generated modules stay ignored.
