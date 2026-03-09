# What Is GitHub Actions?

GitHub Actions is a CI/CD and automation platform built directly into GitHub. It lets you automate tasks in response to events that happen in your repository — a push, a pull request, a new issue, a scheduled time, or even a manual button click.

Instead of configuring a separate CI server like Jenkins or CircleCI and wiring it up to your repository, GitHub Actions runs right where your code already lives. Your automation configuration is version-controlled alongside your source code, reviewed in pull requests, and executed on GitHub-hosted (or self-hosted) machines.

## Why Does It Matter?

Before GitHub Actions, setting up continuous integration typically meant:

- Choosing and hosting a CI server
- Configuring webhooks between GitHub and that server
- Managing credentials and access across two separate systems
- Maintaining infrastructure for build agents

GitHub Actions eliminates this friction. With a single YAML file committed to your repository, you can:

- **Run tests** automatically on every push or pull request
- **Build and package** your application for deployment
- **Deploy** to cloud providers, container registries, or static hosting
- **Automate project management** — label issues, greet new contributors, enforce PR conventions
- **Schedule maintenance tasks** like dependency updates or stale issue cleanup

Because it is a first-party GitHub feature, Actions has deep integration with the rest of the platform: pull request checks, deployment environments, repository secrets, and the entire GitHub ecosystem of over 20,000 community-built actions in the GitHub Marketplace.
