## Review Uncommitted Changes

Run `git diff HEAD` to examine all uncommitted changes (both staged and unstaged) in the working tree.

**Before you begin**: These changes may span multiple actions or sessions. Do not assume you remember what was changed or why. Read the diff output fresh and let the code speak for itself — treat it as if you are reviewing someone else's work.

For each changed file:

1. **State the intent**: What is this change trying to accomplish?
2. **List assumptions**: What assumptions does the new/modified code make about inputs, state, types, execution order, and the behavior of surrounding code that was not modified?
   - For every **deleted** code path (function, branch, condition), identify what inputs or states previously routed there. Verify where those inputs land in the new code — flag any scenario where they silently do nothing, return early with no output, hit a default/fallback, or reach a different handler than before.
   - For every **retained variable or field** whose role changes (e.g., it now feeds a different formula or is used in a new context), verify that its definition still produces values appropriate for the new usage.
3. **Challenge each assumption (Evidence Required)**: For every assumption listed, determine whether it is guaranteed by the surrounding code. **You must explicitly execute file reading or search tools** to inspect the actual definitions, interfaces, or types involved. Do not rely on memory. List the exact file paths and line numbers you reviewed to prove each assumption.
4. **Integration check**: For any modified function signature, return type, or renamed symbol, **explicitly search** for all callers and importers in the codebase. Verify none are broken by the change.
5. **Data and State Audits**: Do the uncommitted changes alter the shape, schema, or lifecycle of any variables, data structures (e.g., dataframes), or objects? If yes, explicitly trace how downstream code handles this modified data to ensure no type errors or silent failures occur.
6. **Consistency and Commenting**: Verify the changes follow the same conventions as the existing code (naming, error handling, patterns, types). For any newly generated logic, ensure extensive comments explaining the reasoning are present. Verify that no existing comments were removed unless the corresponding code was entirely deleted.
7. **Trace representative inputs**: Construct at least 3 concrete input scenarios and walk each through the new control flow end-to-end. Flag any scenario where behaviour diverges from what the old code would have produced. Include:
   - Argument-level boundary cases (default, omitted, or malformed arguments).
   - **Lifecycle/state boundary cases** — what states can the system, data structures, or in-flight objects be in when this code runs? Consider mid-operation states such as partially completed work, open transactions, in-progress items, or unfinished records that may still be present when the changed code executes.
8. **Public interface audit**: For every entry point, CLI flag, or function signature — whether unchanged or **newly documented** — verify the advertised behaviour matches the actual code. If the diff introduces new comments, docstrings, or documentation that reference CLI flags, function names, file paths, or code paths, **explicitly verify those references exist** in the actual parser, definitions, or filesystem. Do not trust your memory of what flags or APIs exist — look them up.
9. **New documentation validation**: For every comment, docstring, CLI example, or documentation line added or modified by the diff, verify it is factually correct against the actual code. If a comment shows a command invocation, confirm each flag is accepted by the argument parser. If it references a function, module, or symbol, confirm the name and signature match. If it states behavioral properties, confirm the code implements them.
10. **Project rules compliance**: If the repository contains a CLAUDE.md or similar project-level instruction file, re-read its documentation-sync and test-coverage rules. Verify that the changes satisfy all applicable rules — particularly required documentation updates, test coverage for new behavior, and naming conventions.
11. **File placement audit**: For every **newly created file** in the diff, verify it belongs in the directory where it was placed. Check the project's directory-level contracts (e.g., test tier rules, module boundaries, package conventions). If the project defines criteria for what belongs in each directory (such as import weight, module dependencies, or test categorization), verify the new file satisfies those criteria by inspecting its **actual imports** — not its intended purpose.
12. **Logic issues**: Identify edge cases, race conditions, off-by-one errors, unintended side effects, or broken invariants introduced by the changes.

13. **Test verification**: Run the project's test suite. If any tests fail, the changes are not ready to commit regardless of the static review outcome. Report which tests failed and why.

Be specific — reference file names, line numbers, and function names. If you find a problem, do not just flag it — propose a detailed plan for the eventual fix. **Do NOT execute any code edits or fixes yourself.**

Do not say the changes "look good" unless you can explicitly justify why for each point above using concrete evidence gathered from your tools.

Make sure you end up with a clear conclusion on whether the changes are correct and ready to commit.

**CRITICAL RULE: This is a review and planning phase only. You are strictly forbidden from making *any* file edits.**
