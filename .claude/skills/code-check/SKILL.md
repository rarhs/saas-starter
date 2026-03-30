---

name: review
description: Perform a code review. Use when the user asks to review code, check code
quality, analyze a file, or spot issues.
allowed-tools: Read, Grep, Glob

---

# Code Review

## Context

- Branch: !`git branch --show-current`
- Changed files: !`git diff --name-only HEAD`

## Review checklist

Go through the target file or files ($ARGUMENTS) and check:

1. **Correctness** — Does it do what it claims?
2. **Edge cases** — What inputs could break it?
3. **Readability** — Would a teammate understand it in 6 months?
4. **Security** — Any injection, auth, or data exposure risks?

Format findings as: **[Severity]** description — file:line
