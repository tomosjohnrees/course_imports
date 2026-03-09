# Caching Dependencies

Installing dependencies from scratch on every workflow run is slow and wasteful. The `actions/cache` action lets you save and restore directories between runs, dramatically speeding up your pipelines.

## How caching works

The cache action works by creating a snapshot of a directory (like `node_modules` or Python's pip cache) and storing it with a **key**. On subsequent runs, if a cache entry matches the key, the directory is restored instead of being rebuilt.

A typical caching strategy uses a hash of the lockfile as part of the key. This means the cache is automatically invalidated whenever dependencies change:

- If `package-lock.json` changes, the npm cache key changes, and fresh dependencies are installed.
- If the lockfile has not changed, the cached directory is restored and installation is nearly instant.

## Built-in caching vs. explicit caching

Many `setup-*` actions (like `actions/setup-node` and `actions/setup-python`) have a built-in `cache` option that handles caching automatically. For most projects, this is the simplest approach.

Use the explicit `actions/cache` action when you need more control -- for example, when caching multiple directories, using custom key strategies, or caching build outputs that are not covered by the setup actions.

## Restore keys

The `restore-keys` field provides fallback key prefixes. If no exact match is found, GitHub looks for the most recent cache entry whose key starts with one of the restore-key prefixes. This is useful for getting a partial cache hit: even a slightly outdated cache is usually faster than starting from nothing.
