# Execution adapter and bundle composition

Status: proposed Unified/Converge adapter. The current [Python bridge](../bridge/README.md) has not demonstrated a live Amplifier run and uses an operator-configured legacy CLI argv.

## Recommendation on Converge

Converge is a candidate **product and workflow foundation**: it ships a Python web app with Home, Direction, Operation, a manager console, document proposals/history and Git-host collaboration, as well as its development method. These functions overlap the proposed Studio UX and record responsibilities. The earlier description as only a development-workflow candidate was incomplete. Consult the [pinned source wiki](reference/converge/README.md) and [reuse assessment](reference/converge/STUDIO-REUSE-AND-GAPS.md) before extending this adapter or creating another surface.

Its root includes lean Anchors (six helpers), work-tracker behavior and Converge behavior (four workflow agents, guard, awareness and manager-mode declaration). Five procedure skills mount with the manager mode. Actual host loading and separate worker execution still require qualification. The newer collaborative profile ships portable instructions for external domain/runtime tools; it does not implement those tools or replace the Python app backend here. Artifacts, memory integration, OS isolation and delivery policy still need explicit seams.

## Project-local composition

1. Inspect the actual pinned Unified host's bundle/behavior/mode loading schema and CLI/API.
2. Record resolved Core/Foundation, Converge, work-tracker, and specialist bundle revisions.
3. Compose the supported Converge behavior with the actively developed Cloudflare specialist guidance in a project-local configuration.
4. Load it on an isolated qualification host and record actual agents, modes, tools, skills, and custody behavior.
5. Ratify seam contracts; exercise locked candidate behavior before product execution.
6. Qualify one real lane, then add an independent verification lane or second worker only when useful.

The operator is actively evolving the starter bundle. Coordinate updates and pin its actual content; do not overwrite it from the historical snapshot. Its single Cloudflare specialist/context behavior and reuse of engineering helpers are a foundation, not an already loaded comprehensive development system. Hardcoded container recipe assumptions need portability review.

## Lane and custody mapping

Map Studio project/task revision/assignment/attempt to native manager session, work-tracker task, worker session, repository, and packet. One owner manages each active attempt. Workers require independent OS workspaces and sessions. Calls to helper agents inside a manager session are not sufficient proof of separate product lanes.

Only the worker repository and selected packet credentials enter the worker environment. The candidate builder and verifier have separate authority. Converge's default merge/integration behavior, if enabled, is confined to an isolated candidate workspace; production/GitHub destination writes remain explicitly controlled.

## Current bridge limits

The bridge validates outbound origins, uses separate clones, enforces time budgets, reports tests/diffs, and does not merge/deploy. It does not create an OS sandbox. The `isolated_environment` flag is operator intent only. Tests run before its final commit; that evidence cannot qualify the final combined candidate. Failed unpublished temporary work is removed rather than recovered.

Qualify the actual host invocation instead of guessing that legacy `amplifier run` maps directly to Unified. Keep provider configuration outside packets and do not install/upgrade the global host as a side effect.

## Qualification receipt

Capture actual host command/API, resolved pins, bundle activation evidence, session/tracker IDs, environment image/network/filesystem restrictions, packet digest, approved base, start/end/lease events, contribution SHA, and safe exit/report. Test failed load, duplicate claim, lost lease, cancellation, expired token, stale baseline, changed working tree, and interrupted Git publication.

The [runner contract](../contracts/runner-adapter.v1-candidate.md), [review contract](../contracts/review-integration.v1-candidate.md), and [verification](VERIFICATION.md) govern the seam. No unsupported combination is promoted to working status on the strength of declaration alone.
