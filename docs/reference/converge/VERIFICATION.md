# Verification and proof boundaries

Fresh review checks on **2026-10-07**, pinned source **41679679fd449ecc16b6af58d0ce8ec2cb2d29ad**. Full machine reports and self-test output are in [verification-results.json](verification-results.json).

## Executed here

| Kit | Good fixture: pass / fail / skip | Bad fixture: pass / fail / skip | Stdlib self-tests |
|---|---|---|---|
| experience | 16 / 0 / 2 | 0 / 16 / 2 | 43 passed |
| experience-direction | 13 / 0 / 0 | 0 / 13 / 0 | 14 passed |
| experience-operation | 15 / 0 / 0 | 0 / 15 / 0 | 22 passed |
| experience-console | 10 / 0 / 0 | 0 / 10 / 0 | 13 passed |
| experience-collaboration | 12 / 0 / 2 | 0 / 12 / 2 | 17 passed |

All five good fixtures exited 0. All five deliberately bad fixtures exited 1 with named failures. All **109** self-tests passed. The Direction suite also checks the fixture that cannot restore from a chosen history snapshot. Negative-fixture failure is the expected successful check outcome.

Commands used from the cached snapshot, without installing dependencies:

```bash
python3 conformance/<kit>/run.py conformance/<kit>/fixtures/sample-good --json-only
python3 conformance/<kit>/run.py conformance/<kit>/fixtures/sample-bad --json-only
python3 conformance/<kit>/tests/test_conformance.py
```

The fixtures include their own target snapshots. They are not the running app. SKIP remains unproved: umbrella idiom judgments and collaboration second-party behavior cannot be inferred from those passes.

Acquisition verified the Git blob SHA and SHA-256 of all **672** cached UTF-8 files. Structural indexing parsed **202 Python files** and indexed **201 Markdown/template heading files**. Neither check proves semantic correctness.

## Verification assets shipped upstream

| Area | Asset | Proof class |
|---|---|---|
| Lean composition | conformance/composition | Source checks plus optional actual-host probes; may launch live composition |
| Document anatomy | conformance/documents | Repository/participant-kit/work-item checks; current queue export matters |
| Experience family | Five experience kits | API/HTML/JS/CSS/route snapshot checks, fixture negatives and self-tests |
| Retired surface | conformance/_superseded/surface | Historical kit retained for remaining consumers |
| Ordinary app | app/tests | Backend/auth/TLS/writes/identity and rendered browser/PWA/tmux tests |
| Root package/guidance | tests | Reader/writer/guidance/install/recipe/turnkey regressions |
| Guard modules | modules/*/tests | Pure evaluator and mount/public-observation checks |
| Portable package | packages/collaborative/tests | Resource delivery, method guidance and composition |
| Ledger | ledger/checks/verify.py | Clause/hash/assertion/tracker integrity; current queue and artifact paths matter |
| Ratchet/adoption/turnkey | evaluations/* | Provider/host/container/real-lane trials, distinct from fixtures |
| Frontend stub | app/static/dev | Development fixtures/verifier; not real project data |

[Repository map](REPOSITORY-MAP.md) and [symbol index](symbol-index.json) identify files/test names.

## Historical results

Upstream records turnkey greens, adopter failures/repair history, measured app/browser defects and one September 22 acceptance-review success. These describe named earlier revisions/environments. The September 22 case explicitly excludes full orchestration, integration, closure and conversation-journey proof.

Many newer collaborative scenarios are **NOT RUN**. Package/resource tests show text delivery; they do not establish that a model follows the text, a retained manager adopted it, or the final application opening is usable.

## Not run here and why

No full app/browser/package/module test suite was executed. This host lacks pytest and several app/Amplifier dependencies, including PAM Python bindings, Jinja2, itsdangerous, Markdown renderer and Amplifier Core/Foundation. No dependency installation or provider-enabled evaluation was needed for the requested reference.

No server was exposed, user credential read, cookie forged, terminal attached, host comment sent or Artifacts deployment exercised. No Converge ledger or historical report was changed to manufacture a green result.

The safe next operational check is a bounded receiving trial on the user's actual qualified host, with its exact dependency/tool pins and authority. It should test the proposed seam rather than repeat the entire research acquisition.
