---

name: commit
description: Create a git commit
disable-model-invocation: true
allowed-tools: Bash(git \*)

---

Status: !`git status`
Diff: !`git diff HEAD`
Branch: !`git branch --show-current`

Write a conventional commit message and commit all staged changes.
