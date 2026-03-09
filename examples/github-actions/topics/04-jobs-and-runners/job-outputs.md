# Job Outputs and Sharing Data Between Jobs

Since each job runs on a fresh runner, there is no shared filesystem between jobs. To pass information from one job to another, you use **job outputs**.

## How Job Outputs Work

The mechanism has two parts:

1. **A step sets an output** by writing to the special `$GITHUB_OUTPUT` file.
2. **The job declares which step outputs to expose** in its `outputs` map.
3. **A downstream job reads the output** using the `needs` context.

This gives you a clean, explicit data flow between jobs. Only values you deliberately expose are available to downstream jobs.

## When to Use Job Outputs

Job outputs are ideal for passing small pieces of information:

- A version number computed during the build
- A boolean flag indicating whether a deployment is needed
- A URL or identifier for a resource created during an earlier job
- The result of a validation check

For larger artefacts like compiled binaries or test reports, use the `actions/upload-artifact` and `actions/download-artifact` actions instead. These store files that can be downloaded by other jobs in the same workflow run.
