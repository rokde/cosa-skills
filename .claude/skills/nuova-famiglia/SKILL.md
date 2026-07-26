---
name: nuova-famiglia
description: Use when the user wants to add a new specialization to the Commissione — a new domain of work with its own Capo and Revisore, such as legal, data-analysis, or infrastructure. Walks through the required files so the Consigliere can find and dispatch to it.
---

# Neue Famiglia gründen

Jede Famiglia besteht aus **genau drei Teilen**. Fehlt einer, ist sie
unvollständig und wird vom Consigliere nicht genutzt.

```
.claude/skills/famiglia-<name>/SKILL.md   Doktrin — das WIE der Domäne
.claude/agents/capo-<name>.md             Ausführender Agent
.claude/agents/revisore-<name>.md         Prüfender Agent
```

Plus: Eintrag in `.claude/skills/consigliere/references/famiglie.md`.

## Schritt 1 — Domäne abgrenzen

Beantworten, bevor etwas geschrieben wird:

- Welches beobachtbare Artefakt liefert diese Famiglia? (nicht „Beratung",
  sondern ein Dokument, ein Diff, ein Plan mit Datum)
- Wodurch unterscheidet sich diese Domäne von den bestehenden Famiglie
  (`codice`, `disegno`, `mercato`)? Überschneidung ⇒ eher bestehende Famiglia
  erweitern als eine neue gründen.
- Was sind die branchentypischen Qualitätsfallen dieser Domäne? (bei Codice:
  ungetesteter Code; bei Legal: unbelegte Rechtsauffassung; usw.) — das wird
  die Kernregel der Doktrin.

## Schritt 2 — Doktrin schreiben

`famiglia-<name>/SKILL.md` folgt der Form der bestehenden Doktrinen:

1. Eine nicht verhandelbare Kernregel, die die typische Qualitätsfalle
   verhindert (siehe `famiglia-codice`: TDD verhindert unbelegte
   Funktionsbehauptungen).
2. Konkreter Ablauf für die Ausführung.
3. Grenzen: was diese Famiglia nicht anfasst.
4. Abschlussschritt, der zwingend zum Revisore führt.
5. Tabelle „Rote Flaggen" mit typischen Rationalisierungen dieser Domäne.

Frontmatter-`description` beginnt mit „Use when …" und benennt den Auslöser,
nicht den Inhalt.

## Schritt 3 — Capo-Agent

`agents/capo-<name>.md`:

```yaml
---
name: capo-<name>
description: <Wann dieser Capo eingesetzt wird, dritte Person, auslösend>
tools: <minimal nötige Menge>
model: sonnet
---
```

Inhalt: kurz. Verweist auf die Doktrin (`Skill: famiglia-<name>`), beschreibt
den Empfang eines Contratto, ruft am Ende immer `revisore-<name>` auf, bevor
er an den Consigliere liefert. Siehe `capo-codice.md` als Vorlage.

## Schritt 4 — Revisore-Agent

`agents/revisore-<name>.md`:

```yaml
---
name: revisore-<name>
description: <Wann dieser Revisore eingesetzt wird>
tools: <read-only wo möglich, plus Ausführung zum Verifizieren>
model: opus
---
```

Der Revisore prüft **selbst nach**, nicht nur den Text des Rapporto. Bei
Codice: Tests wirklich ausführen. Bei Mercato: Belege wirklich nachschlagen.
Übernimm das Verdetto-Format aus `references/rapporto.md` unverändert — es ist
das Protokoll, das der Consigliere über alle Famiglie hinweg erwartet.

## Schritt 5 — Register aktualisieren

In `.claude/skills/consigliere/references/famiglie.md` eine Zeile in der
Modelltabelle und einen Abschnitt analog zu den bestehenden Famiglie ergänzen.
**Ohne diesen Eintrag findet der Consigliere die Famiglia nicht** — er kennt
nur, was dort gelistet ist.

## Nicht vergessen

- Modellwahl folgt `references/modelli.md`: Capo sonnet, Revisore opus, es sei
  denn die Doktrin selbst zwingt zu Reasoning-Arbeit auch beim Capo.
- Contratto- und Rapporto-Format werden **nicht** neu erfunden — jede Famiglia
  nutzt dieselben zwei Formate aus `references/`. Nur der Inhalt der
  Akzeptanzkriterien ist domänenspezifisch.
- Passt die neue Aufgabe eigentlich nur teilweise nicht zu einer bestehenden
  Famiglia, ist meist eine Erweiterung der Doktrin die bessere Wahl als eine
  neue Famiglia.
