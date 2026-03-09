# Your First Workflow

In the previous topic, you learned what GitHub Actions is and why it matters. Now it is time to build something real. By the end of this topic you will have written a working workflow file, pushed it to GitHub, and watched it run.

A GitHub Actions workflow is defined in a single YAML file that lives inside your repository. When a specified event happens -- such as pushing code -- GitHub reads that file and executes the instructions it contains. No external CI server is needed; everything runs on GitHub's own infrastructure.

Before we write one, we need to understand the file format those workflows are written in.
