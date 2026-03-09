# What Is a Course?

In Course Imports, a "course" is simply a folder on your filesystem. There is no special build step, no database, and no proprietary file format. A course is made of:

- **A `course.json` file** at the root that describes the course (its title, author, description, and the order of topics).
- **A `topics/` directory** containing one subfolder per topic.
- **Content files** inside each topic folder — a `content.json` that defines the sequence of blocks, plus any markdown files, code files, or images those blocks reference.

Because everything is plain files, you can create a course with nothing more than a text editor and a file manager. You can also version-control your courses with Git, collaborate with others, or generate content programmatically.
