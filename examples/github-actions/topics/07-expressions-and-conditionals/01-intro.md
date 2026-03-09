# Expressions and Conditionals

So far, every step and job in your workflows has run unconditionally. Push code, and every job fires; every step executes in order. That works for simple pipelines, but real-world automation needs decisions: skip deployment on a draft pull request, only notify on failure, run a cleanup step regardless of whether earlier steps succeeded.

GitHub Actions provides two features that unlock this control:

1. **Expressions** — a mini-language embedded in workflow YAML that lets you reference context values, call functions, and evaluate conditions at runtime.
2. **Conditionals** — the `if` keyword on jobs and steps, which uses expressions to decide whether something should run.

Together, they let you build workflows that respond intelligently to the situation instead of blindly executing the same sequence every time.

## What You Will Learn

By the end of this topic you will be able to:

- Write expressions using the `${{ }}` syntax
- Use comparison and logical operators
- Apply `if` conditionals to jobs and steps
- Control flow with status check functions like `success()`, `failure()`, `always()`, and `cancelled()`
- Work with built-in functions such as `contains()`, `startsWith()`, `format()`, `toJSON()`, `fromJSON()`, and `hashFiles()`
- Understand how GitHub Actions handles type casting and truthiness
