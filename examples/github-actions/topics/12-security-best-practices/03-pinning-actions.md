## Pinning Actions to Commit SHAs

When you reference an action with a tag like `actions/checkout@v4`, you trust that the tag will always point to the same code. But tags are mutable -- a repository owner (or an attacker who compromises their account) can move a tag to point to completely different code.

### The problem with tags

Consider this workflow step:

```yaml
- uses: actions/checkout@v4
```

Today `v4` might point to commit `abc123`. Tomorrow the maintainer could retag `v4` to point to a different commit. You would automatically run the new code without any review.

### The solution: SHA pinning

Instead of a tag, reference the exact commit SHA:

```yaml
- uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11 # v4.1.1
```

A commit SHA is immutable. Even if the repository is compromised, the SHA still points to the exact code you reviewed. The trailing comment preserves human-readable version information.

### How to find the SHA

1. Navigate to the action repository on GitHub
2. Go to the **Releases** or **Tags** page
3. Click on the tag to view the associated commit
4. Copy the full 40-character commit SHA

### Keeping pinned actions up to date

Pinning to SHAs does not mean never updating. Use **Dependabot** to automatically propose pull requests when new versions of pinned actions are released.
