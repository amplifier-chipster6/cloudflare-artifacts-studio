# Cost controls and actual limits

The user wants fewer redundant API calls and less rework. This reference therefore pins facts, retains local source, separates static checks from model trials, and maps reuse before implementation.

## Source mechanisms

| Mechanism | What it actually bounds | What it does not prove |
|---|---|---|
| Lean Anchors root | Loaded capability/context footprint | Measured savings for this user's project |
| Mode-contributed skills | Five skills absent from unrelated always-on catalogue | Zero total context or model cost |
| Lane width and owned paths | Intended capacity/collision discipline | Enforced provider spend limit |
| Recipe phase timeouts | Per-phase elapsed execution | Exact dollars/tokens or whole-program cost |
| Agent drafter opt-in | Default proposal asks avoid starting a headless model session | All execution is free when agents are enabled |
| Supervisor observation bounds | Read count, deadline, response/context sizes | Guaranteed latency or cost |
| Collaborative attempt guidance | Per-target no-new-fact bound versus total launch cap | Runtime enforcement exists in this repository |
| Cached pinned knowledge | Avoids repeated full-source retrieval | Facts remain current after upstream changes |

Evidence: [bundle.md](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/bundle.md#L16), [modes/converge-manager.md](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/modes/converge-manager.md#L20), [app/serve.py](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/serve.py#L102), [modules/hooks-supervisor-entry/README.md](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/modules/hooks-supervisor-entry/README.md#L47).

## Calls that can incur usage

With `CONVERGE_ASK_DRAFTER=agent`, a proposal ask invokes `amplifier run --mode single --output-format json <prompt>` in the repo, with timeout/error fallback. Default is `fixture`: the user's words become proposal wording without that invocation. The route is not a metered worker service: [app/writes.py](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/writes.py#L550), [app/writes.py](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/writes.py#L738).

Native manager/worker sessions, seed-reconcile and evaluation harnesses can use providers and external infrastructure. The adopter README explicitly describes long provider sessions and container launches; these were **not run** during this review: [evaluations/adopter/README.md](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/evaluations/adopter/README.md#L34).

Web UI Git/queue/tmux reads and host polling incur ordinary compute/host requests; they do not themselves prove a model call. Git-host collaboration polls at 60 seconds. Do not estimate provider cost from the number of visible screens.

## Proposed pilot controls

Before a paid live run, fix one objective, source/host/bundle pins, allowed paths, one lane initially, explicit stop conditions, remaining failure budget, provider/model/effort setting and spend ceiling where the host actually supports enforcement. Read/reconcile an uncertain receipt before issuing another effect. Reuse a completed review instead of re-running the acquisition.

Capture actual provider usage, elapsed time and outcomes; show unsupported cost enforcement honestly. This review incurred connector retrieval/review work but launched **no model execution through Amplifier** and made no provider-cost measurement.
