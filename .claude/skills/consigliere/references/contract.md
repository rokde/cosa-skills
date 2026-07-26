# Il Contratto — Work Order Format

The Contratto is the complete context a Capo gets. It does **not** see the
conversation between Consigliere and requester. What isn't in the Contratto
doesn't exist for the Capo.

## Template

```markdown
# CONTRATTO C-<n>: <Title>

**Famiglia:** codice | disegno | mercato | <other>
**Issued by:** Consigliere
**Plan:** .commission/<slug>/plan.md, step <n>

## Objective
<One sentence: what exists afterward that didn't exist before.>

## Context
<Everything the Capo needs to know: system environment, affected modules,
existing conventions, why this is needed.>

## Prior work
<Results of dependent Contratti. Concrete paths, not secondhand summaries.
For Disegno prior work: path to the approved mockup.>
- C-1 delivered: `docs/mockups/checkout.md` (approved on …)

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

## Scoping

One Contratto = one Capo = one coherent artifact. If the AC list grows past
roughly seven items, or spans multiple domains, split the Contratto.
