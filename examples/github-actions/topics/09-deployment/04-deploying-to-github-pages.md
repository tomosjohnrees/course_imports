# Deploying to GitHub Pages

GitHub Pages is a free static hosting service built into GitHub. It is an excellent fit for documentation sites, blogs, single-page applications, and project landing pages. GitHub Actions can build and deploy your site to Pages automatically on every push.

## How Pages Deployment Works

Modern GitHub Pages deployment uses a two-step process:

1. **Build** — your workflow generates static files and uploads them as an artefact using the `actions/upload-pages-artifact` action
2. **Deploy** — a separate job uses `actions/deploy-pages` to publish the artefact to the Pages infrastructure

This approach gives you full control over the build process. You can use any static site generator — Jekyll, Hugo, Astro, Next.js, VitePress, or a plain HTML folder.

## Required Setup

Before your workflow can deploy to Pages, you need to configure two things in your repository settings:

1. **Pages source** — go to **Settings > Pages** and set the source to **GitHub Actions** (instead of "Deploy from a branch")
2. **Permissions** — the workflow needs `pages: write` and `id-token: write` permissions. The `id-token` permission is required because Pages deployment uses OIDC (OpenID Connect) for secure authentication.

## Understanding the Workflow

The Pages deployment workflow has a few notable details:

- The `permissions` block at the top grants the minimum permissions needed for Pages deployment
- The `concurrency` block ensures only one Pages deployment runs at a time (more on concurrency later in this topic)
- The build job uploads the output using `actions/upload-pages-artifact`, which packages the files in the format Pages expects
- The deploy job runs in the `github-pages` environment, which GitHub creates automatically for Pages-enabled repositories
- The deploy job outputs the live URL, which appears in the workflow run summary
