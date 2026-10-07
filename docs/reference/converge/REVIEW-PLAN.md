# Converge reference review plan

Review requested by the operator. Source: microsoft/amplifier-bundle-converge, pinned to `41679679fd449ecc16b6af58d0ce8ec2cb2d29ad`. User-facing review date: 2026-10-07 (Etc/UTC).

Goal: build an offline, source-cited reference and a factual reuse/gap assessment. This is repository analysis and documentation; no model runs, global installation, deployment, or architecture migration.

- [x] Acquire a complete tree inventory and first-party text snapshot through the GitHub connector; verify Git blob identities and record exclusions.
- [x] Review the bundle/modes/hooks/skills, fourteen contracts, app/UI/API, source library, packages, runtime/dependencies, persistence/authentication, and verification assets.
- [x] Create focused reference pages, source citations, capability/reuse matrices, coverage and open-question registers.
- [x] Run offline reference/integrity checks and bounded safe source self-tests where dependencies allow; separate static analysis from executed/live evidence.
- [x] Add navigation and a correction notice to the existing incomplete Converge description.

Store curated reference pages under `docs/reference/converge/`. Store the local source cache under its ignored `source/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/` directory, preserving upstream LICENSE and notices. Index binaries and generated/vendor assets without claiming visual/source review. Do not count acquisition or symbol indexing as full semantic review.

Claims cite immutable GitHub source paths and line numbers. The cache supports local follow-up; the curated reference and manifest remain useful without it. Record the difference between documented promises, source behavior, historical measurements, and checks performed during this review.
