# Security Best Practices for GitHub Actions

CI/CD pipelines are a high-value target for attackers. Your workflows have access to source code, secrets, deployment credentials, and often the ability to publish artifacts or push code. A compromised pipeline can lead to supply chain attacks that affect every user of your software.

This final topic covers the security landscape of GitHub Actions and equips you with practical techniques to harden your workflows. You will learn how to:

- Understand the most common security risks in CI/CD pipelines
- Pin third-party actions to immutable commit SHAs
- Apply the principle of least privilege to workflow permissions
- Prevent script injection attacks
- Use OpenID Connect (OIDC) to eliminate long-lived cloud credentials
- Secure self-hosted runners
- Review dependencies for known vulnerabilities
- Monitor workflow activity through audit logs

Security is not a feature you bolt on at the end — it should be woven into every workflow you write from the start.
