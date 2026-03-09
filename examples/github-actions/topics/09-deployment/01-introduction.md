# Continuous Deployment with GitHub Actions

So far in this course you have learned how to build and test your code automatically. The natural next step is **deployment** — getting your tested code running in an environment where users can access it.

**Continuous Deployment (CD)** extends your CI pipeline so that every change that passes tests is automatically delivered to one or more target environments. When done well, CD gives you:

- **Faster feedback loops** — changes reach users in minutes rather than days
- **Smaller, safer releases** — deploying frequently means each release contains fewer changes, making issues easier to diagnose
- **Reduced manual work** — no more "deployment Fridays" where someone follows a checklist of manual steps
- **Reproducibility** — every deployment follows the exact same automated process

## CI vs CD

It is helpful to distinguish between three related terms:

- **Continuous Integration (CI)** — automatically building and testing code on every push. You covered this in the previous topic.
- **Continuous Delivery** — automatically preparing code for release so it *can* be deployed at the push of a button. The deployment itself may still require manual approval.
- **Continuous Deployment** — automatically deploying every change that passes the full pipeline, with no human intervention required.

GitHub Actions supports all three models. You choose where to draw the line between automation and manual control using **environments** and **protection rules**, which you will learn about next.

## What You Will Learn

In this topic you will:

1. Configure GitHub Environments with protection rules and environment-scoped secrets
2. Build deployment workflows that require manual approvals before promoting to production
3. Deploy a static site to GitHub Pages
4. Understand common patterns for deploying to cloud providers
5. Create release workflows triggered by Git tags
6. Use concurrency controls to prevent overlapping deployments
