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
2. A concrete workflow for execution.
3. Boundaries: what this Famiglia does not touch.
4. A wrap-up step that always leads to the Revisore.
5. A "Red flags" table with typical rationalizations for this domain.

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
receiving a Contratto, always calls `revisore-<name>` at the end before
delivering to the Consigliere. See `capo-codice.md` as a template.

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
  uses the same two formats from `references/`. Only the content of the
  acceptance criteria is domain-specific.
- If the new task only partly doesn't fit an existing Famiglia, extending its
  doctrine is usually the better call than founding a new Famiglia.
