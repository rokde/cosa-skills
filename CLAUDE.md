# Cosa Claude — Project Instructions

This repository defines an orchestration system of Claude Code skills and
agents. The content *is* the product: markdown definitions, no application code.

## Working conventions in this repo

- Language of all artifacts: **English**. Role and protocol terms stay
  Italian: `Consigliere`, `Capo`, `Revisore`, `Famiglia`, `Contratto`,
  `Rapporto`, `Verdetto`. Everything else — prose, headings, field values,
  generated file and directory names — is English.
- Agent files live flat under `.claude/agents/<name>.md`.
- Skills live under `.claude/skills/<name>/SKILL.md`, supporting material in
  `references/` next to them.
- Every Famiglia always has **three** parts: doctrine skill, Capo agent,
  Revisore agent. No Famiglia without a Revisore.
- Generated working documents use English names: `plan.md`, `docs/design/`,
  `.commission/` — not their Italian equivalents.

## When changing definitions

1. If you change the Contratto or Rapporto format, update **every** agent
   that uses it — the protocol is the contract between them.
2. New Famiglia → an entry in
   `.claude/skills/consigliere/references/families.md` is mandatory,
   otherwise the Consigliere won't find it.
3. Only change model assignment per
   `.claude/skills/consigliere/references/models.md`.

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
