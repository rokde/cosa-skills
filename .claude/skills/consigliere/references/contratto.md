# Il Contratto — Format des Arbeitsauftrags

Der Contratto ist der vollständige Kontext eines Capo. Er sieht das Gespräch
zwischen Consigliere und Auftraggeber **nicht**. Was nicht im Contratto steht,
existiert für ihn nicht.

## Vorlage

```markdown
# CONTRATTO C-<n>: <Titel>

**Famiglia:** codice | disegno | mercato | <weitere>
**Erteilt von:** Consigliere
**Piano:** .commissione/<slug>/piano.md, Schritt <n>

## Obiettivo
<Ein Satz: was existiert danach, das vorher nicht existierte.>

## Kontext
<Alles, was der Capo wissen muss: Systemumgebung, betroffene Module,
bestehende Konventionen, warum das gebraucht wird.>

## Vorarbeit
<Ergebnisse abhängiger Contratti. Konkrete Pfade, keine Zusammenfassungen aus
zweiter Hand. Bei Disegno-Vorarbeit: Pfad zum freigegebenen Mockup.>
- C-1 lieferte: `docs/mockups/checkout.md` (freigegeben am …)

## Akzeptanzkriterien
<Nummeriert, einzeln prüfbar, formuliert als beobachtbare Tatsache.
Bei Software so, dass jedes AK als Test schreibbar ist.>

- **AK-1:** …
- **AK-2:** …

## Constraints
- Nicht anfassen: <Pfade/Module>
- Einzuhalten: <Konventionen, Bibliotheken, Stilvorgaben>
- Keine neuen Abhängigkeiten ohne Rückfrage

## Nicht im Umfang
- …

## Artefakte
| Pfad | Art |
|------|-----|
| `src/…` | zu ändern |
| `tests/…` | neu |

## Abnahme
Revisore: `<revisore-agent-name>`
Der Rapporto geht erst nach `Verdetto: approvato` an den Consigliere zurück.
```

## Qualitätsregeln für Akzeptanzkriterien

Schlecht (nicht prüfbar):
> AK-1: Der Rate-Limiter funktioniert gut.

Gut (prüfbar):
> AK-1: Bei mehr als 100 Anfragen pro Minute und IP antwortet die API mit
> HTTP 429 und Header `Retry-After`.
> AK-2: Anfragen unterhalb des Limits werden unverändert durchgereicht.
> AK-3: Das Limit ist über `RATE_LIMIT_PER_MINUTE` konfigurierbar, Default 100.

Faustregel: Kann der Revisore das AK nicht mit „ja/nein + Beleg" beantworten,
ist es kein AK, sondern ein Wunsch. Umformulieren.

## Zuschnitt

Ein Contratto = ein Capo = ein zusammenhängendes Artefakt. Wird die
AK-Liste länger als etwa sieben Punkte oder betrifft sie mehrere Domänen,
teile den Contratto auf.
