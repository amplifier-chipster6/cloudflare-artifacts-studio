# Cloudflare Artifacts review for Artifacts Studio

Reviewed 2026-10-06 against all 26 product pages in the [Artifacts documentation index](https://developers.cloudflare.com/artifacts/llms.txt). Coverage means the indexed product pages, not every external service linked from them. Documented capabilities are distinguished below from local verification. After the Workers Paid upgrade, namespace listing succeeds; namespace creation and Worker deployment remain blocked by authentication/access errors. Repository read/write behavior and native binding execution have not been verified live.

## Fit for your workflow

Artifacts supplies Git repositories, scoped credentials, forks, object reads and event hooks. Studio supplies projects, tasks, selected context, agent assignments, evidence and decisions. Amplifier remains the external execution runtime. GitHub stays linked to the project; this version does not migrate or synchronize it.

This preserves Website Studio's existing boundary: Studio owns lifecycle and approval; Amplifier executes bounded work; accepting evidence does not initiate another stage. Modernization is the first workspace, with amplifier-chatui the intended pilot after execution is connected. Context Intelligence and memory retrieval are future integrations, not an implied ingestion of personal history.

Each assignment gets its own fork of a project baseline, an immutable task/context snapshot and a short-lived repo credential. At most two runs can be active. This applies the [best-practices guide](https://developers.cloudflare.com/artifacts/concepts/best-practices/). Separate Git repositories do not isolate operating-system processes: execution still needs constrained containers or equivalent boundaries.

## Deployment implications

- **Availability and cost:** The [changelog](https://developers.cloudflare.com/artifacts/platform/changelog/) identifies open beta. [Pricing](https://developers.cloudflare.com/artifacts/platform/pricing/) requires Workers Paid and says billing starts October 14, 2026. Included usage is 10,000 operations and 1 GB monthly; additional usage costs $0.15 per 1,000 operations and $0.50 per GB-month. Workers, storage, execution and models can add separate charges. No plan upgrade was performed.
- **Limits:** The [limits reference](https://developers.cloudflare.com/artifacts/platform/limits/) specifies 1 GB per repo, 32 MB per blob and 1 TB account storage; storage limits can be raised. Control-plane requests are limited to 2,000 per 10 seconds per namespace; Git has the same rate per repo. Large media belongs elsewhere. This version has no automatic retention or budget enforcement.
- **Private GitHub:** The [import guide](https://developers.cloudflare.com/artifacts/guides/import-repositories/) documents public HTTPS remotes. The private Website Studio repo needs an authenticated Git seed from a trusted environment. A GitHub link in Studio does not establish private import or synchronization.
- **Location:** The [localization guide](https://developers.cloudflare.com/artifacts/guides/data-localization/) supports `eu` and `us`. Jurisdiction is set at namespace creation and cannot subsequently change. Choose it before the first production repo if required. Templates make no residency claim.

## Current API and older examples

The current [Workers binding reference](https://developers.cloudflare.com/artifacts/api/workers-binding/) drives this implementation: `get()` returns a disposable capability, `info()` returns metadata, create/fork return metadata directly, and `createToken()` returns a result containing `plaintext`. File reads return Blob values. Commit logs follow first parents, with at most 1,000 results. Code releases handles in `finally`. The reference requires Wrangler 4.145.0 or newer for current types and remote Blob support; generate binding types before deployment.

Older examples contain discrepancies:

1. The isomorphic-git page says the binding cannot read files. The newer reference now documents file, blob, tree and commit reads. We use native reads and external Git writes.
2. The Sandbox example reads metadata properties directly from a repo handle. The newer reference requires `info()`; we follow that shape.
3. “How Artifacts works” describes only implicit namespace creation. The newer namespace and REST pages also document explicit creation and jurisdiction. Repo creation can still implicitly create an unrestricted namespace.

The [REST reference](https://developers.cloudflare.com/artifacts/api/rest-api/) uses Cloudflare's v4 JSON envelope, with raw bytes for file/blob success responses. The local adapter maps repo/fork/token/content routes into the same small interface used by the Worker. Tests validate those shapes with controlled responses, not account-level compatibility.

## Authentication, review and automation

The [authentication guide](https://developers.cloudflare.com/artifacts/guides/authentication/) distinguishes native bindings, Cloudflare API tokens and repo-scoped Git tokens. Cloud deployment additionally requires verified Access owner identity. The runner has a separate credential and cannot use owner routes. Agent processes receive no Cloudflare API token.

The [Git protocol guide](https://developers.cloudflare.com/artifacts/api/git-protocol/) requires the returned HTTPS remote. Bearer auth uses the full token; Basic auth uses a nonempty username and the secret before `?expires=`. The bridge validates the Artifacts host and uses temporary askpass credentials instead of credential-bearing remotes.

Studio checks reported commit existence, approved-base ancestry and unchanged source/fork heads. Diffs and tests remain runner-submitted evidence, not independently reproduced results. Acceptance records a human decision; there is no automatic merge or deployment.

The [event guide](https://developers.cloudflare.com/artifacts/guides/event-subscriptions/) exposes repository lifecycle and push/fetch/clone/token events. Future handlers should deduplicate events and pin work to their commit IDs. No subscriptions were created.

The [build/deploy guide](https://developers.cloudflare.com/artifacts/guides/build-and-deploy-on-push/) offers Workers Builds or custom Workflows with `@cloudflare/ci`, caches and isolated runners. Checks can run after pushes while publication stays separately initiated. Neither cloud CI path is implemented here.

The [metrics reference](https://developers.cloudflare.com/artifacts/observability/metrics/) documents `artifactsEventsAdaptiveGroups`, counts, durations and errors for the past 31 days. These would complement Studio run records. This version displays only its own events and runner evidence, not Cloudflare analytics or a Context Intelligence feed.

## Complete coverage ledger

Each indexed page was reviewed for design and implementation implications. Deferred capabilities are not shipped features.

| Page | Applied finding or disposition |
|---|---|
| [Overview](https://developers.cloudflare.com/artifacts/) | Git storage foundation; Studio implements the personal workflow. |
| [Get started](https://developers.cloudflare.com/artifacts/get-started/) | Worker and external REST entrypoints both apply. |
| [Workers quickstart](https://developers.cloudflare.com/artifacts/get-started/workers/) | Binding and Git handoff; live deployment unverified. |
| [REST quickstart](https://developers.cloudflare.com/artifacts/get-started/rest-api/) | Account/namespace routes used by local adapter. |
| [Workers binding](https://developers.cloudflare.com/artifacts/api/workers-binding/) | Current capability and metadata shapes implemented. |
| [REST reference](https://developers.cloudflare.com/artifacts/api/rest-api/) | Repo/fork/token/log/commit/file routes mapped. |
| [Git protocol](https://developers.cloudflare.com/artifacts/api/git-protocol/) | Returned HTTPS remote and repo credential used by bridge. |
| [Wrangler](https://developers.cloudflare.com/artifacts/api/wrangler/) | Inspection and token commands support setup; no global install changed. |
| [Errors](https://developers.cloudflare.com/artifacts/api/errors/) | Pending fork/import differs from access failure; provisioning failure is visible. |
| [How it works](https://developers.cloudflare.com/artifacts/concepts/how-artifacts-works/) | Repo history, credentials and lifecycle are independent. |
| [Namespaces](https://developers.cloudflare.com/artifacts/concepts/namespaces/) | Stable namespace across interfaces; explicit creation supports location choice. |
| [Repositories](https://developers.cloudflare.com/artifacts/concepts/repositories/) | Control-plane management and Git writes remain separate. |
| [Best practices](https://developers.cloudflare.com/artifacts/concepts/best-practices/) | Per-run fork, unique names, short-lived credentials; git notes deferred. |
| [Authentication](https://developers.cloudflare.com/artifacts/guides/authentication/) | API and Git credentials are distinct. |
| [Import](https://developers.cloudflare.com/artifacts/guides/import-repositories/) | Public import does not establish private GitHub sync. |
| [ArtifactFS](https://developers.cloudflare.com/artifacts/guides/artifact-fs/) | Lazy FUSE hydration suits large repos; normal Git clone chosen initially. |
| [Events](https://developers.cloudflare.com/artifacts/guides/event-subscriptions/) | Hooks reviewed; subscriptions deferred. |
| [Build/deploy](https://developers.cloudflare.com/artifacts/guides/build-and-deploy-on-push/) | CI options reviewed; publication is separately initiated. |
| [Localization](https://developers.cloudflare.com/artifacts/guides/data-localization/) | Immutable namespace jurisdiction must be chosen at creation. |
| [Metrics](https://developers.cloudflare.com/artifacts/observability/metrics/) | GraphQL operation analytics deferred. |
| [Git client](https://developers.cloudflare.com/artifacts/examples/git-client/) | Standard clone/push fits the existing execution environment. |
| [isomorphic-git](https://developers.cloudflare.com/artifacts/examples/isomorphic-git/) | Worker-side writes are an alternative, unnecessary for this bridge. |
| [Sandbox SDK](https://developers.cloudflare.com/artifacts/examples/sandbox-sdk-artifacts/) | Per-sandbox repo pattern reviewed; existing isolated environment preferred first. |
| [Pricing](https://developers.cloudflare.com/artifacts/platform/pricing/) | Paid plan, usage charges and retained forks affect rollout. |
| [Limits](https://developers.cloudflare.com/artifacts/platform/limits/) | Bound code/context; put large assets elsewhere. |
| [Changelog](https://developers.cloudflare.com/artifacts/platform/changelog/) | Newer October API behavior takes precedence over older examples. |

## Remaining live evidence

Resolve connector access errors, deploy privately, verify a real baseline/fork/token/Git cycle, pair the installed Amplifier runtime, and demonstrate overlapping runs with actual commits and test evidence. Then implement separately initiated integration and deployment. The local workspace supports project planning, context selection and task preparation while these connections remain unresolved.
