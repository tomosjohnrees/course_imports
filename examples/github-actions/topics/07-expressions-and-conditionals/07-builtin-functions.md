# Built-in Functions

GitHub Actions expressions include a set of built-in functions for string manipulation, data conversion, and hashing. These functions let you transform and inspect values without dropping into a shell script.

## String Functions

### `contains(search, item)`

Returns `true` if `search` contains `item`. Works with both strings and arrays. The comparison is **case-insensitive** for strings.

```yaml
# Check if the commit message includes a keyword
if: contains(github.event.head_commit.message, 'hotfix')

# Check if a label is in the list of PR labels
if: contains(github.event.pull_request.labels.*.name, 'urgent')
```

### `startsWith(string, prefix)`

Returns `true` if the string begins with the prefix. Case-insensitive.

```yaml
# Match any release branch
if: startsWith(github.ref, 'refs/heads/release/')
```

### `endsWith(string, suffix)`

Returns `true` if the string ends with the suffix. Case-insensitive.

```yaml
# Match tags that end with '-rc' (release candidate)
if: endsWith(github.ref, '-rc')
```

### `format(template, ...values)`

Replaces `{0}`, `{1}`, etc. in the template with the provided values. Useful for constructing dynamic strings.

```yaml
- name: Print summary
  run: echo "${{ format('Build {0} on branch {1}', github.run_number, github.ref_name) }}"
```

To include a literal brace, double it: `{{` outputs `{` and `}}` outputs `}`.

### `join(array, separator)`

Concatenates all elements of an array into a single string, separated by the given separator. If no separator is provided, a comma is used.

```yaml
- name: Show labels
  run: echo "${{ join(github.event.pull_request.labels.*.name, ', ') }}"
```

## Data Functions

### `toJSON(value)`

Converts a value to a pretty-printed JSON string. This is invaluable for debugging -- you can dump an entire context object to see what data is available.

```yaml
- name: Dump GitHub context
  run: echo '${{ toJSON(github) }}'
```

### `fromJSON(string)`

Parses a JSON string into an object. This is often used with step outputs to pass structured data between steps or to dynamically set a matrix.

```yaml
- name: Set matrix dynamically
  id: set-matrix
  run: echo 'matrix=["16", "18", "20"]' >> $GITHUB_OUTPUT

- name: Show parsed value
  run: echo "${{ fromJSON(steps.set-matrix.outputs.matrix)[0] }}"
```

## Hashing

### `hashFiles(pattern)`

Returns a SHA-256 hash of the files matching the given glob pattern. If multiple files match, the hash covers all of them. This is most commonly used for cache keys.

```yaml
- name: Cache dependencies
  uses: actions/cache@v4
  with:
    path: node_modules
    key: deps-${{ hashFiles('package-lock.json') }}
```

If the lock file changes, the hash changes, and the cache is invalidated. You can pass multiple patterns separated by commas:

```yaml
key: deps-${{ hashFiles('**/package-lock.json', '**/yarn.lock') }}
```
