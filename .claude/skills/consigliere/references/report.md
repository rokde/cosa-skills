# Il Rapporto & Il Verdetto

Two documents, two senders:

- **Rapporto** — the Capo reports what it did. Goes to the Revisore first.
- **Verdetto** — the Revisore judges. Only `approvato` opens the path to
  the Consigliere.

## Rapporto (Capo → Revisore → Consigliere)

```markdown
# RAPPORTO C-<n>

**Outcome:** completed | partial | failed
**Famiglia:** <name>

## Acceptance criteria
| AC | Status | Evidence |
|----|--------|----------|
| AC-1 | met | `tests/rate_limit_test.py::test_over_limit_returns_429` |
| AC-2 | met | `tests/rate_limit_test.py::test_under_limit_passes` |
| AC-3 | not met | see Open items |

## Approach
<Brief: which path was chosen and why. For software: the TDD cycles.>

## Changed artifacts
| Path | Kind | Core of the change |
|------|------|---------------------|

## Verification
<Commands actually run and real output excerpts. Not a paraphrase.>

```
$ pytest tests/rate_limit_test.py
12 passed in 0.84s
```

## Deviazioni
<Where and why the work deviated from the Contratto. Empty means: no
deviation — that's an assertion, not an omission.>

## Open items / risks
- …
```

### Evidence rules

Evidence is one of:
- A test name that covers the criterion
- `path/file.ext:line`
- A command plus its actual output excerpt
- A path to an artifact (mockup, document)

Not evidence: "was implemented", "was tested", "works as intended".

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
  files, cross-check claims.
- An unevidenced AC is a **blocker**, even if the implementation is correct.
- Taste is a note, not a blocker.
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
```
