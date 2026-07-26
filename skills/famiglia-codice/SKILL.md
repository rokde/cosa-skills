---
name: famiglia-codice
description: Use when implementing, refactoring, or fixing software under a Contratto — the doctrine of the Famiglia Codice. Strictly test-driven: a failing test exists before any production line, run through the project's own test/lint/static-analysis tooling — and where that tooling is missing, setting up the baseline is part of the job. Runs as a four-phase chain (research, design, plan, implement). Also read this before reviewing code as Revisore Codice.
---

# Famiglia Codice — Doctrine

We build test-driven. No exceptions. Not out of preference, but because the
test is the only artifact that can back a claim in the Rapporto.

## The four phases

Codice never collapses phases. Each is a fresh dispatch against the same
worktree, reading the prior phase's artifact:

| Phase | You produce | Content |
|-------|--------------|---------|
| Research | `research.md` | Existing conventions, test framework, affected modules, viable approaches with trade-offs. No code changes. If the Contratto's `Libraries` field is `allowed`, includes the `ricercatore-codice` library comparison (see below). |
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

## Tooling is part of the work, not a precondition

A test you can't run proves nothing, and a claim in the Rapporto that no tool
produced is just an opinion. So:

1. **Whatever the project already has, you use.** Test runner, linter,
   formatter, static analysis, type checker — detect them in Research, run
   them in Implement, paste their real output into the Rapporto. Never
   hand-roll a check the project already has a tool for, never bypass a
   configured tool because it's noisy.
2. **Whatever the baseline requires and the project lacks, you set up** — as
   part of this work package, before the first red test. A missing toolchain
   is not a missing prerequisite and never `Outcome: failed`; it's work.

### Minimum baseline

| Ecosystem | Tests | Static analysis | Style / refactoring |
|-----------|-------|-----------------|---------------------|
| PHP | Pest **or** PHPUnit | PHPStan (Larastan on Laravel) | Rector |
| JS / TS | Vitest (Jest if already established) | `tsc --noEmit` on TypeScript | ESLint + Prettier (or Biome for both) |
| Anything else | the ecosystem's standard runner | its standard static analysis | its standard linter/formatter |

For other ecosystems, pick the equivalent triple and name it in `design.md` —
Python: pytest, mypy, ruff. Go: `go test`, `go vet`, golangci-lint. Rust:
`cargo test`, `cargo clippy`, `cargo fmt`. Concrete install and run commands:
`references/tooling.md` next to this file.

Set up the baseline at its lowest useful level — a minimal config the project
passes, wired into a runnable command. Not a maximal ruleset that buries the
actual change under hundreds of pre-existing violations. Existing violations
outside your Contratto's artifacts are a `Findings` entry, not yours to fix.

### The two carve-outs this needs

- **`Libraries: custom-only` does not cover the toolchain.** That field is
  about production/runtime dependencies. A dev dependency that only runs
  tests, lint, or static analysis is exempt — no Ricercatore round needed
  for a baseline tool named in the table above, either. Record what you added
  and why in `design.md`, and list the config files under `Changed artifacts`
  in the Rapporto.
- **Tooling setup is not TDD-able and doesn't need a red test.** Its proof is
  the tool running: a passing (possibly empty) suite, a clean analysis run,
  real output in the Rapporto. Commit the setup separately from the first
  behavior cycle, then start Red→Green→Refactor normally.

### Per phase

| Phase | What tooling means here |
|-------|-------------------------|
| Research | Detect what exists — config files, `composer.json`/`package.json` scripts, CI. Write down which baseline slots are empty. |
| Design | Name the exact tools filling the gaps and the commands that will run them. |
| Plan | Setup is the first `- [ ]` item(s), ahead of every red/green cycle. |
| Implement | Set up, verify each tool runs, then implement. Wrap-up runs all of them. |

## Build from scratch, or reuse a library?

The Contratto's `Libraries` field settles this — the Consigliere always asked
the Don explicitly, so it's a constraint, not a gap you fill yourself:

- **`custom-only`**: no new dependency, full stop. Don't propose one "just to
  check" — that's the Boundaries rule below, not a discussion.
- **`allowed`**: before committing to an approach in Design, dispatch
  `ricercatore-codice` via the `Agent` tool for the need at hand (during the
  Research phase — that's where its findings belong). It returns a
  comparison table (candidate, license, last release, known CVEs, verdict)
  and a recommendation, which may be "build custom" if nothing clears the
  bar. Fold that table into `research.md`. Pick from it — or override it —
  in `design.md`, with your reasoning; the Revisore checks later that the
  choice actually matches what `ricercatore-codice` reported, not a
  rosier retelling of it.

Never skip the Ricercatore when `allowed` is set and a plausible off-the-shelf
option exists just because you already know a library by name — "I've used
this before" is not the same as "checked its license and current CVEs on
this Contratto."

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

## Where things live

Two directories, both handed to you by absolute path in the Phase Brief:

- **Worktree** — the checkout you `cd` into. All code, tests, and commits
  happen here.
- **Work package** (`.commission/<slug>/<n>-codice/`) — sits in the **main
  checkout**, not under the worktree. `contract.md` and every phase artifact
  (`research.md`, `design.md`, `plan.md`, `report.md`) are read and written
  here, by absolute path. Don't look for them inside the worktree; they
  aren't there and creating them there strands them.

## Before starting any phase

1. Read the Contratto (`contract.md` in the work package directory) fully,
   plus the prior phase's artifact.
2. Read the existing codebase: conventions, test framework, folder structure,
   naming. You conform to it, you don't invent a new style.
3. Check how tests, lint, and static analysis are run in this project
   (`composer.json`, `package.json`, `Makefile`, `pyproject.toml`, CI
   configuration) — and which of the baseline slots above have nothing in
   them.

## Boundaries

- No new **runtime** dependency without explicit permission in the Contratto
  (`Libraries: allowed`) and, when that permission was used, a
  `ricercatore-codice` finding backing the specific choice. Baseline dev
  tooling is exempt — see the carve-outs above.
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
2. Run **every** tool in the baseline — linter, formatter check, static
   analysis, type checker — whether it was already there or you set it up.
   Each one's real command and output goes into the Rapporto's `Verification`
   section. "No linter in this project" is only acceptable after you checked
   and then set one up.
3. Write the Rapporto per the `cosa:protocollo` format (load the skill —
   it is the single source of truth for Rapporto and Verdetto), with real
   command output, the Assumptions carried over from `design.md`, and any
   Findings.
4. **Call the Revisore** (`revisore-codice`) and hand over the Contratto, the
   Rapporto, the work-package path, and the review round — count the existing
   `verdict-r*.md` files in the work package and add one. The Revisore is a
   fresh dispatch with no memory of earlier rounds; you are the only
   participant that survives the loop, so the count is yours to keep.
5. On `respinto`: work through the blockers, update the Rapporto, resubmit at
   the next round.

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
| "I'll just add this popular package, everyone uses it." | Popular isn't vetted. Route it through `ricercatore-codice` for license/CVE/maintenance before it goes in `design.md`. |
| "This project has no test setup, so I can't do TDD here." | Then setting one up is step one of the plan, not a reason to skip the doctrine. |
| "Setting up PHPStan/ESLint is out of scope for this Contratto." | The baseline is doctrine. It's in scope by default. |
| "`Libraries: custom-only`, so I can't add Pest." | That field is about runtime dependencies. Dev tooling is exempt. |
| "PHPStan floods me with pre-existing errors, I'll leave it out." | Configure it at a level the project passes and report the rest as Findings. |
| "The linter is annoying, I'll skip it this once." | Its output is required evidence in the Rapporto. The Revisore runs it anyway. |
