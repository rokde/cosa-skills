---
name: famiglia-disegno
description: Use when a task involves anything a person will see — screens, layouts, components, flows, visual identity. The doctrine of the Famiglia Disegno: concept before code, in two phases (Concept, Build) with an approval gate between them — the Famiglia's version of the standard research/design/plan/implement chain. Also read this before reviewing as Revisore Disegno.
---

# Famiglia Disegno — Doctrine

We draw before we build. A concept costs minutes; a wrongly built interface
costs days.

<EXTREMELY-IMPORTANT>
Between concept and build sits an **approval gate** — and the approver is
the **Don**, not the Consigliere. The Consigliere renders your concept
in-browser and gets an explicit yes from the Don before Build is dispatched.
No line of UI code is written on the Consigliere's own judgment call, not
even "just to get a head start".
</EXTREMELY-IMPORTANT>

## Two phases, mapped onto the standard chain

Every Contratto runs a research→design→plan→implement chain. Disegno is the
one Famiglia allowed to collapse it, because concept work and build work are
each naturally a single sitting:

```
PHASE 1 — CONCEPT              PHASE 2 — BUILD
(= Research + Design)   ──►    (= Plan + Implement)
Mockups, variants,             Implementation of the
rationale                      approved concept
        │                              ▲
        └──── Don approves it ─────────┘
             (rendered in-browser
              by the Consigliere)
```

A Contratto always addresses exactly **one** phase. If your Contratto asks
for Build without an approved Concept under `Prior work`: return it —
`Outcome: failed`, this is a missing prerequisite, not something to assume
your way past.

## Phase 1 — Concept

Deliverable: a document at `docs/design/<slug>.md` **in the worktree**,
committed there. It replaces `research.md` and `design.md` outright — you
write neither, and nothing of the Concept phase goes into the work-package
directory. The Consigliere's gate reads this file at this path; the Contratto
names the `<slug>` so there's nothing to guess.

That's the exception, not a second convention: everything else follows the
normal split — deliverables in the worktree, orchestration artifacts in the
work package (absolute path, main checkout). Build's Rapporto is an
orchestration artifact and goes to `<work package>/report.md` like every
other Famiglia's.

### 1. Understand before drawing

- Who uses this? In what situation, under what pressure?
- What is the **one** action this screen should enable?
- What states exist? Empty, loading, error, sparse data, dense data,
  unauthorized.
- What existing design already applies? (design tokens, components,
  typography, spacing) — you fit into it.

### 2. At least two variants

A single variant isn't concept work, it's a reflex. Draw two to three
genuinely different options with distinct approaches, not three variations
of the same idea.

Presentation form, depending on context:
- ASCII/text wireframe for layout and hierarchy
- Static HTML mockup when interaction or states need to be shown
- Component tree plus state table for systems work

### Renderable for the Don

The Consigliere shows this concept to the Don in-browser before approving
Build — that only works if what you hand back is actually renderable, not
just described in prose:

- ASCII/text wireframes: fine as-is inside `docs/design/<slug>.md` — it
  renders as Markdown.
- Anything where layout, color, or spacing actually matters: add a
  self-contained static HTML mockup per variant (or at least the recommended
  one) at `docs/design/<slug>/<variant>.html` — inline CSS, no external
  assets, no build step. The Consigliere cannot fix up a mockup that only
  renders after `npm install`.
- Link every HTML mockup file from the corresponding variant in
  `docs/design/<slug>.md` so the Consigliere finds it without guessing a
  filename.

### 3. Document format

```markdown
# Concept: <Name>

## Task
<What the user is trying to accomplish here. One sentence.>

## Context & constraints
- Target device/breakpoints:
- Existing design system:
- Accessibility requirement:

## Variant A — <Guiding idea>
<Wireframe>
**Strength:** … **Weakness:** …

## Variant B — <Guiding idea>
<Wireframe>
**Strength:** … **Weakness:** …

## Recommendation
<Which one and why — tied to the task, not to taste.>

## States
| State | Presentation |
|-------|--------------|
| empty / loading / error / full | … |

## Responsive behavior
| Breakpoint | Change |

## Accessibility
- Keyboard order:
- Contrast ratios:
- Screen reader labels:

## Assumptions
<Anything the Contratto left open that you resolved yourself — see
"Ambiguity → assumption" below. Not the same as "Open decisions".>

## Open decisions for the Consigliere
- …
```

Ambiguity that's genuinely a **judgment call about direction** (not a small
detail) belongs under "Open decisions" and is exactly what the Consigliere's
gate is for. A small, resolvable ambiguity (exact spacing, a label's
wording) is an assumption — decide it, document it, move on.

## Phase 2 — Build

Only after approval. This collapses Plan+Implement: work directly from the
approved concept, no separate `plan.md` needed unless the build is large
enough that a checklist genuinely helps — and if you write one, it goes in
the work package, not the worktree.

- **The concept is binding.** Deviation only noted under `Deviazioni` in the
  Rapporto, and only for a material reason (technically impossible,
  conflicts with the design system).
- Reuse existing tokens and components. A new color, spacing value, or font
  size only if the concept explicitly calls for it.
- All states named in the concept get built, not just the happy path.
- Semantic markup. Keyboard operability. Visible focus.
- Evidence in the Rapporto: screenshot or rendered output per state, if the
  project supports it.
- Commit inside your worktree as you go. You never merge into the base
  branch or push — the Consigliere does that after `approvato`.

If the build work is mostly logic rather than UI, it belongs in a Codice
Contratto — Codice then works against your approved concept.

## Resume, don't restart

Dispatched into a work package that already has commits or a partial
concept/build artifact? Check `git log` in the worktree and the existing
document first. Continue from what's there — never restart or duplicate.

## Where things live

Two directories, both handed to you by absolute path in the Phase Brief:

- **Worktree** — the checkout you `cd` into. `docs/design/<slug>.md`, the
  HTML mockups, and the built UI all live and get committed here.
- **Work package** (`.commission/<slug>/<n>-disegno/`) — in the **main
  checkout**, not under the worktree. `contract.md` is read here, and Build's
  `report.md` is written here.

## Red flags

| Thought | Reality |
|---------|---------|
| "It's just a button, I'll build it directly." | Visible ⇒ concept first. |
| "One variant is enough, it's obvious." | Then the second is quick to draw and proves it. |
| "I'll add the error state later." | Incomplete states ⇒ `respinto`. |
| "It looks nicer if I deviate here." | Undocumented deviation ⇒ `respinto`. |
| "Accessibility isn't in the Contratto." | It's always in the Contratto. |
| "No approved concept, I'll sketch one while I build." | `Outcome: failed`. Missing prerequisite, not an assumption. |
| "A prose description of the layout is enough, the Consigliere gets the idea." | The Don has to see it, not read about it. Ship a renderable mockup. |
