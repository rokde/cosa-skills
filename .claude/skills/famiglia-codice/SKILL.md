---
name: famiglia-codice
description: Use when implementing, refactoring, or fixing software under a Contratto — the doctrine of the Famiglia Codice. Strictly test-driven: a failing test exists before any production line. Runs as a four-phase chain (research, design, plan, implement). Also read this before reviewing code as Revisore Codice.
---

# Famiglia Codice — Doctrine

We build test-driven. No exceptions. Not out of preference, but because the
test is the only artifact that can back a claim in the Rapporto.

## The four phases

Codice never collapses phases. Each is a fresh dispatch against the same
worktree, reading the prior phase's artifact:

| Phase | You produce | Content |
|-------|--------------|---------|
| Research | `research.md` | Existing conventions, test framework, affected modules, viable approaches with trade-offs. No code changes. |
| Design | `design.md` | Chosen approach, ACs refined into concrete test descriptions, assumptions made, risks. Consigliere gates this. |
| Plan | `plan.md` | Ordered checklist, one red/green/refactor cycle per AC, as `- [ ]` items. Consigliere gates this. |
| Implement | `report.md` | The Rapporto — execute the plan, check items off, call the Revisore. |

Never skip straight to Implement because the change "looks obvious" — the
Design and Plan gates are what let the Consigliere catch a wrong approach
before code exists, not after.

## The cycle (inside Implement)

For **every** acceptance criterion in the plan:

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

## Ambiguity → assumption, not a question

An AC that's underspecified in a way you can reasonably resolve does **not**
stop the phase chain. Pick the most reasonable reading, write it down in
`design.md` under a clear "Assumptions" heading, carry it into the Rapporto,
and proceed. The Consigliere reviews it at acceptance — that's the check,
not a question mid-flight.

This is different from a missing **prerequisite**, which does stop you:

- The Contratto touches anything visible and `Prior work` has no approved
  Disegno artifact → `Outcome: failed`, don't invent a UI.
  Same rule for the Design phase: if you can't even produce a sound
  `design.md` without one, fail there instead of guessing at layout.
- A named tool, credential, or upstream artifact the Contratto promised is
  actually absent → `Outcome: failed`, state exactly what's missing.

Everything else — naming, edge-case behavior not spelled out, which of two
equally valid approaches to take — is an assumption, not a blocker.

## Resume, don't restart

If you're dispatched into a work package that already has commits or a
partial phase artifact (interrupted prior run), check `git log` in the
worktree and the existing `research.md`/`design.md`/`plan.md`/checked-off
items **before** doing anything. Continue from the last completed item.
Never redo work that's already there, never duplicate a commit.

## Before starting any phase

1. Read the Contratto (`contract.md` in the work package directory) fully,
   plus the prior phase's artifact.
2. Read the existing codebase: conventions, test framework, folder structure,
   naming. You conform to it, you don't invent a new style.
3. Check how tests are run in this project (`package.json`, `Makefile`,
   `pyproject.toml`, CI configuration).

## Boundaries

- No new dependency without explicit permission in the Contratto.
- Don't touch anything outside the artifacts named in the Contratto. Notice
  a bug nearby? Note it under `Open items` in the Rapporto, don't fix it.
- No commented-out code blocks, no `TODO` placeholders as a deliverable.
- Never disable, skip, or weaken an existing test to get green. A breaking
  existing test is a finding — not an obstacle.
- Commit inside your worktree as you go, with meaningful messages. You never
  merge into the base branch and you never push — that's the Consigliere's
  job, after `approvato`.

## Wrap-up (Implement phase)

1. Run the full test suite, not just the new tests.
2. Run the project's linter/typechecker, if any.
3. Write the Rapporto per `references/report.md` format, with real command
   output, the Assumptions carried over from `design.md`, and any Findings.
4. **Call the Revisore** (`revisore-codice`) and hand over the Contratto and
   Rapporto.
5. On `respinto`: work through the blockers, update the Rapporto, resubmit.

## Red flags

| Thought | Reality |
|---------|---------|
| "Too trivial for a test." | Then the test takes 30 seconds to write. |
| "I'll test it afterward." | Breaking the doctrine. The Revisore will reject it. |
| "The test is awkward, I'll mock it away." | An awkward test is a design smell. |
| "That old test was broken anyway." | Report the finding, don't delete it. |
| "I'll also clean up the neighboring module." | Outside the Contratto. Hands off. |
| "This AC is vague, let me fail and ask." | Assume the reasonable reading, document it, proceed. |
| "Design/Plan phase is overhead for such a small change." | The gate is what catches a wrong approach before code exists. |
