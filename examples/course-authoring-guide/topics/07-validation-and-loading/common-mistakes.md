# Common Mistakes and How to Fix Them

Even experienced authors run into these. Here are the errors that come up most often.

## Mismatched folder names

This is the single most common validation failure. Your `topicOrder` says one thing, but the actual folder on disk says something slightly different.

The fix is simple: make sure the strings in `topicOrder` are **exact** matches for the folder names inside `topics/`. Copy-paste the folder name into your `course.json` to avoid typos.

## Missing `src` files

You reference `"src": "overview.md"` in a block, but the file is actually named `Overview.md` (capital O) or it lives in a different topic folder. Remember that `src` paths are **case-sensitive** and **relative to the topic folder** the block lives in.

The fix: double-check the filename, including capitalisation, and make sure the file is in the correct topic directory.

## Invalid answer index

A multiple-choice quiz with three options has valid `answer` values of `0`, `1`, or `2`. Setting `answer` to `3` — or to `-1` — will fail validation because the index is out of bounds.

The fix: count your options starting from zero. If you have four options, valid indices are `0` through `3`.

## `content.json` is not an array

If you accidentally wrap your blocks in an object (`{ "blocks": [...] }`) instead of a plain array (`[...]`), validation will fail. The file must contain a JSON array at the top level.

## Trailing commas in JSON

JSON does not allow trailing commas. A comma after the last item in an array or object is invalid and will cause a parse error. Many text editors can highlight this for you.
