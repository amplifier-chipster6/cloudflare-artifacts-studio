# Security and hosting constraints

This is focused source review, not a comprehensive security audit or live deployment qualification.

## Existing controls

| Area | Inspected behavior | Evidence |
|---|---|---|
| Login | Machine PAM service; empty/failing authentication refuses; no loopback login exemption | [app/auth.py](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/auth.py#L132), [app/serve.py](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/serve.py#L345) |
| Session | Timed signed cookie with user and random sid, twelve-hour lifetime; revocation consulted on requests | [app/auth.py](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/auth.py#L185), [app/serve.py](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/serve.py#L377) |
| Instance separation | Instance-directory namespace separates cookie names, signing secret and revocation store | [app/serve.py](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/serve.py#L220) |
| Steward authority | Decision, lock, priority, steer and terminal writes check registered steward; missing steward refuses | [app/serve.py](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/serve.py#L942), [app/serve.py](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/serve.py#L395) |
| Teammate work | Draft edits, asks, feedback and comments remain available to authenticated teammates | [app/serve.py](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/serve.py#L751) |
| Request forgery | Unsafe methods check supplied Origin/Referer and CSRF mismatch; webhook uses separate proof | [app/serve.py](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/serve.py#L365) |
| TLS | Mandatory local-CA HTTPS through CLI/server main; private key permissions; no plain-HTTP flag | [app/serve.py](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/serve.py#L1178), [app/README.md](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/README.md#L14) |
| PWA privacy | Principal-scoped cached reads; identity changes/logout/refusal clear sensitive copies | [app/static/sw.js](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/static/sw.js#L28) |

**Nuance:** missing Origin/Referer is accepted, and a missing cookie or supplied CSRF token is accepted by `csrf_ok`; only a present mismatch refuses. Do not claim this code strictly requires a token on every unsafe request: [app/auth.py](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/auth.py#L395).

Draft edits may make immediate local commits. Candidate/decision actions and actual Git publication have different effects. An agent cannot be given arbitrary host authority merely because the UI has a guard.

## Qualification questions from source

- The terminal GET handler accepts socket/session names; middleware's registration/steward gate is specifically for POST keystrokes. Verify read confidentiality and registered-target policy before allowing untrusted machine users or remote access: [app/tmux_view.py](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/tmux_view.py#L497), [app/serve.py](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/serve.py#L399).
- The local decision route falls back to the first repo when an identifier does not match, while the collaboration router deliberately refuses ambiguous/unknown repository identifiers. Use stable repository identities in any adapter: [app/serve.py](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/serve.py#L949), [app/collab.py](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/collab.py#L482).
- Locking checks submitted condition strings, not independently verified artifacts. Approval/evidence policy needs a trusted verifier: [app/writes.py](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/writes.py#L1089).
- The webhook's custom secret header is not an inspected GitHub HMAC verification path. Define the authenticated ingress adapter, replay/delivery semantics and exact repository binding before external wiring: [app/collab.py](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/collab.py#L679).
- Hook restrictions do not replace filesystem/network/process isolation; documented shell and mount-coverage limits remain.

These are source-grounded integration questions, not a claim that an exploit was reproduced or that hosting was hardened here.

## Cloudflare boundary

The current app needs OS PAM, tmux, native Git, subprocess execution and local repository files. Its declared Python version alone does not make it Cloudflare-Workers-compatible. There is no Cloudflare Artifacts binding or Workers backend demonstrated in this repository.

**Proposed first reuse path:** qualify the existing app on a supported execution host with private access, then define the Artifacts/Git and record seams. Alternatives include consuming an existing collaborative runtime or porting the app's read/write interfaces. Choose only after the host inventory and a narrow working demonstration.

A Cloudflare access layer, compute product or Python support is not proof that these OS dependencies work there. Do not deploy the all-interface default as an incidental consequence of a documentation review.
