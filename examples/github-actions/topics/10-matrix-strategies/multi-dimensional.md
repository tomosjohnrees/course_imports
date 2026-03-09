# Multi-Dimensional Matrices

The real power of matrices appears when you add multiple variables. GitHub Actions generates a job for every combination across all variables — the Cartesian product.

For example, if you want to test your project on three Node.js versions across three operating systems, you add an `os` variable alongside the `node-version` variable. This produces 3 x 3 = 9 jobs from just a few lines of configuration.
