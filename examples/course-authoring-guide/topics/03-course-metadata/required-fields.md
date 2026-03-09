# Required Fields

The `course.json` file is a JSON object with seven required fields. Every field must be present — the app will reject a course that is missing any of them.

| Field        | Type       | Description                                                        |
| ------------ | ---------- | ------------------------------------------------------------------ |
| `id`         | `string`   | A unique identifier for the course, written in kebab-case.         |
| `title`      | `string`   | The display title shown to learners in the app.                    |
| `description`| `string`   | A short summary describing what the course covers.                 |
| `version`    | `string`   | A semantic version string (e.g. `"1.0.0"`).                       |
| `author`     | `string`   | The name of the course author.                                     |
| `tags`       | `string[]` | An array of keywords used for categorisation and search.           |
| `topicOrder` | `string[]` | An ordered list of topic folder names inside `topics/`.            |

Let's walk through each one.
