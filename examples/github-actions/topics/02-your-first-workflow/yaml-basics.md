# YAML Syntax Basics

GitHub Actions workflows are written in **YAML** (YAML Ain't Markup Language). If you have worked with Docker Compose, Kubernetes manifests, or Ansible playbooks, you already know YAML. If not, here is what you need to get started.

## Key-Value Pairs

The simplest YAML construct is a key-value pair, written as `key: value`. The colon must be followed by a space.

```yaml
name: My Workflow
version: 1
```

## Nesting with Indentation

YAML uses **indentation** (spaces, never tabs) to express hierarchy. Child items are indented under their parent, typically by two spaces.

```yaml
parent:
  child: value
  another-child: value
```

## Lists

A list is a sequence of items, each preceded by a dash and a space (`- `).

```yaml
fruits:
  - apple
  - banana
  - cherry
```

## Strings

Strings usually do not need quotes. Use quotes when the value contains special characters (`:`, `#`, `{`, `}`) or when you want to preserve exact formatting.

```yaml
plain: hello world
quoted: "Step 1: Install dependencies"
```

## Comments

Lines beginning with `#` are comments and are ignored by the parser.

```yaml
# This is a comment
name: CI  # Inline comment
```

## Common Pitfalls

- **Tabs vs. spaces:** YAML forbids tabs for indentation. Use spaces only.
- **Inconsistent indentation:** All items at the same level must use the same number of spaces.
- **Missing space after colon:** `key:value` is invalid; it must be `key: value`.

These fundamentals are all you need to read and write GitHub Actions workflows. The rest is just learning which keys GitHub expects.
