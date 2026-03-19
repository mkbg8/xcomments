## Review Documentation for Discrepancies

Do not edit anything — this is a read-only review. Your goal is to find discrepancies between the documentation files and the actual codebase.

**CRITICAL RULES FOR THIS INTERACTION:**
1. **NO MODIFICATIONS**: You are strictly forbidden from executing any file edits, file creations, file deletions, or structural modifications to the codebase.
2. **NO TERMINAL MUTATIONS**: Do not execute terminal commands that alter the environment state.
3. **SAFE EXPLORATION**: You must use your read, grep, and semantic search tools to comprehensively explore the codebase to gather evidence.

---

### Scope

The documentation files to review are:
- `CLAUDE.md` (single source of truth — highest priority)
- All files under `docs/`
- `.github/copilot-instructions.md`

### Phase 1: Internal Consistency

Check that the documentation files agree with each other:

1. **Cross-reference claims**: When CLAUDE.md and a `docs/` file both describe the same thing (strategy list, module roles, test counts, lvls2-gated strategies, CLI flags, etc.), verify they state the same facts. Flag any contradictions.
2. **Naming consistency**: Check that module names, class names, strategy names, enum values, and CLI flags are spelled identically across all doc files. Typos in names are high-priority findings.
3. **Staleness signals**: Flag items mentioned in one doc file but absent from another where they should logically appear (e.g., a strategy listed in CLAUDE.md but missing from `docs/strategy-system.md`, or vice versa).

### Phase 2: Docs vs. Code

For each major factual claim in the documentation, verify it against the actual source code. Prioritize these categories:

1. **Strategy registry**: Verify the documented strategy list matches `StrategyBaseX._registry` by reading registered strategies in `live/xtrd/`. Check strategy counts and names.
2. **Lvls2-gated strategies**: For every strategy claimed to use lvls2 TradeFilter, read its source and confirm `lvls2_enabled=True`. For strategies not listed, spot-check a sample to confirm they do not use lvls2.
3. **Module descriptions**: For each module listed in the architecture tables, verify the file exists and its actual content matches the described role. Flag modules that have been renamed, removed, or whose responsibilities have shifted.
4. **Test inventory**: Verify documented test file names exist, test counts match reality (run `pytest --co -q` on each test file or directory), and golden test counts are accurate.
5. **CLI flags and commands**: Spot-check documented CLI flags against the actual argument parsers in entry-point files (`xtrade.py`, `xdataprep.py`, `xmodeling.py`).
6. **Import and tech stack claims**: Spot-check claims about which libraries are used where (e.g., "pybit for Bybit", "talipp for indicators"). Verify a sample of stated imports actually exist in the referenced modules.
7. **Data flow and directory paths**: Verify documented directory paths (`data/00_orig/`, `data/02_final/`, etc.) and data flow descriptions match actual code references.
8. **Class/function signatures**: When docs describe specific function signatures, parameters, or return types, verify a sample against the actual code.

### Phase 3: Compile Findings

Present findings grouped by severity:

**🔴 Factual errors** — Documentation contradicts the code (wrong names, wrong counts, nonexistent modules/functions, incorrect behavior descriptions):
For each: quote the doc text, state what file/line it appears in, and state what the code actually shows.

**🟡 Stale or incomplete** — Documentation is outdated or missing coverage for something that exists in code (missing strategies, undocumented modules, outdated counts):
For each: state what is missing or outdated and where it should be documented.

**🔵 Internal inconsistencies** — Documentation files disagree with each other but you cannot determine which is correct without deeper investigation:
For each: quote both conflicting statements with file locations.

If a category has no findings, state that explicitly.

**Do not propose edits.** Only report the discrepancies with enough detail that they can be acted on.
