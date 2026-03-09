## Audit Logging

Knowing what happened and when is essential for security. GitHub provides audit logs that record activity across your organisation, including Actions-specific events.

### What is captured

GitHub audit logs for Actions record events such as:

- Workflow runs: who triggered them, which branch, which commit
- Secret access: when secrets were created, updated, or deleted
- Runner registration: when self-hosted runners were added or removed
- Permission changes: modifications to workflow permissions or action policies
- Environment modifications: changes to deployment environment protection rules

### Accessing audit logs

**Organisation owners** can access audit logs through:

- **GitHub web UI:** Settings > Audit log
- **REST API:** `GET /orgs/{org}/audit-log`
- **Streaming:** Forward logs to a SIEM (Security Information and Event Management) tool like Splunk, Datadog, or Azure Sentinel for real-time analysis

### Filtering for Actions events

In the audit log search, use the `action:` qualifier to filter for workflow-related events:

```
action:workflows
action:org.update_actions_settings
```

### Best practices for audit logging

**Retain logs externally.** GitHub retains audit log data for a limited period (90 days for most plans). Stream or export logs to a long-term storage solution.

**Set up alerts.** Configure your SIEM or monitoring tool to alert on suspicious patterns, such as:

- Workflow runs from unexpected branches or forks
- New self-hosted runner registrations
- Changes to repository or organisation Action permissions
- Secret modifications outside of normal change windows

**Review regularly.** Schedule periodic reviews of audit logs to identify unusual activity before it becomes a security incident.
