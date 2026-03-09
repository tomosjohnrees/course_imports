# Operators

Expressions support the standard comparison and logical operators you would expect from a programming language, plus a few quirks specific to GitHub Actions.

## Comparison Operators

| Operator | Meaning                  | Example                              |
| -------- | ------------------------ | ------------------------------------ |
| `==`     | Equal to                 | `github.ref == 'refs/heads/main'`    |
| `!=`     | Not equal to             | `github.actor != 'dependabot[bot]'`  |
| `<`      | Less than                | `github.run_attempt < 3`             |
| `>`      | Greater than             | `steps.test.outputs.coverage > 80`   |
| `<=`     | Less than or equal to    | `matrix.node-version <= 18`          |
| `>=`     | Greater than or equal to | `github.event.pull_request.additions >= 500` |

Comparisons are **not type-strict**. GitHub Actions coerces types before comparing. The string `'1'` equals the number `1`. This loose comparison is important to keep in mind when working with outputs from steps, which are always strings.

## Logical Operators

| Operator | Meaning | Example                                            |
| -------- | ------- | -------------------------------------------------- |
| `&&`     | AND     | `github.ref == 'refs/heads/main' && github.event_name == 'push'` |
| `\|\|`  | OR      | `github.event_name == 'push' \|\| github.event_name == 'workflow_dispatch'` |
| `!`      | NOT     | `!contains(github.event.head_commit.message, '[skip ci]')` |

You can group sub-expressions with parentheses to control evaluation order:

```yaml
if: (github.event_name == 'push' && github.ref == 'refs/heads/main') || github.event_name == 'workflow_dispatch'
```

## The Not Operator

The `!` operator deserves special mention. It flips the truthiness of its operand. Combined with functions, it becomes a powerful filter:

```yaml
# Run only when the commit message does NOT contain '[skip ci]'
if: "!contains(github.event.head_commit.message, '[skip ci]')"
```

Note the quotes around the expression. When an `if` value starts with `!`, YAML can misinterpret it. Wrapping the expression in quotes avoids parsing errors.
