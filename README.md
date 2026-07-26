# Cosa Claude

Ein Skill- und Agent-System für Claude Code nach dem Prinzip der *Commissione*:
Ein **Consigliere** plant und orchestriert, spezialisierte **Famiglie** setzen um,
und jede Famiglia hat ihren eigenen **Revisore**, der die Arbeit abnimmt, bevor
sie zurück an den Consigliere geht.

## Prinzip

```
                       ┌──────────────────┐
   Auftrag  ─────────► │   CONSIGLIERE    │  plant, delegiert, nimmt ab
                       │   (Hauptskill)   │  schreibt NIEMALS Code
                       └────────┬─────────┘
                                │ CONTRATTO
                ┌───────────────┼───────────────┐
                ▼               ▼               ▼
        ┌──────────────┐ ┌─────────────┐ ┌─────────────┐
        │ Capo Codice  │ │Capo Disegno │ │ Capo Mercato│   setzt um
        └──────┬───────┘ └──────┬──────┘ └──────┬──────┘
               │ Werk           │               │
               ▼                ▼               ▼
        ┌──────────────┐ ┌─────────────┐ ┌─────────────┐
        │Revisore Cod. │ │Revisore Dis.│ │Revisore Mer.│   prüft, gibt frei
        └──────┬───────┘ └──────┬──────┘ └──────┬──────┘
               └────────────────┼───────────────┘
                                │ RAPPORTO (nur bei `approvato`)
                                ▼
                       ┌──────────────────┐
                       │   CONSIGLIERE    │  Abnahme gegen Contratto
                       └──────────────────┘
```

Kernregel: **Ein Rapporto erreicht den Consigliere erst, wenn der Revisore
`approvato` vergeben hat.** Der Consigliere glaubt dem Rapporto nicht — er prüft
die Belege gegen die Akzeptanzkriterien des eigenen Contratto.

## Verzeichnisstruktur

```
.claude/
├── agents/                       Subagent-Definitionen (Ausführende)
│   ├── capo-codice.md            Implementierung, strikt testgetrieben
│   ├── revisore-codice.md        Code-Abnahme
│   ├── capo-disegno.md           Visuelle Konzepte & UI-Implementierung
│   ├── revisore-disegno.md       Design-Abnahme
│   ├── capo-mercato.md           Marketing, Positionierung, Content
│   ├── revisore-mercato.md       Marketing-Abnahme
│   └── occhio.md                 Aufklärung, read-only Recherche
└── skills/                       Doktrin (das WIE)
    ├── consigliere/              Hauptskill — Orchestrierung
    │   └── references/
    │       ├── contratto.md      Format des Arbeitsauftrags
    │       ├── rapporto.md       Format von Bericht & Verdikt
    │       ├── famiglie.md       Register aller Famiglie
    │       └── modelli.md        Modell-Policy
    ├── famiglia-codice/          Doktrin Softwareentwicklung (TDD)
    ├── famiglia-disegno/         Doktrin Visuelles (Konzept vor Code)
    ├── famiglia-mercato/         Doktrin Marketing
    └── nuova-famiglia/           Anleitung: neue Famiglia gründen
```

## Benutzung

```
/consigliere Baue mir einen Rate-Limiter für die API
```

Oder einfach eine Aufgabe stellen — der Consigliere-Skill greift bei
mehrstufigen Aufgaben automatisch.

## Zwei nicht verhandelbare Doktrinen

1. **Software wird testgetrieben gebaut.** Roter Test zuerst, Beleg im Rapporto.
   Kein Test = kein `approvato`. Siehe `famiglia-codice`.
2. **Visuelles wird erst gezeichnet, dann gebaut.** Mockup/Designentwurf muss
   vom Consigliere freigegeben sein, bevor Implementierung startet.
   Siehe `famiglia-disegno`.

## Modell-Policy (Kurzfassung)

| Rolle          | Modell | Warum |
|----------------|--------|-------|
| Consigliere    | opus   | Planung, Zerlegung, Abnahme — reines Reasoning |
| Revisori       | opus   | Qualitäts-Gate, muss Lücken finden, nicht nur lesen |
| Capi           | sonnet | Ausführung gegen einen präzisen Contratto |
| Occhio         | haiku  | Breites Suchen, Sammeln, Zusammenfassen |

Details und Eskalationsregeln: `.claude/skills/consigliere/references/modelli.md`

## Erweitern

Neue Spezialisierung nötig? `.claude/skills/nuova-famiglia/SKILL.md` beschreibt
den Bauplan: Capo + Revisore + Doktrin-Skill + Eintrag im Register.
