# Vision

Status: proposed architecture, authored 2026-10-06. Owner: project steward; ratification belongs to the operator.

Artifacts Studio is a personal workspace for turning an idea into defined work, agent-produced code, reviewed results, and a durable account of what happened. It becomes the engineering foundation of Website Studio: assess a website, capture goals and requirements, select context, assign implementation and testing, review against acceptance criteria, and explicitly deliver the accepted result.

The first project is modernization and personalization of the operator's **amplifier-unified** fork. It is a pilot of this engineering loop, not a mandate to rebuild Unified. The [bounded pilot](PILOT.md) deliberately starts with one native, discoverable personalization seam. A second website project later tests whether the workflow transfers without project-specific machinery.

## Product loop

1. Save a project goal, repository, intended delivery path, and stage.
2. Define a versioned task, allowed changes, acceptance criteria, and one or two assignments.
3. Select and freeze context; show what will leave the workspace.
4. Run Amplifier in constrained working environments with clear custody.
5. Build a proposed candidate and independently check its exact Git identity.
6. Record the operator's decision and, through separate actions, integration and deployment.
7. Preserve the evidence, journal, and handoff for another session.

Artifacts is the primary durable foundation. Git repositories hold authoritative authored records, selected packets, code proposals, and receipts. Operational SQL provides coordination and views; the memory system derives reusable, cited knowledge. Unified retains its native conversations and execution history. These roles avoid conflicting versions of a task or decision.

Human authority remains explicit. Agent suggestions, passing tests, acceptance, merging, and deployment are different events. Memory cannot infer approval. Agents receive the smallest useful, explicitly chosen context. Secrets and the operator's complete personal history do not become ordinary project records.

## Progressive development

Reuse an existing capability first; configure it where possible; compose qualified parts; extend only a demonstrated gap. Converge supplies a development workflow, and the project-local Cloudflare bundle supplies relevant specialist guidance. Their availability is qualified against pinned host versions rather than assumed from repository activity.

Success means that a new session can reconstruct the project's intent and evidence, run a bounded task, assess a reproducible candidate, and understand the next authorized action. Feature quantity and release frequency do not establish this outcome.

See [architecture](ARCHITECTURE.md), [ownership](INTEGRATION-OWNERSHIP.md), [roadmap](ROADMAP.md), and [sources](SOURCES.md). The current v0.1 app remains the implementation baseline; the new record foundation and live Amplifier execution are not yet demonstrated.
