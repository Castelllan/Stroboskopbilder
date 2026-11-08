# STROBO – unabhängiges Usability-/UX-Audit

## Auftrag, Umfang und Beweisstatus

Geprüft wurde die vollständige `index.html` (Zeilen 1–1392) mit Blick auf den Ablauf **Video auswählen → Frequenz/Zeitbereich festlegen → Stroboskopbild erstellen → messen/kalibrieren → PNG exportieren**. Der Fokus liegt auf deutschsprachigen Lernenden und Lehrkräften, konkreten Nutzerabläufen, Verständlichkeit, Rückmeldungen, Fehlerkorrektur, Datenverlust, mobiler Bedienung, Tastatur/Screenreader und Auffindbarkeit. Allgemeine Codequalität und Security sind nicht Gegenstand dieses Audits.

**Testgrenze:** Dies ist eine vollständige statische Prüfung des HTML-, CSS- und JavaScript-Codes. Es wurden **keine** Browser-, Screenreader-, Geräte-, Kontrast-, Performance- oder Nutzertests durchgeführt und keine echten Videos verarbeitet oder PNGs erzeugt. Die Repro-Schritte sind aus dem Code abgeleitete Prüfszenarien, keine behaupteten Testausführungen.

Die Befunde sind bewusst getrennt:

- **B – belegter Defekt:** Das Verhalten bzw. der fehlende Zustandsübergang ist im Code eindeutig nachvollziehbar. Die genaue Wahrnehmung durch Nutzer oder Hilfsmittel wurde nicht getestet.
- **H – heuristische Einschätzung:** Wahrscheinliches UX-Problem aufgrund von Interaktionsprinzipien; Ausmaß und Schwere sollten mit Nutzern bzw. Geräten validiert werden.
- **U – ungetestete Hypothese:** Das Problem hängt von Browser-/Plattformverhalten ab und ist erst durch einen gezielten Laufzeittest zu bestätigen oder zu widerlegen.

**Schwere:** 4 = blockierend, 3 = schwer, 2 = mittel, 1 = gering, 0 = kein relevanter Schaden. Es wurde kein Befund mit Schwere 4 festgestellt.

## Kurzfazit

Der grundsätzliche Lern- und Arbeitsablauf ist verständlich aufgebaut und durch zahlreiche gute Gegenmaßnahmen abgesichert. Die größten Risiken sind dennoch fachlich relevant: **Ein verändertes Setup kann weiterhin das alte Ergebnis exportieren (001), die zentrale Messung ist nicht tastaturbedienbar (002), und erneutes Erstellen löscht Messarbeit ohne Warnung (003).** Danach stehen insbesondere eindeutige Zeitangaben, zugängliche Validierung, dauerhafte Qualitätswarnungen und der Schutz ungesicherter Arbeit an.

| ID | Kurztitel | Status | Schwere |
|---|---|---:|---:|
| STROBO-UX-001 | Altes Ergebnis bleibt nach Einstellungsänderung unkontrolliert exportierbar | B | 3 |
| STROBO-UX-002 | Messung und Kalibrierung sind ohne Zeiger nicht vollständig durchführbar | B | 3 |
| STROBO-UX-003 | Erneutes Erstellen löscht Messungen und Maßstab ohne Warnung | B | 3 |
| STROBO-UX-004 | Zeitbereichsfehler sind nicht zugänglich an den Eingaben verankert | B | 2 |
| STROBO-UX-005 | Relative Zeiten werden als Positionen „im Video“ bezeichnet | B | 2 |
| STROBO-UX-006 | Hochformatige Videos/Ergebnisse können in der Vorschau beschnitten werden | B | 2 |
| STROBO-UX-007 | Bewegungs- und Einbildwarnungen sind nur kurzzeitig sichtbar | B | 2 |
| STROBO-UX-008 | Auf 1280 Pixel reduzierte Ausgabe wird nicht vorab erklärt | B | 1 |
| STROBO-UX-009 | Messlisten-Aktionen entfernen das fokussierte Element ohne Fokusführung | B | 2 |
| STROBO-UX-010 | „Video entfernen“ löscht implizit das gesamte ungesicherte Ergebnis | B | 2 |
| STROBO-UX-011 | Kein Schutz bzw. Wiederherstellung bei Reload oder versehentlichem Verlassen | H | 2 |
| STROBO-UX-012 | Messungen löschen bietet weder Rückgängig noch Sicherungsabfrage | H | 2 |
| STROBO-UX-013 | Vollbild bietet keinen eigenen sichtbaren Ausstieg für Touch-Nutzer | H | 1 |
| STROBO-UX-014 | Messpunkte sind auf kleinen Touchscreens schwer präzise zu korrigieren | H | 2 |
| STROBO-UX-015 | BFCache-Rückkehr könnte die Videoquelle unbrauchbar machen | U | 2 |

---

## B – Belegte Defekte

### STROBO-UX-001 – Altes Ergebnis bleibt nach Einstellungsänderung unkontrolliert exportierbar

- **Schwere:** 3 – schwer.
- **Betroffener Ablauf:** Frequenz/Zeitbereich/Bewegungserkennung ändern → bestehendes Bild prüfen → messen oder PNG exportieren.
- **Szenario/Repro:** Ein Ergebnis mit 10 Hz erstellen. Danach auf 20 Hz oder einen anderen Zeitbereich stellen, ohne erneut zu erstellen. Die Vorschau, Messungen und der PNG-Download bleiben aktiv. Mit deaktivierter Zeitleiste fehlt auch der direkte Frequenzaufdruck als sichtbarer Hinweis. Dasselbe gilt nach einem abgebrochenen oder fehlgeschlagenen Neuaufbau.
- **Nutzerfolge:** Lernende können ein PNG oder Messwerte unter der Annahme sichern, es gelte bereits die neue Frequenz bzw. der neue Abschnitt. Das ist nicht nur kosmetisch veraltet, sondern kann Zeitintervalle und damit Geschwindigkeits-/Beschleunigungsrechnungen falsch zuordnen.
- **Code:** `state.result` und `download()` in Zeilen 872, 1052–1062; Eingabe-Handler in Zeilen 1236–1239 aktualisieren nur Fehler/Hinweis bzw. Overlays und markieren das Resultat nicht als veraltet. `updateControls()` (905–922) deaktiviert weder Vorschau noch Export. Der Abbruch erhält absichtlich das alte Resultat (1046–1049), ohne einen dauerhaften Altzustand anzuzeigen.
- **Vorhandene Gegenmaßnahmen:** Zeitleiste, Bildstreifen und Dateiname enthalten Informationen zum alten Ergebnis; die Zeitleiste ist jedoch abschaltbar und kein eindeutiger Veraltungshinweis. Overlay-Schalter wenden ihre Änderungen korrekt sofort an und sind deshalb nicht Teil dieses Defekts.
- **Konkrete Verbesserung:** Bei Änderungen an Frequenz, Start, Ende oder Sensitivität einen persistenten, auch für Screenreader verfügbaren Zustand wie „Einstellungen geändert – angezeigt wird noch das Ergebnis mit 10 Hz“ setzen. Entweder Export/Messung bis zur Neuerstellung sperren oder den Download ausdrücklich als „Vorheriges Ergebnis (10 Hz) herunterladen“ anbieten. Das alte Ergebnis dabei nicht vorschnell löschen.
- **Akzeptanzkriterium:** Nach jeder der vier genannten Änderungen sowie nach Abbruch/Fehler ist ohne Toast eindeutig erkennbar, zu welchen Parametern Bild, Messung und Download gehören. Ein Export kann nicht versehentlich als Ergebnis der neuen Parameter erscheinen. Zeit-/Raster-Overlays lösen keinen falschen Veraltungszustand aus.

### STROBO-UX-002 – Messung und Kalibrierung sind ohne Zeiger nicht vollständig durchführbar

- **Schwere:** 3 – schwer.
- **Betroffener Ablauf:** Messwerkzeug öffnen → zwei Punkte setzen → Strecke bearbeiten → Referenz kalibrieren → Ergebnis exportieren.
- **Szenario/Repro:** Nur mit Tabulatortaste, Pfeiltasten und Enter arbeiten. Der Messdialog und seine Bedienelemente sind erreichbar, der fokussierbare Mess-Canvas reagiert jedoch nicht auf Tastaturbefehle zum Setzen von Punkten. Es gibt auch keine Koordinatenfelder als alternative Eingabe. Damit ist ohne Maus, Touch oder anderen Zeiger keine erste Strecke und folglich keine Kalibrierung möglich.
- **Nutzerfolge:** Der fachliche Kernschritt ist für Tastaturnutzer blockiert. Screenreader-Nutzer erhalten zwar Anweisungen und spätere Listenwerte, aber keine nichtvisuelle Möglichkeit, die Punkte selbst zu bestimmen.
- **Code:** Canvas mit `tabindex="0"` und Anweisung in Zeile 542; Punktsetzung ausschließlich über `click` mit Zeigerkoordinaten in 1340–1360; Beschriftungsverschiebung ausschließlich über Pointer Events in 1297–1339. Es existiert kein entsprechender `keydown`-Handler für den Canvas. Die Kalibrierung benötigt zwingend `selectedMeasurement()` (1100–1107, 1367–1374).
- **Vorhandene Gegenmaßnahmen:** Tabs besitzen eine korrekte Pfeiltasten-, Pos1- und Ende-Navigation (924–932, 1244–1249); native Dialoge, Formularfelder und Buttons sind grundsätzlich tastaturbedienbar. Diese Funktionen ersetzen jedoch nicht die Punktwahl.
- **Konkrete Verbesserung:** Ein sichtbares Tastatur-Fadenkreuz mit Pfeiltasten, Sprungintervallen (z. B. Umschalt für gröbere Schritte) und Enter zum Setzen jedes Punktes anbieten; alternativ validierte X/Y-Felder bereitstellen. Punktpositionen und den nächsten Schritt über eine Live-Region ausgeben. Für Beschriftungen zusätzlich tastaturbedienbare Verschiebung oder Positionsfelder anbieten.
- **Akzeptanzkriterium:** Ein vollständiger Durchlauf gelingt ohne Zeiger: Dialog öffnen, zwei unterschiedliche Punkte setzen, Strecke auswählen/umbenennen/sichtbar schalten, Referenz kalibrieren, Dialog schließen und PNG exportieren. Fokus ist sichtbar; Anweisungen und Werte sind mit mindestens einem Screenreader verständlich.

### STROBO-UX-003 – Erneutes Erstellen löscht Messungen und Maßstab ohne Warnung

- **Schwere:** 3 – schwer.
- **Betroffener Ablauf:** Ergebnis messen/kalibrieren → Frequenz, Zeitbereich oder Sensitivität verändern → erneut „Stroboskopbild erstellen“.
- **Szenario/Repro:** Mehrere Strecken benennen, kalibrieren und anschließend die Frequenz ändern. Beim erfolgreichen Neuaufbau werden alle Messungen, die Referenz, der Maßstab und ein etwaiger Entwurf ohne Vorwarnung oder Rückgängig-Funktion entfernt.
- **Nutzerfolge:** Mühsam erhobene Mess- und Kalibrierungsarbeit geht unwiederbringlich verloren. Gerade der naheliegende Versuch, durch eine bessere Frequenz oder Sensitivität das Ergebnis zu verbessern, bestraft vorherige Arbeit.
- **Code:** Nach erfolgreichem `processVideo()` wird `state.result` ersetzt und sofort `resetCalibration()` aufgerufen (1022–1024). `resetCalibration()` löscht Maßstab, Referenz, Punkte, sämtliche Messungen und IDs sowie die sichtbaren Listen-/Eingabewerte (942–950). Vor `createResult()` gibt es keine Sicherungsabfrage (1010–1050).
- **Vorhandene Gegenmaßnahmen:** Das Zurücksetzen verhindert, dass alte Geometrien unbemerkt auf einem neuen Bild weiterverwendet werden. Der fachliche Grund ist nachvollziehbar; der ungewarnte Datenverlust bleibt dennoch bestehen.
- **Konkrete Verbesserung:** Vor dem Neuaufbau bei vorhandenen Messungen oder Maßstab eine erklärende Abfrage zeigen: „Neues Bild erstellen? Alle 4 Messungen und der Maßstab werden dabei gelöscht.“ Standardaktion „Abbrechen“, zusätzlich „Vorher PNG sichern“ anbieten. Alternativ ein Projekt-/Messdaten-Backup oder Rückgängig bereitstellen.
- **Akzeptanzkriterium:** Bei Abbrechen bleiben altes Resultat, alle Messungen, Namen, Sichtbarkeiten, Auswahl und Maßstab vollständig erhalten. Erst nach ausdrücklicher Bestätigung werden sie ersetzt. Ohne Messarbeit bleibt der bisherige direkte Ablauf unverändert.

### STROBO-UX-004 – Zeitbereichsfehler sind nicht zugänglich an den Eingaben verankert

- **Schwere:** 2 – mittel.
- **Betroffener Ablauf:** Zeitbereich eingeben und Eingabefehler korrigieren.
- **Szenario/Repro:** Bei geladenem Video „Von = 5“ und „Bis = 2“ eintragen oder ungültige Zeichen eingeben. Der Erstellen-Button wird deaktiviert; die Erklärung erscheint nur im allgemeinen `create-hint` unter dem Button. Die beiden Zeitfelder erhalten weder `aria-invalid` noch eine Verknüpfung zu dieser Meldung. Der Button kann für eine erneute Validierung nicht aktiviert werden.
- **Nutzerfolge:** Screenreader-Nutzer erfahren während der Eingabe nicht zuverlässig, warum der nächste Schritt gesperrt ist oder welches Feld zu korrigieren ist. Auch sehende Nutzer müssen die kleine, entfernte Meldung den Feldern selbst zuordnen.
- **Code:** Zeitfelder ohne Fehlerbeziehung in Zeile 498; Validierung in 889–903; deaktivierter Button und ausschließliche Textausgabe in `create-hint` in 913–921; Eingabe-Handler in 1236. `create-hint` hat keine Live-Rolle (505). Das vorhandene `role="alert"` in 506 wird auf diesem Weg nicht verwendet.
- **Vorhandene Gegenmaßnahmen:** Fehlermeldungen enthalten konkrete Grenzen bzw. Gründe; die Frequenz ist wenigstens über `aria-describedby` mit `create-hint` verbunden (491). Für die Zeitfelder fehlt genau diese Beziehung.
- **Konkrete Verbesserung:** Feldnahe Fehler-IDs für Start/Ende einführen, per `aria-describedby` verbinden und `aria-invalid` zustandsabhängig setzen. Die zusammengefasste Meldung als angemessen dosierte Live-Region ausgeben. Fehler erst nach sinnvoller Validierung anzeigen, damit nicht jeder Tastendruck eine Ansage erzeugt.
- **Akzeptanzkriterium:** Für „Von 5 / Bis 2“, Text statt Zahl, Ende oberhalb der Videodauer und zu viele Bilder werden Ursache und betroffene Eingabe sichtbar und mit einem Screenreader verständlich gemeldet. Nach Korrektur verschwinden Fehlerzustand und Ansage; keine Dauerwiederholung bei jedem Fokuswechsel.

### STROBO-UX-005 – Relative Zeiten werden als Positionen „im Video“ bezeichnet

- **Schwere:** 2 – mittel.
- **Betroffener Ablauf:** Zeitbereich wählen → Einzelbilder lesen/aufrufen → Zeitleiste im PNG interpretieren.
- **Szenario/Repro:** Einen Abschnitt von 10 bis 12 Sekunden verwenden. Das erste Einzelbild trägt die Beschriftung „0,00 s“; sein zugänglicher Name sagt „bei 0,000 Sekunden im Video“. Beim Aktivieren springt das Originalvideo tatsächlich zu 10 Sekunden. Auch die exportierte Zeitleiste beginnt relativ bei null; ihre Erklärung erscheint nur bei ausreichend großer `legendHeight`.
- **Nutzerfolge:** Absolute Videoposition und Zeit seit Abschnittsbeginn können verwechselt werden. Beim Protokollieren von Messreihen oder beim Abgleich mit dem Originalvideo entstehen falsche Zeitpunkte.
- **Code:** `relativeTime` und absolute `time` in 711; zugänglicher Name, Bildtext und sichtbare Beschriftung mit `relativeTime` in 1029–1035; Seek mit absoluter `frame.time` in 1035. Relative Achsenwerte in 746; die Erläuterung „Zeitangaben relativ … Videobeginn“ nur unter der Bedingung `legendHeight > 68` in 747.
- **Vorhandene Gegenmaßnahmen:** Die Daten für beide Zeitbezüge sind bereits vorhanden, und breite Ergebnisse erhalten eine erklärende Fußzeile. Der Fehler liegt in Kennzeichnung und Konsistenz, nicht in der Seek-Funktion.
- **Konkrete Verbesserung:** Durchgehend „0,00 s nach Abschnittsbeginn (Video: 10,00 s)“ bzw. eine gleichwertige kompakte Doppelkennzeichnung verwenden. Den zugänglichen Namen entsprechend korrigieren. Die Zeitbasis im Export unabhängig von der Bildbreite eindeutig angeben.
- **Akzeptanzkriterium:** Bei jedem Startwert größer null unterscheiden Einzelbildbeschriftung, Screenreader-Name und PNG eindeutig zwischen relativer und absoluter Zeit. Bei Start 0 entsteht keine widersprüchliche Doppelangabe.

### STROBO-UX-006 – Hochformatige Videos/Ergebnisse können in der Vorschau beschnitten werden

- **Schwere:** 2 – mittel.
- **Betroffener Ablauf:** Hochformatvideo laden, Ergebnis prüfen, Originalvideo ansehen.
- **Szenario/Repro:** Ein 9:16-Video auf einem schmalen mobilen Viewport verwenden. Der Vorschaubereich ist auf 22 rem Höhe begrenzt, während Canvas/Video bis zu 29 rem hoch werden dürfen. Der umschließende Container schneidet Überstand mit `overflow: hidden` ab; es gibt kein Scrollen oder automatisches Einpassen auf die tatsächlich verfügbare Höhe.
- **Nutzerfolge:** Obere oder untere Bildbereiche und damit möglicherweise Messobjekte oder Zeitinformationen fehlen in der normalen Vorschau. Nutzer können das Bild falsch beurteilen oder müssen den nicht erklärten Vollbild-Umweg finden.
- **Code:** Feste Höhe des `visual-area` in 198 und mobile Höhe in 363; `overflow: hidden` an `canvas-wrap`/`video-view` in 210; Canvas-/Video-`max-height: 29rem` statt containerbezogener Begrenzung in 211–212. Die separaten Vollbildregeln in 313–317 zeigen, dass nur der Vollbildmodus eine explizite viewportbezogene Einpassung erhält.
- **Beweisgrenze:** Die widersprüchlichen Größen- und Overflow-Regeln sind codebelegt; der genaue sichtbare Ausschnitt in verschiedenen Browsern wurde nicht gerendert.
- **Konkrete Verbesserung:** Canvas und Video mit `max-width: 100%; max-height: 100%` sowie geeigneter intrinsischer Größenberechnung vollständig in den verfügbaren Container einpassen. Containergröße und Seitenverhältnis nach Laden, Ergebnisänderung und Resize synchronisieren.
- **Akzeptanzkriterium:** Bei 9:16-, 4:3-, 16:9- und sehr schmalen Ergebnissen, jeweils mit und ohne Zeitleiste, bleiben auf 360×640, 768×1024 und Desktop alle Bildinhalte in Ergebnis- und Originalansicht vollständig sichtbar. Kein vertikaler Beschnitt; Vollbild ist optional, nicht zur Fehlerumgehung nötig.

### STROBO-UX-007 – Bewegungs- und Einbildwarnungen sind nur kurzzeitig sichtbar

- **Schwere:** 2 – mittel.
- **Betroffener Ablauf:** Ergebnisqualität beurteilen → Sensitivität/Zeitbereich korrigieren → exportieren.
- **Szenario/Repro:** Ein nahezu unbewegtes Video oder einen so kurzen Abschnitt wählen, dass nur ein Bild entsteht. Nach Abschluss erscheint die eigentliche Qualitätswarnung nur als Toast und verschwindet nach etwa 4,5 Sekunden. Der dauerhafte Status meldet weiterhin die zusammengeführten Bilder mit „ready“; Download und Messung bleiben normal verfügbar.
- **Nutzerfolge:** Wer die kurze Meldung verpasst, kann einen leeren oder nicht aussagekräftigen Hintergrund als gültiges Experiment exportieren. Der nächste Korrekturschritt ist dann nicht mehr am Ergebnis erkennbar.
- **Code:** Toast-Lebensdauer in 881–885; normaler Ergebnisstatus und `ready` in 1041–1042; beide Qualitätsfälle nur über `toast()` in 1043–1045. `preview-status` wird nicht als Warnung gesetzt.
- **Vorhandene Gegenmaßnahmen:** Der Toast besitzt `role="status"` (562) und nennt bei geringer Bewegung bereits eine sinnvolle Korrektur. Damit ist eine einmalige Rückmeldung vorhanden, aber keine dauerhafte Zustandsinformation.
- **Konkrete Verbesserung:** Qualitätszustände dauerhaft im Ergebnisbereich anzeigen, z. B. „Kaum Bewegung erkannt – Bewegungserkennung nach links stellen und erneut erstellen“ mit direktem Sprung zur Einstellung. Bei nur einem Bild zusätzlich „längeren Zeitbereich wählen“ nennen; bei bereits 120 Hz nicht allein „Frequenz erhöhen“ empfehlen.
- **Akzeptanzkriterium:** Beide Warnungen bleiben auch nach Ablauf des Toasts bis zur relevanten Einstellungsänderung oder Neuerstellung sichtbar und programmatisch mit dem Ergebnis verbunden. Die Korrektur ist direkt erreichbar; Screenreader erhalten die Warnung einmal, nicht in einer Dauerschleife.

### STROBO-UX-008 – Auf 1280 Pixel reduzierte Ausgabe wird nicht vorab erklärt

- **Schwere:** 1 – gering.
- **Betroffener Ablauf:** Hochauflösendes Video laden → Verarbeitung starten → PNG für Messung oder Unterrichtsmaterial exportieren.
- **Szenario/Repro:** Ein 4K-Video auswählen. Vor dem Erstellen zeigt die Dateiinformation die Originalauflösung; die Verarbeitung begrenzt die lange Seite jedoch auf 1280 Pixel. Erst danach nennt der Status die resultierenden Pixelmaße, ohne die Reduktion ausdrücklich zu erklären.
- **Nutzerfolge:** Nutzer können mit Originalschärfe rechnen und kleine Objekte bzw. feine Linealmarkierungen im Export schlechter auflösen als erwartet. Die nachträgliche Pixelzahl allein erklärt weder Qualitäts- noch Messgenauigkeitsfolgen.
- **Code:** `MAX_SIDE = 1280` in 567; Skalierung in `fitDimensions()` 614–617 und Anwendung in 671–673; Originale und Ergebnismaße in 715, 980 und 1042. Es fehlt ein vorab sichtbarer Hinweis auf diese Grenze.
- **Vorhandene Gegenmaßnahme:** Die tatsächliche Ergebnisauflösung wird nach der Verarbeitung angezeigt, und die Originalauflösung steht in den Rückgabedaten. Die Reduktion ist daher nicht völlig unsichtbar, aber nicht verständlich angekündigt.
- **Konkrete Verbesserung:** Vor dem Erstellen bei betroffenen Videos einen Hinweis wie „Ausgabe wird auf maximal 1280 px lange Seite verkleinert“ anzeigen. Optional eine Exportauflösung anbieten; andernfalls Original- und Exportmaß im Ergebnis gemeinsam benennen.
- **Akzeptanzkriterium:** Vor der Verarbeitung eines Videos oberhalb der Grenze ist die tatsächlich zu erwartende Exportauflösung sichtbar und für Hilfsmittel verfügbar. Nach Export stimmen Ankündigung, PNG-Maße und Ergebnisstatus überein.

### STROBO-UX-009 – Messlisten-Aktionen entfernen das fokussierte Element ohne Fokusführung

- **Schwere:** 2 – mittel.
- **Betroffener Ablauf:** Vorhandene Messungen mit Tastatur auswählen oder löschen.
- **Szenario/Repro:** In einer Liste mit mehreren Messungen eine Auswahl-Schaltfläche per Tastatur aktivieren. `drawMeasurement()` baut die gesamte Liste neu und entfernt dabei auch das gerade fokussierte Element. Eine neue Fokusposition wird nicht gesetzt. Beim einzelnen Löschen entsteht dieselbe Situation, ohne dass der nächste sinnvolle Eintrag fokussiert wird.
- **Nutzerfolge:** Tastatur- und Screenreader-Nutzer verlieren ihre logische Position und müssen den Dialog bzw. die Liste erneut durchqueren. Die genaue vom Browser gewählte Fallback-Fokusposition wurde nicht getestet; das Entfernen des Fokusziels ohne Ersatz ist jedoch eindeutig.
- **Code:** Vollständiger Listen-Neuaufbau mit `replaceChildren()` in 1170–1173; Auswahl-Handler ruft unmittelbar `drawMeasurement()` auf (1181); Lösch-Handler ebenso (1218–1222). Es gibt keine anschließende `focus()`-Führung.
- **Vorhandene Gegenmaßnahmen:** Namenseingabe und Sichtbarkeitsumschaltung bauen die Liste nicht neu und vermeiden dieses Problem weitgehend; der Befund betrifft gezielt Auswahl und Entfernen.
- **Konkrete Verbesserung:** Zeilen nicht vollständig neu aufbauen, wenn nur Auswahl/Werte wechseln. Falls ein Neuaufbau nötig ist, den äquivalenten Auswahlbutton anschließend fokussieren. Nach Löschen den nächsten, sonst vorherigen Eintrag oder bei leerer Liste die Überschrift/Leermeldung sinnvoll fokussieren und die Änderung ankündigen.
- **Akzeptanzkriterium:** Nach Tastaturauswahl bleibt der Fokus auf der ausgewählten Strecke; nach Löschen befindet er sich auf einem vorhersehbaren benachbarten Ziel. Kein Fokusverlust auf `body`/Dialoganfang, und der neue Wert wird mit Screenreader verständlich gemeldet.

### STROBO-UX-010 – „Video entfernen“ löscht implizit das gesamte ungesicherte Ergebnis

- **Schwere:** 2 – mittel.
- **Betroffener Ablauf:** Video wechseln oder entfernen nach Erstellung/Messung.
- **Szenario/Repro:** Nach Messung und Kalibrierung die einzige angebotene Schaltfläche „Video entfernen“ aktivieren, etwa um ein anderes Video auszuwählen. Neben dem Video verschwinden sofort Ergebnis, Bildstreifen, alle Messungen, Maßstab und Downloadmöglichkeit. Es gibt keine Warnung, Bestätigung oder Wiederherstellung.
- **Nutzerfolge:** Die sichtbare Bezeichnung verspricht nur das Entfernen des Videos, tatsächlich wird das gesamte aktuelle Experiment verworfen. Ungespeicherte Arbeit kann unerwartet verloren gehen.
- **Code:** Buttonname in 486; `clearVideo()` setzt Video und Dateifelder zurück und ruft `resetResult()` auf (952–963); `resetResult()` deaktiviert Export/Messung und ruft `resetCalibration()` (934–950); direkter Handler ohne Vorprüfung in 1235.
- **Vorhandene Gegenmaßnahme:** Das Zurücksetzen verhindert zu Recht eine Vermischung von Video und fremdem Ergebnis. Die Schaltfläche hat außerdem einen eindeutigen zugänglichen Namen – nur ihr tatsächlicher Datenverlustumfang bleibt unausgesprochen.
- **Konkrete Verbesserung:** Bei vorhandenem Resultat oder Messarbeit den Umfang vorab erklären („Video, Bild und 4 Messungen löschen?“), mit Abbruch als Standard und optional vorherigem PNG-Export. Alternativ einen klar benannten Projektzustand mit Rückgängig anbieten. Ohne zu verlierende Arbeit ist kein zusätzlicher Dialog nötig.
- **Akzeptanzkriterium:** Kein Klick auf „Video entfernen“ kann ungewarnt Messungen oder Maßstab löschen. Abbrechen bewahrt den kompletten Zustand; Bestätigen entfernt genau die vorher benannten Daten. Die Bezeichnung beschreibt den tatsächlichen Umfang.

---

## H – Heuristische Einschätzungen

### STROBO-UX-011 – Kein Schutz bzw. keine Wiederherstellung bei Reload oder versehentlichem Verlassen

- **Schwere:** 2 – mittel.
- **Betroffener Ablauf:** Gesamter Arbeitsprozess, besonders nach aufwendiger Messung und vor PNG-Export.
- **Szenario/Repro:** Mit erstelltem, noch nicht exportiertem Ergebnis die Seite neu laden, schließen oder versehentlich zu einem anderen Ziel navigieren. Videoobjekt, Ergebnis, Einstellungen und Messungen existieren nur im Laufzeitzustand; es gibt weder Sicherung noch `beforeunload`-Schutz noch Wiederherstellung.
- **Nutzerfolge:** Der komplette Arbeitsstand ist verloren und muss einschließlich Kalibrierung neu erstellt werden. Ob Nutzer bei einer Offline-Einzelseite automatische Persistenz erwarten, ist heuristisch; die mögliche Datenverlustfolge ist erheblich.
- **Code:** Flüchtiger `state` in 872; Zurücksetzen nur in 934–963; `pagehide` bricht Verarbeitung ab und widerruft die Objekt-URL in 1386. Es gibt keinen `beforeunload`-/`pageshow`-Wiederherstellungs- oder Projekt-Speichermechanismus.
- **Vorhandene Gegenmaßnahmen:** `pagehide` verhindert weiterlaufende Verarbeitung und gibt Ressourcen frei. Das ist technisch sinnvoll, schützt aber nicht die Arbeit.
- **Konkrete Verbesserung:** Mindestens bei ungespeichertem Ergebnis oder Messungen einen native Verlassenshinweis aktivieren und nach erfolgreichem Export den „dirty“-Zustand neu bewerten. Für mobile Browser, in denen solche Hinweise unzuverlässig sein können, wäre eine lokale Wiederherstellung des Projekts bzw. wenigstens der Messdaten robuster.
- **Akzeptanzkriterium:** Ein versehentlicher Reload mit ungesicherter Arbeit führt entweder zu einer bestätigten Verlassensentscheidung oder zu einer vollständig wiederherstellbaren Sitzung inklusive Videoquelle, Einstellungen, Ergebnis, Messungen und Maßstab. Nach bewusstem Verwerfen erscheint kein unnötiger Hinweis.

### STROBO-UX-012 – Messungen löschen bietet weder Rückgängig noch Sicherungsabfrage

- **Schwere:** 2 – mittel.
- **Betroffener Ablauf:** Fehlerkorrektur innerhalb des Messdialogs.
- **Szenario/Repro:** Nach mehreren benannten und kalibrierten Strecken versehentlich „Alle löschen“ oder das X einer einzelnen Strecke aktivieren. Die Daten werden sofort entfernt. Die bisherigen Toasts verschwinden lediglich nach einer Zeit und enthalten keine Wiederherstellungsaktion.
- **Nutzerfolge:** Ein Fehlklick kann mehrere Messungen vernichten. Einzelne Messungen lassen sich nur durch erneutes Punktsetzen rekonstruieren; es gibt keine kurze Korrekturfenster-Funktion.
- **Code:** Einzelnes Löschen ohne Undo in 1218–1222; „Alle löschen“ in 547 und Handler 1362–1365; Toast-Funktion ohne Aktion in 881–885. `resetCalibration()` zeigt ebenfalls, dass keine getrennte Sicherung der alten Messdaten existiert (942–950).
- **Vorhandene Gegenmaßnahmen:** „Alle löschen“ ist deaktiviert, solange weder Messung noch Entwurf existiert (1169). Die Bezeichnung ist eindeutig destruktiv; deshalb ist nicht jede Nutzung ein Defekt. Ein erster Entwurf lässt sich mit „Neue Strecke“ verwerfen (1361).
- **Konkrete Verbesserung:** Bevorzugt eine kurze „Messungen gelöscht – Rückgängig“-Aktion mit vollständiger Wiederherstellung anbieten. Bei „Alle löschen“ alternativ eine Abfrage, wenn mehrere Einträge betroffen sind. Rückgängig muss auch Namen, Sichtbarkeit, Auswahl und IDs intakt wiederherstellen.
- **Akzeptanzkriterium:** Nach versehentlichem Löschen einer oder aller Strecken kann derselbe Zustand mit einer einzigen Aktion vollständig wiederhergestellt werden. Die Aktion ist per Tastatur und mit Screenreader bedienbar und verschwindet nicht, bevor sie fokussiert/angesagt werden konnte.

### STROBO-UX-013 – Vollbild bietet keinen eigenen sichtbaren Ausstieg für Touch-Nutzer

- **Schwere:** 1 – gering.
- **Betroffener Ablauf:** Vorschau auf Smartphone/Tablet vergrößern und wieder zur App zurückkehren.
- **Szenario/Repro:** Vollbild über die Schaltfläche unterhalb der Vorschau öffnen. In den Vollbildmodus gelangt nur `visual-area`; die auslösende Schaltfläche liegt außerhalb und ist dort nicht mehr als App-Bedienelement verfügbar. Innerhalb des Vollbilds existiert kein „Schließen/Zurück“-Button.
- **Nutzerfolge:** Touch-Nutzer müssen die jeweilige Browser- oder Systemgeste kennen. Auf Desktop ist Escape naheliegend und Browser zeigen häufig eigene Hinweise; ein echtes Blockieren ist daher nicht belegt, aber die appseitige Orientierung fehlt.
- **Code:** `visual-area` in 511–525; Vollbildbutton außerhalb in 526; `requestFullscreen()`/`exitFullscreen()` in 1261–1267. Es gibt kein Bedienelement innerhalb des Vollbildcontainers zum Beenden.
- **Vorhandene Gegenmaßnahmen:** Escape bzw. native Browser-/Systemmechanismen können den Modus beenden; nicht unterstützte Vollbild-APIs erhalten eine verständliche Toast-Rückmeldung (1264–1265).
- **Konkrete Verbesserung:** Innerhalb des Vollbilds eine sichtbare, mindestens 44×44 CSS-Pixel große Schaltfläche „Vollbild schließen“ mit `aria-label` einblenden; Escape weiter unterstützen. Optional das Bild antippen, um native Hinweise sichtbar zu machen, aber nicht als einzige Lösung.
- **Akzeptanzkriterium:** Auf mindestens einem unterstützten Android- und einem unterstützten iOS-/iPadOS-Browser lässt sich Vollbild allein über ein sichtbares Touch-Ziel öffnen und schließen; danach ist der Fokus wieder sinnvoll bei der Vorschau. Wo Element-Vollbild nicht unterstützt wird, erscheint kein erfolgloser Einstieg und die Alternative wird klar benannt. Desktop-Escape funktioniert weiterhin.

### STROBO-UX-014 – Messpunkte sind auf kleinen Touchscreens schwer präzise zu korrigieren

- **Schwere:** 2 – mittel.
- **Betroffener Ablauf:** Mobile Streckenmessung und Fehlerkorrektur.
- **Szenario/Repro:** Auf einem kleinen Display ein detailreiches oder hochformatiges Ergebnis vermessen. Der Canvas wird vollständig in die verfügbare Fläche eingepasst und deaktiviert mit `touch-action: none` das native Scrollen/Zoomen auf dem Canvas. Es gibt weder Lupe/Zoom noch verschiebbare Endpunkte. Nach dem zweiten Tap kann eine falsch gesetzte Strecke nur gelöscht und neu erstellt werden.
- **Nutzerfolge:** Finger verdecken den Zielpunkt; kleine Positionsfehler beeinflussen Pixelstrecke und kalibrierte Zentimeterwerte. Die fehlende direkte Korrektur erhöht den Aufwand und kann unbemerkt die Messgenauigkeit senken. Die tatsächliche Treffergenauigkeit ist ohne Gerätetest offen.
- **Code:** `touch-action: none` und Fadenkreuz in 278; reine Größenanpassung in 1143–1153; Punktsetzung und sofortige Fertigstellung nach dem zweiten Klick in 1340–1358. Pointer-Dragging existiert nur für Beschriftungen (1297–1339), nicht für Endpunkte. „Neue Strecke“ und Löschen sind die vorhandenen Korrekturwege (1218–1222, 1361–1365).
- **Vorhandene Gegenmaßnahmen:** Punkte werden sichtbar gezeichnet, ein identischer zweiter Punkt wird abgefangen, und Beschriftungen lassen sich per Touch verschieben. Diese Funktionen verhindern Fehlbedienung beim Layout, verbessern aber nicht die Endpunktgenauigkeit.
- **Konkrete Verbesserung:** Endpunkte nachträglich per ausreichend großem Touch-Ziel verschiebbar machen und während des Setzens eine Lupe bzw. kontrollierbaren Zoom anbieten. Alternativ einen Bestätigungsschritt nach dem zweiten Punkt einführen. Zoom/Pan darf keine unbeabsichtigten Messpunkte erzeugen; Tastaturalternative gemäß 002 mitdenken.
- **Akzeptanzkriterium:** Auf einem Gerät mit 360 CSS-Pixeln Breite kann eine vorhandene Strecke an beiden Enden korrigiert werden, ohne andere Messungen zu löschen. Der Zielpunkt bleibt während der Korrektur sichtbar bzw. durch Lupe erkennbar; Werte aktualisieren sich sofort und Export sowie Tastaturbedienung bleiben konsistent.

---

## U – Ungetestete Hypothesen

### STROBO-UX-015 – BFCache-Rückkehr könnte die Videoquelle unbrauchbar machen

- **Schwere:** 2 – mittel, falls bestätigt.
- **Betroffener Ablauf:** App nach Erstellung kurz verlassen → über Browser-Zurück zurückkehren → Video ansehen oder erneut erstellen.
- **Szenario zur gezielten Prüfung:** In einem Browser mit Back-Forward-Cache ein Ergebnis erstellen, zu einer anderen Seite navigieren und zurückkehren. `pagehide` widerruft die Objekt-URL auch dann, wenn die Seite in den BFCache aufgenommen wird. Falls dabei JS-Zustand und Canvas erhalten bleiben, die URL aber ungültig ist, könnten vorhandenes Ergebnis und scheinbar geladenes Video noch angezeigt werden, während erneutes Erstellen oder Suchen im Video fehlschlägt.
- **Mögliche Nutzerfolge:** Ein scheinbar wiederhergestelltes Experiment ist nur teilweise funktionsfähig. Die Fehlermeldung würde erst beim nächsten Zugriff erscheinen; die ursprüngliche Datei müsste eventuell erneut ausgewählt werden.
- **Code:** Einziger `pagehide`-Handler in 1386 widerruft `state.url` bedingungslos und prüft weder `event.persisted` noch einen späteren `pageshow`-Wiedereinstieg. `processVideo()` benötigt diese URL erneut (665–670); die ursprüngliche `File`-Referenz wird nicht im `state` gehalten (872, 965–971).
- **Warum Hypothese:** Ob und wie BFCache, Videozustand und widerrufene Objekt-URL in Chrome, Firefox und Safari zusammenwirken, wurde nicht ausgeführt. Aus dem Code allein folgt keine bestätigte sichtbare Störung.
- **Konkrete Verbesserung:** Zunächst mit echtem Navigations-/BFCache-Test bestätigen. Falls belegt, bei `event.persisted` die Quelle nicht widerrufen oder auf `pageshow` einen konsistenten Wiederherstellungszustand herstellen. Keine halb wiederhergestellte Oberfläche mit ungültiger Quelle anzeigen.
- **Akzeptanzkriterium:** Nach Zurücknavigation mit BFCache funktionieren Videowiedergabe, Einzelbild-Seek und erneutes Erstellen ohne erneute Dateiauswahl; alternativ wird sofort klar erklärt, dass das Video neu gewählt werden muss. Der Test sollte mindestens Chrome/Edge, Firefox und Safari einschließen und `event.persisted` protokollieren.

---

## Bereits vorhandene, relevante Gegenmaßnahmen (keine Fehlalarme)

- **Abbruch ist vorhanden und signalisiert:** Der sichtbare Button „Verarbeitung abbrechen“ bleibt während des Busy-Zustands aktiv; `AbortController` durchzieht Laden, Suchen und Verarbeitung (619–660, 690, 995–1002, 1241). Ein Abbruch wird per Toast gemeldet und überschreibt ein vorheriges Resultat nicht (1046–1049).
- **Tastaturnavigation ist teilweise gut umgesetzt:** Skip-Link, native Buttons/Eingaben/Dialoge und die vollständige Tab-Navigation mit Pfeilen, Pos1 und Ende sind vorhanden (438, 481, 924–932, 1244–1249). Befund 002 betrifft gezielt den Mess-Canvas, nicht die gesamte App.
- **Eingabe- und Verarbeitungsfehler sind konkret:** Ungültige Frequenzen/Zeiten, mehr als 300 Bilder, Lesefehler und Timeouts liefern verständliche deutsche Meldungen (570–575, 619–660, 899–903). `role="alert"`, Fortschrittsanzeige und Statusregionen sind vorhanden (505–506, 524, 526, 562).
- **Messbedienung hat mehrere Schutzmechanismen:** Dialogschließen verwirft Messungen nicht; „Neue Strecke“ verwirft einen Entwurf, identische Punkte werden abgefangen, Sichtbarkeit und Löschen sind getrennt, Namen/Längenanzeige sind editierbar (1074–1076, 1182–1225, 1337–1365).
- **Fachliche Einordnung ist vorhanden:** Die Hilfe erklärt Frequenz/Zeitintervall und warnt ausdrücklich vor Zeitlupen- und doppelten Videobildern sowie Genauigkeitsgrenzen (533). Diese Punkte wurden nicht erneut als angebliche fehlende Hinweise gemeldet.
- **Mobile und reduzierte Darstellung wurden bedacht:** Responsive Layouts, 44-Pixel-Ziele an vielen zentralen Buttons, `playsinline`, Dark Mode, erhöhte Kontraste, reduzierte Bewegung/Transparenz und Forced Colors sind vorhanden (140, 173, 222, 278, 318–433, 523).
- **Datenschutz und Offline-Auffindbarkeit sind klar:** Die App kommuniziert lokale Verarbeitung sichtbar und benötigt laut Dokumentstruktur keine externen Ressourcen (2–3, 465, 471, 478).

## Priorisierte Umsetzungsempfehlung

1. **Zuerst fachliche Fehlzuordnung und Datenverlust verhindern:** 001, 003 und 010.
2. **Danach den Messkern zugänglich machen:** 002 und 009; anschließend 014 auf echten Touch-Geräten validieren.
3. **Anschließend Verständlichkeit und Rückmeldung schließen:** 004, 005, 006 und 007.
4. **Vor weiterer Arbeit gezielt verifizieren:** BFCache-Hypothese 015 sowie Verlassensschutz 011. Die geringen Verbesserungen 008 und 013 können danach mit dem Export-/Vollbildkonzept umgesetzt werden.
