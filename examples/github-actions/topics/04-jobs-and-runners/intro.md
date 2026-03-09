# Jobs and Runners

A GitHub Actions workflow is made up of one or more **jobs**. Each job is a set of steps that execute on the same runner. By default, jobs run **in parallel** -- but you can create dependencies between them to enforce a specific order.

A **runner** is the machine that executes your job. GitHub provides hosted runners with common operating systems pre-installed, or you can register your own self-hosted runners for specialised workloads.

Understanding how to structure jobs and choose the right runners is key to building efficient, reliable CI/CD pipelines. In this topic you will learn:

- How to define and configure jobs within a workflow
- The different GitHub-hosted runners available to you
- When and why you might use self-hosted runners
- How to create dependencies between jobs using `needs`
- How to pass data between jobs using outputs
