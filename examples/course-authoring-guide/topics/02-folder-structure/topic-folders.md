# The Topics Directory

The `topics/` directory is required. If the loader does not find it, the course will fail validation.

Inside `topics/`, each topic gets its own subfolder. Topic folders are numbered to control their display order, using a naming convention that combines a numeric prefix with a kebab-case description.

## Topic Folder Naming Convention

Topic folders follow this pattern:

```
{number}-{kebab-case-name}
```

For example:
- `01-introduction`
- `02-variables-and-types`
- `03-control-flow`
- `10-advanced-patterns`

The numeric prefix determines the sort order. The kebab-case portion after the first hyphen describes the topic. Both parts are required.

## How Display Titles Are Derived

You do not set a topic's display title explicitly. Instead, the app derives it automatically from the folder name:

1. The numeric prefix and its trailing hyphen are stripped (`01-introduction` becomes `introduction`)
2. Hyphens are replaced with spaces (`variables-and-types` becomes `variables and types`)
3. The result is title-cased (`variables and types` becomes `Variables And Types`)

So the folder `02-variables-and-types` produces the display title **"Variables And Types"**. Keep this in mind when choosing folder names — the folder name *is* the title.
