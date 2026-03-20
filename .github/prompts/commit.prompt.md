## Commit and Push

Before committing:

1. Run `git status` and `git diff --stat`. Review what will be staged.
2. If there are files that look unrelated to the current task (temp files, unrelated edits, debug leftovers), stage only the relevant files. Otherwise, stage all.
3. Confirm which branch you are on. Pushing to `main` or `master` is allowed.

Commit message format:
- First line: concise summary, imperative mood, max 72 characters (e.g. "Add ATR-based margin zone to SFP entry logic")
- If the change is non-trivial, add a blank line followed by a short body explaining *why*, not *what*

Push to the current branch.