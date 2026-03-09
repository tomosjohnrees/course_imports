## Dependency Review and Supply Chain Security

Your workflows do not run in isolation -- they install and execute third-party packages. A single compromised dependency can give an attacker access to your build environment, secrets, and deployment targets.

### Dependency review

GitHub provides a **dependency review** action that checks pull requests for newly introduced dependencies with known vulnerabilities. It runs against the GitHub Advisory Database and can block merges that introduce critical or high-severity issues.

### How it works

The dependency review action compares the dependency manifests (e.g., `package-lock.json`, `Gemfile.lock`, `requirements.txt`) between the base branch and the pull request branch. It flags:

- Dependencies with known CVEs (Common Vulnerabilities and Exposures)
- Dependencies with restrictive or incompatible licences
- New dependencies that have not been reviewed

### Additional supply chain protections

**Enable Dependabot alerts** to receive notifications about vulnerable dependencies in your repository.

**Use Dependabot version updates** to automatically receive pull requests that update dependencies to patched versions.

**Lock file integrity:** Always commit lock files and verify their integrity in CI. A tampered lock file can redirect package resolution to malicious sources.

**Use `npm ci` instead of `npm install`** (or the equivalent in your package manager). The `ci` command installs from the lock file exactly and fails if the lock file is out of sync with `package.json`, preventing unexpected package resolution.

**Audit your dependencies** regularly using tools like `npm audit`, `pip-audit`, or `bundler-audit` as part of your CI pipeline.
