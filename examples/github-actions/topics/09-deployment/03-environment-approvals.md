# Deployment Workflows with Environment Approvals

A common deployment pattern is to promote code through a series of environments: first to `staging` for verification, then to `production` after approval. GitHub Environments and job dependencies make this straightforward.

## The Promotion Pattern

The workflow below demonstrates a realistic deployment pipeline:

1. **Build and test** — compile the application and run the test suite
2. **Deploy to staging** — automatically deploy to the staging environment
3. **Deploy to production** — deploy to production, but only after a reviewer approves

Each phase is a separate job. The `needs` keyword ensures they run in order, and the `environment` keyword on the production job triggers the approval gate.

## How Approvals Work in Practice

When the workflow reaches the `deploy-production` job, GitHub pauses execution and shows a yellow "Waiting" badge. The required reviewers see a notification (via email and the GitHub UI) with a link to review. They can:

- **Approve** — the deployment proceeds immediately
- **Reject** — the workflow run is cancelled
- **Leave a comment** — provide context for their decision

The approval request includes a link to the workflow run so reviewers can inspect test results and build artefacts before deciding.

## Environment URLs

You can set a `url` on the environment to link directly to the deployed application. This is especially useful for reviewers — they can click through from the approval screen to verify the staging deployment before promoting to production.

```yaml
environment:
  name: staging
  url: https://staging.example.com
```

The URL appears on the repository's main page alongside the deployment status.
