## OpenID Connect (OIDC) for Cloud Deployments

Traditionally, workflows that deploy to cloud providers (AWS, Azure, GCP) store long-lived credentials as repository secrets. This creates risk: if those secrets are leaked, an attacker has persistent access to your cloud environment.

### The problem with stored credentials

Long-lived access keys:

- Never expire unless manually rotated
- Are shared across all workflow runs
- Can be exfiltrated if a workflow step is compromised
- Are difficult to audit (who used them and when?)

### How OIDC solves this

With OIDC, your workflow does not store any cloud credentials at all. Instead:

1. The workflow requests a short-lived **OIDC token** from GitHub
2. GitHub signs the token with claims about the workflow (repository, branch, actor, etc.)
3. The workflow presents this token to your cloud provider
4. The cloud provider verifies the token against GitHub's OIDC endpoint
5. If the claims match a trust policy, the cloud provider issues temporary credentials
6. The temporary credentials expire after the job finishes

The result: no secrets to leak, no keys to rotate, and every authentication event is logged on both sides.

### Setting up OIDC

The setup has two sides:

**Cloud provider side:** Configure a trust relationship that accepts tokens from GitHub's OIDC provider (`https://token.actions.githubusercontent.com`). You specify which repositories, branches, or environments are allowed to assume the role.

**Workflow side:** Request the `id-token: write` permission and use the cloud provider's official login action.
