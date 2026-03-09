# Putting It All Together

Now that you know the four main content block types — text, code, callout, and image — you can combine them to build rich, engaging topics.

A well-structured topic typically follows a pattern like this:

1. Start with a **text block** that introduces the concept
2. Show a **code block** with a concrete example
3. Use a **callout** to highlight a tip or common mistake
4. Include an **image** if a diagram or screenshot helps clarify things
5. End with a **quiz** to reinforce learning

Remember these key rules:

- Every block needs a `"type"` field
- Text and code blocks need either `"src"` or `"content"` (exactly one, never both, never neither)
- Code blocks also need a `"language"` field
- Callout blocks need `"style"` and `"body"`
- Image blocks need `"src"` and `"alt"`, and images must be under 10 MB

The `content.json` array is rendered in order, so arrange your blocks in the sequence that makes the most sense for the reader.
