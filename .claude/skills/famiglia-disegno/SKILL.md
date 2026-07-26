---
name: famiglia-disegno
description: Use when a task involves anything a person will see — screens, layouts, components, flows, visual identity. The doctrine of the Famiglia Disegno: concept before code, in two separate phases with an approval gate between them. Also read this before reviewing as Revisore Disegno.
---

# Famiglia Disegno — Doktrin

Wir zeichnen, bevor wir bauen. Ein Entwurf kostet Minuten, eine falsch gebaute
Oberfläche kostet Tage.

<EXTREMELY-IMPORTANT>
Zwischen Konzept und Umsetzung liegt ein **Freigabe-Tor**. Ohne Freigabe des
Consigliere wird keine Zeile Oberflächencode geschrieben — auch nicht
„schon mal vorbereitend".
</EXTREMELY-IMPORTANT>

## Zwei Phasen

```
PHASE 1 — CONCETTO           PHASE 2 — COSTRUZIONE
Mockups, Varianten,   ──►    Umsetzung des freigegebenen
Begründung                   Entwurfs
        │                            ▲
        └──── Freigabe Consigliere ──┘
```

Ein Contratto adressiert immer nur **eine** Phase. Steht in deinem Contratto
Phase 2 ohne freigegebenes Konzept unter `Vorarbeit`: zurückgeben.

## Phase 1 — Il Concetto

Liefergegenstand: ein Dokument unter `docs/disegno/<slug>.md`.

### 1. Verstehen, bevor gezeichnet wird

- Wer nutzt das? In welcher Situation, unter welchem Druck?
- Was ist die **eine** Handlung, die dieser Screen ermöglichen soll?
- Welche Zustände gibt es? Leer, lädt, Fehler, wenig Daten, sehr viele Daten,
  ohne Berechtigung.
- Welches Bestandsdesign gibt es schon? (Design-Tokens, Komponenten,
  Typografie, Abstände) — du fügst dich ein.

### 2. Mindestens zwei Varianten

Eine einzige Variante ist keine Entwurfsarbeit, sondern ein Reflex. Zeichne
zwei bis drei ernstgemeinte Optionen mit unterschiedlichem Ansatz, nicht drei
Abwandlungen derselben Idee.

Darstellungsform, je nach Kontext:
- ASCII-/Textwireframe für Layout und Hierarchie
- Statisches HTML-Mockup, wenn Interaktion oder Zustände gezeigt werden müssen
- Komponentenbaum plus Zustandstabelle für Systemarbeit

### 3. Dokumentformat

```markdown
# Concetto: <Name>

## Aufgabe
<Was der Nutzer hier erreichen will. Ein Satz.>

## Kontext & Einschränkungen
- Zielgerät/Breakpoints:
- Bestehendes Designsystem:
- Barrierefreiheits-Anforderung:

## Variante A — <Leitgedanke>
<Wireframe>
**Stärke:** … **Schwäche:** …

## Variante B — <Leitgedanke>
<Wireframe>
**Stärke:** … **Schwäche:** …

## Empfehlung
<Welche und warum — bezogen auf die Aufgabe, nicht auf Geschmack.>

## Zustände
| Zustand | Darstellung |
|---------|-------------|
| leer / lädt / Fehler / voll | … |

## Responsive Verhalten
| Breakpoint | Änderung |

## Barrierefreiheit
- Tastaturreihenfolge:
- Kontrastverhältnisse:
- Beschriftungen für Screenreader:

## Offene Entscheidungen für den Consigliere
- …
```

## Phase 2 — La Costruzione

Erst nach Freigabe. Regeln:

- **Der Entwurf ist verbindlich.** Abweichung nur mit Vermerk unter `Deviazioni`
  im Rapporto und nur mit sachlichem Grund (technisch unmöglich, Widerspruch zum
  Designsystem).
- Bestehende Tokens und Komponenten wiederverwenden. Neue Farbe, neuer Abstand,
  neue Schriftgröße nur, wenn im Entwurf ausdrücklich begründet.
- Alle im Konzept genannten Zustände werden gebaut, nicht nur der Idealfall.
- Semantisches Markup. Tastaturbedienbarkeit. Sichtbarer Fokus.
- Belege im Rapporto: Screenshot oder gerenderte Ausgabe pro Zustand, sofern
  das Projekt das hergibt.

Ist der Umsetzungsanteil überwiegend Logik statt Oberfläche, gehört er in einen
Codice-Contratto — dann arbeitet Codice gegen dein freigegebenes Konzept.

## Rote Flaggen

| Gedanke | Wirklichkeit |
|---------|--------------|
| „Ist nur ein Button, ich baue direkt." | Sichtbar ⇒ Konzept zuerst. |
| „Eine Variante reicht, sie ist offensichtlich." | Dann ist die zweite schnell gezeichnet und beweist es. |
| „Fehlerzustand mache ich später." | Zustände unvollständig ⇒ `respinto`. |
| „Sieht schöner aus, wenn ich hier abweiche." | Abweichung ohne Vermerk ⇒ `respinto`. |
| „Barrierefreiheit ist nicht im Contratto." | Sie ist immer im Contratto. |
