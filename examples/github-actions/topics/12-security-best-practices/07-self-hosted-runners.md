## Securing Self-Hosted Runners

Self-hosted runners give you control over hardware, software, and network access, but they introduce security responsibilities that GitHub-hosted runners handle for you.

### Why self-hosted runners are riskier

GitHub-hosted runners are ephemeral: each job gets a fresh virtual machine that is destroyed after the job completes. Self-hosted runners, by default, are **persistent**. This means:

- A malicious workflow can install backdoors that survive between jobs
- Secrets from one job may be accessible to the next job on the same runner
- Tools or dependencies can be tampered with
- File system artifacts from previous jobs may be accessible

### Key hardening practices

**Use ephemeral runners.** Configure self-hosted runners to run in `--ephemeral` mode, or use container-based solutions (like Actions Runner Controller for Kubernetes) that spin up fresh runner instances for each job and destroy them afterwards.

**Never use self-hosted runners with public repositories.** Anyone can submit a pull request to a public repository and trigger workflows. This effectively gives untrusted users arbitrary code execution on your runner hardware.

**Isolate at the network level.** Run self-hosted runners in a dedicated network segment. Limit their access to only the resources they need -- do not place them on your production network.

**Keep runners updated.** The runner application itself receives security updates. Use automatic updates or have a process to apply them promptly.

**Limit repository access.** Assign runners to specific repositories or use runner groups to control which workflows can use which runners. Avoid organisation-wide shared runners unless necessary.

**Clean up after each job.** If you cannot use ephemeral runners, configure post-job cleanup scripts to remove temporary files, credentials, and environment changes.
