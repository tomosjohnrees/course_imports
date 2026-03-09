# Putting It All Together

The workflow below combines everything covered in this topic into a single, production-ready CI pipeline for a Node.js project. It:

- Triggers on pushes and pull requests to the main branch.
- Caches npm dependencies using the built-in `setup-node` cache.
- Runs the linter, test suite, and build step.
- Uploads the build output as an artifact.
- Writes a job summary with the outcome.

This pattern is a solid starting point. In later topics you will learn how to extend it with matrix strategies (to test across multiple Node.js versions) and reusable workflows (to share CI logic across repositories).
