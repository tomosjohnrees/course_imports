## Common Security Risks in CI/CD Pipelines

Before diving into mitigations, it helps to understand what can go wrong. CI/CD pipelines face several categories of risk:

### Supply chain attacks

Third-party actions are code that runs inside your workflow with full access to your repository and secrets. If an action's maintainer account is compromised, or if a malicious update is pushed to a tag you reference, your pipeline could be silently subverted.

### Secret exposure

Secrets can leak through log output, error messages, environment variable dumps, or artifacts uploaded by workflows. Even well-intentioned debugging steps like `env` or `printenv` can accidentally reveal credentials.

### Script injection

When workflow expressions like `${{ github.event.pull_request.title }}` are interpolated directly into `run:` shell commands, an attacker can craft a pull request title that executes arbitrary code in your runner.

### Excessive permissions

By default, the `GITHUB_TOKEN` may have broad read/write access to your repository. Workflows that do not restrict these permissions give attackers a larger blast radius if a step is compromised.

### Compromised runners

Self-hosted runners persist between jobs unless configured otherwise. A malicious job can leave behind backdoors, modified tools, or tampered environment variables that affect subsequent jobs.

### Dependency confusion

Attackers can publish packages with names matching internal packages to public registries. If your build resolves the public package instead of your private one, malicious code executes during installation.
