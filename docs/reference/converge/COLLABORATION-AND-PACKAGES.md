# Git-host collaboration and portable instructions

There are two distinct integrations in this repository: the web app's Git-host bridge, and portable guidance consumed by collaborative runtimes. They share intent and contract discipline but are not the same executable backend.

## Web app bridge

**Source:** `app/collab.py` uses `gh` to read pull requests/diffs/comments and post questions or the registered steward's answer back to the host. Proposals use the shared review anatomy. Collaboration identity is a hash of the canonical repository path, with ambiguous/unknown identities refused: [app/collab.py](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/collab.py#L326), [app/collab.py](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/collab.py#L457).

Answering a pull request first appends a local dated ratification record, then posts a comment; both outcomes are reported independently. This route does not itself merge the PR or commit ratified text: [app/collab.py](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/collab.py#L595). Native manager integration after verification is a different workflow.

The frontend polls every **60 seconds**. A cookie-exempt host webhook route now exists, refusing absent or wrong `x-converge-secret`. It records an arrival hint. This is a custom shared-secret protocol; this review did not establish direct compatibility with GitHub's signed webhook delivery or deployed reachability: [app/static/js/render/collab.js](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/static/js/render/collab.js#L27), [app/collab.py](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/collab.py#L672), [app/serve.py](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/serve.py#L72).

The governing frozen contract says Git is the protocol; no direct manager-to-manager federation or second issue/document/review store: [contracts/experience-collaboration.v1.md](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/contracts/experience-collaboration.v1.md#L26).

## Portable collaborative profile

`packages/collaborative` ships **amplifier-converge-instructions 0.4.25**. It is text and a small `instruction("manager"|"supervisor")` resource loader. It does not start a process, mount tools, configure a provider or own a store. Shared collaboration text plus the selected role is returned; arbitrary includes are not resolved: [packages/collaborative/README.md](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/packages/collaborative/README.md#L1), [packages/collaborative/src/converge_instructions/__init__.py](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/packages/collaborative/src/converge_instructions/__init__.py#L1).

| Entry | What it delivers |
|---|---|
| behaviors/collaborative.yaml | Shared collaboration + supervisor guidance to an existing host |
| bundles/collaborative/bundle.md | Optional Anchors supervisor root with that behavior |
| behaviors/converge.yaml | Ordinary manager workflow plus the same shared collaboration guidance |
| instruction("manager") | Shared text + manager role for an external consumer |

The profile maps to externally owned Method operation/lanes/wake contracts. It describes public `converge_operations` and project-scoped `converge_project` actions, lane plans, frozen briefs, custody, independent verification, integration/closure, source attachments and exact retry receipts. **Descriptions are not implementations of those actions in this repository.** Actual installed schemas and readiness govern: [packages/collaborative/METHOD-PROTOCOL.md](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/packages/collaborative/METHOD-PROTOCOL.md#L105).

Retained managers require exact instruction-digest migration without deleting or replaying native history. Publishing a new instruction version does not upgrade existing sessions: [packages/collaborative/METHOD-PROTOCOL.md](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/packages/collaborative/METHOD-PROTOCOL.md#L202).

## Optional supervisor entry hook

The opt-in `behaviors/supervisor-entry.yaml` mounts a read-only hook. It needs a qualified public-read adapter registered as `converge.supervisor.public_read.v1`, or an explicitly named mounted Operations tool with a structured result. It does not launch servers, discover private stores, mutate records or create managers: [modules/hooks-supervisor-entry/README.md](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/modules/hooks-supervisor-entry/README.md#L1).

Default deadline is two seconds (maximum five), at most 20 reads, bounded inventory/pages/response/context sizes. It checks root-session ancestry, session identity, workspace binding, revision/selection and freshness; incomplete observation stays uncertainty. Reports are untrusted record data, not new authority. These bounds are configured limits, not measured performance guarantees: [modules/hooks-supervisor-entry/README.md](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/modules/hooks-supervisor-entry/README.md#L47).

## What this changes for Studio

Before building another session manager, direction store or review-selection API, inventory the chosen Unified consumer's already installed capabilities against these public seams. Preserve instruction hashes, native history, domain owners and exact receipts. Artifacts can provide durable Git/evidence storage beneath a qualified adapter or a provenance projection beside native records; this remains a design decision.
