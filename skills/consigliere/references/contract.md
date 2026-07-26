# Il Contratto — Work Order Format

The Contratto is the complete context for one work package. It does **not**
see the conversation between Consigliere and requester. What isn't in the
Contratto, or in an artifact it points to, doesn't exist for the Capo.

A Contratto covers a whole work package and is issued **once**. Execution
inside it runs through four phases (see `Phase chain` below); each phase is a
fresh agent dispatch carrying a short **Phase Brief** derived from this
Contratto, not a renegotiation of it.

## Contratto template

```markdown
# CONTRATTO C-<n>: <Title>

**Famiglia:** codice | disegno | mercato | <other>
**Issued by:** Consigliere
**Plan:** .commission/<slug>/plan.md, step <n>
**Worktree:** <path>, branch <branch-name> (created by the Consigliere before phase 1)
**Libraries (Codice only):** custom-only | allowed — the Don's explicit answer, never assumed

## Objective
<One sentence: what exists afterward that didn't exist before.>

## Context
<Everything the Capo needs to know: system environment, affected modules,
existing conventions, why this is needed.>

## Prior work
<Results of dependent Contratti — concrete paths, not secondhand summaries.
Carry forward the `Handoff` section of every upstream Rapporto verbatim.>
- C-1 delivered: `docs/design/checkout.md` (approved on …) — Handoff: …

## Acceptance criteria
<Numbered, individually verifiable, phrased as an observable fact.
For software, phrased so each AC can be written as a test.>

- **AC-1:** …
- **AC-2:** …

## Constraints
- Do not touch: <paths/modules>
- Must follow: <conventions, libraries, style rules>
- No new dependencies without asking first

## Out of scope
- …

## Artifacts
| Path | Kind |
|------|------|
| `src/…` | to change |
| `tests/…` | new |

## Acceptance
Revisore: `<revisore-agent-name>`
The Rapporto only reaches the Consigliere after `Verdetto: approvato`.
```

## Quality rules for acceptance criteria

Bad (not verifiable):
> AC-1: The rate limiter works well.

Good (verifiable):
> AC-1: At more than 100 requests per minute per IP, the API responds with
> HTTP 429 and a `Retry-After` header.
> AC-2: Requests below the limit pass through unchanged.
> AC-3: The limit is configurable via `RATE_LIMIT_PER_MINUTE`, default 100.

Rule of thumb: if the Revisore can't answer the AC with "yes/no + evidence",
it's not an AC — it's a wish. Rewrite it.

## Ambiguity is not a reason to stop

An unclear AC or an underspecified detail inside an otherwise workable
Contratto is not escalated back to the Consigliere. The Capo picks the most
reasonable reading, documents it as an assumption (in `design.md`, carried
into the Rapporto's `Assumptions` section), and proceeds. The Consigliere
reviews every assumption at acceptance time and issues a rework Contratto if
one doesn't hold.

`Outcome: failed` is reserved for missing **prerequisites**, not ambiguity:
a required upstream artifact is absent (e.g. no approved Disegno concept for
a visible change), a named tool/access is unavailable, or the ACs are
structurally impossible to satisfy as stated.

**One exception that is never an assumption:** for Codice, whether existing
libraries/modules/plugins may be used at all. The Consigliere always asks the
Don this explicitly and records the answer in `Libraries` above — a Capo
never infers it from context. `custom-only` means no new dependency, full
stop. `allowed` means Capo Codice may dispatch its internal
`ricercatore-codice` during Research to vet candidates (license, maintenance,
known CVEs) before Design picks one — see `references/families.md`.

## Phase chain

Every work package runs through four phases. Each phase is dispatched as a
**fresh** agent call in the same worktree — never resume an agent into the
next phase. Phases read the prior phase's artifact from the work-package
directory, never from conversation memory.

**Where things live.** The work-package directory sits in the **main
checkout**, not in the worktree:
`<repo-root>/.commission/<slug>/<n>-<famiglia>/`. A worktree is a fresh
checkout of a branch, so anything written to `.commission/` before the
worktree was created is not visible inside it. Every Phase Brief therefore
names the work-package directory by **absolute** path, and phase agents read
and write their artifacts there while `cd`-ed into the worktree for the
actual work. Deliverables — source, tests, `docs/design/<slug>.md`, mockups
— live in the worktree and are committed there; `.commission/` is gitignored
and never merged.

| Phase | Produces | Who reviews before continuing |
|-------|----------|-------------------------------|
| Research | `research.md` — codebase/context findings, viable approaches with trade-offs | — |
| Design | `design.md` — chosen approach, refined ACs, assumptions, risks | **Consigliere gate** (structural) |
| Plan | `plan.md` — ordered checklist of concrete steps, one per AC-relevant change | **Consigliere gate** (structural) |
| Implement | `report.md` — the Rapporto (see `references/report.md`) | **Revisore** (full verification) |

Research and Design may be produced by the same agent call in one sitting
when the work package is small or the Famiglia's doctrine says so (Disegno's
Concept phase always collapses Research+Design this way; its Build phase
always collapses Plan+Implement). Plan and Implement are never collapsed —
a plan the Consigliere hasn't gated is not a plan an implementer executes
against.

Disegno's Concept→Build gate is the one exception to "gate reviews are
structural": it's the **Don's** explicit approval, rendered in-browser by the
Consigliere via the `Artifact` tool, not a self-judged structural read — see
`references/families.md`.

**Gate reviews are structural, not exhaustive**: the Consigliere checks
`design.md`/`plan.md` against the Contratto's Objective, ACs, and Constraints
— skim headings, spot-read the decision points — and escalates to the
requester only on a genuine deviation from the original ask. Deep
verification of the finished work stays the Revisore's job.

## Phase Brief template

What the Consigliere hands to each phase's fresh agent — short, self-contained:

```markdown
# PHASE BRIEF: C-<n> — <research|design|plan|implement>

**Worktree:** <absolute path> (already checked out on <branch>) — do the work here
**Work package:** <absolute path>/.commission/<slug>/<n>-<famiglia>/
  — in the main checkout, NOT under the worktree. Read and write your phase
  artifacts here, by absolute path.
**Read first:** <work package>/contract.md
  <plus the prior phase's artifact, if any>
**Produce:** <work package>/<phase-artifact>.md
**Boundaries:** <what this phase must NOT do — e.g. "no code changes in
  research", "no implementation ahead of an approved plan">
**Resume check:** if this work package's worktree already has commits or a
  partial artifact for this phase, verify what's done before adding anything
  — continue, don't restart, never duplicate.
```

Both paths are absolute and both are given: the worktree is where the work
happens and where commits land; the work package is where the phase
artifacts are read and written. Never let a phase agent guess either one.

No questions in a Phase Brief — ambiguities become assumptions per the rule
above.

## Scoping

One Contratto = one Capo = one coherent work package, run through its full
phase chain. If the AC list grows past roughly seven items, or spans multiple
domains, split into multiple Contratti instead of one oversized one.
