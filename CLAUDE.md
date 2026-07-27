# Cosa — Project Instructions

This repository is a **Claude Code plugin**: `.claude-plugin/plugin.json` at
the root, with `skills/` and `agents/` alongside it. The content *is* the
product: markdown definitions, no application code.

## Working conventions in this repo

- Language of all artifacts: **English**. Role and protocol terms stay
  Italian: `Consigliere`, `Capo`, `Revisore`, `Famiglia`, `Contratto`,
  `Rapporto`, `Verdetto`, `Don` (the user), `Ricercatore` (internal research
  helper, currently only Famiglia Codice's `ricercatore-codice`). Everything
  else — prose, headings, field values, generated file and directory names —
  is English.
- Agent files live flat under `agents/<name>.md` (plugin root, not `.claude/`).
- Skills live under `skills/<name>/SKILL.md` (plugin root, not `.claude/`),
  supporting material in `references/` next to them.
- Only `plugin.json` goes inside `.claude-plugin/`. Every other directory
  (`skills/`, `agents/`) sits at the plugin root, next to it.
- Every Famiglia always has **three** top-level parts: doctrine skill, Capo
  agent, Revisore agent. No Famiglia without a Revisore. A Famiglia may add
  an internal helper agent that its own Capo dispatches (never the
  Consigliere directly) for a sub-task that produces findings, not a
  Rapporto — it has no Revisore of its own, same as L'Occhio. This doesn't
  count as a fourth top-level part. Precedent: Famiglia Codice's
  `ricercatore-codice`, dispatched by `capo-codice` during Research to vet
  third-party libraries.
- Generated working documents use English names: `plan.md`, `docs/design/`,
  `.commission/` — not their Italian equivalents. No generated file may be
  named `report*.md`, `summary*.md`, `findings*.md`, or `analysis*.md`:
  Claude Code's Write tool hard-refuses those for subagents, and Capi and
  Revisori are subagents. The Rapporto is therefore `phase-report.md`.
- All agents that dispatch another agent (a Capo calling its Revisore or an
  internal helper) need `Agent` in their `tools:` frontmatter — the doctrine
  prose alone doesn't grant that capability. Missing it makes the dispatch
  silently impossible and the Capo tends to self-review instead, defeating
  the point of an independent Verdetto.

## When changing definitions

1. If you change the Contratto or Rapporto format, update **every** agent
   that uses it — the protocol is the contract between them.
2. New Famiglia → an entry in
   `skills/consigliere/references/families.md` is mandatory,
   otherwise the Consigliere won't find it.
   The Contratto/Rapporto/Verdetto formats live in `skills/protocollo/` —
   one source of truth, referenced by skill name (`cosa:protocollo`), never
   copied into an agent or doctrine file and never linked by relative path
   from `agents/` (there is no `references/` sibling there).
3. Only change model assignment per
   `skills/consigliere/references/models.md`.

## Frontmatter conventions

Agents:
```yaml
---
name: kebab-case-name
description: When this agent is used (third person, triggering condition)
tools: Read, Grep, Glob, ...
model: opus | sonnet | haiku | inherit
---
```

Skills:
```yaml
---
name: kebab-case-name
description: Use when ... (trigger condition, not a description of contents)
---
```
