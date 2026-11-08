# Umsetzung der UX-Überarbeitungsliste

Stand: 8. November 2026. Alle 17 Aufgaben aus der [bewerteten Liste](ueberarbeitungsliste.md) sind in `index.html` implementiert. Die Anwendung bleibt eine einzelne offline nutzbare HTML-Datei ohne externe Laufzeitabhängigkeiten. Die optional zurückgestellten Änderungen an H1 und Messraster wurden nicht hinzugefügt.

## Umgesetztes Verhalten

| Aufgabe | Umsetzung |
|---|---|
| T01 | Verwendete Frequenz, Videoabschnitt, Erkennungsschwelle und Bild-/PNG-Maße stehen dauerhaft am Ergebnis. Änderungen markieren es als vorheriges Ergebnis und benennen den Download entsprechend. Raster und Zeitleiste wirken direkt. „Ergebnis ansehen“ führt vom Originalvideo zum Resultat, ohne während der Verarbeitung Tabs zu sperren. |
| T02 | Neuerstellung mit Messarbeit sowie Entfernen/Ersetzen eines Ergebnisses nennen den tatsächlichen Verlustumfang und lassen sich abbrechen. Einzelnes und gesammeltes Löschen bieten Rückgängig direkt im Dialog. Ein unlesbares Ersatzvideo erhält den vorherigen Arbeitsstand. |
| T03 | Pfeiltasten steuern ein sichtbares Fadenkreuz; Umschalt bewegt um zehn Pixel, Enter setzt Punkte, Rücktaste verwirft einen Entwurfspunkt. Vier Koordinatenfelder korrigieren vorhandene Endpunkte; die Beschriftung ist per Tastatur verschiebbar. Punktposition und nächster Schritt werden als Text ausgegeben. |
| T04 | Dateiaktionen führen zu einem sinnvollen Fokusziel. Die Messliste stellt den Fokus nach Auswahl wieder her und führt nach Löschung zum Nachbareintrag. Sichtbarkeit verwendet einen stabilen Namen mit gedrücktem Zustand. |
| T05 | Zahlformat, negative Werte, Videogrenzen, Reihenfolge, Frequenz und Bildanzahl werden konkret validiert. Fehler stehen am Feld mit `aria-invalid` und zugeordnetem Hinweis. Eingabeänderungen werden verzögert angekündigt. |
| T06 | Einzelbilder nennen Zeit seit Abschnittsbeginn und absolute Videoposition. Die Auswahl hat einen programmatischen Zustand. Der PNG-Zeittext wird umgebrochen, sodass die Zeitbasis auch bei schmalen Bildern erhalten bleibt. |
| T07 | Einzelbild- und Bewegungswarnungen bleiben am Ergebnis sichtbar und bieten einen direkten Weg zur passenden Einstellung. |
| T08 | Endpunkte lassen sich ziehen oder numerisch korrigieren. Bei Änderung der Referenz bleibt die bekannte physische Länge erhalten; der Maßstab wird entsprechend neu berechnet. Messpunkte und Linien berücksichtigen die Darstellungsgröße. Zoom, Einpassen und ein ausdrücklicher Verschiebemodus erlauben Touch-Navigation ohne neue Messpunkte. |
| T09 | „Video ersetzen“ und Drop auf die vorhandene Dateikarte funktionieren. Die neue Datei wird vor dem Austausch geprüft. Ladefehler stehen bei der Auswahl; Entfernen stellt einen konsistenten Leerzustand her. Das Entfernen-Ziel ist mindestens 44 CSS-Pixel breit. |
| T10 | Ein nativer Verlassenshinweis schützt vorhandene Ergebnisse und Messarbeit. Er bleibt nach PNG-Export aktiv, weil dieser keinen editierbaren Arbeitsstand sichert. Die Speichergrenze ist sichtbar erklärt. Bei bestätigtem Entfernen wird der Hinweis abgemeldet. Es gibt keine automatische Sitzungswiederherstellung. |
| T11 | Relevante Kleinschrift ist vergrößert. Die beiden beanstandeten Textkombinationen erreichen im hellen Theme 5,65:1 und 5,54:1. Mobile Texteingaben verwenden mindestens 16 Pixel. |
| T12 | Zwei Aktionen übernehmen die aktuelle Videoposition als Start oder Ende. Exakte manuelle Eingaben bleiben möglich. |
| T13 | „Messen“ ist sichtbar beschriftet. Die Hilfe erklärt den Referenzablauf mit 10 cm; die Kalibrierung steht vor der Messliste. Frequenzhilfe fokussiert die passende Erklärung. |
| T14 | Das Bild trägt unabhängig von der Frequenzsteuerung „Beispiel mit 10 Hz“. Ein lokaler Hinweis auf Verarbeitung ohne Upload und Offline-Nutzung bleibt auch mobil sichtbar. |
| T15 | Betroffene Dateien zeigen vorab Original- und verkleinerte Bildmaße. Die zusätzliche PNG-Zeitleiste wird erklärt; nach Erstellung stehen Bildfläche und vollständige PNG-Maße am Ergebnis. |
| T16 | Ein sichtbarer Button innerhalb des Vollbildelements beendet Vollbild und führt den Fokus zur Vorschauaktion zurück. |
| T17 | Das Originalvideo pausiert beim Öffnen der Messung. |

Die Rückgängig-Historie umfasst die letzten 30 Messaktionen. Sie schützt insbesondere Löschen, Punktsetzen, Punktkorrektur, Beschriftungsposition und Kalibrierung. Sie ist kein über einen Tab-Neustart hinaus gespeicherter Arbeitsstand.

## Nachweise

[tests/ux.cjs](../../tests/ux.cjs) verarbeitet synthetische, mit FFmpeg erzeugte Videos in lokalem Chromium. Der Test bedient die echte HTML-Datei über Tastatur, Maus und emulierte Touch-Ereignisse. [Die Testanleitung](../../tests/README.md) enthält Installation und Aufruf.

Geprüft werden:

- Validierung einschließlich deutschem Dezimalkomma, Übernahme der Videoposition, Zeitkennzeichnung, veraltete Ergebnisse und sofortige Overlays.
- Tastaturmessung, Kalibrierung, numerische und per Maus ausgeführte Endpunktkorrektur, Beschriftungsposition, Fokusführung, Löschen und vollständiges Wiederherstellen von drei Messungen mit unterschiedlichen Namen, Sichtbarkeiten und Längenanzeigen einschließlich Auswahl und Referenzmaßstab.
- Abbruch von Bestätigungen, erneute Auswahl derselben Datei nach abgebrochenem Videoersatz, Fehler beim Videoersatz, Verarbeitungsabbruch und erfolgreich bestätigte Neuerstellung.
- Pixelgenaue Übereinstimmung des heruntergeladenen PNG mit dem Ergebnis-Canvas. Der Dateiname gehört auch bei geänderten Einstellungen zum tatsächlich exportierten Ergebnis.
- Nativer Verlassenshinweis nach Export, Pausieren des Videos, Entfernen mit Fokusführung, Größenhinweis und Dateiersatz per Drop.
- Hochformatdarstellung mit und ohne Zeitleiste in Ergebnis- und Originalansicht, mobile Touch-Messung, Zoom und Verschieben ohne zusätzliche Messung, Koordinatenkorrektur und Eingabeschrift.
- Dauerhafte Einbildwarnung, sichtbarer Vollbildausstieg und Rückkehr des Fokus. Während des Laufs werden JavaScript-Ausnahmen erfasst.

[verify-findings.cjs](verify-findings.cjs) prüft ergänzend die originalen Validierungsfunktionen und die aktuellen Kontrastwerte. Es ersetzt den früheren Nachweis der inzwischen behobenen Fehler. Die ursprünglichen Audits bleiben als historische Bewertung erhalten.

## Einordnung der fünf Prüfaufträge

| Prüfauftrag | Ergebnis und Grenze |
|---|---|
| V01: Hochformatbeschnitt | Mit einem 720 × 1280 großen Video bestätigt. In der ursprünglichen Datei wurde das 464 CSS-Pixel hohe Bild in einem 352 Pixel hohen Bereich beschnitten. Nach der Korrektur passt es mit 350 Pixeln vollständig hinein. Ein kleines 180 × 320 großes Video zeigte den Fehler dagegen nicht. Die Regression prüft deshalb das größere Video. |
| V02: BFCache | Die Bereinigung widerruft die Videoquelle bei `pagehide.persisted` nicht mehr. Ein synthetisches Persisted-Ereignis erhält die lesbare Blob-Quelle. Die tatsächliche lokale Zurücknavigation wurde versucht, meldete aber `pageshow.persisted = false`. Dieser Lauf belegt deshalb keine echte BFCache-Rückkehr; dafür bleibt die Browser-Matrix offen. |
| V03: Dezimalkomma | Frequenz, Zeit und bekannte Länge verwenden denselben Parser. Komma und Punkt sind durch Logikprüfung und echte Chromium-Eingaben abgedeckt. Ein von der Browser-Locale abhängiges `type=number` wird für diese Werte nicht mehr verwendet. |
| V04: iOS-Eingabezoom | Eingabeschrift im mobilen Layout auf mindestens 16 Pixel gesetzt; Nutzerzoom bleibt erlaubt. Die CSS-Größe ist geprüft. Die Wirkung auf echtem iOS ist noch offen. |
| V05: Rückmeldungen | Meldungen während der Messung erscheinen in einer Live-Region innerhalb des Dialogs. Allgemeine Meldungen haben eine dauerhaft vorhandene Live-Region. Fortschrittsansagen erfolgen in Zehn-Prozent-Schritten. Sichtbarer Dialoghinweis ist geprüft; die tatsächliche Ansage mit Hilfsmitteln steht aus. |

## Verbleibende Abnahme außerhalb dieser Umgebung

Die automatisierten Browserläufe verwenden Chromium und eine mobile Emulation. Es wurden keine realen iPhones, iPads oder Android-Geräte, keine anderen Browser und kein Screenreader verwendet. Die semantischen Attribute und Tastaturabläufe sind geprüft; daraus folgt keine vollständige Barrierefreiheitszusage.

Vor einer breiten Freigabe bleiben die echten Geräteprüfungen, ein NVDA- oder VoiceOver-Durchlauf, die BFCache-Matrix sowie ein kurzer Bedienversuch mit Lernenden oder Lehrkräften erforderlich. Insbesondere muss der visuelle Bildinhalt für blinde Nutzer gesondert zugänglich beschrieben werden; eine Tastatursteuerung allein löst diese Frage nicht.
