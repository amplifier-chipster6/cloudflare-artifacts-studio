# Security and context boundaries

Status: repository guidance; proposed execution boundaries still require qualification.

Do not post secrets or private memory in public issues, logs, examples, or pull requests. Use GitHub private vulnerability reporting if enabled; otherwise contact the repository owner through an available private channel. No private reporting endpoint is assumed configured.

The local server listens on loopback and supplies a local owner identity. It is for a trusted operator's machine. Cloud deployment must fail closed on verified Access identity and protect all production/preview routes. Runner authentication is separate; where needed, add an Access service-token policy.

Artifacts Git tokens scope an entire repository. Separate record, packet, worker, and verifier repositories/credentials where different writers need different authority. Use the minimum permissions and token lifetime required; revoke and rotate after a run. Keep account API credentials server-side. Never serialize token secrets, authenticated remote URLs, or lease secrets.

Generated code requires constrained OS execution and a verifier protected from the worker. Forks, directories, and a `--sandbox` flag are not evidence of OS isolation. Do not expose production secrets to workers, untrusted tests, or previews.

Context release follows [context policy](docs/CONTEXT-POLICY.md). Memory deletion and residency follow [data lifecycle](docs/DATA-LIFECYCLE.md). Before retrying ambiguous integration or deployment, follow [operations](docs/OPERATIONS.md).

The current v0.1 bridge and adapters do not yet implement every proposed trust boundary; [status](PROJECT_STATUS.md) and [verification](docs/VERIFICATION.md) describe those limits.
