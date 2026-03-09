# Running Shell Commands

The simplest kind of step uses the `run` keyword to execute a shell command directly on the runner. If you can type it into a terminal, you can put it in a `run` step.

## Single-Line Commands

A single-line `run` step looks like this:

```yaml
- name: Print a greeting
  run: echo "Hello from GitHub Actions"
```

The `name` field is optional but strongly recommended. It appears in the GitHub Actions UI and makes it much easier to identify what each step is doing when you are debugging a failed workflow.

## Multi-Line Commands

Real workflows often need more than a one-liner. YAML provides the pipe character (`|`) to write multi-line strings. Each line runs as a separate command in the same shell session:

```yaml
- name: Build the project
  run: |
    echo "Installing dependencies..."
    npm install
    echo "Running build..."
    npm run build
```

This is equivalent to typing each line into the terminal one after another. If any command in the block fails (exits with a non-zero status), the step fails and subsequent commands are not executed.

## Choosing a Shell

By default, `run` steps use `bash` on Linux and macOS runners, and `pwsh` (PowerShell Core) on Windows runners. You can override this with the `shell` key:

```yaml
- name: Run a Python script inline
  shell: python
  run: |
    import os
    print("Repository:", os.environ.get("GITHUB_REPOSITORY"))
```

Common shell options include `bash`, `sh`, `pwsh`, `python`, and `cmd` (Windows only).

## Working Directory

By default, commands run in the root of the workspace directory (`$GITHUB_WORKSPACE`), which is where your repository code ends up after checkout. If your project has subdirectories, you can change where a command runs using `working-directory`:

```yaml
- name: Run tests in the backend folder
  working-directory: ./backend
  run: npm test
```

This is cleaner than prefixing every command with `cd backend &&`. You can also set a default working directory for all `run` steps in a job using `defaults.run.working-directory` at the job level.
