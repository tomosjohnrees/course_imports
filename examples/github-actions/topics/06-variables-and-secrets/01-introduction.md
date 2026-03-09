# Variables and Secrets

Every non-trivial workflow needs configuration: a Node version to install, a Docker registry to push to, an API key to authenticate with. Hard-coding these values directly into workflow YAML creates brittle, insecure pipelines that are difficult to maintain.

GitHub Actions provides a layered system for managing configuration:

- **Environment variables** let you pass values to the shell commands your steps run.
- **GitHub contexts** give you structured access to information about the workflow run, the repository, the runner, and more.
- **Repository variables** store non-sensitive configuration that you can change without editing workflow files.
- **Secrets** store sensitive values like API keys and tokens, encrypted at rest and masked in logs.

This topic covers each layer, starting from the simplest (inline environment variables) and building up to the most secure (encrypted secrets and the automatic `GITHUB_TOKEN`).
