# Reusable Workflows and Composite Actions

As your organisation adopts GitHub Actions, you will quickly notice that different repositories end up with nearly identical workflow files. A Node.js team might copy-paste the same "install, lint, test, build" pipeline into every new service. When a security patch changes the required Node version, someone has to update dozens of files by hand.

This topic tackles that problem head-on. You will learn two complementary strategies for sharing CI/CD logic:

- **Reusable workflows** -- entire workflow files that other workflows can call like a function.
- **Composite actions** -- lightweight, portable bundles of steps you package as a custom action.

Both techniques follow the **DRY principle** (Don't Repeat Yourself). Instead of duplicating YAML across repositories, you define the logic once and reference it everywhere. When you need to make a change, you update a single source of truth and every consumer picks it up.

By the end of this topic you will be able to create, version, and share reusable workflows and composite actions across multiple repositories.
