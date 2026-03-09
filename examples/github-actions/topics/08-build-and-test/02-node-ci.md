# CI for Node.js Projects

Most Node.js projects use npm or yarn to manage dependencies and define test scripts. A typical CI workflow for a Node.js project installs dependencies, runs the linter (if configured), and executes the test suite.

The key steps are:

1. **Check out the code** using `actions/checkout`.
2. **Set up Node.js** using `actions/setup-node`, which lets you specify the version and can automatically cache your package manager's dependency directory.
3. **Install dependencies** with `npm ci` (which ensures a clean, reproducible install from `package-lock.json`).
4. **Run tests** with `npm test`.

The workflow below demonstrates a production-ready Node.js CI setup. Notice that `actions/setup-node` accepts a `cache` option -- setting it to `'npm'` automatically caches the global npm cache directory between runs, so subsequent installs are significantly faster.
