# Artifacts Studio implementation plan

Goal: deliver a usable private workspace with durable project/task/context records and real Artifacts integration.

1. Implement owner/runner access boundaries and D1 schema. Test unauthenticated and cross-origin rejection.
2. Implement project, context and task APIs plus scoped task packets. Test durable CRUD, project isolation, validation and escaped output.
3. Implement the Artifacts adapter and repository UI. Handle missing bindings/service failures explicitly. Test token stripping and request contracts.
4. Implement run queue, atomic claim, leases, reports and exact-head review. Test duplicate claims, stale reports and disconnected-runner blocking.
5. Build responsive interface from API contracts in DESIGN.md; UI owner works only in public/.
6. Build outbound bridge and instructions without changing any global installation. Verify its CLI against official Amplifier sources; never execute unverified commands.
7. Run API tests using Node's SQLite D1 adapter, syntax checks and static UI checks. Independent review. Package and private deployment with owner-only Access.

Review focus: authorization bypass; secret leakage; stale run acceptance; cross-project context; unsafe implied merges/deployments.
