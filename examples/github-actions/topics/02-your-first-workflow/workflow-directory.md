# The Workflows Directory

GitHub Actions looks for workflow files in one specific location inside your repository:

```
.github/workflows/
```

Any YAML file (`.yml` or `.yaml`) placed in this directory is treated as a workflow definition. You can have as many workflow files as you like -- each one is an independent workflow.

## Creating the Directory

If your repository does not already have this directory, create it:

```bash
mkdir -p .github/workflows
```

The `-p` flag creates both `.github` and `workflows` in one command if they do not exist yet.

## Naming Your Workflow File

The file name is up to you. Common conventions include:

- `ci.yml` -- for continuous integration
- `deploy.yml` -- for deployment
- `lint.yml` -- for code quality checks
- `hello.yml` -- for learning purposes (what we will use here)

The file name does not affect how the workflow behaves; GitHub uses the `name` field inside the file as the display name.
