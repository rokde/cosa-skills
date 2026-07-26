# Modell-Policy

## Grundsatz

Modellstärke folgt der **Art der Denkarbeit**, nicht der Wichtigkeit der Aufgabe.

| Art der Arbeit | Modell |
|----------------|--------|
| Zerlegen, abwägen, Lücken finden, urteilen | opus |
| Ausführen gegen eine präzise Spezifikation | sonnet |
| Suchen, sammeln, zusammenfassen | haiku |

## Zuweisung

| Agent | Modell | Begründung |
|-------|--------|------------|
| Consigliere (Hauptloop) | opus | Zerlegung und Abnahme sind reines Reasoning. Der Consigliere trifft die Entscheidungen, die alle anderen ausführen. |
| `revisore-codice` | opus | Muss finden, was der Capo übersehen hat — schwerer als Umsetzen. Ein schwacher Revisore ist schlimmer als keiner: er erzeugt falsche Sicherheit. |
| `revisore-disegno` | opus | Beurteilt Konsistenz, Nutzerführung, Barrierefreiheit — ganzheitlich, nicht regelbasiert. |
| `revisore-mercato` | opus | Prüft Positionierungslogik und Belegbarkeit von Behauptungen. |
| `capo-codice` | sonnet | Arbeitet gegen einen Contratto mit testbaren AK. Der TDD-Zyklus liefert die Führung, die sonst Reasoning liefern müsste. |
| `capo-disegno` | sonnet | Konzeptphase ist strukturiert vorgegeben; die Doktrin ersetzt Reasoning-Tiefe. |
| `capo-mercato` | sonnet | Textproduktion gegen ein vorgegebenes Briefing. |
| `occhio` | haiku | Breite Suche, viele Tokens, geringe Urteilstiefe. |

## Eskalation

Der Consigliere darf ein Modell **hochstufen**, wenn im Contratto einer davon
zutrifft:

- Die Akzeptanzkriterien lassen sich nicht testbar formulieren (schlecht
  definierter Raum ⇒ der Capo muss selbst abwägen).
- Der Auftrag betrifft Sicherheit, Nebenläufigkeit, Datenmigration oder Geldflüsse.
- Ein Capo ist bereits zweimal am selben Contratto gescheitert.

Hochstufung wird im Contratto vermerkt:
`**Modell-Eskalation:** opus — Grund: Nebenläufigkeit im Scheduler`

Herabstufung ist nie erlaubt: ein Revisore läuft niemals unter opus.

## Modell-Bezeichner

In der Agent-Frontmatter werden Aliase verwendet (`opus`, `sonnet`, `haiku`,
`inherit`), nicht die vollen Modell-IDs. So bleiben die Definitionen über
Modellgenerationen hinweg gültig.
