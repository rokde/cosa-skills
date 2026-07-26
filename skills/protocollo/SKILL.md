---
name: protocollo
description: Use when writing or reading a Rapporto or Verdetto, or when authoring a Contratto or Phase Brief — the wire format every Cosa agent shares. Every Capo loads this before delivering an Implement-phase Rapporto; every Revisore loads it before writing a Verdetto; the Consigliere loads it before issuing a Contratto.
---

# Il Protocollo — Contratto, Rapporto, Verdetto

The formats in this skill are the contract *between* the agents. Nobody
reinvents them per Famiglia; only the content of the acceptance criteria is
domain-specific.

- **Contratto** and **Phase Brief** — what the Consigliere issues. Format:
  `references/contract.md` in this skill's directory.
- **Rapporto** — the Capo reports what it did. Goes to the Revisore first.
  This is the `implement` phase's artifact — it lives at
  `<work package>/report.md`.
- **Verdetto** — the Revisore judges. Only `approvato` opens the path to
  the Consigliere. It lives next to the Rapporto at
  `<work package>/verdict-r<round>.md`.

The work package is the absolute path handed to you in the Phase Brief; it
sits in the main checkout, not inside the worktree.

## Rapporto (Capo → Revisore → Consigliere)

```markdown
# RAPPORTO C-<n>

**Outcome:** completed | partial | failed
**Famiglia:** <name>
**Worktree:** <path>, branch <branch-name>, commits: <short-sha>..<short-sha>

## Acceptance criteria
| AC | Status | Evidence |
|----|--------|----------|
| AC-1 | met | `tests/rate_limit_test.py::test_over_limit_returns_429` |
| AC-2 | met | `tests/rate_limit_test.py::test_under_limit_passes` |
| AC-3 | not met | see Open items |

## Approach
<Brief: which path was chosen and why. For software: the TDD cycles.>

## Assumptions
<Every ambiguity you resolved yourself instead of asking. What was unclear,
what you decided, why that's the reasonable reading. Empty means: nothing
was ambiguous — that's an assertion, not an omission.>
- A1: Contratto didn't specify X, assumed Y because Z.

## Changed artifacts
| Path | Kind | Core of the change |
|------|------|---------------------|

## Verification
<Commands actually run and real output excerpts. Not a paraphrase.>

```
$ pytest tests/rate_limit_test.py
12 passed in 0.84s
```

## Findings
<Surprises encountered along the way that the Consigliere should know about
even though they didn't block the work: unexpected tool/environment
behavior, a workaround you had to apply, existing code that contradicted the
Contratto's assumptions. Empty means: nothing surprising came up.>
- …

## Deviazioni
<Where and why the work deviated from the Contratto. Empty means: no
deviation — that's an assertion, not an omission.>

## Open items / risks
- …

## Handoff
<What the next phase or the next Contratto needs to know to build on this
correctly — the Consigliere copies this verbatim into the next Contratto's
"Prior work" section. Empty only if this is truly the last step.>
- …
```

### Evidence rules

Evidence is one of:
- A test name that covers the criterion
- `path/file.ext:line`
- A command plus its actual output excerpt
- A path to an artifact (mockup, document)

Not evidence: "was implemented", "was tested", "works as intended".

### Assumptions vs. Deviazioni

- **Assumption**: the Contratto was silent or ambiguous, you picked a
  reading and proceeded. Expected, not a fault — but the Consigliere reviews
  every one at acceptance.
- **Deviazione**: the Contratto was clear and you did something else anyway
  (scope change, different approach than instructed, skipped an AC). Needs
  explicit justification, and the Consigliere may reject it outright.

## Verdetto (Revisore)

```markdown
# VERDETTO C-<n>

**Verdetto:** approvato | respinto
**Revisore:** <agent-name>
**Round:** <1..3>

## Review of acceptance criteria
| AC | Capo's claim | Own check | Result |
|----|--------------|-----------|--------|
| AC-1 | met | ran the test, fails if the limit is removed | confirmed |
| AC-2 | met | test only checks status code, not pass-through | **not confirmed** |

## Blockers
<Only when `respinto`. Each blocker: what's wrong, where, what must happen.>
1. …

## Notes without blocking effect
- …
```

### Rules for the Revisore

- You verify **yourself**, not by reading the Rapporto. Run tests, open
  files, cross-check claims — inside the worktree named in the Rapporto.
- An unevidenced AC is a **blocker**, even if the implementation is correct.
- Taste is a note, not a blocker.
- An assumption is not automatically a blocker — check it's *reasonable*,
  not that it matches what you'd have picked. Whether it matches the
  requester's actual intent is the Consigliere's call, not yours.
- On `respinto`, the work goes back to the Capo, not to the Consigliere.
- After **three** rounds without `approvato`: escalate to the Consigliere with
  `Verdetto: respinto` and the note `Escalation: round 3 reached`.

## The cycle

```
Capo ──Rapporto──► Revisore ──respinto──► Capo (round+1)
                       │
                    approvato
                       ▼
                  Consigliere ──acceptance failed──► new Contratto
                       │
                  acceptance passed
                       ▼
              merge worktree, delete it, carry Handoff forward
```
