# Documentation branch validation

Validation date: 2026-10-06. Branch: `initial-documentation-creation`. Base: `1a493cb9c6b7618fbd714c50eff059c9ffe3bce2`.

Scope: twenty documentation task groups, reconciliation of existing docs, candidate schemas/examples, an offline documentation checker, and read-only repository CI. Application runtime behavior is unchanged.

| Check | Observed result |
|---|---|
| `npm run check:docs` | PASS: 18 schema definitions, 16 record examples, 1 source envelope, 9 rejected negative fixtures, all 20 ordered task groups, 295 local links |
| `npm run build` | PASS: 3 local assets bundled |
| `npm run check:frontend` | PASS: frontend JavaScript syntax |
| `node --test --test-isolation=none tests/api.test.mjs tests/rest.test.mjs tests/review-regressions.test.mjs` | PASS: all 11 backend/API/REST/regression assertions |
| `npm run test:bridge` | PASS: 16 Python bridge tests |
| `python3 -m py_compile scripts/check_docs.py bridge/runner.py` | PASS |
| CI YAML structural check | PASS: parses, read-only permissions, push/PR triggers, exact action SHA pins |
| `git diff --cached --check` | PASS |
| Targeted credential/private-name pattern scan | No matches in authored documentation, schemas, examples, tooling, and CI |
| Normal `npm test` | Backend file runners completed; frontend smoke blocked by sandbox `spawnSync node EPERM` while invoking its build subprocess |

The direct backend command runs the individual assertions without Node test subprocess isolation. It is not a substitute for the blocked frontend smoke check. The CI workflow retains the normal full suite for a compatible runner; a remote CI result is not claimed in this record.

An independent fresh-context reviewer reran the documentation checks and reviewed the complete tracked/untracked change for coverage, authority/provenance, context, draft/live distinctions, ownership, contracts, and publication readiness. Final review disposition is recorded below.

## Review disposition

No material findings blocking documentation commit and branch publication. The reviewer confirmed coherent authority, provenance, privacy, memory unknowns, custody, and delivery boundaries. The sandbox-blocked frontend smoke limitation remains explicitly recorded.

## Boundaries

These checks do not establish live Artifacts operations, hosted private Access, real Amplifier/model execution, OS isolation, real browser accessibility/mobile behavior, a custom memory adapter, final-candidate verification, or actual project delivery. [VERIFICATION](VERIFICATION.md) lists those future qualification gates.

The desired GitHub main protections are documented configuration tasks, not applied settings. Branch publication is separate from merge and deployment.
