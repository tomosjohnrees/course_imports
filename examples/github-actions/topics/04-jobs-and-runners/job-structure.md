# Job Structure and Configuration

Every job in a workflow lives under the top-level `jobs` key. Each job has a unique **job ID** (the YAML key you choose) and a set of properties that control where and how it runs.

## The Basics

At minimum, a job needs:

- **`runs-on`** -- which runner to use
- **`steps`** -- the list of things to do

The job ID becomes important when other jobs reference it (for example, as a dependency). Choose descriptive IDs like `build`, `test`, or `deploy` rather than generic names like `job1`.

## Common Job Properties

| Property | Purpose |
|---|---|
| `runs-on` | Specifies the runner environment |
| `steps` | The ordered list of steps to execute |
| `needs` | Declares dependencies on other jobs |
| `if` | Conditional expression to skip or run the job |
| `env` | Environment variables available to all steps |
| `timeout-minutes` | Maximum run time before the job is cancelled |
| `strategy` | Matrix or other execution strategy |
| `outputs` | Values to expose to downstream jobs |
| `permissions` | Fine-grained token permissions for the job |
| `concurrency` | Controls concurrent execution |

Each job starts with a **fresh runner instance**. No files, environment variables, or processes carry over from one job to another unless you explicitly share data between them.
