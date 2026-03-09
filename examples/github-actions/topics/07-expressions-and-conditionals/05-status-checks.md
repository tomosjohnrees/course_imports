# Status Check Functions

By default, a step only runs if all previous steps succeeded, and a job only runs if all jobs it depends on succeeded. GitHub Actions provides four **status check functions** that override this default behavior.

## `success()`

Returns `true` when all previous steps (or dependency jobs) have succeeded. This is the default behavior, so using `success()` explicitly is redundant in most cases. However, it is useful when you need to combine it with another condition:

```yaml
- name: Deploy
  if: success() && github.ref == 'refs/heads/main'
  run: ./deploy.sh
```

## `failure()`

Returns `true` when any previous step (or dependency job) has failed. This is essential for error handling -- uploading logs, sending alerts, or running cleanup after a failure.

```yaml
- name: Notify on failure
  if: failure()
  run: curl -X POST "$SLACK_WEBHOOK" -d '{"text":"Build failed!"}'
```

## `always()`

Returns `true` regardless of whether previous steps succeeded, failed, or were cancelled. This is the function you reach for when a step absolutely must run -- for example, uploading test artifacts or cleaning up resources.

```yaml
- name: Upload test results
  if: always()
  uses: actions/upload-artifact@v4
  with:
    name: test-results
    path: test-results/
```

## `cancelled()`

Returns `true` only when the workflow run was cancelled. This is less commonly used but can be helpful for distinguishing between a failure and a manual cancellation.

```yaml
- name: Acknowledge cancellation
  if: cancelled()
  run: echo "Workflow was cancelled by a user."
```

## Combining Status Checks with Other Conditions

These functions become particularly powerful when combined with other expressions. A common pattern is "always run, but only on a specific branch":

```yaml
- name: Cleanup staging
  if: always() && github.ref == 'refs/heads/main'
  run: ./cleanup-staging.sh
```

Or "run only on failure of a specific step":

```yaml
- name: Debug test failure
  if: failure() && steps.test.outcome == 'failure'
  run: cat test-output.log
```

Note the distinction between `steps.<id>.outcome` and `steps.<id>.conclusion`. The `outcome` is the result before `continue-on-error` is applied, while `conclusion` is the final result after. If a step fails but has `continue-on-error: true`, its `outcome` is `failure` but its `conclusion` is `success`.
