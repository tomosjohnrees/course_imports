# Build Status Badges

A build status badge is a small image you can add to your repository's README that shows whether your CI workflow is currently passing or failing. It gives contributors and users an at-a-glance indicator of project health.

## Adding a badge

GitHub automatically generates badge URLs for every workflow. The URL format is:

```
https://github.com/{owner}/{repo}/actions/workflows/{workflow-file}/badge.svg
```

For example, if your repository is `octocat/my-project` and your workflow file is `ci.yml`, the badge URL would be:

```
https://github.com/octocat/my-project/actions/workflows/ci.yml/badge.svg
```

To display it in your README, use a standard Markdown image link:

```markdown
![CI](https://github.com/octocat/my-project/actions/workflows/ci.yml/badge.svg)
```

## Branch-specific badges

By default, the badge shows the status of the default branch. You can target a specific branch by adding a `branch` query parameter:

```
https://github.com/octocat/my-project/actions/workflows/ci.yml/badge.svg?branch=develop
```

This is useful for monorepos or projects that maintain multiple active branches.

## Finding your badge URL

The easiest way to find the badge URL is from the GitHub UI:

1. Go to the **Actions** tab of your repository.
2. Select the workflow you want a badge for.
3. Click the **"..."** menu (top right) and select **"Create status badge"**.
4. Copy the Markdown snippet and paste it into your README.
