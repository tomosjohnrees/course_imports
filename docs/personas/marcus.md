# Persona: Marcus Rivera — Course Author

## Demographics

- **Age:** 35
- **Occupation:** Senior software engineer and occasional technical writer
- **Location:** Portland, Oregon, USA
- **Technical comfort:** High — lives in the terminal, writes markdown daily, maintains several GitHub repos

## Background

Marcus has been mentoring junior developers for years and keeps rewriting the same explanations. He decided to package his knowledge into structured courses that he can share with his team and the broader community. He was drawn to Course Imports because courses are just folders of markdown and JSON — no proprietary editor, no vendor lock-in. He can author in VS Code, version with git, and distribute via GitHub.

## Goals

- Author well-structured courses using plain files he controls
- Validate that his course renders correctly before sharing
- Iterate quickly — edit a file, reload, see the result
- Share courses by sending a single GitHub URL

## Typical workflows

1. Scaffolds a new course folder following the spec: `course.json`, `topics/` with numbered subdirectories
2. Writes content in markdown and code files, wires them up in `content.json`
3. Opens the course locally via "Open local folder" to preview rendering
4. Checks that text blocks render markdown correctly, code blocks highlight properly, quizzes behave as expected
5. Pushes to GitHub, then loads via URL to verify the remote experience
6. Shares the URL with his team or in a blog post

## Pain points and frustrations

- Frustrated if validation errors are vague — needs to know exactly which file or field is wrong
- Wants fast feedback when previewing locally; doesn't want to restart the app
- Annoyed if the app silently drops or ignores content blocks due to minor formatting issues
- Needs to understand the exact course format spec — wishes for better error recovery or linting

## What success looks like

Marcus authors a 10-topic course in an afternoon, previews it locally with confidence that what he sees is what learners will see, pushes to GitHub, and his team loads it without any issues.
