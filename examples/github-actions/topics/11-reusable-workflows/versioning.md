# Versioning Reusable Workflows and Actions

Versioning is critical when sharing workflows and actions across repositories. Without proper versioning, a breaking change in a shared workflow can cascade across every repository that uses it.

## Versioning with Git Tags

The standard approach is to use **semantic versioning** with Git tags:

```bash
git tag -a v1.0.0 -m "Initial stable release"
git push origin v1.0.0
```

Consumers reference a specific version:

```yaml
uses: my-org/shared-workflows/.github/workflows/build.yml@v1.0.0
```

## Major Version Tags

A common convention is to maintain a **floating major version tag** (e.g., `v1`) that always points to the latest patch within that major version. This lets consumers opt in to bug fixes without changing their reference:

```yaml
# Pinned to exact version — maximum stability
uses: my-org/shared-workflows/.github/workflows/build.yml@v1.2.3

# Floating major version — gets bug fixes automatically
uses: my-org/shared-workflows/.github/workflows/build.yml@v1
```

To update a major version tag:

```bash
git tag -fa v1 -m "Update v1 to v1.2.3"
git push origin v1 --force
```

## Pinning to a Commit SHA

For maximum security, pin to the full commit SHA:

```yaml
uses: my-org/shared-workflows/.github/workflows/build.yml@a1b2c3d4e5f6...
```

This guarantees the exact code that runs will never change, even if someone force-pushes a tag. This is recommended for third-party actions (see Topic 12 on security).

## Breaking Changes

When making breaking changes (removing inputs, changing behaviour), **always** create a new major version. Document the migration path in your repository's release notes.
