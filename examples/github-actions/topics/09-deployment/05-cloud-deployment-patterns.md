# Deploying to Cloud Providers

Most production applications run on cloud platforms like AWS, Google Cloud, Azure, or services like Fly.io, Railway, and Vercel. While the specifics differ between providers, the deployment pattern in GitHub Actions follows a consistent structure.

## The General Pattern

Every cloud deployment workflow has three phases:

1. **Authenticate** — prove to the cloud provider that this workflow is authorised to deploy
2. **Build / prepare** — produce the deployable artefact (a Docker image, a zip file, compiled binaries, etc.)
3. **Deploy** — push the artefact to the provider and trigger the rollout

## Authentication Approaches

There are two common ways to authenticate with cloud providers from GitHub Actions:

### Static Credentials (Secrets)

Store a cloud provider's access key and secret key as GitHub repository or environment secrets, then reference them in your workflow. This is the simplest approach but requires rotating credentials manually.

### OpenID Connect (OIDC) -- Recommended

OIDC lets your workflow request a short-lived token directly from the cloud provider, with no long-lived secrets stored in GitHub. The cloud provider trusts GitHub's identity token, and you configure which repositories and branches are allowed to assume a deployment role.

OIDC is supported by AWS, Google Cloud, Azure, and a growing number of other providers. It is the recommended approach because:

- No long-lived credentials to leak or rotate
- You can restrict access by repository, branch, and environment
- Tokens expire automatically after the job finishes

## Example: Deploying a Docker Image

The following workflow demonstrates a common cloud deployment pattern. It builds a Docker image, pushes it to a container registry, and then deploys it. The specifics of the final deployment step vary by provider, but the overall structure is the same.

## Adapting for Your Provider

The key differences between providers come down to:

| Concern | What Changes |
|---------|-------------|
| **Authentication action** | AWS uses `aws-actions/configure-aws-credentials`, Google Cloud uses `google-github-actions/auth`, Azure uses `azure/login` |
| **Registry** | AWS ECR, Google Artifact Registry, Azure Container Registry, Docker Hub |
| **Deploy command** | AWS ECS task update, `gcloud run deploy`, `az webapp deploy`, Kubernetes `kubectl apply` |

The structure of the workflow -- authenticate, build, push, deploy -- stays the same regardless of where you are deploying.

## Tips for Cloud Deployments

- **Use environment-scoped secrets** so staging and production deploy to different cloud accounts or projects
- **Pin action versions** to a full commit SHA for security-critical authentication actions
- **Use OIDC** whenever the provider supports it -- it is strictly more secure than static credentials
- **Add a health check step** after deployment to verify the new version is responding correctly
