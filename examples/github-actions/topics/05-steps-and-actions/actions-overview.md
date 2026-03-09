# Using Actions

While `run` steps let you execute arbitrary shell commands, the `uses` keyword lets you reference **actions** -- reusable units of automation that someone has already built and tested.

Actions are one of the most powerful features of GitHub Actions. Instead of writing dozens of lines of shell script to check out your code, install a programming language runtime, cache dependencies, or deploy to a cloud provider, you reference an action that handles all of that for you.

## Where Actions Come From

Actions can come from three places:

1. **Public repositories** -- referenced as `owner/repo@ref`, for example `actions/checkout@v4`. This is the most common form.
2. **The GitHub Marketplace** -- a searchable catalogue at [github.com/marketplace?type=actions](https://github.com/marketplace?type=actions) where thousands of community and official actions are listed.
3. **Local directories** -- referenced as `./path/to/action` for actions defined within your own repository.

## The `uses` Syntax

When you reference an action, you specify the repository and a version tag:

```yaml
- name: Check out repository code
  uses: actions/checkout@v4
```

The `@v4` part is a **version reference**. It can be:

- A **tag** like `v4` or `v4.1.0` (recommended for stability)
- A **branch** like `main` (gets latest changes, less stable)
- A **commit SHA** like `a5ac7e51b41094c92402da3b24376905380afc29` (most secure, pinned to an exact version)

Using a major version tag like `@v4` is the most common convention. It provides a good balance between stability and receiving patch updates.

## Official Actions

GitHub maintains a set of high-quality actions under the `actions` organisation. You will encounter these in almost every workflow:

| Action | Purpose |
|--------|---------|
| `actions/checkout` | Clones your repository onto the runner |
| `actions/setup-node` | Installs a specific version of Node.js |
| `actions/setup-python` | Installs a specific version of Python |
| `actions/setup-java` | Installs a specific JDK version |
| `actions/setup-go` | Installs a specific version of Go |
| `actions/cache` | Caches dependencies to speed up workflows |
| `actions/upload-artifact` | Saves files from a workflow run |
| `actions/download-artifact` | Retrieves files saved by a previous job |

The `setup-*` family all follow the same pattern: they install a language runtime and add it to the PATH so subsequent steps can use it.
