Here is what each section does:

- **`name: CI`** — A human-readable label for the workflow. It appears in the Actions tab on GitHub.
- **`on:`** — Declares the **events** that trigger this workflow: pushes and pull requests targeting the `main` branch.
- **`jobs:`** — Contains all the **jobs** in this workflow. Here there is one job called `build`.
- **`runs-on: ubuntu-latest`** — Specifies the **runner**: a GitHub-hosted Ubuntu machine.
- **`steps:`** — The ordered list of **steps** the job will execute.
- **`uses: actions/checkout@v4`** — A step that calls a reusable **action** to clone your repository onto the runner.
- **`run: echo "Running tests..."`** — A step that runs a shell command directly.

Even in this tiny example, all six core concepts are present: a **workflow** file responds to **events**, defines a **job** running on a **runner**, which executes **steps** that use both **actions** and shell commands.
