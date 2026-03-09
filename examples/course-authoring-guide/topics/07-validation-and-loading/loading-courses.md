# Loading a Course Into the App

Once your course passes validation, you need to get it into Course Imports. There are two loading methods.

## Method 1: Local Folder

Click **Import Course** in the app, then select the **Local Folder** option. A file picker will open — navigate to your course's root folder (the one that contains `course.json`) and select it.

The app reads the folder directly from your filesystem. This is the fastest way to test a course during development because you can make changes to your files and re-import immediately.

## Method 2: GitHub Repository

Instead of a local folder, you can paste a **GitHub repository URL** into the import dialog. The repository must follow the same folder structure: `course.json` at the root and a `topics/` directory with numbered subfolders.

For **public repositories**, just paste the URL and import. No authentication is needed.

For **private repositories**, you will be prompted to provide a **GitHub Personal Access Token (PAT)**. This token gives the app read access to your private repo. You can generate a PAT in your GitHub settings under *Developer settings > Personal access tokens*. A fine-grained token with "Contents" read-only access to the specific repository is sufficient.

## Which method should I use?

- Use **local folder** when you are actively developing and testing a course. It is instant and requires no setup.
- Use **GitHub** when you want to share a course with others or load it on a different machine. It also makes version control straightforward — every change is a commit.
