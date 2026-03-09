# Triggers and Events

Every GitHub Actions workflow begins with the `on` keyword. This keyword defines **when** a workflow runs by specifying one or more **events** that trigger it.

An event is something that happens in or to your GitHub repository -- a push, a pull request being opened, a release being published, or even a scheduled timer going off. When the event occurs, GitHub checks whether any workflow files match that event and, if so, starts running them.

Understanding triggers is essential because they give you precise control over your CI/CD pipeline. You can run tests only when code changes, deploy only when a release is tagged, or generate reports on a nightly schedule -- all by choosing the right event configuration.

## What you will learn

In this topic you will learn how to:

- Use `push` and `pull_request` events with branch and path filters
- Schedule workflows with cron syntax
- Create manual triggers using `workflow_dispatch` with custom inputs
- Respond to other repository events like releases and issues
- Combine multiple triggers in a single workflow
