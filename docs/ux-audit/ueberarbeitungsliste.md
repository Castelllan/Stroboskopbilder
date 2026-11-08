# STROBO: bewertete UX-Überarbeitungsliste

Umsetzung vom 8. November 2026: Alle 17 Aufgaben sind implementiert. [Umgesetztes Verhalten, Tests und offene Geräteabnahme](umsetzung.md). Die folgende Bewertung beschreibt den ursprünglichen Auditstand.

Stand: 7. November 2026. Geprüfter App-Stand: `42261c8d3d23ced0d62770dfc6805ada978609ed`, `index.html`, 1.392 Zeilen.

Die wichtigsten Überarbeitungen betreffen die Zuordnung von Einstellungen und Ergebnis, den Schutz der Messarbeit und die Tastaturbedienung der Messung. Diese drei Themen haben Vorrang, weil sie fachlich falsche Zuordnungen, verlorene Arbeit oder einen unzugänglichen Kernablauf verursachen können.

## Grundlage und Grenzen

[Kimi K3.1 Pro](kimi-k3.1-pro.md) und [DeepSeek V4.1 Flash](deepseek-v4.1-flash.md) haben über OpenCode unabhängig voneinander die Anwendung geprüft. Ihre 15 beziehungsweise 28 Befunde sind Ausgangsmaterial, keine 43 voneinander unabhängigen Fehler. Beide Audits basieren auf Codelektüre. Es gab keine Browser-, Video-, Geräte-, Screenreader- oder Nutzertests.

Für diese Zusammenführung wurden die Befunde mit den betroffenen HTML-, CSS- und JavaScript-Pfaden abgeglichen. Zum Auditzeitpunkt führte die damalige Version von `verify-findings.cjs` die originalen Funktionen für Einstellungen, Validierung, Export und Messungsreset mit kleinen DOM-Doubles aus. Die Kontrastwerte werden aus den tatsächlichen CSS-Farben berechnet. Der Lauf bestätigt:

- Neue Einstellung 20 Hz, vorhandenes Ergebnis und Download weiterhin 10 Hz. Die Anwendung markiert den Unterschied nicht ausdrücklich.
- Ein ungültiger Zeitbereich sperrt die Erstellung und schreibt die Erklärung in den allgemeinen Hinweis unter der Hauptaktion.
- `resetCalibration()` entfernt Messungen und Maßstab. Der Aufruf nach erfolgreicher Neuerstellung ist im Code belegt.
- Zwei relevante Farbkombinationen im hellen Theme liegen unter dem gewählten Kontrastziel von 4,5:1.

Die aktuelle Fassung prüft die behobene Validierung und die verbesserten Kontraste. Aufruf aus dem Projektverzeichnis:

```sh
node docs/ux-audit/verify-findings.cjs
```

Das ist eine Prüfung einzelner Originalfunktionen, kein Test der vollständigen Benutzeroberfläche. Aussagen über tatsächliche Fokuspositionen, Bildbeschnitt, Touch-Präzision oder Screenreader-Ansagen bleiben ohne entsprechenden Laufzeittest begrenzt. Die App wurde für das Audit nicht verändert.

## Bewertung und Reihenfolge

Schwere und Umsetzungsvorrang sind getrennt. Schwere 3 bedeutet erheblicher Verlust oder ein für eine Nutzergruppe blockierter Kernablauf. Schwere 2 bedeutet relevante Fehlergefahr oder Reibung. Schwere 1 bedeutet eine begrenzte Verständlichkeits- oder Komfortlücke. P1 wird zuerst überarbeitet, P2 anschließend, P3 bei der zugehörigen Oberflächenarbeit. Es wurde kein die gesamte Anwendung blockierender Defekt bestätigt.

Die Liste enthält 17 zusammengefasste Aufgaben. Bei heuristisch begründeten Aufgaben wird die vorgeschlagene Lösung vor größerer Umsetzung mit einem kurzen Bedienversuch geprüft. Die fünf gesonderten Prüfaufträge sind noch keine bestätigten Änderungsanforderungen.

| Aufgabe | Vorrang | Schwere | Überarbeitung |
|---|---|---|---|
| T01 | P1 | 3 | Angezeigtes Ergebnis und aktuelle Einstellungen eindeutig zuordnen |
| T02 | P1 | 3 | Messarbeit vor unbeabsichtigtem Löschen und Ersetzen schützen |
| T03 | P1 | 3 | Messen und Kalibrieren per Tastatur ermöglichen |
| T04 | P2 | 2 | Fokus bei Datei- und Messlistenaktionen erhalten |
| T05 | P2 | 2 | Eingaben feldnah, konkret und zugänglich validieren |
| T06 | P2 | 2 | Relative und absolute Zeit durchgehend unterscheiden |
| T07 | P2 | 2 | Qualitätswarnungen dauerhaft am Ergebnis zeigen |
| T08 | P2 | 2 | Messpunkte präzise setzen und nachträglich korrigieren |
| T09 | P2 | 2 | Videoersatz und Ladefehler verständlich behandeln |
| T10 | P2 | 2 | Ungesicherte Arbeit beim Verlassen schützen |
| T11 | P2 | 2 | Relevante Kleinschrift und Textkontraste verbessern |
| T12 | P2 | 2 | Zeitbereich aus der Videoposition übernehmen |
| T13 | P2 | 2 | Messung und Kalibrierung sichtbar erklären |
| T14 | P3 | 1 | Festes Beispiel und lokale Verarbeitung mobil kenntlich halten |
| T15 | P3 | 1 | Verkleinerung der Ausgabe vorab anzeigen |
| T16 | P3 | 1 | Sichtbaren Ausstieg aus Vollbild anbieten |
| T17 | P3 | 1 | Originalvideo beim Öffnen der Messung pausieren |

### T01: Angezeigtes Ergebnis und aktuelle Einstellungen eindeutig zuordnen

**Befund:** Belegt. Ein Ergebnis mit 10 Hz erstellen, dann 20 Hz, einen anderen Abschnitt oder eine andere Empfindlichkeit einstellen. Bild, Messungen und Export gehören weiterhin zum alten Ergebnis; ein dauerhafter Hinweis fehlt. Abbruch und Fehler bewahren das alte Ergebnis sinnvollerweise ebenfalls. Der PNG-Dateiname nennt korrekt die alten 10 Hz. Der Fehler ist daher die fehlende Kennzeichnung des Zustands, keine falsche Berechnung oder falsche Benennung der Datei.

**Änderung:** Die bei der Erstellung verwendeten Parameter am Ergebnis anzeigen. Nach relevanten Änderungen ausdrücklich erklären, dass die Einstellungen noch nicht angewendet sind, und eine Neuerstellung anbieten. Ein weiterhin erlaubter Export muss klar als Export des vorhandenen Ergebnisses bezeichnet sein. Das alte Ergebnis bis zum erfolgreichen Ersetzen erhalten. Raster und Zeitleiste wirken sofort und dürfen keine Veraltungswarnung auslösen.

**Abnahme:** Bei geändertem Hz-Wert, Start, Ende oder Empfindlichkeit sowie nach abgebrochener beziehungsweise fehlgeschlagener Neuerstellung ist die Parameterzuordnung ohne kurzlebige Meldung erkennbar. Bei Wechsel zum Originalvideo während der Verarbeitung ist anschließend eine dauerhafte Aktion „Ergebnis ansehen“ erreichbar. Den vom Nutzer gewählten Tab muss die App dafür nicht sperren oder ungefragt wechseln.

**Belege:** `index.html:905`, `1010`, `1052`, `1236`. Kimi STROBO-UX-001. DeepSeek nennt das veraltete Ergebnis im Fazit ohne eigene Befund-ID; UX-C04 betrifft die verwandte Abschlussorientierung.

### T02: Messarbeit vor unbeabsichtigtem Löschen und Ersetzen schützen

**Befund:** Belegt. Erfolgreiche Neuerstellung löscht sämtliche Messungen und den Maßstab. „Video entfernen“ verwirft zusätzlich das Ergebnis. Einzelnes Löschen und „Alle löschen“ bieten keine Wiederherstellung. „Alle löschen“ lässt den bisherigen Maßstab bestehen; dieser Unterschied zur Neuerstellung muss erhalten oder bewusst neu gestaltet werden.

**Änderung:** Vor dem Ersetzen eines vermessenen Ergebnisses den Verlustumfang nennen und Abbrechen beziehungsweise vorheriges Sichern ermöglichen. Videoentfernung mit ihrem tatsächlichen Umfang beschriften. Für einzelne und gesammelte Messungslöschungen eine im Dialog erreichbare Rückgängig-Aktion bevorzugen. Keine zusätzliche Bestätigung erzwingen, wenn noch keine Arbeit verloren geht. Messungen nicht ungeprüft auf ein neues Bild übertragen.

**Abnahme:** Drei benannte Strecken mit unterschiedlichen Sichtbarkeiten und kalibriertem Maßstab anlegen. Abbruch eines Ersetzens bewahrt alle Werte und das bisherige Ergebnis. Bestätigtes Ersetzen verwirft genau die angekündigten Daten. Rückgängig nach Messungslöschung stellt Punkte, Namen, Auswahl, Sichtbarkeit und Referenzbezug vollständig wieder her.

**Belege:** `index.html:934`, `942`, `952`, `1022`, `1218`, `1362`. Kimi 003, 010, 012. DeepSeek UX-V02, UX-D01, UX-M05.

**Neubewertung:** DeepSeeks Schwere 2 für Neuerstellung wird auf 3 angehoben. Die Möglichkeit, mehrere Messungen manuell neu anzulegen, macht einen stillen Verlust während eines normalen Verbesserungsschritts nicht geringfügig. Einzelnes Löschen bleibt innerhalb dieser Aufgabe Schwere 2.

### T03: Messen und Kalibrieren per Tastatur ermöglichen

**Befund:** Belegt. Der Mess-Canvas ist fokussierbar, besitzt aber ausschließlich Klick- und Pointer-Interaktionen. Ohne Zeiger lässt sich keine Referenzstrecke anlegen und damit kein Maßstab setzen.

**Änderung:** Ein sichtbares Fadenkreuz mit Pfeiltasten und Enter oder zugängliche Koordinatenfelder anbieten. Endpunkte und Beschriftungspositionen müssen korrigierbar sein. Den aktuellen Punkt, den nächsten Schritt und das Ergebnis verständlich als Text bereitstellen. Koordinatenfelder allein machen den visuellen Bildinhalt noch nicht für blinde Nutzer verständlich; das muss gesondert mit Hilfsmitteln geprüft werden.

**Abnahme:** Ausschließlich mit Tastatur eine Strecke setzen, korrigieren, benennen, auswählen, kalibrieren und löschen sowie ein PNG herunterladen. Fokus und Eingabemodus sind erkennbar. Mit mindestens einem Screenreader prüfen, ob Anweisungen und Werte verständlich zugänglich sind.

**Belege:** `index.html:542`, `1104`, `1297`, `1340`. Kimi 002; DeepSeek UX-M01. Schwere 3 bleibt trotz des für diese Gruppe blockierten Messablaufs angemessen; Erstellen und Export sind weiterhin zugänglich.

### T04: Fokus bei Datei- und Messlistenaktionen erhalten

**Befund:** Codebelegt, genaue Browser-Fokusfolge ungetestet. Dateiauswahl und Entfernen blenden das auslösende Element aus. Auswahl und Löschen in der Messliste bauen alle Einträge neu auf und entfernen das fokussierte Element. Die Sichtbarkeitsschaltfläche kombiniert außerdem wechselnde Aktionsnamen mit einem gedrückten Zustand.

**Änderung:** Nach Laden, Fehler und Entfernen den Fokus an eine passende sichtbare Stelle führen. In der Messliste vorhandene Elemente aktualisieren oder den Fokus anhand der Messungs-ID wiederherstellen. Für Sichtbarkeit entweder einen stabilen Toggle-Namen mit Zustand oder einen verständlichen wechselnden Aktionsnamen verwenden.

**Abnahme:** Nach Dateiauswahl, Ladefehler und Entfernen kann der Ablauf ohne erneutes Durchtabben vom Seitenanfang fortgesetzt werden. Auswahl hält den Fokus auf der Strecke; Löschen führt zum benachbarten Eintrag oder einer sinnvollen Aktion bei leerer Liste. Der Sichtbarkeitszustand ist mit Screenreader eindeutig.

**Belege:** `index.html:957`, `972`, `1170`, `1181`, `1196`, `1218`. Kimi 009; DeepSeek UX-V03, UX-M02.

### T05: Eingaben feldnah, konkret und zugänglich validieren

**Befund:** Belegt. Text statt Zahl, Start hinter dem Videoende und vertauschte Grenzen können dieselbe Reihenfolgemeldung ergeben. Die Zeitfelder verweisen nicht auf Fehlertexte; die Erklärung des gesperrten Erstellen-Buttons steht in einem entfernten allgemeinen Hinweis.

**Änderung:** Zuerst Zahlformat und Videogrenzen, danach Reihenfolge und Bildanzahl prüfen. Betroffene Felder markieren, Fehlermeldungen zuordnen und Änderungen dosiert ankündigen. Der allgemeine Erstellen-Hinweis darf feldbezogene Hilfe nicht ersetzen.

**Abnahme:** Ungültige Zeichen, negativer Start, Start hinter Videoende, Start gleich oder nach Ende, Ende hinter Videoende, ungültige Frequenz und mehr als 300 Bilder liefern jeweils eine konkrete Korrekturhilfe. Nach Korrektur wird die Erstellung wieder möglich. Die Ursache ist auch beim Verbleiben im Eingabefeld mit Screenreader erfahrbar.

**Belege:** `index.html:498`, `570`, `889`, `895`, `905`, `921`. Kimi 004; DeepSeek UX-C01, UX-C02. Die tatsächliche Zuverlässigkeit der Ansage ist Teil von V05.

### T06: Relative und absolute Zeit durchgehend unterscheiden

**Befund:** Belegt. Bei Abschnittsbeginn 5 s wird das erste Einzelbild mit 0 s bezeichnet, im zugänglichen Namen jedoch als Zeitpunkt „im Video“. Der Klick springt korrekt zu 5 s. Die Erläuterung im PNG hängt von dessen Breite ab. Die Einzelbildauswahl ist nur durch eine CSS-Klasse markiert.

**Änderung:** Zeit seit Abschnittsbeginn und absolute Videoposition verständlich kennzeichnen. Den zugänglichen Namen berichtigen, die Auswahl programmatisch auszeichnen und die Zeitbasis unabhängig von der Exportbreite nennen.

**Abnahme:** Einen Abschnitt 5 bis 8 s erstellen. Das erste Bild ist als 0 s seit Abschnittsbeginn und 5 s im Video erkennbar. Die Auswahl wird angesagt; der Seek bleibt korrekt. Auch ein schmales PNG erklärt seine Zeitbasis. Relative Zeiten bleiben für Intervallrechnungen nutzbar.

**Belege:** `index.html:711`, `747`, `1029`, `1035`. Kimi 005; DeepSeek UX-R01. Schwere 2 bleibt bestehen: Die Zeitdifferenzen sind richtig, die Beschriftung ist missverständlich.

### T07: Qualitätswarnungen dauerhaft am Ergebnis zeigen

**Befund:** Belegt. Nur ein Bild oder kaum erkannte Bewegung führen lediglich zu einem ungefähr 4,5 Sekunden sichtbaren Toast. Danach sieht der Ergebnisstatus wie ein regulärer Erfolg aus.

**Änderung:** Eine dauerhafte, mit dem Ergebnis verbundene Warnung und passende Korrektur anbieten. Bei einem Einzelbild auch einen längeren Abschnitt empfehlen; bei geringer Bewegung auf die Empfindlichkeit hinweisen. Den Export bewusst ermöglichen, ohne die Qualität als einwandfrei darzustellen.

**Abnahme:** Beide Sonderfälle erzeugen auch nach Ende des Toasts einen lesbaren Hinweis. Die passende Einstellung ist direkt erreichbar. Eine neue Verarbeitung bewertet die Qualität neu; keine dauernden Wiederholungsansagen.

**Belege:** `index.html:881`, `1041`, `1043`. Kimi 007.

### T08: Messpunkte präzise setzen und nachträglich korrigieren

**Befund:** Fehlende Endpunktkorrektur und fehlender App-Zoom sind belegt; das Ausmaß der Touch-Probleme ist heuristisch. Der Canvas wird eingepasst, die Linien und Punkte schrumpfen mit. Pointer-Dragging verschiebt nur Beschriftungen.

**Änderung:** Endpunkte nachträglich verändern können, einschließlich Tastaturalternative aus T03. Eine Lupe oder kontrollierten Zoom anbieten und Zeichengrößen an die Darstellung anpassen. Sichtbarer Punkt und ausreichendes Trefferziel müssen getrennt betrachtet werden. Versehentliche Messpunkte beim Zoomen vermeiden.

**Abnahme:** Auf einem Telefon beide Enden einer vorhandenen Strecke korrigieren, ohne die Strecke neu anzulegen. Punktposition und Messwert bleiben auch bei Zoom und Resize konsistent. Referenzkorrekturen müssen den daraus abgeleiteten Maßstab nachvollziehbar aktualisieren oder ausdrücklich eine neue Kalibrierung verlangen. Vergleich mit einer bekannten Geometrie verwenden.

**Belege:** `index.html:278`, `1118`, `1143`, `1297`, `1340`. Kimi 014; DeepSeek UX-M03, UX-M04. Konkrete Zoomgestaltung zunächst mit einem kurzen Touch-Bedienversuch prüfen.

### T09: Videoersatz und Ladefehler verständlich behandeln

**Befund:** Das Drop-Ziel verschwindet nach dem Laden; der globale Drop-Handler verhindert danach nur Navigation. Ladefehler stehen am Ende der Steuerspalte statt an der Dateiauswahl. Dass die Meldung auf einem bestimmten Gerät außerhalb des sichtbaren Bereichs liegt, ist ohne Rendering noch nicht nachgewiesen.

**Änderung:** Eine erkennbare Aktion „Video ersetzen“ oder eine weiter aktive Dateikarte als Drop-Ziel anbieten. Fehler unmittelbar bei der Videoauswahl anzeigen und ihr zuordnen. Bestehende Arbeit gemäß T02 schützen. Den Entfernen-Button auf ein komfortables Touch-Ziel vergrößern.

**Abnahme:** Ein zweites Video lässt sich per Dateiauswahl und Drop einsetzen. Eine unlesbare Datei erklärt das Problem an der Auswahl und erlaubt einen neuen Versuch. Bestehende Arbeit verschwindet nicht ungewarnt. Nach Entfernung stimmen aktiver Tab, Leerzustand und Vorschaukennzeichnung überein.

**Belege:** `index.html:188`, `486`, `506`, `952`, `972`, `989`, `1228`. DeepSeek UX-V01, UX-V02, UX-V04. Die 32-px-Breite allein wird nicht als belegter Mindestgrößenverstoß gewertet.

### T10: Ungesicherte Arbeit beim Verlassen schützen

**Befund:** Flüchtiger Zustand und fehlender Verlassensschutz sind belegt. Ob Wiederherstellung erwartet wird, ist heuristisch; vollständige automatische Projektspeicherung ist keine zwingende Voraussetzung dieses Audits.

**Änderung:** Bei ungesicherter Messarbeit versehentliches Verlassen nach Möglichkeit abfangen und die Speichergrenzen klar erklären. Eine lokale Wiederherstellung oder ein wieder ladbarer Arbeitsstand kann zuverlässiger sein als ein Browserdialog. PNG-Export sichert das Bild, aber keinen editierbaren Messzustand. Ein Downloadaufruf beweist auch nicht, dass die Datei gespeichert wurde.

**Abnahme:** Reload und Tab-Schließen mit Messarbeit in den unterstützten Browsern prüfen. Eine Warnung oder nachgewiesene Wiederherstellung verhindert stillen Verlust. Bewusstes Verwerfen bleibt möglich. Auf Mobil die Grenzen von Browser-Rückfragen gesondert prüfen. BFCache ist separat V02.

**Belege:** `index.html:872`, `1052`, `1386`. Kimi 011; DeepSeek UX-D02. Schwere 2, da die App keine bisher gebrochene Zusage automatischer Speicherung macht.

### T11: Relevante Kleinschrift und Textkontraste verbessern

**Befund:** Rechnerisch bestätigt. Formattext verwendet `--faint` auf `--surface` mit 4,21:1; Dateimetadaten verwenden `--muted` auf `--accent-soft` mit 4,39:1. Mehrere Sekundärtexte sind bei 16-px-Grundschrift nur 9 bis 11 px groß.

**Änderung:** Relevante Metadaten und Bedienhinweise größer setzen und die Farben auf mindestens 4,5:1 Textkontrast abstimmen. Helles und dunkles Theme sowie erhöhte Kontraste gemeinsam prüfen. Dekorative Platzhalternummern haben geringeren Vorrang als Dateiformate, Dauer und Hinweise.

**Abnahme:** Der Kontrast der betroffenen Texte erreicht das Ziel rechnerisch. Metadaten und Hinweise sind bei schmaler Darstellung und vergrößerter Schrift ohne Überlappung lesbar. Sichtprüfung auf Telefon und einer für Unterricht typischen Darstellung ergänzen.

**Belege:** `index.html:23`, `26`, `138`, `178`, `187`, `228`, `238`. DeepSeek UX-A02. Von Schwere 1 auf 2 angehoben, weil die realen Dateimetadaten und Formatangaben betroffen sind. Eine bestimmte Mindestschriftgröße wird hier als Gestaltungsziel, nicht als pauschale Normvorgabe behandelt.

### T12: Zeitbereich aus der Videoposition übernehmen

**Befund:** Heuristik. Start und Ende lassen sich nur als Sekundenwerte eintippen. Der Player erlaubt das Auffinden eines Ereignisses, überträgt seine aktuelle Position aber nicht in die Zeitfelder.

**Änderung:** Zunächst zwei Aktionen „Aktuelle Position als Start/Ende“ vorsehen. Eine zusätzliche aufwendige Schnittzeitleiste ist für diesen Bedarf nicht erforderlich. Exakte Texteingaben behalten.

**Abnahme:** Den Beginn und das Ende eines Falls im Player finden und ohne Abtippen übernehmen. Bildanzahl und Validierung aktualisieren sich. Der Ablauf funktioniert per Tastatur und Touch. Vor größerer Gestaltung mit einer Person aus der Zielgruppe prüfen, ob diese Aktionen den Auswahlaufwand tatsächlich reduzieren.

**Belege:** `index.html:498`, `523`, `895`. DeepSeek UX-C03. Als Verbesserung angenommen, nicht als Defekt der vorhandenen manuellen Auswahl.

### T13: Messung und Kalibrierung sichtbar erklären

**Befund:** Heuristik. „Messen“ ist ein Icon mit zugänglichem Namen und Desktop-Tooltip. Die Hilfe erwähnt ein mitgefilmtes Lineal und das Messwerkzeug, erklärt aber nicht die Bedienfolge zur Kalibrierung. Eine Erklärung ist im Dialog bereits vorhanden.

**Änderung:** Die Messaktion sichtbar beschriften. Den Weg Referenz messen, bekannte Länge eingeben, Maßstab anwenden mit einem konkreten Beispiel erklären. Die Kalibrierung auch bei langer Messliste auffindbar halten. Frequenzhilfe an die passende Erklärung führen.

**Abnahme:** Ein erstmaliger Nutzer kann mithilfe der Oberfläche eine bekannte Referenz in cm kalibrieren und die Einheit der weiteren Messwerte erklären. Auf schmalem Display bleibt der Kalibrierungsbereich auffindbar, auch mit mehreren Strecken. Einen kurzen Bedienversuch durchführen.

**Belege:** `index.html:489`, `526`, `533`, `554`. DeepSeek UX-M07. Die Behauptung, Kalibrierung sei überhaupt nicht erklärt, wird auf fehlende vollständige Hilfe und Auffindbarkeit eingegrenzt.

### T14: Festes Beispiel und lokale Verarbeitung mobil kenntlich halten

**Befund:** Codebelegt, Nutzerwirkung heuristisch. Das Beispiel zeigt immer 10 Hz beziehungsweise 0,10 s. Seine Kennzeichnung im Toolbar-Tag wird auf kleinen Ansichten verborgen; im Bild bleibt „ILLUSTRATION“. Die beiden prominenten Hinweise auf lokale beziehungsweise Offline-Verarbeitung werden ebenfalls ausgeblendet.

**Änderung:** Ein sichtbares „Beispiel mit 10 Hz“ im Beispielbild und einen kompakten Hinweis auf lokale Verarbeitung auch mobil behalten. Das feste Beispiel kann unverändert bleiben; keine dynamische Physiksimulation erforderlich.

**Abnahme:** Bei gewählten 30 Hz wird auf Telefon und Desktop das Beispiel eindeutig als unabhängiges 10-Hz-Beispiel verstanden. Vor der Dateiauswahl ist erkennbar, dass kein Upload erfolgt und die Anwendung offline arbeiten kann.

**Belege:** `index.html:325`, `330`, `351`, `465`, `478`, `513`, `519`. DeepSeek UX-C07, UX-A03. Schwere des festen Beispiels von 2 auf 1 reduziert, da es bereits als Illustration ausgezeichnet ist.

### T15: Verkleinerung der Ausgabe vorab anzeigen

**Befund:** Belegt. Die Verarbeitung verkleinert die lange Bildseite auf höchstens 1280 px. Vorher sieht man die Originalauflösung; nachher nennt der Ergebnisstatus die tatsächlichen Maße.

**Änderung:** Bei betroffenen Dateien vor Erstellung Original- und geplante Ausgabeauflösung nennen. Keine neue Auflösungswahl erforderlich. Die zusätzliche Höhe der optionalen PNG-Zeitleiste bei Größenangaben berücksichtigen.

**Abnahme:** Bei einem 4K-Video ist die Verkleinerung vor dem Start verständlich; Angaben zu Bildfläche und vollständigem PNG stimmen mit der erzeugten Datei überein. Kleinere Dateien erhalten keinen irreführenden Skalierungshinweis.

**Belege:** `index.html:567`, `614`, `671`, `721`, `980`, `1042`. Kimi 008.

### T16: Sichtbaren Ausstieg aus Vollbild anbieten

**Befund:** Fehlender App-Button im Vollbild ist belegt. Ein Festhängen ist nicht bestätigt, da Browser und Betriebssystem eigene Ausstiege anbieten.

**Änderung:** Innerhalb des Vollbildelements einen beschrifteten Ausstieg anbieten. Escape und vorhandene Browsermechanismen erhalten. Nicht unterstützte Plattformen weiter verständlich behandeln.

**Abnahme:** Vollbild lässt sich auf Desktop und einem unterstützten Touch-Gerät über ein sichtbares App-Ziel schließen. Danach sinnvoller Fokus. Escape bleibt nutzbar.

**Belege:** `index.html:511`, `526`, `1261`. Kimi 013; DeepSeek UX-R03.

### T17: Originalvideo beim Öffnen der Messung pausieren

**Befund:** Codebelegt, hörbare Wirkung ungetestet. Beim Wechsel in den Ergebnis-Tab wird pausiert; direktes Öffnen der Messung aus einem abspielenden Originalvideo pausiert den Player nicht.

**Änderung:** Vor Öffnen des Messdialogs pausieren. Kein automatisches Fortsetzen nach dem Schließen nötig.

**Abnahme:** Ein hörbares Video abspielen, direkt die Messung öffnen. Wiedergabe stoppt; beim Schließen bleibt die Position erhalten.

**Belege:** `index.html:932`, `1268`. DeepSeek UX-M08. Schwere von 2 auf 1 reduziert, da die Messung funktional möglich bleibt.

## Vor einer Änderung gezielt prüfen

| Prüfauftrag | Ausgangsbefund | Nachweis und Entscheidung |
|---|---|---|
| V01: Hochformatbeschnitt | Kimi 006 | In echten Browsern 9:16, 4:3 und 16:9 mit und ohne Zeitleiste in Ergebnis und Original prüfen. Der Konflikt zwischen Containerhöhe, `max-height: 29rem` und `overflow: hidden` ist verdächtig; das tatsächliche Flex-/Medienlayout wurde nicht gerendert. Erst bei Beschnitt eine P2-Korrektur ableiten. |
| V02: Rückkehr über Browser-Zurück | Kimi 015; Teil von DeepSeek UX-D02 | Mit tatsächlichem `pagehide.persisted`/`pageshow.persisted` und Videozugriff nachweisen, ob die widerrufene Objekt-URL den erhaltenen Zustand beschädigt. Dann Wiederherstellung oder Bereinigung korrigieren. Kein bestätigter BFCache-Fehler. |
| V03: Dezimalkomma | DeepSeek UX-C06 | Frequenz und Maßstab mit `10,5` sowie `10.5` in unterstützten Browsern mit deutscher Sprache prüfen. Bei Ablehnung Grenze verständlich melden oder Parsing vereinheitlichen. `type=number` allein beweist keinen Fehler. |
| V04: iOS-Eingabezoom | DeepSeek UX-A01 | Auf echtem iPhone/iPad Zeitfelder, Maßstab und Streckennamen fokussieren. Bei störendem automatischem Zoom Eingabeschrift anpassen; Nutzerzoom nicht deaktivieren. |
| V05: Meldungen mit Hilfsmitteln und im Dialog | DeepSeek UX-C05, UX-M06 | Fortschrittsansagen, Download, Abbruch, identische Messpunkte und Kalibrierung mit offenem Dialog in Browser und Screenreader prüfen. Toast liegt außerhalb des modalen Dialogs; Ansagen und sichtbare Überdeckung wurden nicht getestet. Falls beeinträchtigt, Meldungen im Dialog ausgeben und Live-Ansagen dosieren. |

V01 ist gegenüber Kimis Einstufung als belegter Defekt ausdrücklich zurückgestuft. V05 fasst verwandte Rückmeldungsprüfungen zusammen; eine Codeänderung ohne Nachweis der konkreten Wirkung wird daraus nicht automatisch verlangt.

## Zurückgestellte Vorschläge und verworfene Schlussfolgerungen

- **DeepSeek UX-C08, explizitere Überschrift:** Optionaler Textversuch. Arbeitsbereich und Hauptaktion nennen bereits „Stroboskopbild“. Eine andere H1 ist ohne beobachtetes Orientierungsproblem kein Muss.
- **DeepSeek UX-R02, Raster und Zeitleiste im Messdialog:** Das Raster ist eine sinnvolle optionale Orientierungshilfe. Seine Abwesenheit erzeugt keine falsche Messung. Es zeigt Pixel und ersetzt keine reale Kalibrierungsreferenz. Die Zeitleiste außerhalb der Messfläche zu halten ist plausibel; ihre Übernahme ist keine Pflicht.
- **DeepSeek UX-C04, Tabs sperren oder nach Abschluss zwangsweise wechseln:** Diese konkrete Lösung wird nicht übernommen. Ein bewusst gewählter Originalvideo-Tab darf erhalten bleiben. T01 verlangt eine eindeutige Abschlussorientierung und einen direkten Weg zum Ergebnis.
- **DeepSeek UX-D02, Video könne nicht gespeichert werden:** Diese absolute technische Aussage wird nicht übernommen. Lokale Dateispeicherung ist grundsätzlich eine mögliche spätere Gestaltung. Für dieses Audit genügt die Feststellung, dass die aktuelle Anwendung nichts wiederherstellt.
- Native Dialoge, Tab-Tastaturnavigation, Verarbeitungsabbruch, lokale Verarbeitung, Fortschritt, allgemeine Fehlertexte und Einstellungen für reduzierte Bewegung sind bereits vorhanden. Sie müssen bei den Änderungen erhalten bleiben.

## Vollständige Zuordnung der Ausgangsbefunde

Kimi-IDs stehen im Original mit dem Präfix `STROBO-UX-`. Die folgenden Kurznummern bezeichnen genau diese IDs. Ein mehrfach zugeordneter Befund erzeugt keine zusätzliche Aufgabe.

| Kimi | Entscheidung |
|---|---|
| 001 | T01, Schwere 3 bestätigt |
| 002 | T03, Schwere 3 bestätigt |
| 003 | T02, Schwere 3 bestätigt |
| 004 | T05, Schwere 2 bestätigt |
| 005 | T06, Schwere 2 bestätigt, Zeitberechnung selbst korrekt |
| 006 | V01, von Defekt auf Prüfauftrag zurückgestuft |
| 007 | T07, Schwere 2 bestätigt |
| 008 | T15, Schwere 1 bestätigt |
| 009 | T04, Schwere 2, Browserfolge noch zu prüfen |
| 010 | T02, Schwere 2 für Entfernung, mit Datenverlustschutz zusammengeführt |
| 011 | T10, Schwere 2, keine volle Persistenz als Pflicht vorausgesetzt |
| 012 | T02, Schwere 2 für Löschung |
| 013 | T16, Schwere 1 bestätigt |
| 014 | T08, Schwere 2 als begründete UX-Verbesserung |
| 015 | V02, Hypothese bleibt unbestätigt |

| DeepSeek | Entscheidung |
|---|---|
| UX-V01 | T09, Schwere 2 bestätigt |
| UX-V02 | T02 und T09, Verlustumfang, Wechsel und Zielgröße getrennt betrachtet |
| UX-V03 | T04, Schwere 2, konkrete Fokusfolge noch zu prüfen |
| UX-V04 | T09, Schwere 2 als Heuristik; konkrete Sichtbarkeit ungetestet |
| UX-C01 | T05, Schwere 2 bestätigt |
| UX-C02 | T05, Schwere 2 bestätigt; Ansagewirkung V05 |
| UX-C03 | T12, Schwere 2 als Verbesserung, kein Funktionsdefekt |
| UX-C04 | T01, Abschlussorientierung Schwere 1; Tab-Sperre nicht verlangt |
| UX-C05 | V05, Mechanik belegt, Wirkung unbestätigt |
| UX-C06 | V03, Hypothese bleibt unbestätigt |
| UX-C07 | T14, von Schwere 2 auf 1 reduziert |
| UX-C08 | Optionaler Textversuch, keine Pflichtüberarbeitung |
| UX-R01 | T06, Schwere 2 bestätigt, einschließlich Auswahlzustand |
| UX-R02 | Optionale Rasterhilfe, keine fehlerhafte Messung nachgewiesen |
| UX-R03 | T16, Schwere 1 bestätigt |
| UX-M01 | T03, Schwere 3 bestätigt |
| UX-M02 | T04, Schwere 2 bestätigt, Fokus und Sichtbarkeitssemantik |
| UX-M03 | T08, Schwere 2 als Verbesserung |
| UX-M04 | T08, Schwere 2 als Verbesserung, Touch-Wirkung ungetestet |
| UX-M05 | T02, Schwere 2 für Löschung |
| UX-M06 | V05, Dialogdarstellung und Ansage testen |
| UX-M07 | T13, Schwere 2 als Heuristik, vorhandene Erklärung berücksichtigt |
| UX-M08 | T17, von Schwere 2 auf 1 reduziert |
| UX-D01 | T02, von Schwere 2 auf 3 angehoben |
| UX-D02 | T10, Schwere 2; BFCache-Teil V02 |
| UX-A01 | V04, Hypothese bleibt unbestätigt |
| UX-A02 | T11, von Schwere 1 auf 2 angehoben; Kontraste nachgerechnet |
| UX-A03 | T14, Schwere 1 als Kommunikationsverbesserung |

## Empfohlene Arbeitspakete

1. **Ergebnis und Arbeit schützen:** T01 und T02 gemeinsam umsetzen. Zustände vor Änderung, nach Änderung, nach Abbruch, nach Fehler und nach Erfolg prüfen.
2. **Messung zugänglich und korrigierbar machen:** T03, T04 und T08 zusammen gestalten, damit Maus, Touch und Tastatur dieselben Operationen verwenden.
3. **Eingabe und fachliche Lesbarkeit verbessern:** T05, T06, T07, T09, T11, T12 und T13; mit einem echten Video vollständigen Ablauf bis zum PNG prüfen.
4. **Sitzung und Plattformen prüfen:** T10 zusammen mit V01 bis V05. Nachweise dokumentieren, bestätigte Plattformfehler anschließend einplanen.
5. **Oberfläche abrunden:** T14 bis T17 bei den betroffenen Ansichten mitnehmen. Die beiden optionalen Vorschläge erst bei beobachtetem Bedarf verfolgen.

Für die Abnahme mindestens einen vollständigen Desktop-Tastaturablauf, einen Touch-Ablauf, einen Screenreader-Ablauf und einen Vergleich der sichtbaren Messung mit dem exportierten PNG ausführen. Diese Prüfungen sind Anforderungen an die spätere Umsetzung und wurden in diesem Audit noch nicht durchgeführt.
