# Bundle composition and runtime

## Ordinary composition

**Source:** root `bundle.md` version **0.1.0** includes Foundation's lean Anchors bundle, the work-tracker behavior, and Converge's own behavior. Anchors supplies six helpers; Converge adds **four** workflow agents. Describing the root as merely exposing six helpers omits its own capability payload: [bundle.md](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/bundle.md#L16).

| Agent | Responsibility | Authority distinction |
|---|---|---|
| converge:protocol-authority | Interpret the ratified protocol | A ruling is not implementation or owner ratification |
| converge:reconciler | Derive clause rows, check reality, file gaps/violations | Mutates ledger/tracker under its brief |
| converge:negotiator | Produce options, recommendation and a decision request | Read-only negotiation |
| converge:proposal-drafter | Author a candidate beside a locked document | Never edits the locked original or ratifies itself |

These are workflow helpers, not proof that separate product-worker lanes are running. Source: [bundle.md](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/bundle.md#L77); composition: [behaviors/converge.yaml](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/behaviors/converge.yaml#L136).

The ordinary composable entrypoint is `behaviors/converge.yaml`. The README's `amplifier bundle add ... --app` composes it onto the existing Amplifier host. **That `--app` flag does not start Converge's web app.** The advanced root path also chooses Anchors. The behavior supplies work-tracker, guard, four agents, thin awareness, shared collaboration guidance and the manager-mode declaration; its host must supply the session tools, skills machinery and mode loader: [README.md](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/README.md#L57), [behaviors/converge.yaml](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/behaviors/converge.yaml#L37).

## Manager mode

`modes/converge-manager.md` contributes five skills only while active: freeze-bar, lane-brief, ledger-disposition, proposing-a-change, seam-test. It also contributes seven manager-context documents. The mode allows unlisted tools and warns on delegation; the warning is not structural isolation: [modes/converge-manager.md](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/modes/converge-manager.md#L8).

The operating sequence is investigate → negotiate → encode and commit direction → seed ledger → queue derived work → execute isolated lanes → integrate and independently verify → close, with standing reconciliation. Product work uses real worker sessions/copies/branches; in-session helpers have narrower supporting roles. Source: [docs/PROTOCOL.md](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/docs/PROTOCOL.md#L175), [contracts/operation.v1.md](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/contracts/operation.v1.md#L29).

Root and behavior deliberately omit session-wide `spawn.exclude_tools`; it previously damaged unrelated sessions. Do not reinstate it while composing a specialist bundle. Namespace collision can hide `converge-manager`; adoption and install checks are distinct from mere bundle discovery: [README.md](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/README.md#L106).

## Recipe and dependencies

`recipes/seed-reconcile.yaml` is **1.6.0**, schema **2**. Its dependency closure names Anchors at `main` and Converge behavior at tag `v0.1.0`, supplying explorer/reconciler. Four sequential steps load contracts, derive rows, run the target's checks and file drift. It writes ledger/reconcile evidence, not a complete project delivery: [recipes/seed-reconcile.yaml](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/recipes/seed-reconcile.yaml#L368).

The current source snapshot is not necessarily the code resolved by that older recipe tag or moving transitive `main` references. An operational qualification must capture actual resolved commits and tools. Recipe timeouts bound phases, not dollars or tokens.

## Version and host boundaries

Root package: Python >=3.11, Click base dependency, optional app extra with FastAPI, Uvicorn, Jinja2, PAM, signing, Markdown, YAML, tmux-kit and TLS dependencies. Portable instructions package: **0.4.25**, Python >=3.12; supervisor hook package: **0.1.1**. These are separate version streams: [pyproject.toml](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/pyproject.toml#L1), [packages/collaborative/pyproject.toml](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/packages/collaborative/pyproject.toml#L5), [modules/hooks-supervisor-entry/pyproject.toml](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/modules/hooks-supervisor-entry/pyproject.toml#L1).

The Unified host and its runtime/domain libraries are external dependencies, with their own pins and requirements. This review does not newly certify them. No bundle was installed, manager launched, or global configuration modified.
