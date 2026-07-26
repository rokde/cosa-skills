---
name: nuova-famiglia
description: Use when the user wants to add a new specialization to the Commissione — a new domain of work with its own Capo and Revisore, such as legal, data-analysis, or infrastructure. Walks through the required files so the Consigliere can find and dispatch to it.
---

# Founding a new Famiglia

Every Famiglia consists of **exactly three parts**. Missing one makes it
incomplete, and the Consigliere won't use it.

```
.claude/skills/famiglia-<name>/SKILL.md   Doctrine — the HOW of the domain
.claude/agents/capo-<name>.md             Executing agent
.claude/agents/revisore-<name>.md         Reviewing agent
```

Plus: an entry in `.claude/skills/consigliere/references/families.md`.

## Step 1 — Scope the domain

Answer before writing anything:

- What observable artifact does this Famiglia deliver? (not "advice", but a
  document, a diff, a dated plan)
- How does this domain differ from the existing Famiglie (`codice`,
  `disegno`, `mercato`)? Overlap ⇒ extend an existing Famiglia rather than
  founding a new one.
- What are the typical quality traps of this domain? (for Codice: untested
  code; for Legal: unsupported legal opinion; etc.) — this becomes the core
  rule of the doctrine.

## Step 2 — Write the doctrine

`famiglia-<name>/SKILL.md` follows the shape of the existing doctrines:

1. One non-negotiable core rule that prevents the domain's typical quality
   trap (see `famiglia-codice`: TDD prevents unevidenced claims of behavior).
2. How the standard **research → design → plan → implement** phase chain
   maps onto this domain — decide per phase what's produced, and whether any
   phases naturally collapse (only Disegno collapses today: Concept =
   research+design, Build = plan+implement). Plan and Implement are never
   collapsed.
3. The line between an **assumption** (ambiguity the Capo resolves itself,
   documents, and proceeds past) and a **missing prerequisite** (a genuine
   blocker, `Outcome: failed`) — every doctrine needs this distinction
   spelled out concretely for its domain, not just inherited by reference.
4. Boundaries: what this Famiglia does not touch.
5. A wrap-up step (Implement phase) that always leads to the Revisore.
6. A "Red flags" table with typical rationalizations for this domain.

Frontmatter `description` starts with "Use when …" and names the trigger,
not the content.

## Step 3 — Capo agent

`agents/capo-<name>.md`:

```yaml
---
name: capo-<name>
description: <When this Capo is used, third person, triggering condition>
tools: <minimal necessary set>
model: sonnet
---
```

Content: brief. References the doctrine (`Skill: famiglia-<name>`), describes
receiving a **Phase Brief** for one phase at a time (never the whole
Contratto in one dispatch), working inside the assigned worktree, resuming
instead of restarting if work is already there, and calling
`revisore-<name>` only at the end of the Implement phase before delivering
to the Consigliere. See `capo-codice.md` as a template.

## Step 4 — Revisore agent

`agents/revisore-<name>.md`:

```yaml
---
name: revisore-<name>
description: <When this Revisore is used>
tools: <read-only where possible, plus execution for verification>
model: opus
---
```

The Revisore verifies **itself**, not just the Rapporto's text. For Codice:
actually run the tests. For Mercato: actually look up the sources. Reuse the
Verdetto format from `references/report.md` unchanged — it's the protocol the
Consigliere expects across every Famiglia.

## Step 5 — Update the register

Add a row to the model table and a section analogous to the existing
Famiglie in `.claude/skills/consigliere/references/families.md`.
**Without this entry the Consigliere won't find the Famiglia** — it only
knows what's listed there.

## Don't forget

- Model choice follows `references/models.md`: Capo sonnet, Revisore opus,
  unless the doctrine itself forces reasoning-heavy work even for the Capo.
- The Contratto and Rapporto formats are **not** reinvented — every Famiglia
  uses the same two formats from `references/`, including the phase chain,
  the `Assumptions`/`Findings`/`Handoff` sections, and the worktree fields.
  Only the content of the acceptance criteria is domain-specific.
- Capi commit inside their own worktree; only the Consigliere merges into
  the base branch and deletes the worktree, after `approvato`. Never write a
  Capo that merges or pushes itself.
- If the new task only partly doesn't fit an existing Famiglia, extending its
  doctrine is usually the better call than founding a new Famiglia.
