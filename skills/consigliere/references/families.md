# Le Famiglie — Register

Authoritative registry. The Consigliere only delegates to Famiglie listed
here. New Famiglia → `skills/nuova-famiglia/SKILL.md`.

## Famiglia Codice — Software

| Role | Agent | Model |
|------|-------|-------|
| Capo | `capo-codice` | sonnet |
| Revisore | `revisore-codice` | opus |
| Ricercatore (internal, optional) | `ricercatore-codice` | sonnet |

**Doctrine:** `famiglia-codice` — strictly test-driven, Red→Green→Refactor.
**Phase chain:** all four phases stand alone — research, design, plan,
implement — no collapsing.
**Handles:** implementation, refactoring, bug fixes, tests, migrations,
build and CI configuration.
**Does not handle:** visual concepts (→ Disegno). UI code is implemented by
Codice, but only after an approved Disegno artifact.
**Library research:** when the Contratto's `Libraries` field is `allowed`,
Capo Codice dispatches `ricercatore-codice` during Research to evaluate
candidate libraries/modules for license compatibility, maintenance/currency,
and known CVEs/issues, before Design picks one. Not a top-level dispatch
target for the Consigliere and not a fourth part of the Famiglia — an
internal helper the Capo calls itself, the same way it calls the Revisore,
except it produces findings, not a Rapporto, so it has no Revisore of its
own (same reasoning as L'Occhio below).

## Famiglia Disegno — Visual & UX

| Role | Agent | Model |
|------|-------|-------|
| Capo | `capo-disegno` | sonnet |
| Revisore | `revisore-disegno` | opus |

**Doctrine:** `famiglia-disegno` — concept before code.
**Phase chain:** collapsed into two: Concept (research+design) and Build
(plan+implement). Gate between them is the **Don's** explicit approval, not
a Consigliere structural read — the Consigliere renders the concept (and any
HTML mockups) via the `Artifact` tool so the Don can view it in-browser
before Build is dispatched.
**Handles:** mockups, wireframes, design concepts, UI specifications, layout,
interaction design, design tokens, accessibility, plus implementing an
approved concept into markup/styles.
**Trigger:** anything a human sees on screen. Even "just a button."

## Famiglia Mercato — Marketing & Communication

| Role | Agent | Model |
|------|-------|-------|
| Capo | `capo-mercato` | sonnet |
| Revisore | `revisore-mercato` | opus |

**Doctrine:** `famiglia-mercato` — audience and proof of claims before copy.
**Phase chain:** all four phases stand alone — research, design, plan,
implement — no collapsing.
**Handles:** positioning, messaging, go-to-market plans, landing page copy,
campaigns, content plans, competitive analysis.

## L'Occhio — Recon

| Role | Agent | Model |
|------|-------|-------|
| Osservatore | `occhio` | haiku |

**No Revisore** — L'Occhio produces no deliverable, only facts. Read-only.
**Handles:** taking stock of a codebase, locating files and patterns,
summarizing existing documentation, research.
**Rule:** the Consigliere uses L'Occhio before planning against unfamiliar
existing work.

## Selection guide

| Order contains … | Famiglia |
|-------------------|----------|
| Function, endpoint, bug, test, deployment | codice |
| Screen, layout, color, component, user flow | disegno, then codice |
| Audience, message, launch, pricing, outward-facing copy | mercato |
| "What does this actually look like right now?" | occhio |

If more than one applies, write more than one Contratto — never a mixed one.
