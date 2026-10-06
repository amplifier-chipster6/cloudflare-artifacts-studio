# Private deployment of the v0.1 application

Deployment is a future qualification gate; this documentation branch does not deploy the app. Read the [roadmap](docs/ROADMAP.md), [architecture](docs/ARCHITECTURE.md), and [verification strategy](docs/VERIFICATION.md) first. Uploading today's code does not implement the proposed Artifacts record writer, memory port, or final-candidate verifier.

Before deploying, replace `YOUR_CLOUDFLARE_ACCOUNT_ID` and `owner@example.com` in `wrangler.jsonc` with your account ID and authorized owner email. This public backup retains Worker name `artifacts-studio` and namespace `artifacts-studio`; private account values were removed. It uses SQLite Durable Object storage, so no separate D1 database ID is needed. No credentials are included.

Historical state: the local application and controlled tests were delivered. A successful listing confirmed an unrestricted `artifacts-studio` namespace. Repository creation and Worker upload failed; after reauthentication, a connector returned “Unknown tool” before reaching Cloudflare. These historical failures do not diagnose current permissions. There is no verified hosted Studio URL or live Amplifier connection. Recheck current inventory and permissions before a future authorized deployment; preserve the [deployment history](docs/DEPLOYMENT-STATUS.json).

## Use the workspace locally

Extract the archive and open a terminal in its `artifacts-studio` folder. Node.js 24 or newer is required.

```bash
node build.mjs
node server.mjs
```

The first command bundles the interface and schema. The second starts the app at `http://127.0.0.1:8787` and stores records in `data/studio.sqlite`. Stop it with Ctrl+C. Keep this local server on loopback; its local owner identity is not suitable for public hosting.

## Upload through your own Cloudflare login

Run these explicit commands in the extracted project folder:

```bash
npx --yes wrangler@4.145.0 login
npx --yes wrangler@4.145.0 deploy --config wrangler.jsonc
```

`npx` downloads the example pinned CLI without a global installation; `--yes` accepts the download prompt. Qualify that exact project-local version and generated binding types against current Artifacts documentation first. `login` opens Cloudflare authorization. `deploy` builds/uploads this Worker and declares its SQLite Durable Object migration and native Artifacts binding. Choose namespace jurisdiction explicitly before creation; implicit unrestricted creation is unsuitable for a required locality policy.

The initial configuration leaves `workers.dev` and previews disabled. Upload success alone does not make the Studio usable. If upload fails, keep the complete error text and stop here; neither the paid plan nor this package guarantees permission to deploy.

## Configure private access, then enable the URL

1. In Cloudflare, open **Workers & Pages → artifacts-studio → Access → Protect this Worker behind Access**. Choose **All traffic**.
2. Use an Access allow policy for your actual owner email (the public template uses `owner@example.com` as a placeholder). If the initial dialog only offers account membership or email domains, finish the policy configuration in Zero Trust → Access → Applications and restrict the allow rule to that exact email. The app also independently requires that owner email. Do not add a bypass or protect previews only.
3. After Access is attached, change only `"workers_dev": false` to `"workers_dev": true` in `wrangler.jsonc`. Leave `preview_urls` false. Run the same `deploy --config wrangler.jsonc` command again. Open the URL printed by Wrangler and sign in with the owner email.

The code refuses owner requests when verified Access identity is absent; it does not trust a caller-supplied email header. Static files are bundled in the Worker itself because the documented Static Assets router does not propagate `ctx.access` to user code. This app uses HTTP rather than WebSockets.

## Verify the first usable cloud workspace

1. Confirm a signed-out/private browser window requires login and an unauthorized identity cannot access the workspace.
2. Create a project and context item; reload and confirm both persist.
3. Create an Artifacts repository from Repositories and link it to that project. An empty repository has no commit history until an initial Git commit is pushed.
4. Create a task with selected context and download its packet. Confirm it contains only those selected entries.

Keep agent execution disconnected until the separate runner is configured. These checks demonstrate a private planning/repository workspace, not a complete live agent platform.

## Pair Amplifier separately

Use [bridge guidance](bridge/README.md) for the current adapter and [execution architecture](docs/EXECUTION-ADAPTER.md) for the proposed Unified/Converge qualification. Actual host invocation, loaded composition, OS isolation, and custody must be qualified. No command above installs or changes the host or its global bundles.

Create a random runner secret in your secret manager. Set the Worker secret interactively:

```bash
npx --yes wrangler@4.145.0 secret put RUNNER_TOKEN --config wrangler.jsonc
```

`secret put` prompts for the value and stores it as a Worker secret. Set the same value in the runner process environment, outside agent checkouts. Use a distinct Access service token and an appropriate service-token policy for the runner; pass its client ID and secret only through the runner environment. Do not paste secrets into chat, task text, Git URLs, or source files.

Configure the runner URL, exact Artifacts account hostname, installed Amplifier command, permitted provider environment variables, and project test commands. Its `--check` mode validates local configuration only. Its `--execute` mode runs queued assignments and therefore requires a deliberately provisioned isolated runtime. Demonstrate a real run before treating the connection as operational.

GitHub synchronization, automatic memory retrieval, integration/merge, and production website deployment are not implemented in v0.1. Review acceptance records a decision; it does not merge or deploy.

## References

- [Artifacts binding and required Wrangler version](https://developers.cloudflare.com/artifacts/api/workers-binding/)
- [Worker-level Access and ctx.access](https://developers.cloudflare.com/workers/configuration/cloudflare-access/)
- [Workers.dev route configuration](https://developers.cloudflare.com/workers/configuration/routing/workers-dev/)

Reviewed October 6, 2026. The full product documentation review is in `docs/ARTIFACTS-REVIEW.md`.
