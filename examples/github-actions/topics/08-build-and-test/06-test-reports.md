# Working with Test Reports

Running tests in CI is only half the story. When a test fails, you need to quickly understand which test broke and why. GitHub Actions offers several ways to surface test results beyond scanning raw log output.

## JUnit XML reports

Most test frameworks can produce results in JUnit XML format, a widely supported standard. You can upload these reports as artifacts for later inspection, or use third-party actions to parse them and post a summary directly to the pull request.

For example, `pytest` generates JUnit XML with the `--junitxml` flag, and Jest (for Node.js) can produce it using the `jest-junit` reporter.

## Job summaries

GitHub Actions supports **job summaries** -- rich Markdown content that appears on the workflow run summary page. You can write to the special `$GITHUB_STEP_SUMMARY` file to add tables, charts, or formatted test results that are easier to read than raw logs.

This approach does not require any third-party actions. You simply pipe or echo Markdown-formatted content into `$GITHUB_STEP_SUMMARY` from any step in your workflow.

## Failing the workflow on test failures

By default, if `pytest` or `npm test` exits with a non-zero status code, the step fails, which causes the entire job to fail. This is usually the desired behaviour -- a failing test should block the pull request. If you need to run cleanup steps after a test failure, use the `if: always()` conditional on those steps.
