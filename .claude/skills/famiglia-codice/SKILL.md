---
name: famiglia-codice
description: Use when implementing, refactoring, or fixing software under a Contratto — the doctrine of the Famiglia Codice. Strictly test-driven: a failing test exists before any production line. Also read this before reviewing code as Revisore Codice.
---

# Famiglia Codice — Doktrin

Wir bauen testgetrieben. Ausnahmslos. Nicht weil es eine Vorliebe ist, sondern
weil der Test das einzige Artefakt ist, das eine Behauptung im Rapporto belegen kann.

## Der Zyklus

Für **jedes** Akzeptanzkriterium des Contratto:

```
ROSSO   → Test schreiben, der das AK prüft. Ausführen. Er MUSS fehlschlagen.
          Fehlermeldung lesen: schlägt er aus dem richtigen Grund fehl?
VERDE   → Minimale Produktionsänderung, bis der Test grün ist. Nichts darüber hinaus.
RIFARE  → Aufräumen bei durchgehend grünen Tests. Kein neues Verhalten.
```

<EXTREMELY-IMPORTANT>
Kein Produktionscode ohne vorher fehlgeschlagenen Test.
Hast du Code geschrieben, bevor der rote Test lief: Code zurücksetzen, Test
zuerst. „Ich schreibe den Test gleich danach" ist der Bruch der Doktrin.
</EXTREMELY-IMPORTANT>

### Warum Rot zuerst zwingend ist

Ein Test, den du nie hast fehlschlagen sehen, beweist nichts. Er kann
tautologisch sein, die falsche Sache prüfen oder gar nicht ausgeführt werden.
Der rote Lauf ist der Beweis, dass der Test das Verhalten wirklich beobachtet.

Notiere pro AK den roten Lauf für den Rapporto:

```
AK-1 rot:  test_over_limit_returns_429 — FAILED (AssertionError: 200 != 429)
AK-1 grün: test_over_limit_returns_429 — PASSED
```

## Testqualität

| Regel | Bedeutung |
|-------|-----------|
| Verhalten testen, nicht Implementierung | Refactoring darf keinen Test brechen |
| Ein Grund zu scheitern pro Test | Fehlermeldung zeigt sofort die Ursache |
| Aussagekräftiger Name | `test_<situation>_<erwartung>` |
| Echte Grenzen, keine Mocks des eigenen Codes | Mocke nur, was du nicht besitzt |
| Deterministisch | Keine Zeit, kein Zufall, keine Netzwerkabhängigkeit ohne Kontrolle |

Randfälle gehören dazu: leere Eingabe, Grenzwert, Grenzwert±1, Fehlerpfad,
Nebenläufigkeit falls relevant.

## Vor der Arbeit

1. Contratto vollständig lesen. AK unklar oder nicht testbar? **Nicht raten** —
   mit `Esito: fallito` und der konkreten Rückfrage an den Consigliere zurück.
2. Bestand lesen: bestehende Konventionen, Testframework, Ordnerstruktur,
   Namensgebung. Du fügst dich ein, du erfindest keinen neuen Stil.
3. Prüfen, wie Tests in diesem Projekt laufen (`package.json`, `Makefile`,
   `pyproject.toml`, CI-Konfiguration).

## Betrifft der Contratto Sichtbares?

Dann muss unter `Vorarbeit` ein freigegebenes Disegno-Artefakt stehen. Fehlt es:
**nicht implementieren**. Zurück an den Consigliere mit dem Hinweis, dass ein
Disegno-Contratto fehlt. Du erfindest keine Oberfläche.

## Grenzen

- Keine neue Abhängigkeit ohne ausdrückliche Erlaubnis im Contratto.
- Nichts außerhalb der im Contratto genannten Artefakte anfassen. Fällt dir
  daneben ein Fehler auf: in `Offene Punkte` des Rapporto vermerken, nicht beheben.
- Keine auskommentierten Codeblöcke, keine `TODO`-Platzhalter als Ergebnis.
- Kein Abschalten, Überspringen oder Aufweichen bestehender Tests, um grün zu
  werden. Ein bestehender Test, der bricht, ist ein Befund — kein Hindernis.

## Abschluss

1. Vollständige Testsuite laufen lassen, nicht nur die neuen Tests.
2. Linter/Typechecker des Projekts laufen lassen, falls vorhanden.
3. Rapporto nach `references/rapporto.md`-Format verfassen, mit echten
   Befehlsausgaben.
4. **Revisore rufen** (`revisore-codice`) und ihm Contratto + Rapporto übergeben.
5. Bei `respinto`: Blocker abarbeiten, Rapporto aktualisieren, erneut vorlegen.

## Rote Flaggen

| Gedanke | Wirklichkeit |
|---------|--------------|
| „Zu einfach für einen Test." | Dann ist der Test in 30 Sekunden geschrieben. |
| „Ich teste hinterher." | Bruch der Doktrin. Der Revisore weist es zurück. |
| „Der Test ist umständlich, ich mocke das weg." | Umständlicher Test = Signal für schlechtes Design. |
| „Der alte Test war sowieso kaputt." | Befund melden, nicht löschen. |
| „Ich räume gleich noch das Nachbarmodul auf." | Außerhalb des Contratto. Finger weg. |
