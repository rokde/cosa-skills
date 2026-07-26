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
**Tooling baseline:** Codice always uses the project's existing test, lint,
and static-analysis tools, and sets up the missing ones as part of the work
package (PHP: Pest/PHPUnit, PHPStan, Rector — JS/TS: Vitest,
ESLint+Prettier). Don't scope that out of a Contratto and don't ask the Don
about it — it's doctrine, and dev tooling is exempt from
`Libraries: custom-only`.
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
**Artifact paths:** Concept output is a deliverable, so it lives in the
worktree at `docs/design/<slug>.md` (+ `docs/design/<slug>/<variant>.html`)
and is committed — not as `research.md`/`design.md` in the work package.
Build's Rapporto goes to the work package as `report.md`, like every other
Famiglia's.
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

## Famiglia Impresa — Idea & Business Assessment

| Role | Agent | Model |
|------|-------|-------|
| Capo | `capo-impresa` | opus |
| Revisore | `revisore-impresa` | opus |

**Doctrine:** `famiglia-impresa` — the burden of proof lies on the idea.
**Phase chain:** all four phases stand alone — research, design, plan,
implement — no collapsing.
**Deliverable:** `docs/assessment/<slug>.md` in the worktree, committed,
ending in `pursue` | `pursue-if` | `too-early` | `drop`. `report.md` goes to
the work package as usual and points at it.
**Handles:** grilling a product idea, feature bet, or venture across six
dimensions — problem, solution/feasibility, market fit, launch survival,
sustained operation, business case. Build-or-not decisions, "is this a good
business" questions, post-mortem viability checks on something already
running.
**Does not handle:** building it (→ Codice), designing it (→ Disegno),
selling it (→ Mercato). No legal or tax advice — regulatory exposure is
named as a risk, not answered.
**Boundary against Mercato:** Mercato positions a product whose existence is
already decided; Impresa decides whether it should exist. Where both are
wanted, Impresa runs first and Mercato consumes its assessment as
`Prior work`. Never one mixed Contratto.
**A `drop` is a successful work package** — `Outcome: completed` with a
negative recommendation. Don't reissue a rework Contratto hoping for a
friendlier answer; the way to overturn a `drop` is new evidence, and that's
a new Contratto that says so.

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
| "Should we build this at all?", idea, viability, business case | impresa |
| "What does this actually look like right now?" | occhio |

If more than one applies, write more than one Contratto — never a mixed one.
