# Sharing Across Repositories

Once you have reusable workflows or composite actions that work well, you will want to share them across your organisation. There are several patterns for this.

## Dedicated Shared Repository

The most common approach is a central repository (e.g., `my-org/shared-workflows`) that contains all your reusable workflows and composite actions. Other repositories reference them by their full path:

```yaml
# Reusable workflow from shared repo
uses: my-org/shared-workflows/.github/workflows/build.yml@v2

# Composite action from shared repo
uses: my-org/shared-actions/setup-node-project@v1
```

## Repository Visibility

- **Public repositories** — anyone can use your reusable workflows and actions.
- **Internal repositories** (GitHub Enterprise) — available to all repositories in the same organisation.
- **Private repositories** — only accessible within the same repository. To share private reusable workflows, you must explicitly allow access in the repository's Actions settings.

## Monorepo Actions

You can also keep composite actions inside the consuming repository under `.github/actions/`:

```
.github/
├── actions/
│   ├── setup-node-project/
│   │   └── action.yml
│   └── deploy-preview/
│       └── action.yml
└── workflows/
    └── ci.yml
```

This is useful when the action is tightly coupled to the project and not worth extracting to a separate repository.
