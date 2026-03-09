# Self-Hosted Runners

While GitHub-hosted runners cover the majority of use cases, some teams need more control. **Self-hosted runners** are machines that you manage yourself and register with GitHub to pick up workflow jobs.

## When to Use Self-Hosted Runners

- **Specialised hardware** -- you need GPUs, ARM processors, or large amounts of RAM that hosted runners do not offer
- **On-premises requirements** -- your builds must access internal networks, databases, or services behind a firewall
- **Cost optimisation** -- for high-volume repositories, running your own infrastructure can be cheaper than consuming hosted runner minutes
- **Persistent environments** -- you want to keep build caches, Docker images, or other artefacts on disk between runs

## Configuring a Self-Hosted Runner

To use a self-hosted runner in a workflow, you apply custom **labels** in the `runs-on` field:

```yaml
jobs:
  build:
    runs-on: [self-hosted, linux, x64]
    steps:
      - uses: actions/checkout@v4
      - run: make build
```

Labels are assigned when you register the runner. Common labels include the operating system (`linux`, `windows`, `macos`), architecture (`x64`, `arm64`), and any custom tags you define (such as `gpu` or `production`).

## Trade-offs

| | GitHub-Hosted | Self-Hosted |
|---|---|---|
| **Setup** | Zero config | You install and maintain the agent |
| **Isolation** | Fresh VM every job | Shared environment (unless you add your own isolation) |
| **Cost** | Per-minute billing | Your own infrastructure costs |
| **Network** | Public internet only | Can access private networks |
| **Maintenance** | Managed by GitHub | You handle OS updates, security patches |

For most teams starting out, GitHub-hosted runners are the right choice. Consider self-hosted runners when you have a concrete need that hosted runners cannot satisfy.
