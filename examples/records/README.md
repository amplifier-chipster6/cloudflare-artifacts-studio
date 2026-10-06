# Inert record examples

All JSON files here are **synthetic examples**, not real projects, model runs, trusted test results, operator approvals, merges, or deployments. Repeated-letter Git SHAs and example repository/session IDs are intentional placeholders.

The sixteen examples form one linked graph: project/milestone/task/criterion/assignment → selected context manifest → run/contribution → candidate/verification/review → integration/deployment, with journal/handoff continuity.

[The ingestion example](../ingestion/task.json) adds a post-commit source envelope to an authored task. Its record digest matches the exact example file bytes; remote commit/blob identities are synthetic.

Run `npm run check:docs` for shape, link, graph, digest, and negative-case checks. Read [schema limitations](../../schemas/README.md) before treating these shapes as a production contract.
