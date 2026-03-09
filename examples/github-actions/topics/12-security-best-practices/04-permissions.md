## Permissions and Least Privilege

Every workflow run receives a `GITHUB_TOKEN` that authenticates API calls and Git operations against your repository. By default, this token can have broad permissions. Restricting those permissions limits the damage an attacker can do if a step is compromised.

### Setting restrictive defaults

At the organisation or repository level, you can configure the default `GITHUB_TOKEN` permissions to be read-only. This is the single most impactful security setting you can change.

Go to **Settings > Actions > General > Workflow permissions** and select **Read repository contents only**.

### Declaring permissions in workflows

Use the top-level `permissions` key to declare exactly what your workflow needs. If you do not specify `permissions`, the token inherits the repository default.

A restrictive starting point is:

```yaml
permissions: {}
```

This grants the token **no** permissions at all. You then add back only what each job requires.

### Job-level permissions

You can also set permissions at the job level, which overrides the workflow-level setting for that specific job. This is useful when different jobs need different access.

### Available permission scopes

Some commonly used scopes include:

| Scope | Purpose |
|-------|---------|
| `contents: read` | Clone the repository |
| `contents: write` | Push commits or tags |
| `pull-requests: write` | Post PR comments or reviews |
| `packages: write` | Publish to GitHub Packages |
| `issues: write` | Create or update issues |
| `id-token: write` | Request an OIDC token for cloud auth |
| `security-events: write` | Upload code scanning results |

Each scope can be set to `read`, `write`, or omitted entirely (no access).
