This workflow demonstrates several best practices:

1. **Broad coverage with `fail-fast: false`** -- All 9 combinations run to completion so you can see exactly which environments pass or fail.
2. **Targeted extras with `include`** -- Code coverage is only generated on one combination (Ubuntu + Node.js 22) to avoid redundant work and save runner minutes.
3. **Conditional steps** -- Linting runs only once (on Ubuntu with the latest Node.js) rather than 9 times, since lint results do not vary across environments.
4. **Dependency caching** -- The `cache: npm` option on `actions/setup-node` speeds up installs across all matrix jobs.

This pattern scales well. As you add new Node.js versions or operating systems, the matrix automatically expands without duplicating any workflow logic.
