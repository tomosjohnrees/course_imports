# The topicOrder Array

The `topicOrder` field deserves special attention because it is the most common source of errors when setting up a new course.

Each string in the `topicOrder` array must match the **exact** name of a folder inside `topics/`. If your folder is called `01-introduction`, the corresponding entry must be `"01-introduction"` — not `"introduction"`, not `"01_introduction"`, not `"01-Introduction"`.

The order of entries in the array determines the order topics are presented to the learner. The first entry is shown first, the second entry second, and so on.

Here is a concrete example. If your `topics/` directory looks like this:

```
topics/
├── 01-getting-started/
├── 02-core-concepts/
└── 03-advanced-usage/
```

Then your `topicOrder` must be:

```json
"topicOrder": [
  "01-getting-started",
  "02-core-concepts",
  "03-advanced-usage"
]
```

If you rename a folder, you must update `topicOrder` to match. If you add a new topic folder, you must add its name to the array. If you remove a topic folder, you must remove its entry from the array. The app validates that every entry in `topicOrder` has a corresponding folder, and will reject the course if any are missing.
