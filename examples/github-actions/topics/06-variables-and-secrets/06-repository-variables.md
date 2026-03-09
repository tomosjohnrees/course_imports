# Repository Variables

Not every configuration value is sensitive. For non-secret settings like deployment region names, feature flags, or application URLs, GitHub provides **repository variables** (also called configuration variables).

## How They Differ from Secrets

| | Secrets | Variables |
|---|---|---|
| Encrypted at rest | Yes | No |
| Masked in logs | Yes | No |
| Visible to repo admins | No (write-only) | Yes (readable) |
| Accessed via | `${{ secrets.NAME }}` | `${{ vars.NAME }}` |
| Use case | API keys, tokens, passwords | Region names, feature flags, URLs |

## Setting Up Variables

Variables are managed in the same section of the GitHub UI as secrets:

1. Navigate to **Settings > Secrets and variables > Actions**.
2. Select the **Variables** tab.
3. Click **New repository variable**.
4. Enter a name and value, then save.

Or use the GitHub CLI:

```
gh variable set DEPLOY_REGION --body "eu-west-1"
```

## When to Use Variables vs Secrets

Use a **variable** when the value is non-sensitive and you want it to be readable and auditable. Use a **secret** when the value would cause harm if exposed -- credentials, tokens, private keys, and similar sensitive data.

A good rule of thumb: if you would be comfortable posting the value in a public Slack channel, it can be a variable. If not, it should be a secret.
