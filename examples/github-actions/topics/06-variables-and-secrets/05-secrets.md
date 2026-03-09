# Repository Secrets

Secrets store sensitive values -- API keys, deployment credentials, signing certificates -- that your workflows need but that should never appear in your source code or logs.

## How Secrets Work

1. You add a secret through the GitHub UI (Settings > Secrets and variables > Actions) or via the GitHub CLI.
2. GitHub encrypts the secret at rest using a libsodium sealed box.
3. In your workflow, you access the secret through the `secrets` context: `${{ secrets.MY_SECRET }}`.
4. GitHub automatically redacts any secret value from workflow logs, replacing it with `***`.

## Adding a Secret

In the GitHub UI:

1. Navigate to your repository's **Settings** tab.
2. In the left sidebar, click **Secrets and variables**, then **Actions**.
3. Click **New repository secret**.
4. Enter a name (e.g., `DEPLOY_TOKEN`) and paste the value.
5. Click **Add secret**.

You can also use the GitHub CLI:

```
gh secret set DEPLOY_TOKEN --body "your-token-value"
```

## Secret Naming Rules

- Names can only contain alphanumeric characters and underscores.
- Names cannot start with `GITHUB_` (that prefix is reserved).
- Names are not case-sensitive, but uppercase with underscores is the convention (e.g., `AWS_ACCESS_KEY_ID`).

## Scope

Secrets can be scoped at three levels:

- **Repository secrets** are available to all workflows in a single repository.
- **Environment secrets** are tied to a deployment environment (e.g., `production`) and can require approval before use.
- **Organisation secrets** can be shared across multiple repositories in an organisation, with configurable access policies.
