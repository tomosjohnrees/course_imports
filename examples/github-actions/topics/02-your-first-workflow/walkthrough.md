# Walkthrough: Building the Hello World Workflow

Let's build a complete workflow step by step. We will create a file called `hello.yml` that runs every time you push to the `main` branch.

## Step 1: Create the File

Create the workflows directory and open a new file:

```bash
mkdir -p .github/workflows
touch .github/workflows/hello.yml
```

## Step 2: Add the Name and Trigger

Start with the workflow name and trigger. We will trigger on pushes to `main` and also add `workflow_dispatch` so you can run it manually from the GitHub UI:

```yaml
name: Hello World

on:
  push:
    branches:
      - main
  workflow_dispatch:
```

The `workflow_dispatch` trigger adds a "Run workflow" button in the Actions tab -- handy for testing.

## Step 3: Define a Job

Add a job called `greet` that runs on the latest Ubuntu runner:

```yaml
jobs:
  greet:
    runs-on: ubuntu-latest
```

## Step 4: Add Steps

Inside the job, add steps that run shell commands:

```yaml
    steps:
      - name: Say hello
        run: echo "Hello, World!"

      - name: Print the date
        run: date

      - name: Show runner info
        run: |
          echo "OS: $RUNNER_OS"
          echo "Arch: $RUNNER_ARCH"
          echo "GitHub Actor: $GITHUB_ACTOR"
```

Notice the `|` (pipe) character on the last step. This is YAML's **block scalar** syntax -- it lets you write multiple lines of shell commands as a single `run` value.

## Step 5: Commit and Push

```bash
git add .github/workflows/hello.yml
git commit -m "Add hello world workflow"
git push
```

As soon as the push reaches GitHub, the workflow triggers automatically.
