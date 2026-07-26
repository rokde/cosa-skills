# Il Rapporto & Il Verdetto

Zwei Dokumente, zwei Absender:

- **Rapporto** — der Capo berichtet, was er getan hat. Geht zuerst an den Revisore.
- **Verdetto** — der Revisore urteilt. Erst `approvato` öffnet den Weg zum Consigliere.

## Rapporto (Capo → Revisore → Consigliere)

```markdown
# RAPPORTO C-<n>

**Esito:** completato | parziale | fallito
**Famiglia:** <name>

## Akzeptanzkriterien
| AK | Status | Beleg |
|----|--------|-------|
| AK-1 | erfüllt | `tests/rate_limit_test.py::test_over_limit_returns_429` |
| AK-2 | erfüllt | `tests/rate_limit_test.py::test_under_limit_passes` |
| AK-3 | nicht erfüllt | siehe Offene Punkte |

## Vorgehen
<Kurz: welcher Weg gewählt wurde und warum. Bei Software: die TDD-Zyklen.>

## Geänderte Artefakte
| Pfad | Art | Kern der Änderung |
|------|-----|-------------------|

## Verifikation
<Tatsächlich ausgeführte Befehle und echter Ausgabeauszug. Keine Nacherzählung.>

```
$ pytest tests/rate_limit_test.py
12 passed in 0.84s
```

## Deviazioni
<Wo vom Contratto abgewichen wurde und warum. Leer heißt: keine Abweichung —
das ist eine Zusicherung, keine Auslassung.>

## Offene Punkte / Risiken
- …
```

### Belegregeln

Ein Beleg ist eines von:
- Testname, der das Kriterium abdeckt
- `pfad/datei.ext:zeile`
- Befehl + tatsächlicher Ausgabeauszug
- Pfad zu einem Artefakt (Mockup, Dokument)

Kein Beleg: „wurde implementiert", „getestet", „funktioniert wie gewünscht".

## Verdetto (Revisore)

```markdown
# VERDETTO C-<n>

**Verdetto:** approvato | respinto
**Revisore:** <agent-name>
**Runde:** <1..3>

## Prüfung der Akzeptanzkriterien
| AK | Behauptung Capo | Eigene Prüfung | Ergebnis |
|----|-----------------|----------------|----------|
| AK-1 | erfüllt | Test ausgeführt, schlägt fehl wenn Limit entfernt | bestätigt |
| AK-2 | erfüllt | Test prüft nur Statuscode, nicht Weiterleitung | **nicht bestätigt** |

## Blocker
<Nur bei `respinto`. Jeder Blocker: was ist falsch, wo, was muss passieren.>
1. …

## Anmerkungen ohne Blockerwirkung
- …
```

### Regeln für den Revisore

- Du prüfst **selbst**, nicht durch Lesen des Rapporto. Tests ausführen, Dateien
  öffnen, Behauptungen gegenprüfen.
- Ein nicht belegtes AK ist ein **Blocker**, auch wenn die Umsetzung stimmt.
- Geschmacksfragen sind Anmerkungen, keine Blocker.
- Bei `respinto` geht die Arbeit zurück an den Capo, nicht an den Consigliere.
- Nach **drei** Runden ohne `approvato`: Eskalation an den Consigliere mit
  `Verdetto: respinto` und dem Vermerk `Eskalation: Runde 3 erreicht`.

## Der Kreislauf

```
Capo ──Rapporto──► Revisore ──respinto──► Capo (Runde+1)
                       │
                    approvato
                       ▼
                  Consigliere ──Abnahme fehlgeschlagen──► neuer Contratto
```
