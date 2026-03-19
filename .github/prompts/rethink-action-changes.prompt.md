## Review Your Last Action

Review the changes you just made in your last action. Do not review the entire uncommitted diff — only the files and lines you modified or created in that action.

**Before you begin**: Your memory of what you wrote may already be stale or colored by what you *intended* to write. Re-read every line you changed by explicitly opening the files. Do not confirm your own work from memory — verify it from the actual code on disk.

For each change you made:

1. **Restate intent**: What were you trying to accomplish with this specific edit?
2. **List assumptions**: What assumptions does your new/modified code make about inputs, state, types, execution order, and the behavior of surrounding code you did not modify?
   - For every **retained variable or field** whose role changes (e.g., it now feeds a different formula or is used in a new context), verify that its definition still produces values appropriate for the new usage.
3. **Challenge each assumption (Evidence Required)**: For every assumption, determine whether it is guaranteed by the existing codebase. **You must explicitly execute file reading or search tools** to inspect the actual definitions, interfaces, or types of the components you interacted with. Do not rely on memory. List the exact file paths and line numbers you reviewed to prove your assumptions.
4. **Integration check**: Do your changes interact correctly with the unchanged code around them? Check call sites, return types, shared state, and import dependencies. If you modified a function signature or return type, you must explicitly search for all callers to verify they are not broken.
5. **Data and State Audits**: Did your action alter the shape, schema, or lifecycle of any variables, data structures (e.g., dataframes), or objects? If yes, explicitly trace how downstream code handles this modified data to ensure no type errors or silent failures occur.
6. **Consistency and Commenting**: Verify your changes follow the same conventions as the surrounding code (naming, error handling, patterns). For any newly generated logic, ensure you have included extensive comments explaining the reasoning behind the code. Verify that you have **not** removed any existing comments unless the corresponding code was entirely deleted.
7. **Trace representative inputs**: Construct at least 2 concrete input scenarios and walk each through your modified code path. Flag any scenario where behavior diverges from what the code produced before your edit. Include:
   - Argument-level boundary cases (default, omitted, or degenerate arguments).
   - **Lifecycle/state boundary cases** — what states can the system, data structures, or in-flight objects be in when this code runs? Consider mid-operation states such as partially completed work, open transactions, or unfinished records.
8. **New documentation validation**: For every comment, docstring, CLI example, or documentation line you added or modified, verify it is factually correct against the actual code. If a comment shows a command invocation, confirm each flag is accepted by the argument parser. If it references a function, module, or symbol, confirm the name and signature match.
9. **Project rules compliance**: If the repository contains a CLAUDE.md or similar project-level instruction file, re-read its documentation-sync and test-coverage rules. Verify that your changes satisfy all applicable rules.
10. **File placement audit**: For every **newly created file** in the diff, verify it belongs in the directory where it was placed. Check the project's directory-level contracts (e.g., test tier rules, module boundaries, package conventions). If the project defines criteria for what belongs in each directory (such as import weight, module dependencies, or test categorization), verify the new file satisfies those criteria by inspecting its **actual imports** — not its intended purpose.
11. **Logic issues**: Identify edge cases, off-by-one errors, unintended side effects, or broken invariants introduced by your edits.
12. **Test verification**: Run the project's test suite. If any tests fail, your changes are not correct regardless of the static review outcome. Report which tests failed and why.

Do not say the changes "look good" unless you can explicitly justify why for each point above using concrete evidence gathered from your tools.

Make sure you end up with a clear conclusion on whether your last action was correct or not.

Be specific — reference file names, line numbers, and function names. If you find a problem, do not just flag it — propose a detailed plan for the eventual fix. **Do NOT execute any code edits or fixes yourself.**

**CRITICAL RULE: This is a review and planning phase only. You are strictly forbidden from making *any* file edits.**
