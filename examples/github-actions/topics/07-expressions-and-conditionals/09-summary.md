# Summary

Expressions and conditionals transform static workflow definitions into dynamic, intelligent automation. Here is a recap of the key ideas from this topic.

**Expression syntax** uses `${{ }}` to evaluate values, call functions, and perform comparisons at runtime. Inside `if` fields, the `${{ }}` wrapper is optional.

**Operators** include `==`, `!=`, `<`, `>`, `<=`, `>=` for comparisons, and `&&`, `||`, `!` for logical operations. All comparisons use loose type coercion.

**The `if` conditional** can be applied to both jobs and steps. A job or step runs only when its `if` expression evaluates to a truthy value. Skipped jobs cascade -- downstream jobs that depend on a skipped job are also skipped by default.

**Status check functions** override default execution behavior:
- `success()` -- previous steps/jobs all passed (the default)
- `failure()` -- at least one previous step/job failed
- `always()` -- run regardless of outcome
- `cancelled()` -- the run was cancelled

**Type casting** follows loose rules. The most important thing to remember is that step outputs are always strings, so the string `'false'` is truthy. Always compare explicitly against `'true'` or `'false'`.

**Built-in functions** provide tools for string matching (`contains`, `startsWith`, `endsWith`), formatting (`format`, `join`), data conversion (`toJSON`, `fromJSON`), and cache key generation (`hashFiles`).

With these building blocks, you can write workflows that deploy only from specific branches, handle failures gracefully, generate dynamic matrices, and make nuanced decisions based on the full context of every workflow run.
