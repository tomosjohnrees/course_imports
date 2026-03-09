# Accessing Matrix Values in Steps

Matrix variables are available through the `matrix` context. You can use them anywhere that accepts expressions:

- **Step names:** `name: Test on ${{ matrix.os }}`
- **Input values:** `node-version: ${{ matrix.node-version }}`
- **Conditional logic:** `if: matrix.os == 'ubuntu-latest'`
- **Run commands:** `run: echo "Testing on ${{ matrix.os }}"`
- **Environment variables:** `env: NODE_VERSION: ${{ matrix.node-version }}`

This makes matrices very flexible. You can customise any part of a job based on the current combination.

## Conditional Steps Based on Matrix Values

A common pattern is to run certain steps only for specific matrix combinations. For example, you might want to upload test coverage only from the Ubuntu job, or run additional linting only on the latest Node.js version.

```yaml
- name: Upload coverage
  if: matrix.os == 'ubuntu-latest' && matrix.node-version == 22
  run: npx coveralls
```

This keeps your workflow DRY while still allowing per-combination customisation.
