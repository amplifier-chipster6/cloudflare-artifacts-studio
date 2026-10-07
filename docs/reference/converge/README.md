# Converge source reference

Reviewed through the GitHub connector on 2026-10-07 (UTC). Repository: **microsoft/amplifier-bundle-converge**, fixed commit **41679679fd449ecc16b6af58d0ce8ec2cb2d29ad**. This is a source reference for Artifacts Studio and Website Studio, not a new upstream specification or an implemented integration.

**Converge ships a web application as well as a development method and agent bundle.** Its existing Direction, Operation, manager-console, document-review and Git-host collaboration functions substantially overlap the Studio proposal. The prior description of Converge as only a development-workflow candidate was incomplete. Read [Studio reuse and gaps](STUDIO-REUSE-AND-GAPS.md) before approving duplicate implementation.

## Reading order

| Need | Reference |
|---|---|
| Understand the product and its existing screens | [Product and UX](PRODUCT-AND-UX.md) |
| Find every repository component | [Repository map](REPOSITORY-MAP.md) |
| Understand agent composition and execution | [Bundle and runtime](BUNDLE-AND-RUNTIME.md) |
| Trace the shipped web application | [App architecture](APP-ARCHITECTURE.md), [API reference](API-REFERENCE.md) |
| Find record owners and persistence locations | [Data and provenance](DATA-AND-PROVENANCE.md) |
| Understand contracts and amendment guards | [Contracts and guards](CONTRACTS-AND-GUARDS.md) |
| Understand the newer collaborative integration path | [Collaboration and packages](COLLABORATION-AND-PACKAGES.md) |
| Assess Cloudflare hosting and access constraints | [Security and hosting](SECURITY-AND-HOSTING.md) |
| Distinguish tests from actual runtime evidence | [Verification](VERIFICATION.md) |
| Avoid unnecessary provider usage and duplicate work | [Cost and limits](COST-AND-LIMITS.md) |
| Identify disagreements and unresolved assumptions | [Drift and open questions](DRIFT-AND-OPEN-QUESTIONS.md) |
| Audit what was actually covered | [Snapshot and coverage](SNAPSHOT-AND-COVERAGE.md) |
| Refresh the knowledge without repeating this review | [Maintenance](MAINTENANCE.md) |

## Evidence and offline use

[FACTS.json](FACTS.json) contains stable REF-CVG claim IDs and source spans. These identify review knowledge, not upstream ledger rows or native task IDs. [source-inventory.json](source-inventory.json) indexes all **752** upstream files. [symbol-index.json](symbol-index.json) indexes Python symbols, Markdown headings and route declarations. [verification-results.json](verification-results.json) preserves fresh offline results.

A byte-verified local cache contains **672 text files** at `source/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/` beneath this directory. It includes upstream license notices. The cache is Git-ignored; the curated pages, indexes and results can be versioned without copying the entire upstream repository. To hand over the complete local source evidence, also provide that cache directory. Reading these pages and the indexes requires no GitHub call.

Selected upstream excerpts retain their [attribution and license notice](NOTICE.md).

Evidence labels used here: **contract** = a promise; **source** = inspected implementation; **historical** = an upstream recorded result; **executed here** = a check run in this review; **proposal** = our integration recommendation. A source function or passing fixture does not establish a live agent, hosted application or model-compliant workflow.

Binaries were inventoried, not viewed; third-party minified xterm code/CSS were not audited. Detailed semantic review focused on the product, composition, writes, authority and integration seams. Acquisition and structural indexing are explicitly distinguished from that review.
