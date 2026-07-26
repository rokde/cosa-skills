---
name: famiglia-codice
description: Use when implementing, refactoring, or fixing software under a Contratto — the doctrine of the Famiglia Codice. Strictly test-driven: a failing test exists before any production line. Also read this before reviewing code as Revisore Codice.
---

# Famiglia Codice — Doctrine

We build test-driven. No exceptions. Not out of preference, but because the
test is the only artifact that can back a claim in the Rapporto.

## The cycle

For **every** acceptance criterion in the Contratto:

```
RED     → Write a test that checks the AC. Run it. It MUST fail.
          Read the failure message: does it fail for the right reason?
GREEN   → Minimal production change until the test passes. Nothing beyond that.
REFACTOR→ Clean up while everything stays green. No new behavior.
```

<EXTREMELY-IMPORTANT>
No production code without a test that failed first.
Wrote code before the red test ran? Revert it, write the test first. "I'll
add the test right after" is breaking the doctrine.
</EXTREMELY-IMPORTANT>

### Why red-first is non-negotiable

A test you never watched fail proves nothing. It can be tautological, check
the wrong thing, or never even run. The red run is proof that the test truly
observes the behavior.

Record the red run per AC for the Rapporto:

```
AC-1 red:   test_over_limit_returns_429 — FAILED (AssertionError: 200 != 429)
AC-1 green: test_over_limit_returns_429 — PASSED
```

## Test quality

| Rule | Meaning |
|------|---------|
| Test behavior, not implementation | Refactoring must not break a test |
| One reason to fail per test | The failure message shows the cause instantly |
| Meaningful name | `test_<situation>_<expectation>` |
| Real boundaries, don't mock your own code | Only mock what you don't own |
| Deterministic | No time, no randomness, no uncontrolled network dependency |

Edge cases belong in scope: empty input, boundary value, boundary±1, error
path, concurrency where relevant.

## Before starting work

1. Read the Contratto fully. AC unclear or not testable? **Don't guess** —
   return `Outcome: failed` with the concrete question to the Consigliere.
2. Read the existing codebase: conventions, test framework, folder structure,
   naming. You conform to it, you don't invent a new style.
3. Check how tests are run in this project (`package.json`, `Makefile`,
   `pyproject.toml`, CI configuration).

## Does the Contratto touch anything visible?

Then `Prior work` must contain an approved Disegno artifact. If it's missing:
**don't implement**. Return it to the Consigliere noting the missing Disegno
Contratto. You don't invent a UI.

## Boundaries

- No new dependency without explicit permission in the Contratto.
- Don't touch anything outside the artifacts named in the Contratto. Notice
  a bug nearby? Note it under `Open items` in the Rapporto, don't fix it.
- No commented-out code blocks, no `TODO` placeholders as a deliverable.
- Never disable, skip, or weaken an existing test to get green. A breaking
  existing test is a finding — not an obstacle.

## Wrap-up

1. Run the full test suite, not just the new tests.
2. Run the project's linter/typechecker, if any.
3. Write the Rapporto per `references/report.md` format, with real command
   output.
4. **Call the Revisore** (`revisore-codice`) and hand over Contratto + Rapporto.
5. On `respinto`: work through the blockers, update the Rapporto, resubmit.

## Red flags

| Thought | Reality |
|---------|---------|
| "Too trivial for a test." | Then the test takes 30 seconds to write. |
| "I'll test it afterward." | Breaking the doctrine. The Revisore will reject it. |
| "The test is awkward, I'll mock it away." | An awkward test is a design smell. |
| "That old test was broken anyway." | Report the finding, don't delete it. |
| "I'll also clean up the neighboring module." | Outside the Contratto. Hands off. |
