## Review This File Thoroughly, Then Verify Findings

Do not edit anything — this is only a review. Perform a thorough review of the specified file, then rigorously re-examine your own findings before presenting them.

You will work in two internal passes. **Only present the final verified output** — do not show intermediate results, diagnostic steps, or retracted findings.

---

### Internal Pass 1: Thorough Review

Read the file in full before beginning.

1. **Purpose and Role**: What is this file's responsibility within the codebase? **Explicitly search** for all files that import from or reference this file to map its dependents.
2. **Dependencies**: List every module, class, and function this file imports or relies on. **Explicitly read** each dependency's interface (signature, return type, docstring) to confirm this file uses them correctly.
3. **Assumption Inventory**: For every function in this file, list the assumptions it makes about its inputs (types, ranges, nullability, shape), execution order, and external state. For each, determine whether it is **enforced** or **implicit**. Flag every implicit assumption.
4. **Trace representative inputs**: For each public function, construct at least 2 concrete input scenarios — one happy path and one boundary/degenerate case — and walk each through the function's control flow. Flag any scenario that crashes, silently returns wrong data, or swallows an error. Beyond argument-level boundary cases, consider **lifecycle/state boundary cases**: what states can the system or data structures be in when this function is called? (e.g., partially completed records, in-progress transactions, empty-but-not-None collections).
5. **Error handling audit**: For every operation that can fail, verify that a failure is caught and handled meaningfully or explicitly allowed to propagate. Flag bare `except`, swallowed exceptions, or missing error paths.
6. **Edge cases and invariants**: Identify race conditions, off-by-one errors, unintended mutation of shared state, or broken invariants. Pay special attention to mutable default arguments, global state modifications, and in-place vs. copy semantics.
7. **Data and State Flow**: Trace the lifecycle of every significant data structure created or mutated in this file. Verify downstream consumers receive data in the shape and type they expect. Flag implicit schema assumptions.
8. **Naming and Conventions**: Do names and patterns follow the conventions established in the rest of the codebase? **Read at least 2 neighboring files** to establish the baseline. Also read CLAUDE.md (or equivalent project instructions) and verify the file adheres to all stated constraints — tech stack restrictions, import order, type hint requirements, naming conventions, and prohibited patterns.
9. **Commenting and Documentation**: Flag missing comments on non-trivial logic and stale comments that no longer match the code.
10. **Dead code and redundancy**: Identify unreachable code paths, unused imports, unused variables, or duplicated logic.
11. **Complexity and Decomposition**: Flag any function longer than ~40 lines or with more than 3 levels of nesting. Identify concrete extraction points.
12. **Performance concerns**: Flag only concrete suboptimal patterns — unnecessary copies, repeated computation in loops, O(n²) where O(n) is possible.

Classify every finding internally as 🔴 (bug/correctness), 🟡 (risk/implicit assumption), or 🔵 (quality/maintainability).

---

### Internal Pass 2: Re-examine Every 🔴 and 🟡 Finding

**You are now adversarially re-examining your own findings. Do not assume Pass 1 was correct.**

Re-examine up to **5** of the most severe 🔴 and 🟡 findings (prioritizing 🔴). For each:

1. **Re-read the code**: **Explicitly open and read** the exact lines again. Do not reuse what you read during Pass 1.
2. **Alternative explanations**: List at least 2 interpretations that would make the code correct. **Explicitly read** callers, callees, type definitions, configuration, constants, and defaults. Only reject an alternative if the code concretely disproves it.
3. **Search for missed context**: **Explicitly search** for upstream validation, filtering, or constraints that narrow inputs to a safe range. Search for tests that exercise this code path. List every file and line you checked.
4. **Reproduce the failure**: Construct a concrete, minimal input that triggers the problem. Trace it line by line. If you cannot construct a realistic triggering input, downgrade the finding.
5. **Verdict**: Assign exactly one — ✅ CONFIRMED, ⚠️ DOWNGRADED, or ❌ RETRACTED. Discard retracted findings entirely.

---

### Output (this is the only thing you present)

**🔴 Confirmed bugs and correctness issues:**
For each: function name, line number, what goes wrong, a concrete triggering input, and a proposed fix.

**🟡 Confirmed risks (including downgraded items that remain yellow-severity):**
For each: function name, line number, what could go wrong and under what conditions, and a proposed fix or mitigation.

**🟡 Deferred risks (not re-examined due to context budget):**
If more than 5 🔴/🟡 findings existed, list the remainder here with a one-line description each. These should be individually verified using `/review_issue`.

**🔵 Quality and maintainability:**
List these as-is from Pass 1 — they do not require re-examination.

If no 🔴 or 🟡 findings survived verification, state that explicitly and explain why.