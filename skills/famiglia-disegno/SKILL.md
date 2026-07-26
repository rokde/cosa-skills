---
name: famiglia-disegno
description: Use when a task involves anything a person will see — screens, layouts, components, flows, visual identity. The doctrine of the Famiglia Disegno: concept before code, in two phases (Concept, Build) with an approval gate between them — the Famiglia's version of the standard research/design/plan/implement chain. Also read this before reviewing as Revisore Disegno.
---

# Famiglia Disegno — Doctrine

We draw before we build. A concept costs minutes; a wrongly built interface
costs days.

<EXTREMELY-IMPORTANT>
Between concept and build sits an **approval gate**. Without the
Consigliere's approval, no line of UI code is written — not even
"just to get a head start".
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
        └──── Consigliere gate ────────┘
```

A Contratto always addresses exactly **one** phase. If your Contratto asks
for Build without an approved Concept under `Prior work`: return it —
`Outcome: failed`, this is a missing prerequisite, not something to assume
your way past.

## Phase 1 — Concept

Deliverable: a document at `docs/design/<slug>.md` — this doubles as both
`research.md` and `design.md` for the work package; no need to write them
separately.

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
enough that a checklist genuinely helps.

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

## Red flags

| Thought | Reality |
|---------|---------|
| "It's just a button, I'll build it directly." | Visible ⇒ concept first. |
| "One variant is enough, it's obvious." | Then the second is quick to draw and proves it. |
| "I'll add the error state later." | Incomplete states ⇒ `respinto`. |
| "It looks nicer if I deviate here." | Undocumented deviation ⇒ `respinto`. |
| "Accessibility isn't in the Contratto." | It's always in the Contratto. |
| "No approved concept, I'll sketch one while I build." | `Outcome: failed`. Missing prerequisite, not an assumption. |
