# Matrix Strategies

When you build software, you rarely target a single environment. Your application might need to run on multiple operating systems, against several versions of a language runtime, or with different dependency configurations. Testing every combination manually — or maintaining a separate job for each one — quickly becomes unwieldy.

GitHub Actions solves this with **matrix strategies**. A matrix lets you define a set of variables and their possible values. GitHub Actions then automatically creates a job for every combination of those values, running them in parallel by default.

## When to Use a Matrix

Matrix strategies are the right tool whenever you need to repeat the same job across varying configurations:

- **Language versions** — test your library against Node.js 18, 20, and 22
- **Operating systems** — verify your CLI tool works on Ubuntu, macOS, and Windows
- **Dependency variations** — run your test suite with both PostgreSQL 14 and 15
- **Build targets** — compile for `x86_64` and `arm64` architectures
- **Multi-dimensional combinations** — test Node.js 18, 20, and 22 on all three operating systems (9 jobs from 6 lines of configuration)

Without a matrix, you would duplicate the entire job block for each configuration, violating DRY principles and making maintenance painful. With a matrix, you define the job once and let GitHub Actions expand it.
