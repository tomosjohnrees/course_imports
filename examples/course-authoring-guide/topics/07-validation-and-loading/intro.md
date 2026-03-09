# Validation and Loading

You have built a complete course — metadata, topics, content blocks, and quizzes are all in place. The final step is getting it into the app.

Course Imports validates every course on load. If anything is wrong — a missing file, a malformed JSON array, a bad answer index — the app will reject the course and show you an error message. This is by design: catching problems at load time means learners never see a broken course.

This topic walks through the full validation checklist, the most common mistakes authors make, and the two methods for loading a course into the app.
