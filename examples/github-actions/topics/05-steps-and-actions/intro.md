# Steps and Actions

In the previous topic, you learned about jobs and the runners that execute them. Now it is time to look inside a job and understand the building blocks that do the actual work: **steps**.

Every job contains an ordered list of steps, defined under the `steps` key. Steps run sequentially, top to bottom, on the same runner. Because they share a machine, one step can produce files or set environment variables that later steps consume.

Each step does one of two things:

1. **Runs a shell command** using the `run` keyword
2. **Uses a pre-built action** using the `uses` keyword

This distinction -- `run` versus `uses` -- is the most important concept in this topic. Shell commands give you complete flexibility; actions give you reusable, community-tested building blocks that save you from writing everything from scratch.

By the end of this topic you will know how to combine shell commands with actions from the GitHub Marketplace to build powerful, readable workflow steps.
