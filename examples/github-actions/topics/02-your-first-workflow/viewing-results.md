# Viewing Workflow Results

After pushing your workflow, head to your repository on GitHub and follow these steps to see it in action.

## Finding the Actions Tab

Click the **Actions** tab at the top of your repository page. This is the central dashboard for all workflow activity.

You will see a list of workflow runs. Each entry shows:

- The **workflow name** (from the `name` field in your YAML file)
- The **commit message** that triggered the run
- The **status**: a yellow dot for in-progress, a green check for success, or a red cross for failure
- The **duration** of the run

## Inspecting a Run

Click on any workflow run to see its details. You will see:

1. **Jobs** -- listed on the left side. Click a job name to expand it.
2. **Steps** -- each step appears as a collapsible section within the job. Click a step to view its log output.

For our Hello World workflow, you should see three steps under the `greet` job:

- **Say hello** -- showing `Hello, World!`
- **Print the date** -- showing the current date and time on the runner
- **Show runner info** -- displaying the operating system, architecture, and your GitHub username

## Re-running a Workflow

You can re-run any workflow directly from the Actions tab. Click into a workflow run and use the **Re-run all jobs** button in the top-right corner. This is useful when a failure was caused by a temporary issue rather than a code problem.

## Manual Triggers

Because we included `workflow_dispatch` in our trigger configuration, you can also start the workflow manually. Go to the Actions tab, select the "Hello World" workflow from the left sidebar, and click **Run workflow**. You can choose which branch to run it on.

This is particularly useful during development when you want to test changes to your workflow without creating a new commit each time.
