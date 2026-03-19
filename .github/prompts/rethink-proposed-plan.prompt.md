## Review Your Proposed Plan

Review the plan you just proposed. Do not execute it yet.

**Before you begin**: You just authored this plan, so you are biased toward confirming it. Review it as if someone else proposed it and you are looking for reasons it might fail. For every check below, gather fresh evidence from the codebase — do not reuse your earlier reasoning.

For each proposed change in the plan:

1. **Restate intent**: What is this specific change trying to accomplish, and how does it contribute to the overall goal?
2. **Completeness check**: Is the plan sufficient to fully accomplish the stated goal? Identify anything that is missing — files not mentioned, edge cases not addressed, dependencies not updated, or steps that are implied but not explicitly planned.
	- For any function, class, or symbol that moves or is renamed, verify that **every caller** in the codebase is updated. You must explicitly execute your search tools (e.g., `grep`, `find_in_files`) to verify this — do not rely on memory.
3. **List assumptions**: What assumptions does each proposed change make about the current state of the codebase, inputs, types, execution order, and the behavior of code you are not planning to modify?
	- For every code path the plan **deletes, moves, or collapses**, identify what inputs or states previously routed there. Verify where those inputs will land after the plan executes — flag any scenario where they silently do nothing, hit a default/fallback, or reach a different handler than before.
4. **Challenge each assumption**: For every assumption, verify it against the actual codebase. You must explicitly execute your file reading tools to gather evidence. List the exact file paths and function names you reviewed. Flag any assumption that is not confirmed by the concrete code you read.
5. **Consistency check**: Will the proposed changes follow the same conventions as the existing code (naming, error handling, patterns, types, comment style)?
6. **Data and State Consistency**: Does this plan alter the shape, type, or lifecycle of any underlying data structures (e.g., dataframe schemas, serialized objects, class properties, database rows)? If yes, explicitly state how existing or historical data pipelines will be updated to prevent downstream type errors or crashes.
7. **Ordering and dependencies**: Are the steps in the right order? Does any step depend on the outcome of a later step? Will intermediate states (between steps) leave the code in a broken or inconsistent state?
8. **Trace representative inputs**: Construct at least 3 concrete input scenarios and walk each through the proposed control flow end-to-end. Flag any scenario where behaviour would diverge from what the current code produces. Include:
   - Argument-level boundary cases (default, omitted, or malformed arguments).
   - **Lifecycle/state boundary cases** — what states can the system, data structures, or in-flight objects be in when this code runs? Consider mid-operation states such as partially completed work, open transactions, or unfinished records.
9. **Verification Plan**: Mental tracing is insufficient. Specify the exact unit or integration tests that must be created or updated to prove this change works. If the code interacts with data structures or external APIs, define exactly how that data will be mocked or simulated.
10. **Public interface audit**: For every entry point, CLI flag, or function signature — whether unchanged or **newly documented** by the plan — verify the advertised behaviour matches the actual code. If the plan introduces new comments, docstrings, or documentation that reference CLI flags, function names, or code paths, verify those references exist in the actual parser/definitions.
11. **New documentation validation**: If the plan adds or modifies comments, docstrings, CLI examples, or documentation, verify each is factually correct. If a planned comment shows a command invocation, confirm each flag is accepted by the argument parser. If it references a function or symbol, confirm the name and signature match.
12. **Project rules compliance**: If the repository contains a CLAUDE.md or similar project-level instruction file, re-read its documentation-sync and test-coverage rules. Verify that the plan satisfies all applicable rules.
13. **File placement audit**: For every **newly created file** in the plan, verify the proposed directory is correct. Check the project's directory-level contracts (e.g., test tier rules, module boundaries, package conventions). If the project defines criteria for what belongs in each directory (such as import weight, module dependencies, or test categorization), verify the new file will satisfy those criteria by tracing its **actual import chain** — not its intended purpose.
14. **Logic issues**: Identify edge cases, unintended side effects, or broken invariants that the proposed changes would introduce.
15. **Rollback Strategy**: If execution fails midway through this plan, will the codebase be left in a broken or uncompilable state? Define the exact steps to cleanly revert the changes if a mid-plan failure occurs.

Be specific — reference file names, function names, and the relevant plan steps. If you find a problem, do not just flag it — revise the plan to address it. Present the revised plan clearly, marking what changed and why.

Do not say the plan "looks good" unless you can justify why for each point above.

Make sure you end up with a clear conclusion on whether the plan is correct and ready to implement.

**CRITICAL RULE: This is a review and planning phase only. You are strictly forbidden from making *any* file edits.**
