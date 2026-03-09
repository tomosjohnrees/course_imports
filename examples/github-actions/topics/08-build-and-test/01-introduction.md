# Build and Test with GitHub Actions

Continuous Integration (CI) is the practice of automatically building and testing your code every time a change is pushed to the repository. GitHub Actions makes this straightforward -- you define your build and test steps in a workflow file, and GitHub runs them on every push or pull request.

A well-configured CI pipeline catches bugs early, before they reach your main branch. It gives every contributor immediate feedback on whether their changes work, and it gives maintainers confidence that merging a pull request will not break the project.

## What you will learn

In this topic you will learn how to:

- Set up CI pipelines for Node.js and Python projects
- Run tests automatically and interpret the results
- Cache dependencies so builds run faster
- Upload and download build artifacts
- Add a build status badge to your repository README
- Work with test reports to surface results directly in pull requests
