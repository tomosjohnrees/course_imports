In this example:

- `fail-fast: false` means that if the `ubuntu-latest + Node.js 20` job fails, the other 8 jobs will continue running. You will see results for every combination.
- `max-parallel: 3` means that at most 3 of the 9 matrix jobs will run at the same time. The remaining jobs queue and start as earlier jobs finish.

These two options are independent -- you can use either one alone or both together. When omitted, `fail-fast` defaults to `true` and `max-parallel` has no limit (all jobs run simultaneously).
