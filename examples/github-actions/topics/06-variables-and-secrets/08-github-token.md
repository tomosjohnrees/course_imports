# The GITHUB_TOKEN

Every workflow run automatically receives a special token called `GITHUB_TOKEN`. You do not need to create or configure it -- GitHub generates a unique one for each run and revokes it when the run completes.

## What It Can Do

The `GITHUB_TOKEN` grants access to the repository where the workflow runs. Common uses include:

- Pushing commits or tags back to the repository
- Creating or commenting on issues and pull requests
- Publishing packages to GitHub Packages
- Creating releases
- Interacting with the GitHub API for the current repository

## How to Use It

The token is available through the `secrets` context as `${{ secrets.GITHUB_TOKEN }}` or through the `github` context as `${{ github.token }}`. Many official actions accept it automatically.

## Permissions

By default, the `GITHUB_TOKEN` has broad read/write access to the repository. You can restrict its permissions using the `permissions` key at the workflow or job level. This follows the principle of least privilege -- only grant the access your workflow actually needs.

## Why Restrict Permissions?

A compromised or buggy step with an overly-permissive token could modify code, delete branches, or publish packages. Explicitly declaring narrow permissions limits the blast radius of any such issue.
