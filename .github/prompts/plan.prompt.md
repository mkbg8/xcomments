# Implementation Planning Mode

The user has requested a detailed implementation plan for a specific goal. 

**CRITICAL RULES FOR THIS INTERACTION:**
1. **NO MODIFICATIONS**: You are strictly forbidden from executing any file edits, file creations, file deletions, or structural modifications to the codebase.
2. **NO TERMINAL MUTATIONS**: Do not execute terminal commands that alter the environment state (e.g., building, committing, moving).
3. **SAFE EXPLORATION**: You must use your read, grep, and semantic search tools to comprehensively explore the codebase to gather the context and evidence needed.

Your task is to build a robust plan, internally evaluate and rethink it to reach a better state, and then present the final, refined plan. Follow this structured process:

### Phase 1: Explore & Draft Initial Plan (Internal)
Investigate the codebase to understand the current state related to the user's request. Formulate a comprehensive, step-by-step implementation plan that includes:
- Source code modifications.
- Required test additions or updates.
- Required documentation updates (e.g., in `docs/` and `CLAUDE.md`).

### Phase 2: Self-Review & Rethink (Internal)
Before outputting, rigorously review your drafted plan against these criteria. Gather fresh evidence from the codebase to challenge your assumptions.
1. **Completeness check**: Is the plan sufficient? Identify missing edge cases, untouched caller files, dependencies, or unaddressed test files. Focus on the test inventory and docs synchronization constraints.
2. **Assumptions**: What does each proposed change assume about inputs, states, or execution order? Explicitly search to verify these assumptions.
3. **Consistency**: Do the planned changes follow project conventions (e.g., Polars over pandas, reliable methods over heuristics)?
4. **Data and State Consistency**: Does this plan alter underlying data structures? If so, does it break historical pipelines or downstream schemas? 
5. **Ordering**: Are the steps in the right order? Does any step depend on the outcome of a later step?
6. **Public interface audit**: For every capability or CLI flag — whether unchanged or newly documented by the plan — verify the advertised behaviour matches the actual code. If the plan introduces comments, docstrings, or CLI examples, verify the referenced flags, functions, and paths actually exist.
7. **Project rules compliance**: Re-read CLAUDE.md's documentation-sync and test-coverage rules. Verify the plan satisfies all applicable rules.
8. **Rollback Strategy**: If execution fails midway, is it recoverable?

*Refine your original plan immediately if any of these checks fail. Mark what you changed during your rethink phase to show your work.*

### Phase 3: Final Presentation
Present the finalized, self-corrected implementation plan to the user. 
- Outline step-by-step how the implementation will be executed.
- Clearly list the files to be modified, created, or deleted. 
- Emphasize the required tests and documentation updates.
- Briefly mention the optimizations or corrections made during your "rethink" phase.

Address the user's specific query applying these strict read-only and planning constraints:

Arguments: **$ARGUMENTS**