# Release Workflows Triggered by Tags

Not every project deploys on every push to `main`. Many teams prefer a **tag-based release** model: when you are ready to release, you create a Git tag (like `v1.2.0`), and the tag triggers a workflow that builds, publishes, and optionally deploys the release.

## Why Use Tags for Releases?

- **Explicit versioning** -- tags map directly to semantic version numbers
- **Decoupled from branch activity** -- merging to `main` does not automatically trigger a deployment
- **Clear audit trail** -- you can see exactly which commit each release corresponds to
- **GitHub Releases integration** -- tagged releases appear on your repository's Releases page with changelogs and downloadable assets

## Triggering on Tags

To trigger a workflow when a tag is pushed, use a `push` event with a `tags` filter:

```yaml
on:
  push:
    tags:
      - 'v*'
```

This triggers on any tag starting with `v` -- matching `v1.0.0`, `v2.3.1-beta`, and so on. You can be more specific with patterns like `v[0-9]+.[0-9]+.[0-9]+` to match only strict semver tags.

## Extracting the Version Number

Inside the workflow, you can extract the tag name from the `GITHUB_REF` environment variable:

```yaml
- name: Get version from tag
  id: version
  run: echo "VERSION=${GITHUB_REF#refs/tags/}" >> "$GITHUB_OUTPUT"
```

This strips the `refs/tags/` prefix, leaving just the tag name (e.g., `v1.2.0`). You can then reference it in later steps as `${{ steps.version.outputs.VERSION }}`.

## Creating a GitHub Release

The workflow below demonstrates a complete release pipeline: it builds the project, creates a GitHub Release with automatically generated release notes, and uploads build artefacts as downloadable assets. This pattern works well for libraries, CLI tools, and any project where users download specific versions.

## The Release Creation Step

The `gh release create` command (GitHub CLI) is the simplest way to create a release from a workflow. The `--generate-notes` flag automatically produces release notes from the merged pull requests and commits since the previous tag.
