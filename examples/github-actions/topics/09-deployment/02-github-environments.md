# GitHub Environments

A **GitHub Environment** is a named deployment target — such as `staging`, `production`, or `preview` — that you configure in your repository settings. Environments give you three important capabilities:

1. **Protection rules** that control when and how deployments happen
2. **Environment-scoped secrets** that are only available to jobs targeting that environment
3. **A deployment history** visible on your repository's main page

## Creating an Environment

You create environments in your repository under **Settings > Environments > New environment**. Give it a descriptive name like `staging` or `production`. The name you choose here is what you reference in your workflow files.

## Protection Rules

Each environment can have one or more protection rules:

### Required Reviewers

You can require one or more people (or teams) to approve a deployment before it proceeds. When a workflow reaches a job that targets a protected environment, it pauses and creates a review request. The designated reviewers receive a notification and can approve or reject the deployment directly from the GitHub UI.

### Wait Timer

You can add a delay (up to 30 days) before a deployment starts. This is useful for staged rollouts where you want to wait and observe a canary deployment before promoting to the full fleet.

### Branch Restrictions

You can restrict which branches are allowed to deploy to an environment. For example, you might configure `production` so that only the `main` branch can deploy to it, preventing accidental production deployments from feature branches.

### Custom Deployment Protection Rules

GitHub also supports custom protection rules powered by GitHub Apps. These let you integrate external checks — such as a passing health check on a staging environment, or approval from an external change-management system — before a deployment proceeds.

## Environment Secrets and Variables

Secrets and variables can be scoped to a specific environment. This is important because different environments typically connect to different infrastructure:

- Your `staging` environment might use a staging database connection string
- Your `production` environment uses the production database credentials
- API keys, cloud credentials, and service URLs all vary per environment

Environment-level secrets override repository-level secrets of the same name when a job targets that environment. This means you can use the same secret name (like `DATABASE_URL`) in your workflow, and the correct value is injected automatically based on which environment the job runs against.

## Referencing an Environment in a Workflow

To target an environment from a workflow job, use the `environment` key:

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Deploy
        run: echo "Deploying to production"
```

When this job runs, it will:
1. Check the protection rules for the `production` environment
2. Wait for any required approvals or timers
3. Make environment-scoped secrets available to the job's steps
4. Record the deployment in the environment's history
