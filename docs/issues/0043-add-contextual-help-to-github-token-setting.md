# [0043] Add contextual help to GitHub token setting

## Summary

The Settings panel presents a "GitHub Token" section with a bare input field and the description "Personal access token for loading private repositories." For users like Sarah who don't know what a GitHub personal access token is, this is confusing and potentially alarming — they may worry they're missing a required step. The setting needs contextual help that explains what it is, when it's needed, and that it's entirely optional for public courses.

## Context

- **Phase:** UX audit — Sarah Chen
- **Depends on:** #0029
- **Blocks:** None

## What needs to happen

1. The GitHub Token section description clearly states that tokens are optional and only needed for private repositories or to avoid rate limits
2. A brief inline explanation or expandable help text describes what a personal access token is and links to instructions for creating one
3. The setting feels approachable rather than developer-oriented — a non-technical user should feel confident they can skip it

## Acceptance criteria

### Functionality
- [ ] The token section description explicitly states the token is optional for public courses
- [ ] An inline help element (e.g. "What's this?" link or info tooltip) explains what a personal access token is in plain language
- [ ] The help text includes a link to GitHub's token creation page or clear step-by-step guidance
- [ ] Users who don't need a token feel confident they can ignore this section

### Security
- [ ] The help text does not encourage users to create tokens with excessive scopes — guidance should specify read-only / public_repo scope at most

### Performance
- [ ] Help text is rendered inline with no additional network requests or lazy-loaded resources

### Testing
- [ ] Component tests verify the optional label and help element render within the token section
- [ ] Component tests verify the help text is accessible (e.g. via tooltip or expandable section with appropriate ARIA attributes)

## Notes

Elena Vasquez (non-technical persona) would also benefit from this change. The current description reads as developer-oriented jargon.
