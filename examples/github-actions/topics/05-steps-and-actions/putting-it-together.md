# Putting It All Together

Now that you understand `run` steps, `uses` steps, inputs, outputs, and working directories, let's see how they combine in a realistic workflow.

The following workflow demonstrates a typical CI pipeline for a Node.js project. It checks out the code, sets up Node.js with dependency caching, installs dependencies, runs a linter, runs tests, and uploads the build output as an artifact.

Notice how the steps flow logically: each step builds on what the previous one set up. The checkout action makes the code available. The setup-node action installs the runtime and restores cached dependencies. Then the `run` steps handle the project-specific commands.

This pattern -- checkout, setup, install, build, test -- is the backbone of most CI workflows regardless of the programming language. Swap `actions/setup-node` for `actions/setup-python` or `actions/setup-java`, change the shell commands, and the structure stays the same.

## Key Takeaways

- Start most jobs with `actions/checkout@v4` to get your code onto the runner.
- Use `setup-*` actions to install language runtimes rather than scripting the installation yourself.
- Pass configuration to actions with `with` and capture their output with `id`.
- Use multi-line `run` blocks for related commands that should run together.
- Set `working-directory` when your commands need to run from a subdirectory.
- Give steps descriptive `name` values -- your future self will thank you when debugging a failed run at midnight.
