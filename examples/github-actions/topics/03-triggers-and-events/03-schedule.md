# Schedule Events

The `schedule` event lets you run workflows on a recurring basis using standard POSIX cron syntax. Scheduled workflows are useful for tasks that should happen regularly regardless of code changes -- nightly builds, weekly dependency updates, periodic health checks, or automated reports.

## Cron syntax

A cron expression has five fields separated by spaces:

```
┌───────────── minute (0-59)
│ ┌───────────── hour (0-23)
│ │ ┌───────────── day of month (1-31)
│ │ │ ┌───────────── month (1-12)
│ │ │ │ ┌───────────── day of week (0-6, Sunday = 0)
│ │ │ │ │
* * * * *
```

Each field can be a specific value, a range (`1-5`), a list (`1,3,5`), a step (`*/15`), or a wildcard (`*`).

## Common examples

| Cron expression     | Meaning                          |
|---------------------|----------------------------------|
| `0 0 * * *`         | Every day at midnight UTC        |
| `30 9 * * 1-5`      | Weekdays at 9:30 AM UTC         |
| `0 */6 * * *`       | Every 6 hours                    |
| `0 0 * * 0`         | Every Sunday at midnight UTC     |
| `0 0 1 * *`         | First day of every month at midnight UTC |

## Important notes

- All cron schedules use **UTC** time, not your local time zone.
- Scheduled workflows only run on the **default branch** (usually `main`).
- GitHub does not guarantee exact execution times. During periods of high load, scheduled workflow runs may be delayed or even skipped.
- The shortest interval you can set is every 5 minutes, but GitHub recommends against high-frequency schedules to avoid wasting resources.
- You can define multiple schedules by listing more than one cron entry.
