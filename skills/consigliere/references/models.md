# Model Policy

## Principle

Model strength follows the **kind of thinking work**, not the importance of
the task.

| Kind of work | Model |
|---------------|-------|
| Decompose, weigh trade-offs, find gaps, judge | opus |
| Execute against a precise spec | sonnet |
| Search, gather, summarize | haiku |

## Assignment

| Agent | Model | Rationale |
|-------|-------|-----------|
| Consigliere (main loop) | opus | Decomposition and acceptance are pure reasoning. The Consigliere makes the decisions everyone else executes. |
| `revisore-codice` | opus | Must find what the Capo missed — harder than doing the work. A weak Revisore is worse than none: it produces false confidence. |
| `revisore-disegno` | opus | Judges consistency, user flow, accessibility — holistic, not rule-based. |
| `revisore-mercato` | opus | Checks positioning logic and whether claims are backed by evidence. |
| `capo-codice` | sonnet | Works against a Contratto with testable ACs. The TDD cycle supplies the guidance that would otherwise require deep reasoning. |
| `capo-disegno` | sonnet | The concept phase is structurally prescribed; the doctrine substitutes for reasoning depth. |
| `capo-mercato` | sonnet | Copy production against a given brief. |
| `occhio` | haiku | Broad search, high token volume, shallow judgment depth. |
| `ricercatore-codice` | sonnet | Evaluates candidates against a concrete rubric (license, maintenance activity, CVEs) — bounded research, not open-ended judgment. The final pick still passes through the Design gate and, at Implement, the Revisore. |

## Escalation

The Consigliere may **upgrade** a model when the Contratto matches one of
these:

- Acceptance criteria can't be phrased as testable (poorly defined space ⇒
  the Capo must exercise its own judgment).
- The order involves security, concurrency, data migration, or money flows.
- A Capo has already failed the same Contratto twice.

An upgrade is noted in the Contratto:
`**Model escalation:** opus — reason: concurrency in the scheduler`

Downgrading is never allowed: a Revisore never runs below opus.

## Model identifiers

Agent frontmatter uses aliases (`opus`, `sonnet`, `haiku`, `inherit`), not
full model IDs, so definitions stay valid across model generations.
