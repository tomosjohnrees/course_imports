# CI for Python Projects

Python CI workflows follow a similar pattern to Node.js but use `pip` for dependency management and tools like `pytest` for testing.

The key steps are:

1. **Check out the code** with `actions/checkout`.
2. **Set up Python** using `actions/setup-python`, specifying the version you need.
3. **Install dependencies** from your `requirements.txt` file.
4. **Run tests** using `pytest` or your preferred test runner.

The workflow below shows a complete Python CI setup. It installs dependencies, runs a linter with `flake8`, and then runs the test suite with `pytest`. The `--tb=short` flag gives concise tracebacks for any failures, making the logs easier to read in the GitHub Actions UI.
