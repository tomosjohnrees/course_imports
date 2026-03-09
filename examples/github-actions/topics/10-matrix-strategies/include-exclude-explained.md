In this workflow:

- The `exclude` block removes the `windows-latest + Node.js 18` combination, reducing the total from 9 to 8 jobs.
- The `include` block matches the existing `ubuntu-latest + Node.js 22` combination and attaches two extra variables: `experimental` and `coverage`. These variables are only available in that specific job instance.
- The "Upload coverage" step uses `if: matrix.coverage == true` to run conditionally -- it only executes for the job where `coverage` was set via `include`.

If an `include` entry does not match any existing combination (i.e., it specifies variable values that are not part of the Cartesian product), it is added as a brand-new job in the matrix.
