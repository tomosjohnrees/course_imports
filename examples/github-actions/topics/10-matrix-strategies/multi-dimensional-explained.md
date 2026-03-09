Notice that the `runs-on` value is now `${{ matrix.os }}` rather than a hardcoded runner label. Each generated job gets its own unique combination of OS and Node.js version:

| Job | OS | Node.js |
|-----|-----|---------|
| 1 | ubuntu-latest | 18 |
| 2 | ubuntu-latest | 20 |
| 3 | ubuntu-latest | 22 |
| 4 | macos-latest | 18 |
| 5 | macos-latest | 20 |
| 6 | macos-latest | 22 |
| 7 | windows-latest | 18 |
| 8 | windows-latest | 20 |
| 9 | windows-latest | 22 |

You can add as many dimensions as you need. Each additional variable multiplies the total number of jobs, so be thoughtful about the combinations you create -- a matrix with four variables of three values each produces 81 jobs.
