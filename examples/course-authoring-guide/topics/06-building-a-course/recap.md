# Recap

You have just built a complete course from an empty directory. The process is always the same:

1. **Create the folder structure** — a root folder, a `topics/` directory, and a numbered subfolder for each topic.
2. **Write `course.json`** — fill in the metadata fields and list every topic folder name in `topicOrder`.
3. **Write each topic's `content.json`** — define the sequence of blocks (text, code, callout, quiz, image) the learner will see.
4. **Create referenced files** — any markdown files, code files, or images that blocks point to via `src`.

That is all there is to it. In the next topic, you will learn how to validate your course and load it into the app.
