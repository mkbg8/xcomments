## Review This Issue

You previously flagged an issue during a review. You are now being asked to deeply re-examine that specific issue. Your goal is to either **confirm it with hard evidence** or **retract it**.

**Preamble**: Do not assume your original analysis was correct. Start from scratch.

### Phase 1: Re-derive the Claim

1. **Restate the issue**: In your own words, what exactly is the problem you flagged? What is the expected behavior, and what do you claim actually happens?
2. **Locate the code**: **Explicitly read** the exact file and lines involved. Do not rely on what you previously saw — the code in your context may be stale. Quote the specific lines that are relevant to the issue.
3. **Reconstruct the reasoning**: Step through the logic that led you to flag this. At each step, verify the factual claim against the code you just read. If any step in your reasoning chain does not hold, stop and retract the issue.

### Phase 2: Challenge Your Own Finding

4. **Alternative explanations**: List at least 2 alternative interpretations of the code that would make it correct. For each, **explicitly read** the surrounding code (callers, callees, type definitions, configuration) to determine whether the alternative holds. Only reject an alternative if the code concretely disproves it.
5. **Context you may have missed**: **Explicitly search** for:
   - Other call sites that might set up preconditions you did not account for.
   - Validation, normalization, or filtering that happens upstream of the flagged code.
   - Configuration, constants, or defaults that constrain inputs to a safe range.
   - Tests that exercise the flagged code path — if a test passes through this exact scenario and asserts correct behavior, that is strong counter-evidence.
   List every file and line number you checked.
6. **Reproduce the failure**: Construct a **concrete, minimal input** that would trigger the bug you described. Trace it through the actual code line by line. If you cannot construct a triggering input using values that realistically occur in this codebase, downgrade the issue to a theoretical risk and state why.

### Phase 3: Assess Impact

7. **Blast radius**: If the issue is confirmed, what breaks? A single function? A downstream pipeline? User-facing output? Quantify the scope.
8. **Silent vs. loud failure**: Would this issue cause a crash (loud, easy to catch) or silent data corruption / wrong results (dangerous, hard to catch)? This determines urgency.

### Phase 4: Verdict

Conclude with exactly one of:

- **✅ CONFIRMED** — The issue is real. State the concrete triggering input, the incorrect behavior it produces, and propose a fix.
- **⚠️ DOWNGRADED** — The issue is theoretically possible but unlikely given the actual usage patterns and upstream constraints in this codebase. State what would have to go wrong for it to trigger.
- **❌ RETRACTED** — Your original analysis was wrong. State specifically which assumption or reasoning step was incorrect, and what the code actually does.

Do not hedge. Pick one.