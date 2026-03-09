# Controlling Execution: fail-fast and max-parallel

By default, GitHub Actions runs all matrix jobs in parallel and uses a behaviour called **fail-fast**: if any single job in the matrix fails, all other in-progress jobs are cancelled immediately. This is often what you want -- if tests fail on Node.js 20, there is little point waiting for the Node.js 18 and 22 jobs to finish.

However, you can change both of these defaults.

## Disabling fail-fast

Set `fail-fast: false` to let every matrix job run to completion, regardless of whether other jobs fail. This is useful when you want to see the full picture -- for example, which specific OS and version combinations are broken.

## Limiting Parallelism

Set `max-parallel` to control how many matrix jobs run at the same time. This is useful when your jobs consume expensive resources (like deployment slots or API rate limits) and you need to throttle concurrency.
