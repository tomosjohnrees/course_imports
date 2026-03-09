# Basic Matrix Configuration

A matrix is defined inside a job's `strategy` block using the `matrix` key. Each key under `matrix` becomes a variable that you can reference in steps using `${{ matrix.<key> }}`.

Consider a Node.js project that needs to be tested against multiple versions. Instead of writing three separate jobs, you define a single job with a matrix.
