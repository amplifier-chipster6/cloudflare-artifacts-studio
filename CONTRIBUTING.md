# Contributing

Start with [agent guidance](AGENTS.md), [status](PROJECT_STATUS.md), and [documentation map](docs/INDEX.md).

## Workflow

1. Open a bounded task: objective, allowed paths, acceptance criteria, source base, selected context, and responsible role.
2. Check the relevant proposed/ratified seam contract and actual dependency pins.
3. Work on `task/<id>-<slug>`, `docs/<slug>`, or the operator's explicitly requested branch. The initial documentation branch is `initial-documentation-creation`.
4. Keep unrelated changes separate. Never commit credentials, private attachments, local databases, or generated assets.
5. Produce a candidate and run appropriate checks. For agent execution, preserve contribution and independent verification receipts for the final candidate SHA.
6. Request review with scope, changed behavior, check results, limitations, and exact evidence.
7. Integrate only through an authorized action against the expected destination head. Deployment is a separate action with its own receipt.

Use concise commit messages such as `docs: establish Artifacts Studio architecture and project baseline`. Link stable task/record IDs when present; commit prose does not replace structured decisions. Record SHA locators after commit creation rather than embedding a commit's own hash in its contents.

## Validation

`node build.mjs`, `npm test`, `npm run test:bridge`, `npm run check:frontend`, and `npm run check:docs` are the repository checks. Documentation validation uses [requirements-docs.txt](requirements-docs.txt). The CI workflow runs these without cloud credentials or deployment permissions.

Browser accessibility, live Artifacts, real Amplifier execution, and memory reconstruction need additional evidence described in [verification](docs/VERIFICATION.md). Do not substitute fixture checks for those gates.

## Desired GitHub baseline

Configure main to require pull requests, one approving review, resolved conversations, and the `Repository checks / checks` status before merge. Disable force pushes/deletion of main. These settings are **recommended administrative tasks; they have not been applied by this documentation change**. Keep branch publishing separate from merging. Verify the emitted check name before enforcing protection.

Issue and PR templates capture objective, scope, criteria, provenance, validation, and delivery intent. Public issues must not contain secrets or private memory.

## Licensing and attribution

The existing [MIT license](LICENSE) remains the repository license. Before copying implementation or knowledge assets from another repository, inspect its license and preserve required notices. A source citation is not a replacement for licensing obligations. Private-source availability does not authorize public redistribution.
