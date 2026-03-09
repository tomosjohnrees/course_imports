# Include and Exclude

Sometimes you need to fine-tune a matrix. You might want to skip a specific combination that is known to be unsupported, or add an extra combination that does not fit neatly into the Cartesian product. GitHub Actions provides two special keys for this: `include` and `exclude`.

## Excluding Combinations

The `exclude` key removes specific combinations from the generated matrix. Each entry in the `exclude` list specifies a set of variable values to skip.

For example, suppose Node.js 18 is not supported on the Windows runner in your project. You can exclude just that combination while keeping all other 8 jobs.

## Including Extra Combinations

The `include` key adds entries to the matrix. This is useful when you want an additional combination that falls outside the regular Cartesian product, or when you want to attach extra variables to a specific combination.

Each `include` entry can define values for existing matrix variables (to match a specific combination) and add new variables that only apply to that combination.
