# Product and existing UX

**Source/contract:** Converge is a workspace for an intent steward to set direction while a manager session derives and carries out bounded work. It already includes the app the person opens beside that work. See [README.md](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/README.md#L44) and [README.md](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/README.md#L184).

## Information architecture

| Surface | Existing responsibility | Source / governing promise |
|---|---|---|
| Home | Manager sessions sorted by what needs the person's word; counts, lane capacity, brief and liveness | [contracts/experience.v1.md](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/contracts/experience.v1.md#L17) |
| Direction | Repository documents, an All view, Reading / Changes / Review / History, proposals and evidence | [contracts/experience-direction.v1.md](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/contracts/experience-direction.v1.md#L25) |
| Operation | Objective, limits, waves, lane states, return brief, confidence narrative, throughput and feedback | [contracts/experience-operation.v1.md](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/contracts/experience-operation.v1.md#L25) |
| Manager Console | Pane beside either place; embeds the actual tmux session; lane watch reuses it | [contracts/experience-console.v1.md](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/contracts/experience-console.v1.md#L26) |

The product's anchor is a **manager session**, which may register multiple repositories and queues. Home is the entry list; Direction and Operation are the two primary places. Conversation is a modality, with the console as a pane. This is an architectural constraint when adopting Converge, rather than an incidental visual style.

## Decisions and actions

The umbrella names five conceptual writes: answer with a word, change priority, drop feedback, steer, ask for a proposal. The actual HTTP API has additional routes for authentication, personal reading, document edits, locking, presence, terminal input and collaboration. “Five writes” does **not** mean exactly five POST endpoints. The kit classifies these against cited exemptions and reports debt: [conformance/experience/README.md](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/conformance/experience/README.md#L79).

Answer words are ratified, ratified with edits, declined and later. Priority records a request for the manager; it does not directly reorder the work tracker. Steering changes lane width and records intent; it does not itself launch workers. Asking creates a candidate, with agent drafting off by default. See [API](API-REFERENCE.md) and [data](DATA-AND-PROVENANCE.md).

## Contract promise versus inspected behavior

The Direction contract calls for rich Markdown, diagrams, safe HTML, source access, sentence-level changes, scoped asks and restore from history. Source provides document payloads and corresponding controls/routes. The Markdown renderer uses CommonMark with tables and `html: False`; this review did not establish rendered Mermaid/DOT or embedded HTML parity. Claims of complete rich rendering require representative browser evidence: [app/data.py](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/app/data.py#L140).

The responsive browser/PWA body has templates, CSS, client modules, offline behavior and rendered tests. Android, iOS, macOS and Windows have draft platform contracts, but their native bodies are not shipped in this tree: [conformance/README.md](https://github.com/microsoft/amplifier-bundle-converge/blob/41679679fd449ecc16b6af58d0ce8ec2cb2d29ad/conformance/README.md#L18). A desktop PWA window is not evidence of a native macOS application.

The console passes literal input to a terminal. It does not maintain a second chat or independently ratify. Manager execution and the app can run independently; installing a behavior does not launch the UI.
