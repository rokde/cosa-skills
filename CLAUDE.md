# Cosa Claude — Projektanweisungen

Dieses Repository definiert ein Orchestrierungssystem aus Claude-Code-Skills und
-Agents. Der Inhalt *ist* das Produkt: Markdown-Definitionen, kein Applikationscode.

## Arbeitsweise in diesem Repo

- Sprache aller Artefakte: **Deutsch**. Rollen- und Protokollbegriffe bleiben
  italienisch (`Consigliere`, `Capo`, `Revisore`, `Contratto`, `Rapporto`, `Verdetto`).
- Agent-Dateien liegen flach unter `.claude/agents/<name>.md`.
- Skills liegen unter `.claude/skills/<name>/SKILL.md`, Zusatzmaterial in
  `references/` daneben.
- Jede Famiglia besteht immer aus **drei** Teilen: Doktrin-Skill, Capo-Agent,
  Revisore-Agent. Keine Famiglia ohne Revisore.

## Beim Ändern von Definitionen

1. Änderst du das Contratto- oder Rapporto-Format, aktualisiere **alle** Agents,
   die es verwenden — das Protokoll ist der Vertrag zwischen ihnen.
2. Neue Famiglia → Eintrag in
   `.claude/skills/consigliere/references/famiglie.md` ist Pflicht, sonst findet
   der Consigliere sie nicht.
3. Modellzuweisung nur gemäß
   `.claude/skills/consigliere/references/modelli.md` ändern.

## Frontmatter-Konventionen

Agents:
```yaml
---
name: kebab-case-name
description: Wann dieser Agent eingesetzt wird (in dritter Person, auslösend)
tools: Read, Grep, Glob, ...
model: opus | sonnet | haiku | inherit
---
```

Skills:
```yaml
---
name: kebab-case-name
description: Use when ... (Auslösebedingung, keine Beschreibung des Inhalts)
---
```
