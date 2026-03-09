# Persona: Priya Patel — AI-Assisted Content Creator

## Demographics

- **Age:** 31
- **Occupation:** Freelance instructional designer
- **Location:** London, UK
- **Technical comfort:** Moderate-to-high — comfortable with AI tools (ChatGPT, Claude), basic terminal commands, and file management, but not a developer

## Background

Priya designs learning material for corporate clients. She discovered that large language models can generate well-structured course content remarkably fast. She uses AI to draft courses in the Course Imports format — generating `course.json`, topic folders, markdown content, and quiz questions — then refines the output and loads it into the app to review. This workflow lets her produce polished courses in a fraction of the time.

## Goals

- Use AI to rapidly generate course content in the correct folder structure
- Load AI-generated courses locally to review and quality-check the output
- Iterate: fix issues in the generated files, reload, and re-check
- Deliver finished courses to clients as GitHub repos or zipped folders

## Typical workflows

1. Prompts an AI model with a topic, audience, and desired structure
2. AI generates the course folder with all required files
3. Saves the output to a local folder
4. Opens the folder in Course Imports via "Open local folder"
5. Reads through each topic, checking for accuracy, tone, and rendering issues
6. Edits files in her text editor, reloads in the app to verify fixes
7. Once satisfied, pushes to a private GitHub repo for client delivery

## Pain points and frustrations

- AI sometimes produces slightly malformed JSON — needs clear error messages pointing to the exact issue
- If a single bad file prevents the entire course from loading, that's very disruptive to her review workflow
- Wants to know immediately if a content block type or field is unrecognised rather than having it silently ignored
- Loading the same local folder repeatedly should be seamless — doesn't want to re-navigate the file picker every time

## What success looks like

Priya generates a 15-topic course with AI, loads it locally on the first try, quickly spots and fixes two formatting issues thanks to clear error messages, and delivers a polished course to her client the same day.
