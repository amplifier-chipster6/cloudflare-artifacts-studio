# Continue Artifacts Studio

This public repository is the source backup requested on October 6, 2026:
`amplifier-chipster6/cloudflare-artifacts-studio`, branch `main`.
It contains the personalized v0.1 Studio implementation from the conversation,
plus the latest deployment findings. The other Artifacts Studio prototype was
not modified or merged into this backup.

## Start here

Continue this implementation; do not restart design or assume a live deployment.
Read `README.md`, `PROJECT_STATUS.md`, and `DEPLOY.md`. Existing design and plan:
`docs/DESIGN.md` and `docs/PLAN.md`. The review of all 26 indexed Artifacts
product documentation pages is `docs/ARTIFACTS-REVIEW.md`.

The user wants a personalized GitHub-like workspace supporting Website Studio,
Amplifier, bounded agent runs, explicit selected context, and review. The source
implements the local workspace and adapters. Live cloud and agent verification
are unfinished. See the existing design rather than replacing its scope.

## Public backup boundary

The repository was public when this snapshot was uploaded. The Cloudflare
account ID and owner email have been replaced with placeholders in
`wrangler.jsonc`, deployment instructions, and the deployment receipt.
Set the actual values before deployment. The complete original private
configuration remains in the user's `artifacts-studio-v0.1.0.zip` attachment.
The private conversation handoff is `Artifacts-Studio-Handoff-2026-10-06.md`.
Neither credentials, user database contents, private Git history, account
screenshots, nor the unrelated Worker investigation evidence are published here.

The application source is based on local commit `96fcafb`; final documentation
corrections and this handoff were added for this backup. This is a clean source
snapshot, not a claim that the original local commit history was pushed.

## Latest Cloudflare state

- The user's screenshot showed Workers Paid as the current plan.
- A successful listing confirmed the user-created `artifacts-studio` namespace,
  jurisdiction `unrestricted`, with zero repositories.
- Repository creation then returned authentication error `10000`; uploading
  the Studio Worker returned “No access to the specified resource.”
- After the user reauthenticated, both Cloudflare connector actions failed
  before reaching the API with MCP `-32001`, “Unknown tool” for
  `cloudflare.execute` and `cloudflare.search`. This does not establish that
  the newly granted API permissions are wrong.
- No Studio Worker, repository, or hosted Studio URL was successfully created
  by the assistant. Recheck current state before mutations; the user may have
  acted since the last successful inventory.
- Dashboard fallback was rejected by the environment's browser security
  policy. Do not retry through another browser surface, raw CDP, or shell
  workaround. A restored Cloudflare connector is a separate permitted route.
- No Amplifier/runtime/provider, GitHub synchronization, or external memory
  service has been connected by this project.

The historical attempts in `docs/DEPLOYMENT-STATUS.json` are retained; its
`latest_observations` section records the later namespace and connection state.

## Next actions

1. Discover the current Cloudflare connection and attempt a small read. Handle
   tool errors before JSON parsing. If “Unknown tool” persists, state that
   precise blocker rather than diagnosing API permissions.
2. Verify the intended account, existing namespace, repositories, and Worker
   inventory. Inspect any same-name resource before modifying it.
3. Restore the private deployment values, then follow `DEPLOY.md`. Use the
   SQLite Durable Object variant with the native Artifacts binding. Keep
   routes/previews disabled until owner-only Access protects all traffic.
4. Verify signed-out/unauthorized access is blocked, owner access works,
   project/context records survive reload, task packets contain only selected
   context, and live Artifacts repository operations succeed.
5. Pair `bridge/runner.py` only when an authorized isolated runtime with Git,
   Amplifier, and model access is available. Follow `bridge/README.md` and
   demonstrate an actual run before claiming the connection is operational.

Private deployment was already authorized. The user is handling unrelated
Worker cleanup; do not delete Workers, routes, or tokens as part of this task.
Do not change global Amplifier configuration or ingest personal history.

## Verification and limits

The last implementation verification passed the build, 11 Node tests,
10 frontend smoke groups, and 16 Python bridge tests. These historical results
are recorded in `PROJECT_STATUS.md`; repeat relevant checks after code changes.
Frontend smoke uses a DOM stub and Artifacts fixtures. Browser rendering,
accessibility, Wrangler dry-run, real cloud CRUD/Git operations, and live
Amplifier/model runs remain unverified.

Review acceptance records a decision; it does not merge or deploy. GitHub is
a project link, not synchronization. Context is explicitly selected per project;
external memory retrieval is not connected. Runner-reported tests are attributed
evidence, not tests independently rerun by Studio. Separate Git clones are not
an OS sandbox. See the existing docs for the full boundaries.

## Suggested skills

- `executing-plans`: resume the existing implementation plan.
- `systematic-debugging`: investigate concrete connection/deployment failures.
- `verification-before-completion`: require actual evidence for new claims.
- `plugin-management`: discover the connection if currently unavailable.
- `library`: retrieve the user's private handoff/configuration ZIP when needed.
- `personal-context`: use only for missing history that these documents do not supply.

## New-conversation prompt

> @Cloudflare Continue amplifier-chipster6/cloudflare-artifacts-studio on main.
> Read docs/HANDOFF.md, verify the Cloudflare connection, and finish the existing
> private deployment. I am handling the unrelated Worker cleanup myself.
