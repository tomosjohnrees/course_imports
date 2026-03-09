## Summary and Security Checklist

Security in GitHub Actions is not a single setting -- it is a combination of practices applied consistently across your workflows. Here is a checklist you can use when writing or reviewing workflows:

### Workflow hardening checklist

- **Pin actions to commit SHAs** -- never use mutable tags for third-party actions
- **Set `permissions: {}` at the workflow level** -- add back only what each job needs
- **Never interpolate user input in `run:` blocks** -- use environment variables instead
- **Use OIDC for cloud authentication** -- eliminate stored long-lived credentials
- **Enable Dependabot for actions and dependencies** -- stay current with security patches
- **Run dependency review on pull requests** -- catch vulnerable packages before they merge
- **Use ephemeral self-hosted runners** -- or never use them with public repositories
- **Stream audit logs** -- retain and monitor workflow activity long-term
- **Use environments with protection rules** -- require approvals for production deployments
- **Review third-party actions before adopting them** -- check the source, maintainer reputation, and star count

### Congratulations

You have completed the GitHub Actions course. You now have the knowledge to build workflows that are not only functional but also secure, maintainable, and scalable. The practices in this topic should inform every workflow you write going forward.
