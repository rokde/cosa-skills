# Le Famiglie — Register

Verbindliches Verzeichnis. Der Consigliere delegiert nur an hier gelistete
Agents. Neue Famiglia → `.claude/skills/nuova-famiglia/SKILL.md`.

## Famiglia Codice — Software

| Rolle | Agent | Modell |
|-------|-------|--------|
| Capo | `capo-codice` | sonnet |
| Revisore | `revisore-codice` | opus |

**Doktrin:** `famiglia-codice` — strikt testgetrieben, Rot→Grün→Refactor.
**Zuständig für:** Implementierung, Refactoring, Bugfixes, Tests, Migrationen,
Build- und CI-Konfiguration.
**Nicht zuständig für:** visuelle Konzeption (→ Disegno). UI-Code setzt Codice
um, aber erst nach freigegebenem Disegno-Artefakt.

## Famiglia Disegno — Visuelles & UX

| Rolle | Agent | Modell |
|-------|-------|--------|
| Capo | `capo-disegno` | sonnet |
| Revisore | `revisore-disegno` | opus |

**Doktrin:** `famiglia-disegno` — Konzept vor Code. Zweiphasig.
**Zuständig für:** Mockups, Wireframes, Designentwürfe, UI-Spezifikationen,
Layout, Interaktionsdesign, Design-Tokens, Barrierefreiheit, sowie die
Umsetzung freigegebener Entwürfe in Markup/Styles.
**Auslöser:** Alles, was ein Mensch am Bildschirm sieht. Auch „nur ein Button".

## Famiglia Mercato — Marketing & Kommunikation

| Rolle | Agent | Modell |
|-------|-------|--------|
| Capo | `capo-mercato` | sonnet |
| Revisore | `revisore-mercato` | opus |

**Doktrin:** `famiglia-mercato` — Zielgruppe und Wirkungsnachweis vor Text.
**Zuständig für:** Positionierung, Messaging, Go-to-Market-Pläne, Landingpage-
Texte, Kampagnen, Content-Pläne, Wettbewerbsanalyse.

## L'Occhio — Aufklärung

| Rolle | Agent | Modell |
|-------|-------|--------|
| Osservatore | `occhio` | haiku |

**Kein Revisore** — L'Occhio produziert kein Werk, nur Fakten. Read-only.
**Zuständig für:** Bestandsaufnahme im Code, Auffinden von Dateien und Mustern,
Zusammenfassen vorhandener Dokumentation, Recherche.
**Regel:** Der Consigliere nutzt L'Occhio, bevor er über fremden Bestand plant.

## Auswahlhilfe

| Auftrag enthält … | Famiglia |
|-------------------|----------|
| Funktion, Endpoint, Bug, Test, Deployment | codice |
| Screen, Layout, Farbe, Komponente, Nutzerfluss | disegno, dann codice |
| Zielgruppe, Botschaft, Launch, Preis, Text nach außen | mercato |
| „Wie sieht es hier eigentlich aus?" | occhio |

Mehrere zutreffend ⇒ mehrere Contratti, nicht ein gemischter.
