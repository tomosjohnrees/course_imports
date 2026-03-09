# Uploading and Downloading Artifacts

Artifacts are files produced during a workflow run that you want to persist after the job completes. Common examples include compiled binaries, test reports, code coverage files, and log files.

GitHub Actions provides two complementary actions for working with artifacts:

- **`actions/upload-artifact`** saves files from a job so they can be downloaded later.
- **`actions/download-artifact`** retrieves files that were uploaded by an earlier job in the same workflow run.

## Why use artifacts?

By default, everything in a job's workspace is discarded when the job finishes. Artifacts let you:

- **Preserve build outputs** -- download a compiled binary or packaged application from the workflow run summary page.
- **Share files between jobs** -- one job builds the application, a later job deploys it.
- **Keep test reports and coverage data** -- inspect exactly what happened in a failed test run.

## Artifact retention

Artifacts are stored for a configurable retention period (the default is 90 days). You can set a shorter period with the `retention-days` input to save storage space for large artifacts you only need temporarily.

## Sharing artifacts between jobs

When one job needs the output of another, you upload the artifact in the first job and download it in the second. The second job must declare a `needs` dependency on the first to ensure it runs after the upload is complete.
