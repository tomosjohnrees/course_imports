# Summary

You now have two powerful tools for eliminating duplication in your CI/CD pipelines:

- **Reusable workflows** for sharing entire job definitions across repositories. Use `workflow_call` to define them, and `uses` at the job level to call them.
- **Composite actions** for bundling sequences of steps into portable, reusable units. Define them with `action.yml` and `runs.using: "composite"`.

Both approaches support inputs, outputs, and versioning. Choose reusable workflows when you need a complete, self-contained pipeline. Choose composite actions when you need reusable step logic that runs within an existing job.

In the next topic, you will learn how to secure your workflows and protect against supply chain attacks — including how versioning and action pinning play a role in security.
