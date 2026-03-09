# Summary

Matrix strategies are one of the most powerful features in GitHub Actions for maintaining comprehensive CI pipelines without duplicating configuration.

## Key Takeaways

- **`strategy.matrix`** defines variables and their values; GitHub Actions creates a job for every combination.
- **Multi-dimensional matrices** multiply out to the Cartesian product of all variable values.
- **`exclude`** removes specific combinations you do not need.
- **`include`** adds extra combinations or attaches additional variables to existing ones.
- **`fail-fast`** (default: `true`) cancels remaining jobs when one fails; set it to `false` for full visibility.
- **`max-parallel`** limits how many matrix jobs run concurrently.
- **`matrix.*` context** lets you reference matrix values anywhere in your job -- step names, inputs, conditionals, and shell commands.

In the next topic, you will learn how to extract common workflow logic into **reusable workflows** -- another key technique for keeping your CI configuration maintainable as it grows.
