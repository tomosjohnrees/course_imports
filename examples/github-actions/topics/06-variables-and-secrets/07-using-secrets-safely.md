# Using Secrets Safely

GitHub masks secrets in logs automatically, but there are several patterns you should follow to avoid accidental exposure.

## Pass Secrets Through Environment Variables

Always assign secrets to environment variables rather than interpolating them directly into shell commands. This avoids the secret appearing in process listings or shell history.

**Good:**
```yaml
- name: Deploy
  env:
    TOKEN: ${{ secrets.DEPLOY_TOKEN }}
  run: curl -H "Authorization: Bearer $TOKEN" https://api.example.com
```

**Bad:**
```yaml
- name: Deploy
  run: curl -H "Authorization: Bearer ${{ secrets.DEPLOY_TOKEN }}" https://api.example.com
```

The "bad" pattern still works and GitHub will still mask the value in logs, but intermediary process logs or error messages could leak the value in unexpected ways.

## Never Echo or Log Secrets

Even though GitHub masks known secret values, avoid deliberately printing them. Masking works by matching the exact secret string -- if you transform the secret (e.g., base64-encode it or reverse it), the transformed value will **not** be masked.

## Be Careful with Forks

By design, secrets are **not** available to workflows triggered by pull requests from forks. This prevents a malicious fork from adding a step that exfiltrates your secrets. If your workflow needs to run differently for fork PRs, check `github.event.pull_request.head.repo.fork`.

## Rotate Secrets Regularly

Treat secrets like any other credential: rotate them periodically and revoke access when team members leave. Updating a secret in the GitHub UI takes effect immediately for all subsequent workflow runs.
