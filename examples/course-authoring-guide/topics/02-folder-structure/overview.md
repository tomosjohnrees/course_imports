# Folder Structure

Every course in Course Imports follows a strict folder layout. The loader expects specific files in specific locations, so getting the structure right is the first step toward a working course.

At the top level, a course is a single folder. That folder contains exactly two things: a `course.json` metadata file and a `topics/` directory. All of the course content lives inside `topics/`.

## The Big Picture

A course folder is self-contained. Everything the app needs to load and display the course — metadata, text, code samples, images, quizzes — lives inside this one directory tree. There are no external dependencies, no database records to create, no build steps. You arrange files in the right structure, and the app picks them up.

This design means courses are easy to version-control with Git, share as zip files, or host in GitHub repositories.
