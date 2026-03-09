# Type Casting and Truthiness

GitHub Actions expressions use **loose type comparison**, which means values are coerced to a common type before being compared. Understanding these rules prevents subtle bugs where a condition evaluates differently than you expect.

## Type Coercion Rules

When comparing values of different types, GitHub Actions converts them according to these rules:

| From       | To Number | To String  | To Boolean |
| ---------- | --------- | ---------- | ---------- |
| `null`     | `0`       | `''`       | `false`    |
| `true`     | `1`       | `'true'`   | `true`     |
| `false`    | `0`       | `'false'`  | `false`    |
| `''`       | `0`       | `''`       | `false`    |
| `'any string'` | `0` (unless valid number) | unchanged | `true` |
| `0`        | `0`       | `'0'`      | `false`    |
| `1`        | `1`       | `'1'`      | `true`     |
| `NaN`      | `NaN`     | `'NaN'`    | `false`    |

## Truthiness in `if` Conditions

When an expression is used in an `if` field, GitHub Actions coerces the result to a boolean. The following values are **falsy** (evaluate to `false`):

- `false`
- `0`
- `-0`
- `''` (empty string)
- `null`
- `NaN`

Everything else is **truthy**, including:

- `'false'` (the string, not the boolean -- this is a common trap)
- `'0'` (the string)
- `[]` (empty arrays)
- `{}` (empty objects)

## A Common Pitfall

Step outputs are always strings. If a step sets an output to `false`, the downstream step receives the string `'false'`, which is **truthy**. This catches many people:

```yaml
- name: Check condition
  id: check
  run: echo "should_deploy=false" >> $GITHUB_OUTPUT

# This step WILL run, because 'false' (the string) is truthy!
- name: Deploy
  if: steps.check.outputs.should_deploy
  run: ./deploy.sh
```

The fix is to compare explicitly against the string:

```yaml
- name: Deploy
  if: steps.check.outputs.should_deploy == 'true'
  run: ./deploy.sh
```

Always use explicit string comparisons with step outputs rather than relying on truthiness.
