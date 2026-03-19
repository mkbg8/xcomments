## Update Documentation to Reflect Recent Changes

The user will specify a time range or commit range after this command (e.g. "Commits since 7am this morning", "Last 3 commits", "Since yesterday 2pm"). Use that specification to determine the scope:

- If a time/hour is given: use `git log --since="<interpreted time>" --oneline` to find the relevant commits, then `git diff <oldest commit hash>^..HEAD` to get the full diff.
- If a commit count is given: use `git log -n <count> --oneline` to identify them, then diff the range.
- If ambiguous: state your interpretation and proceed.

Then find all Markdown (.md) files in the repository.

For each changed file in the diff:

1. **Identify affected docs**: Which .md files reference or describe the changed code? Check for mentions of changed function names, class names, module names, CLI flags, config keys, or architectural concepts that were modified.
2. **Check accuracy**: For each affected doc, verify that descriptions, signatures, parameter lists, examples, and any stated behavior still match the actual code after the changes.
3. **Update**: Edit any documentation that is now inaccurate or incomplete. Match the tone and level of detail of the existing documentation — do not over-expand terse docs or simplify detailed ones.
4. **Missing coverage**: If the changes introduce new public functions, modules, config options, or user-facing behavior that are not documented anywhere, flag them and add documentation following the conventions of the existing docs.

5. **Verify your updates**: After making all documentation changes, re-read each update you wrote and verify every CLI flag, function name, parameter, and behavioral claim against the actual code. Do not trust your memory — look up each reference.

Do not touch documentation that is unrelated to the identified changes. Do not reformat or restructure docs that are already accurate.