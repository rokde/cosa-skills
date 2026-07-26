# Cosa Claude

A skill and agent system for Claude Code built on the *Commissione* principle:
a **Consigliere** plans and orchestrates, specialized **Famiglie** execute,
and every Famiglia has its own **Revisore** who signs off on the work before
it goes back to the Consigliere.

## Principle

```
                       ┌──────────────────┐
   Request  ─────────► │   CONSIGLIERE    │  plans, delegates, accepts
                       │   (main skill)   │  NEVER writes code
                       └────────┬─────────┘
                                │ CONTRATTO
                ┌───────────────┼───────────────┐
                ▼               ▼               ▼
        ┌──────────────┐ ┌─────────────┐ ┌─────────────┐
        │ Capo Codice  │ │Capo Disegno │ │ Capo Mercato│   executes
        └──────┬───────┘ └──────┬──────┘ └──────┬──────┘
               │ deliverable    │               │
               ▼                ▼               ▼
        ┌──────────────┐ ┌─────────────┐ ┌─────────────┐
        │Revisore Cod. │ │Revisore Dis.│ │Revisore Mer.│   checks, approves
        └──────┬───────┘ └──────┬──────┘ └──────┬──────┘
               └────────────────┼───────────────┘
                                │ RAPPORTO (only when `approvato`)
                                ▼
                       ┌──────────────────┐
                       │   CONSIGLIERE    │  accepts against the Contratto
                       └──────────────────┘
```

Core rule: **A Rapporto only reaches the Consigliere once its Revisore has
issued `approvato`.** The Consigliere doesn't trust the Rapporto — it checks
the evidence against its own Contratto's acceptance criteria.

## Directory structure

```
.claude/
├── agents/                       Subagent definitions (executors)
│   ├── capo-codice.md            Implementation, strictly test-driven
│   ├── revisore-codice.md        Code acceptance
│   ├── capo-disegno.md           Visual concepts & UI implementation
│   ├── revisore-disegno.md       Design acceptance
│   ├── capo-mercato.md           Marketing, positioning, content
│   ├── revisore-mercato.md       Marketing acceptance
│   └── occhio.md                 Recon, read-only research
└── skills/                       Doctrine (the HOW)
    ├── consigliere/              Main skill — orchestration
    │   └── references/
    │       ├── contract.md       Work order format
    │       ├── report.md         Report & verdict format
    │       ├── families.md       Registry of all Famiglie
    │       └── models.md         Model policy
    ├── famiglia-codice/          Software development doctrine (TDD)
    ├── famiglia-disegno/         Visual doctrine (concept before code)
    ├── famiglia-mercato/         Marketing doctrine
    └── nuova-famiglia/           Guide: founding a new Famiglia
```

Generated working documents also use English names: `.commission/<slug>/plan.md`
for plans, `docs/design/<slug>.md` for design concepts.

## Usage

```
/consigliere Build me a rate limiter for the API
```

Or just state a task — the Consigliere skill picks up multi-step work
automatically.

## Two non-negotiable doctrines

1. **Software is built test-driven.** Red test first, evidence in the
   Rapporto. No test = no `approvato`. See `famiglia-codice`.
2. **Visuals are drawn before they're built.** A mockup/design draft must be
   approved by the Consigliere before implementation starts.
   See `famiglia-disegno`.

## Model policy (short version)

| Role           | Model  | Why |
|----------------|--------|-----|
| Consigliere    | opus   | Planning, decomposition, acceptance — pure reasoning |
| Revisori       | opus   | Quality gate, must find gaps, not just read |
| Capi           | sonnet | Execution against a precise Contratto |
| Occhio         | haiku  | Broad search, gathering, summarizing |

Details and escalation rules: `.claude/skills/consigliere/references/models.md`

## Extending

Need a new specialization? `.claude/skills/nuova-famiglia/SKILL.md` describes
the blueprint: Capo + Revisore + doctrine skill + registry entry.
