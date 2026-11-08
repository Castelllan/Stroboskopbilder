# STROBO – unabhängiges Usability-/UX-Audit

**Auditobjekt:** `index.html` (1.392 Zeilen, 98.211 Byte) im aktuellen Projekt
**Zielgruppe:** deutschsprachige Lernende und Lehrkräfte
**Kernkette:** Video → Frequenz/Zeitbereich → Stroboskopbild → Messung/Kalibrierung → PNG-Export
**Auditdatum:** 07.11.2026
**Auditart:** statische Code- und Interaktionsanalyse, keine Codequalitäts- oder Security-Prüfung

---

## 1. Vorbemerkung, Methode und Testgrenzen

### 1.1 Was tatsächlich geprüft wurde

- Vollständige Lektüre von `index.html` (CSS, Markup, gesamtes Inline-Skript).
- Nachvollziehen aller relevanten Zustandsübergänge und Ereignisbehandlungen im Code.
- Rechnerische Nachprüfung der reinen Hilfsfunktionen `samplingTimes` und `parseTime` mit Node.js (nicht Teil der App, nur Nachbau der Logik).
- Rechnerische Nachprüfung der WCAG-Kontrastwerte aus den CSS-Farbwerten (sRGB, relative Luminanz).
- Abgleich der CSS-Breakpoints und der sich daraus ergebenden Sichtbarkeit von Inhalten.

### 1.2 Was **nicht** ausgeführt wurde

- **Keine Browser-, Geräte- oder Screenreader-Tests.** Es wurde keine Seite gerendert, kein Video geladen, keine Verarbeitung gestartet, kein PNG exportiert und keine Tastatur-/Touch-Interaktion real ausgeführt.
- **Keine visuelle Prüfung.** Aussagen zu Größen, Kontrasten und Layout beruhen auf CSS-Werten und Rechnung, nicht auf Screenshots.
- **Keine Nutzertests.** Die Zielgruppenannahmen stammen aus dem Auftrag.
- **Keine anderen Auditdateien gelesen.** Es wurden ausschließlich `index.html` und die eigene Ausgabedatei verwendet.
- **Keine App-Änderungen, kein Commit, keine Subdelegation.**

### 1.3 Kennzeichnung des Belegstatus

| Kennzeichnung | Bedeutung |
|---|---|
| **Defekt (belegt)** | Der Fehler ist direkt aus dem Code oder aus nachgerechneten Werten ableitbar. |
| **Defekt (rechnerisch)** | Der Befund folgt aus CSS-/Geometrie-/Kontrastrechnung; die visuelle Wirkung wurde nicht am Bildschirm geprüft. |
| **Heuristik** | Bewertung nach Usability-/Accessibility-Prinzipien, gestützt auf Code und Plattformverhalten, aber ohne vollständigen Nachweis. |
| **Hypothese (ungetestet)** | Der Befund ist plausibel und codegestützt, benötigt aber einen Browser-, Geräte- oder Screenreader-Test. |

### 1.4 Schweregrad

| Schwere | Bedeutung |
|---|---|
| 4 | blockierend für die gesamte Zielgruppe |
| 3 | schwer: Kernablauf für eine Nutzergruppe blockiert oder schwerwiegender, nicht rückgängig zu machender Verlust |
| 2 | mittel: deutliche Reibung, Fehlbedienung, falsches Verständnis oder reversibler Datenverlust |
| 1 | gering: Politur, kleine Hürde, eingeschränkte Zielgruppe |
| 0 | kein Befund |

---

## 2. Priorisierte Übersicht

| ID | Befund | Betroffener Ablauf | Art | Schwere |
|---|---|---|---|---|
| **UX-M01** | Mess-Canvas ist ohne Zeigegerät nicht bedienbar | Messen/Kalibrieren | Defekt (belegt) | **3** |
| UX-V01 | Nach dem Laden gibt es kein Drop-Ziel mehr; Ersetzen per Drag-and-drop läuft ins Leere | Video ersetzen | Defekt (belegt) | 2 |
| UX-V02 | „Video entfernen“ löscht Ergebnis und Messungen ohne Bestätigung; 32 px breites Ziel; ggf. leere Video-Ansicht | Video entfernen | Defekt (belegt) | 2 |
| UX-V03 | Fokusverlust nach Video-Laden und -Entfernen | Video auswählen (Tastatur) | Defekt (belegt) | 2 |
| UX-V04 | Ladefehler erscheint weit unter dem Auslöser, auf Mobil unter dem Fold | Video auswählen → Fehler | Heuristik | 2 |
| UX-C01 | Irreführende Fehlermeldung bei ungültigem/zu großem Zeitbereich | Zeitbereich → Erstellen | Defekt (belegt) | 2 |
| UX-C02 | Einstellungsfehler nur als kleiner Hinweis unter deaktiviertem Button; nicht zugeordnet/angekündigt | Einstellungen → Erstellen | Defekt (belegt) / Heuristik | 2 |
| UX-C03 | Keine visuelle Zeitbereichsauswahl am Video; nur blinde Texteingabe | Zeitbereich festlegen | Heuristik | 2 |
| UX-C04 | Tabs bleiben während der Verarbeitung aktiv; Ergebnis kann verborgen bleiben | Erstellen → Ergebnis | Defekt (belegt) | 2 |
| UX-C05 | Live-Regionen: Fortschritt wird pro Bild aktualisiert; Toast wird erst befüllt, dann eingeblendet | Erstellen (Screenreader) | Defekt (Mechanik) / Hypothese (Wirkung) | 1 |
| UX-C06 | Deutsche Kommaeingabe in `type=number` browserabhängig | Frequenz/Maßstab eingeben | Hypothese (ungetestet) | 2 |
| UX-C07 | Beispielvorschau zeigt statisch Δt = 0,10 s unabhängig von der Frequenz | Einstieg → Frequenz | Defekt (Inkonsistenz) / Heuristik | 2 |
| UX-C08 | H1 und Intro benennen das Ergebnis „Stroboskopbild“ nicht | Einstieg/Orientierung | Heuristik | 1 |
| UX-R01 | Einzelbild-Zeiten sind relativ, werden aber als „im Video“ bezeichnet; Auswahlzustand nur visuell | Ergebnis → Einzelbilder | Defekt (belegt) | 2 |
| UX-R02 | Hilfsraster und Zeitleiste fehlen im Messbild | Ergebnis → Messen | Defekt (belegt) | 1 |
| UX-R03 | Vollbild hat keinen sichtbaren Ausstieg im Vollbild-Element | Ergebnis → Vollbild | Heuristik | 1 |
| UX-M02 | Fokusverlust beim Auswählen/Löschen in der Messliste; Widersprüchliche Toggle-Semantik | Messliste bedienen | Defekt (belegt) / Heuristik | 2 |
| UX-M03 | Messpunkte nach dem Setzen nicht korrigierbar; kein Undo | Messpunkte setzen | Heuristik | 2 |
| UX-M04 | Kein Zoom/Pan; Messlinien und Punkte auf kleinen Displays hauchdünn | Messen auf dem Smartphone | Heuristik (rechnerisch) | 2 |
| UX-M05 | „Alle löschen“ ohne Bestätigung/Undo | Messungen löschen | Defekt (belegt) | 2 |
| UX-M06 | Toast im modalen Messdialog liegt außerhalb des Top-Layers | Messen → ungültige Strecke | Hypothese (Top-Layer) | 1 |
| UX-M07 | Messen und Kalibrieren sind visuell schlecht auffindbar; Hilfe erklärt die Kalibrierung nicht | Messen/Kalibrieren finden | Heuristik | 2 |
| UX-M08 | Video-Ton läuft beim Öffnen des Messdialogs weiter | Originalvideo → Messen | Defekt (belegt) | 2 |
| UX-D01 | Erfolgreiches neues Ergebnis löscht Messungen und Maßstab ohne Warnung | Erneut erstellen | Defekt (belegt) | 2 |
| UX-D02 | Kein Schutz gegen Verlust bei Reload/Tab-Schließen; keine Persistenz | Reload/Tab schließen | Defekt (belegt) / Hypothese (bfcache) | 2 |
| UX-A01 | iOS-Autozoom bei 14-px-Eingabefeldern | Zeitbereich/Maßstab/Name auf iOS | Hypothese (Plattformverhalten) | 2 |
| UX-A02 | Sekundärtexte 9–10 px, teils unter 4,5:1 Kontrast | Sekundärtexte lesen | Defekt (rechnerisch) | 1 |
| UX-A03 | Mobil werden Datenschutz-/Offline-Hinweis und „Beispielvorschau“-Label ausgeblendet | Mobiler Einstieg | Defekt (belegt) / Heuristik | 1 |

**Verteilung:** 1 × Schwere 3, 20 × Schwere 2, 7 × Schwere 1 (28 Befunde). Kein Befund mit Schwere 4.

---

## 3. Detailbefunde

### 3.1 Einstieg und Video

---

#### UX-V01 · Nach dem Laden gibt es kein Drop-Ziel mehr; Video-Ersetzen per Drag-and-drop läuft ins Leere

**Art:** Defekt (belegt)

**Betroffener Ablauf:** Video auswählen → Video ersetzen

**Szenario/Repro:**
1. Ein Video laden; der Dropzone-Button wird durch die Datei-Karte ersetzt (`dropzone.hidden = true`, `index.html:972`).
2. Ein zweites Video auf die Datei-Karte oder eine andere Stelle der Seite ziehen.
3. Es passiert nichts: Die Drop-Listener hängen ausschließlich am `#dropzone` (`index.html:1230–1232`); der globale Handler verhindert nur die Navigation (`index.html:1234`).

**Nutzerfolge:** Der beworbene Weg „Video hier ablegen“ funktioniert nur beim ersten Video. Zum Wechseln muss die Nutzerin den kleinen X-Button bemühen – und verliert dabei Ergebnis und Messungen (siehe UX-V02). Das ist eine stille Sackgasse.

**Schwere:** 2

**Fundstelle:** `index.html:485` (`#dropzone`), `index.html:486` (`#file-info`), `index.html:972` (Ausblenden), `index.html:1228–1234` (Listener)

**Verbesserung:** `#file-info` oder den gesamten `.controls`-Bereich als Drop-Ziel registrieren; bei vorhandenem Ergebnis vor dem Laden eine Bestätigung anzeigen. Alternativ einen sichtbaren Button „Video ersetzen“ ergänzen.

**Akzeptanzkriterium:** Bei geladenem Video führt das Ablegen einer Videodatei auf die Datei-Karte zu einem sichtbaren Ladezustand (und ggf. zu einer Bestätigung), ohne dass zuerst „Video entfernen“ geklickt werden muss. Mit Datei-Drop getestet.

**Vorhandene Gegenmaßnahme:** Der globale `drop`-Handler verhindert immerhin, dass der Browser die Videodatei als Navigation öffnet (`index.html:1234`). Das ist korrekt, löst aber nicht das fehlende Ersetzen.

---

#### UX-V02 · „Video entfernen“ löscht Ergebnis und Messungen ohne Bestätigung; 32-px-Ziel; ggf. leere Video-Ansicht

**Art:** Defekt (belegt)

**Betroffener Ablauf:** Video entfernen / neues Experiment

**Szenario/Repro:**
1. Video laden, Stroboskopbild erstellen, mehrere Strecken messen und einen Maßstab setzen.
2. Auf den X-Button in der Datei-Karte tippen (`#remove-video`, `index.html:486`; Handler `index.html:1235`).
3. `clearVideo()` ruft `resetResult()` auf, das wiederum `resetCalibration()` ausführt (`index.html:952–963`, `934–950`). Ergebnis, Messungen und Maßstab sind sofort weg; es gibt keine Rückfrage und kein Undo.
4. War zuvor der Tab „Originalvideo“ aktiv, bleibt dieser Tab aktiv; `clearVideo()` schaltet nicht auf „Stroboskopbild“ um. Gleichzeitig wird das Tag auf „Beispielvorschau“ gesetzt (`index.html:960`), das Beispiel liegt aber im verborgenen Ergebnis-Tab (`index.html:929`). Sichtbar ist die leere Video-Ansicht „Hier beginnt deine Bewegung“.

**Nutzerfolge:** Ein einziger Fehlgriff – auf Mobil ist der Button nur 32 px breit (`index.html:188`) – vernichtet die gesamte Messarbeit. Der Beschriftungstext „Video entfernen“ (`aria-label`, `index.html:486`) kommuniziert nicht, dass auch Ergebnis und Messungen verschwinden. Die leere Video-Ansicht wirkt anschließend wie ein Fehlerzustand.

**Schwere:** 2
*(Bewusst nicht 3: Die Aktion ist explizit ausgelöst und die Daten sind durch erneutes Messen rekonstruierbar; der unangekündigte Umfang und die fehlende Rückfrage bleiben aber erheblich.)*

**Fundstelle:** `index.html:486` (Button), `index.html:188` (32 px), `index.html:1235` (Handler), `index.html:952–963` (`clearVideo`), `index.html:934–950` (`resetResult`/`resetCalibration`), `index.html:929` (Tab-Sichtbarkeit)

**Verbesserung:**
- Button auf mindestens 44 × 44 px vergrößern (die 24 × 24 px der WCAG-2.2-AA-Mindestgröße sind zwar erreicht, die 44-px-Empfehlung nicht).
- Label auf „Video, Ergebnis und Messungen entfernen“ erweitern.
- Nur bei vorhandenem Ergebnis/Messungen eine Bestätigung oder einen Undo-Toast anbieten.
- In `clearVideo()` `selectTab('result')` aufrufen, damit das Beispiel wieder sichtbar ist.

**Akzeptanzkriterium:**
- Bei vorhandenem Ergebnis öffnet der X-Button zuerst eine Bestätigung oder bietet eine Rückgängig-Aktion an.
- Nach dem Entfernen ist der Tab „Stroboskopbild“ aktiv und die Beispielvorschau sichtbar.
- Der Button ist auf 375 px Breite mindestens 44 px breit.

---

#### UX-V03 · Fokusverlust nach Video-Laden und -Entfernen

**Art:** Defekt (belegt)

**Betroffener Ablauf:** Video auswählen/entfernen (Tastatur)

**Szenario/Repro:**
1. Mit der Tastatur den Dropzone-Button fokussieren und Enter drücken, eine Datei auswählen.
2. `loadVideo()` blendet den fokussierten `#dropzone` aus (`index.html:972`). Der Fokus fällt in der Regel auf `body` zurück.
3. Beim Entfernen wird der fokussierte `#remove-video`-Button mit der Datei-Karte ausgeblendet (`index.html:957`); dasselbe Problem.
4. Auch bei einem Ladefehler wird der Dropzone zunächst ausgeblendet (`index.html:972`) und erst in `clearVideo()` wieder eingeblendet (`index.html:957`); der Fokus wird nicht zurückgeholt.

**Nutzerfolge:** Tastaturnutzer verlieren nach jedem Video-Wechsel ihre Position und müssen vom Seitenanfang (Skip-Link) erneut durch die Oberfläche tabben. Das ist besonders störend, weil der nächste logische Schritt – die Frequenz – weit unten liegt.

**Schwere:** 2

**Fundstelle:** `index.html:484` (Datei-Input), `index.html:972` (Dropzone ausblenden), `index.html:957` (Datei-Karte ausblenden), `index.html:1229` (Change-Handler), `index.html:989–992` (Fehlerpfad)

**Verbesserung:** Nach erfolgreichem Laden den Fokus auf den Entfernen-Button der Datei-Karte oder direkt auf `#frequency` setzen. Nach einem Fehler den Fokus auf die Dropzone bzw. die Fehlermeldung setzen. Nach dem Entfernen den Fokus auf die Dropzone setzen.

**Akzeptanzkriterium:** Nach dem Laden, nach einem Ladefehler und nach dem Entfernen ist ein sinnvolles Element fokussiert (sichtbarer Fokusring), und die nächste Tab-Taste führt nicht zum Seitenanfang. Mit Tastatur getestet.

**Vorhandene Gegenmaßnahme:** Die App hat einen Skip-Link (`index.html:438`) und sichtbare Fokusringe (`index.html:50–53`); das Problem ist der fehlende Fokus-Transfer, nicht fehlende Fokus-Sichtbarkeit.

---

#### UX-V04 · Ladefehler erscheint weit unter dem Auslöser, auf Mobil unter dem Fold

**Art:** Heuristik (Code + Layout nachvollzogen, nicht am Gerät geprüft)

**Betroffener Ablauf:** Video auswählen → Ladefehler

**Szenario/Repro:**
1. Auf einem 375 × 667 px großen Smartphone oben auf „Datei auswählen“ tippen und eine nicht lesbare Videodatei wählen.
2. `loadVideo()` ruft im Fehlerfall `clearVideo()` und `error(err.message)` auf (`index.html:989–992`). Die Meldung landet in `#error-message` (`index.html:506`) – am Ende der linken Steuerspalte, nach Frequenz, Einstellungen und Erstellen-Bereich.
3. Auf dem Telefon liegt die Dropzone im oberen Bereich; die Fehlermeldung ist mehrere hundert Pixel tiefer und beim Auslösen nicht im Viewport. Die Dropzone erscheint einfach wieder.

**Nutzerfolge:** Die Nutzerin sieht keine Erklärung, warum das Video nicht geladen wurde. Sie probiert dieselbe Datei erneut oder hält die App für defekt. Screenreader-Nutzer sollen durch `role="alert"` (`index.html:506`) informiert werden; die Zuverlässigkeit dieses Musters ist in UX-C05 thematisiert. Sehende Mobilnutzer sehen die Meldung jedenfalls nicht ohne Scrollen.

**Schwere:** 2

**Fundstelle:** `index.html:506` (`#error-message`), `index.html:886` (`error()`), `index.html:989–992` (Fehlerpfad), `index.html:505` (Position im DOM), `index.html:348–383` (mobile Einspaltigkeit)

**Verbesserung:** Ladebezogene Fehler direkt unter `#dropzone`/`#file-info` ausgeben (eigener Container) oder nach dem Fehler zur Meldung scrollen und sie fokussieren. Den Fehler zusätzlich am Dropzone-Button als `aria-describedby` verknüpfen.

**Akzeptanzkriterium:** Nach einem fehlgeschlagenen Laden ist die Fehlermeldung auf 375 × 667 px ohne Scrollen sichtbar oder die Seite scrollt automatisch dorthin; der Fehler ist mit der Datei-Auswahl verknüpft. Auf Mobil getestet.

---

### 3.2 Einstellungen und Erstellen

---

#### UX-C01 · Irreführende Fehlermeldung bei ungültigem oder zu großem Zeitbereich

**Art:** Defekt (belegt, mit Node nachgerechnet)

**Betroffener Ablauf:** Zeitbereich eingeben → Erstellen

**Szenario/Repro:**
- Video ist 10 s lang. Im Feld „Von“ steht `20`, „Bis“ bleibt leer (= Videoende, `parseTime(..., state.duration)`).
- `settings()` prüft explizit nur `end > duration` (`index.html:899`). `end` ist hier 10, also unauffällig. `samplingTimes(20, 10, 10)` wirft anschließend „Der Beginn muss vor dem Ende des Zeitbereichs liegen.“ (`index.html:572`). Die eigentliche Ursache – der Start liegt hinter dem Videoende – wird nicht genannt.
- Dasselbe passiert bei `abc` in „Von“ oder „Bis“: `parseTime()` liefert `NaN` (`index.html:889–893`), und die Meldung spricht von der Reihenfolge statt von einer ungültigen Zahl.
- Nachgerechnet: `start=20, end='' , duration=10` → exakt diese Meldung; `end='abc'` → dieselbe Meldung; `start=0, end=20` → korrekt „außerhalb des Videos“.

**Nutzerfolge:** Die Nutzerin korrigiert die falsche Stelle (Reihenfolge), obwohl das Problem eine ungültige Zahl oder ein Start hinter dem Videoende ist. Der Button bleibt deaktiviert; ohne verständliche Ursache wirkt die App blockiert.

**Schwere:** 2

**Fundstelle:** `index.html:889–893` (`parseTime`), `index.html:895–903` (`settings`), `index.html:570–575` (`samplingTimes`), `index.html:917–921` (Hinweistext)

**Verbesserung:** Jedes Feld separat validieren und differenzierte Meldungen ausgeben:
- „Bitte eine Zahl in Sekunden eingeben.“ (NaN)
- „Der Start liegt nach dem Videoende (10,00 s).“
- „Der Start muss vor dem Ende liegen.“ (nur bei gültigen Zahlen)
- „Das Ende liegt nach dem Videoende (10,00 s).“
Zusätzlich das betroffene Feld mit `aria-invalid` markieren.

**Akzeptanzkriterium:** Für die vier Fälle (NaN, Start > Dauer, Start ≥ Ende, Ende > Dauer) erscheint jeweils eine eindeutige, feldbezogene Meldung. Mit den o. g. Eingaben getestet.

---

#### UX-C02 · Einstellungsfehler nur als kleiner Hinweis unter deaktiviertem Button; nicht zugeordnet/angekündigt

**Art:** Defekt (belegt) / Heuristik für die Screenreader-Wirkung

**Betroffener Ablauf:** Einstellungen ändern → Erstellen (Tastatur/Screenreader)

**Szenario/Repro:**
1. Frequenz auf `0` setzen oder „Von“/„Bis“ ungültig machen.
2. `updateControls()` deaktiviert `#create-button` (`index.html:913`) und schreibt die Begründung in `#create-hint` (`index.html:921`) – ein 11-px-`<p>` unter dem Button (`index.html:505`, `index.html:178`).
3. Der deaktivierte Button ist nicht fokussierbar; der Hinweis hat kein `role="status"`/`aria-live`. Ein Screenreader-Nutzer, der im Feld bleibt, hört die Änderung nicht.
4. Zusätzlich ist `#create-hint` über `aria-describedby="frequency-interval create-hint"` an das Frequenzfeld gehängt (`index.html:491`). Beim Fokussieren der Frequenz wird also z. B. „Wähle ein Video, um loszulegen.“ vorgelesen – ein für die Frequenz irrelevanter, dynamischer Text.

**Nutzerfolge:** Sehende sehen den Hinweis erst, wenn sie ihn suchen; Screenreader-Nutzer bekommen keine Erklärung, warum die Hauptaktion nicht verfügbar ist. Die Fehlzuordnung am Frequenzfeld erzeugt zusätzlich irreführende Ansagen.

**Schwere:** 2

**Fundstelle:** `index.html:491` (`aria-describedby`), `index.html:505` (Button + Hint), `index.html:913–921` (`updateControls`), `index.html:178` (11 px, muted)

**Verbesserung:**
- `#create-button` mit `aria-describedby="create-hint"` verknüpfen.
- `#create-hint` als `role="status"`/`aria-live="polite"` ausgeben (gedrosselt).
- Die Felder mit `aria-invalid` und einer feldnahen Fehlermeldung versehen.
- `create-hint` aus der `aria-describedby`-Liste der Frequenz entfernen und durch einen frequenzspezifischen Hinweis ersetzen.
- Alternativ den Button aktiv lassen und beim Klick validieren.

**Akzeptanzkriterium:** Wird die Frequenz ungültig, wird die Begründung innerhalb von ca. 1 s von einem Screenreader angesagt, und der Button verweist per `aria-describedby` darauf. Beim Fokussieren der Frequenz wird nicht der globale Erstellen-Hinweis vorgelesen. Mit NVDA/VoiceOver getestet.

**Vorhandene Gegenmaßnahme:** Die App nutzt an anderen Stellen korrekt `role="alert"` (`#error-message`) und `role="status"` (`#preview-status`); das Muster ist also bekannt, wird hier aber nicht verwendet.

---

#### UX-C03 · Keine visuelle Zeitbereichsauswahl am Video; nur blinde Texteingabe

**Art:** Heuristik

**Betroffener Ablauf:** Zeitbereich festlegen

**Szenario/Repro:**
1. Video laden, zum Tab „Originalvideo“ wechseln und die Stelle finden, an der der Fall beginnt (z. B. bei 5,3 s).
2. Zurück zum Ergebnis-Tab wechseln und die Zahl in „Von“ eintippen. Es gibt keine Schaltfläche „Aktuelle Position übernehmen“, keinen Bereichsregler und keine Markierung im Video.
3. `#start-time` und `#end-time` sind reine Textfelder (`index.html:498`); im Code wird der Player-`currentTime` nur von der Einzelbild-Leiste gesetzt (`index.html:1035`), nicht von den Zeitfeldern gelesen.

**Nutzerfolge:** Für einen 0,1-s-Zeitbereich muss die Nutzerin die Abspielposition manuell ablesen und fehlerfrei abtippen. Das ist umständlich und fehleranfällig, besonders auf Mobilgeräten. Der Hinweis unter dem Button zeigt zwar die Bildanzahl, aber nicht, ob der richtige Abschnitt getroffen wurde.

**Schwere:** 2

**Fundstelle:** `index.html:497–498` (Zeitfelder), `index.html:523` (Player), `index.html:1034–1035` (Einzelbild setzt `currentTime`), `index.html:920` (Hinweis mit Bildanzahl)

**Verbesserung:** Buttons „Aktuelle Position als Start“ und „Aktuelle Position als Ende“ neben den Feldern; alternativ ein Range-Slider mit zwei Griffen über der Video-Zeitleiste und einer Live-Vorschau der Bildanzahl. Die gewählte Range zusätzlich im Player markieren.

**Akzeptanzkriterium:** Die Nutzerin kann den Zeitbereich ohne Abtippen einer Zahl aus der aktuellen Player-Position setzen; die gewählte Range ist im Video sichtbar und die Bildanzahl aktualisiert sich sofort. Mit Tastatur und Touch getestet.

**Vorhandene Gegenmaßnahme:** Der Hinweis `#create-hint` zeigt die resultierende Bildanzahl und Dauer (`index.html:920`) und fängt grobe Fehler ab. Das ersetzt aber keine visuelle Auswahl.

---

#### UX-C04 · Tabs bleiben während der Verarbeitung aktiv; Ergebnis kann verborgen bleiben

**Art:** Defekt (belegt)

**Betroffener Ablauf:** Erstellen → Ergebnis ansehen

**Szenario/Repro:**
1. Video laden und „Stroboskopbild erstellen“ auslösen.
2. Während der Verarbeitung (Progress-Overlay) auf den Tab „Originalvideo“ klicken. Die Tabs liegen im `.preview-toolbar` (`index.html:510`) und werden von `setBusy()` nicht deaktiviert; `setBusy()` sperrt nur `.controls …` (`index.html:998`). Das Overlay bedeckt nur `.visual-area` (`index.html:242`, `index.html:511–525`), nicht die Toolbar.
3. Die Verarbeitung endet erfolgreich. `createResult()` ruft `selectTab('result')` nur **vor** dem Start auf (`index.html:1014`), nicht nach dem Erfolg. Der neue Canvas wird gerendert (`index.html:1024`), bleibt aber im verborgenen `#result-view` (`index.html:929`). Während der Verarbeitung liegt das Overlay auch über dem Video; nach dem Abschluss bleibt der Video-Tab aktiv, das Ergebnis ist verborgen, und unten erscheinen die neuen Einzelbilder.

**Nutzerfolge:** Die Nutzerin sieht das fertige Stroboskopbild nicht und hält die Verarbeitung möglicherweise für fehlgeschlagen, obwohl die Erfolgs-Toastmeldung erscheint. Auf einem großen Bildschirm ist der Tab-Wechsel ein Klick; auf Mobil passiert er leicht versehentlich.

**Schwere:** 2

**Fundstelle:** `index.html:510` (Tabs), `index.html:998` (Disable-Selektor), `index.html:1014` (`selectTab('result')` am Anfang), `index.html:1024` (Canvas wird gezeigt), `index.html:929` (Tab-Sichtbarkeit)

**Verbesserung:** Die Preview-Tabs während `state.busy` deaktivieren (analog zu den Controls) **oder** nach erfolgreichem Abschluss zwingend `selectTab('result')` aufrufen. Zusätzlich den Player pausieren, wenn das Ergebnis fertig ist.

**Akzeptanzkriterium:** Wird während der Verarbeitung auf „Originalvideo“ gewechselt, ist nach Abschluss entweder der Tab-Wechsel gar nicht möglich oder der Ergebnis-Tab wird automatisch aktiv. Mit einem 100-Bilder-Lauf getestet.

---

#### UX-C05 · Live-Regionen: Fortschritt wird pro Bild aktualisiert; Toast wird erst befüllt, dann eingeblendet

**Art:** Defekt (Mechanik belegt) / Hypothese (Screenreader-Wirkung ungetestet)

**Betroffener Ablauf:** Erstellen (Screenreader); Download/Abbruch (Screenreader)

**Szenario/Repro:**
1. Einen Lauf mit vielen Bildern starten. `#progress-description` hat `role="status"` (`index.html:524`) und wird pro Bild mit „Bild i von n wird zusammengeführt.“ aktualisiert (`index.html:712`, `index.html:1020`). Bei 100–300 Bildern sind das 100–300 Textänderungen in einer polite-Live-Region.
2. Beim Download/Abbruch wird `#toast` (role=status, `index.html:562`) erst per `textContent` befüllt und dann `hidden = false` gesetzt (`index.html:881–885`). Eine zunächst verborgene Live-Region ist für viele Screenreader nicht zuverlässig ansagbar.

**Nutzerfolge:** Im besten Fall werden die Fortschrittsmeldungen zusammengefasst; im schlechten Fall wird der Screenreader mit Meldungen geflutet oder die wichtige Abschluss-/Abbruchmeldung bleibt aus. Die Wirkung ist stark vom Browser/Screenreader abhängig und wurde nicht getestet.

**Schwere:** 1
*(Mechanik eindeutig, Auswirkung ungetestet; die Kernaussage „fertig“ steht zusätzlich in `#preview-status`.)*

**Fundstelle:** `index.html:524` (`role="status"`), `index.html:712` (pro Bild), `index.html:1020` (Update), `index.html:562` (Toast), `index.html:881–885` (hidden/textContent)

**Verbesserung:** Fortschritt nur in größeren Schritten (z. B. 10 % oder alle 1–2 s) in die Live-Region schreiben; den Fortschrittsbalken separat fein aktualisieren. Für Toasts eine dauerhaft vorhandene Live-Region verwenden und nur den Text ändern (nicht `hidden` toggeln). Mit NVDA/VoiceOver testen.

**Akzeptanzkriterium:** Ein 100-Bilder-Lauf erzeugt höchstens ca. 10–15 Fortschrittsansagen; Download, Abbruch und Fehler werden zuverlässig angesagt. Mit mindestens einem Screenreader getestet.

---

#### UX-C06 · Deutsche Kommaeingabe in `type=number` browserabhängig

**Art:** Hypothese (ungetestet)

**Betroffener Ablauf:** Frequenz und Maßstab eingeben (deutsche Zahlen)

**Szenario/Repro:**
1. Im Feld „Bilder pro Sekunde“ `10,5` eingeben (`index.html:491`, `type="number"`, `step="0.1"`, `inputmode="decimal"`).
2. Im Feld „Ausgewählte Referenzstrecke entspricht“ `10,5` cm eingeben (`index.html:556`, ebenfalls `type="number"`).
3. Die Zeitfelder sind dagegen `type="text"` und normalisieren Kommas explizit über `parseTime()` (`index.html:889–893`, `index.html:498`).

**Nutzerfolge:** Je nach Browser/Locale wird das Komma akzeptiert, ignoriert oder als ungültig markiert; im schlechtesten Fall bleibt das Feld leer, der Kalibrier-Button bleibt deaktiviert und die Nutzerin versteht nicht, warum. Die App behandelt deutsche Dezimalzahlen in den Zeitfeldern bereits korrekt – die Inkonsistenz ist ein codegestützter Hinweis, aber kein belegter Browserfehler.

**Schwere:** 2 (falls der Browser das Komma verwirft; sonst 0)

**Fundstelle:** `index.html:491` (Frequenz, `type=number`), `index.html:556` (Maßstab, `type=number`), `index.html:889–893` (`parseTime` für Textfelder), `index.html:498` (Zeitfelder, `type=text`)

**Verbesserung:** Alle numerischen Eingaben einheitlich als `type="text"` mit `inputmode="decimal"` und `parseTime()` behandeln, oder eine sichtbare, feldnahe Fehlermeldung für nicht parsebare Werte ergänzen. In Chrome, Firefox und Safari mit `de-DE` testen.

**Akzeptanzkriterium:** `10,5` und `10.5` führen in allen unterstützten Browsern zu 10,5; bei Ablehnung erscheint eine verständliche, feldnahe Meldung. Testmatrix dokumentiert.

---

#### UX-C07 · Beispielvorschau zeigt statisch Δt = 0,10 s unabhängig von der Frequenz

**Art:** Defekt (Inkonsistenz belegt) / Heuristik (Lernwirkung)

**Betroffener Ablauf:** Einstieg → Frequenz wählen

**Szenario/Repro:**
1. Vor dem Laden eines Videos die Frequenz von 10 Hz auf 30 Hz ändern (`index.html:491–492`).
2. Die große Beispielillustration rechts zeigt weiterhin `Δt = 0,10 s` (`index.html:513`, statischer Text) und die Ballpositionen des 10-Hz-Beispiels (`index.html:517–518`).
3. Auf Screens ≤ 1050 px ist zusätzlich das Label „Beispielvorschau“ ausgeblendet (`index.html:325`); es bleibt nur der 9-px-Schriftzug „ILLUSTRATION“ (`index.html:519`).

**Nutzerfolge:** Lernende können die Beispielvorschau als Vorschau ihrer eigenen Einstellung interpretieren und ein falsches Δt lernen. Der Fehler ist besonders relevant, weil die App Physik vermitteln will und die Frequenz der zentrale Begriff ist.

**Schwere:** 2

**Fundstelle:** `index.html:513` (statisches Δt), `index.html:517–518` (feste Positionen), `index.html:510`/`325` (Beispiel-Tag, mobil ausgeblendet), `index.html:491–493` (Frequenzsteuerung)

**Verbesserung:** Entweder das Beispiel bei Frequenzänderung dynamisch neu layouten (aufwendig) oder unmissverständlich als festes Beispiel kennzeichnen: „Beispiel: 10 Hz, Δt = 0,10 s – unabhängig von deiner Einstellung“. Das Label „Beispiel“ auch auf kleinen Screens sichtbar halten.

**Akzeptanzkriterium:** Bei jeder Frequenz ist eindeutig erkennbar, dass die Beispielvorschau ein festes 10-Hz-Beispiel ist (oder sie zeigt die aktuelle Frequenz korrekt). Auf 375 px und 1280 px geprüft.

---

#### UX-C08 · H1 und Intro benennen das Ergebnis „Stroboskopbild“ nicht

**Art:** Heuristik

**Betroffener Ablauf:** Einstieg/Orientierung

**Szenario/Repro:**
1. Die Seite öffnen. Sichtbar ist „DEIN KLEINES PHYSIKLABOR“, „Ein Video. Viele Momente.“ und „Entdecke die Bewegung zwischen den Augenblicken. Bild für Bild.“ (`index.html:474–476`).
2. Das Wort „Stroboskopbild“ erscheint sichtbar erst im Tab/Button des Arbeitsbereichs (`index.html:510`, `index.html:505`) – auf Mobil liegt dieser Bereich unterhalb der langen Steuerspalte.
3. Die `<title>`-/Meta-Beschreibung nennt das Stroboskopbild (`index.html:9–10`), ist aber nicht Teil der sichtbaren Seite.

**Nutzerfolge:** Eine Lehrkraft, die einen Link öffnet, erkennt nicht sofort, dass es sich um einen Stroboskopbild-Generator handelt. Das ist eine verpasste Orientierung, kein blockierendes Problem.

**Schwere:** 1

**Fundstelle:** `index.html:475` (H1), `index.html:476` (Intro), `index.html:9–10` (Meta), `index.html:510`/`505` (erste sichtbare Nennung)

**Verbesserung:** H1 oder Untertitel explizit machen, z. B. „Stroboskopbilder aus deinem Video“ oder „Ein Video. Viele Momente. Ein Stroboskopbild.“ Den Untertitel für Suchmaschinen und Screenreader als echte Beschreibung formulieren.

**Akzeptanzkriterium:** Beim ersten Bildschirmaufbau (ohne Scrollen, 375 px und 1280 px) ist sichtbar, dass die App aus einem Video ein Stroboskopbild erzeugt.

---

### 3.3 Ergebnis, Zeitangaben und Export

---

#### UX-R01 · Einzelbild-Zeiten sind relativ, werden aber als „im Video“ bezeichnet; Auswahlzustand nur visuell

**Art:** Defekt (belegt)

**Betroffener Ablauf:** Ergebnis → Einzelbilder/Originalvideo

**Szenario/Repro:**
1. Ein Video laden und im Zeitbereich „Von“ = `5`, „Bis“ = `8` setzen.
2. Ergebnis erstellen. Die Einzelbild-Leiste zeigt für das erste Bild `0,00 s` (`index.html:1031`), weil `relativeTime = times[i] - start` (`index.html:711`).
3. Das `aria-label` sagt aber „Einzelbild 1 bei 0,000 Sekunden **im Video** ansehen“ (`index.html:1029`), und der Klick springt auf `frame.time` = 5,00 s (`index.html:1035`). Die sichtbare Beschriftung („0,00 s“, 2 Nachkommastellen, `index.html:1031`) und die tatsächliche Videozeit widersprechen sich.
4. In der PNG-Zeitleiste steht der Hinweis „Zeitangaben relativ zum Abschnittsbeginn“ (`index.html:747`) – aber nur, wenn die Legende hoch genug ist (Breite > ca. 510 px). In der UI fehlt dieser Hinweis ganz.
5. Nach dem Klick erhält der Rahmen nur die CSS-Klasse `selected` (`index.html:1036`); es gibt kein `aria-pressed`/`aria-current`.

**Nutzerfolge:** Wer die Zeit eines Einzelbilds für eine Rechnung oder ein Arbeitsblatt übernimmt, verwendet 0,00 s statt 5,00 s. Das ist ein direkter Fehler in der Messkette. Screenreader-Nutzer erfahren zudem nicht, welches Einzelbild aktuell ausgewählt ist.

**Schwere:** 2

**Fundstelle:** `index.html:711` (`relativeTime`), `index.html:1029–1031` (Labels/Captions), `index.html:1034–1036` (Klick/Selected), `index.html:747` (PNG-Fußnote)

**Verbesserung:** Beide Zeiten anzeigen: „0,00 s ab Start (5,00 s im Video)“. Das `aria-label` entsprechend korrigieren. Die relative Zeit in der UI zusätzlich als solche kennzeichnen. Dem ausgewählten Frame `aria-pressed="true"` (oder `aria-current`) geben.

**Akzeptanzkriterium:** Bei „Von“ = 5 s zeigt das erste Einzelbild sichtbar und im zugänglichen Namen sowohl 0,00 s relativ als auch 5,00 s absolut; Screenreader können das ausgewählte Bild erkennen. Mit einem 5–8-s-Ausschnitt getestet.

**Vorhandene Gegenmaßnahme:** Die PNG-Zeitleiste hat für breite Bilder eine korrekte Fußnote; der Klick auf ein Einzelbild setzt die richtige absolute Videozeit. Nur die UI-Beschriftung ist falsch.

---

#### UX-R02 · Hilfsraster und Zeitleiste fehlen im Messbild

**Art:** Defekt (belegt)

**Betroffener Ablauf:** Ergebnis → Messen (mit aktiviertem Hilfsraster)

**Szenario/Repro:**
1. Vor dem Erstellen „Hilfsraster“ aktivieren (`index.html:502`). Das Ergebnis zeigt das 50-px-Raster (`index.html:726–731`, `index.html:1006`).
2. Auf „Strecke messen“ klicken. `renderMeasurementImage()` zeichnet ausschließlich `result.data` (`index.html:1160`), nicht das dekorierte Ergebnis; Raster und Zeitleiste fehlen.
3. Wer das Raster als Maßstabshilfe nutzen wollte, findet es ausgerechnet im Messdialog nicht.

**Nutzerfolge:** Die visuelle Hilfe verschwindet beim entscheidenden Schritt. Die Messung selbst bleibt geometrisch korrekt (die Koordinaten beziehen sich auf dasselbe Bild), aber die Orientierung und die Kalibrierung mit dem Raster werden erschwert.

**Schwere:** 1

**Fundstelle:** `index.html:502` (Raster-Option), `index.html:721–749` (`decorateResult`), `index.html:1006` (Vorschau), `index.html:1155–1162` (`renderMeasurementImage`, insbesondere `1160`)

**Verbesserung:** Das Raster im Messdialog mit derselben 50-px-Einteilung zeichnen (die Zeitleiste kann außerhalb bleiben) oder im Messdialog einen Hinweis anzeigen, dass das Raster nur in der Vorschau verfügbar ist. Besser: die Rasteroption in den Messdialog übernehmen.

**Akzeptanzkriterium:** Bei aktiviertem Hilfsraster ist das Raster im Messdialog sichtbar und die Messpunkte liegen an derselben Bildposition wie in der Vorschau. Mit einem 1280-px-Ergebnis geprüft.

**Vorhandene Gegenmaßnahme:** Die Messkoordinaten und die Überlagerungen sind korrekt; es geht nur um die fehlende visuelle Hilfe, nicht um falsche Messwerte.

---

#### UX-R03 · Vollbild hat keinen sichtbaren Ausstieg im Vollbild-Element

**Art:** Heuristik (Code + Plattformverhalten, nicht am Gerät geprüft)

**Betroffener Ablauf:** Ergebnis → Vollbild

**Szenario/Repro:**
1. Auf „Vorschau vergrößern“ klicken (`index.html:526`). `requestFullscreen()` wird auf `#visual-area` ausgeführt (`index.html:1261–1263`).
2. Der Vollbild-Button liegt in `.preview-bottom` (`index.html:526`) **außerhalb** von `#visual-area`. Im Vollbild ist er nicht sichtbar.
3. Es bleibt nur Esc (Desktop) oder die Systemgeste/System-UI (Mobil). Auf einem iPad/Android-Gerät ist der Ausstieg nicht Teil der App und für unerfahrene Nutzer nicht offensichtlich.

**Nutzerfolge:** Nutzer können in einer vergrößerten Ansicht „festhängen“, insbesondere in einer Klassen-/Präsentationssituation, in der niemand die Escape-Taste kennt.

**Schwere:** 1
*(Esc und die System-UI sind vorhandene Gegenmaßnahmen; der Befund betrifft die Auffindbarkeit, nicht das vollständige Fehlen eines Ausstiegs.)*

**Fundstelle:** `index.html:511` (`#visual-area`), `index.html:526` (Button außerhalb), `index.html:1261–1267` (Fullscreen-Logik), `index.html:313–317` (Fullscreen-CSS)

**Verbesserung:** Im Vollbild einen sichtbaren Button „Vollbild beenden“ (mit `aria-label`) oben rechts innerhalb von `#visual-area` einblenden; er kann dieselbe `exitFullscreen`-Logik aufrufen. Alternativ die Toolbar mit in das Vollbild-Element nehmen.

**Akzeptanzkriterium:** Im Vollbild ist ein sichtbarer, per Tastatur und Touch erreichbarer Ausstieg vorhanden; Esc funktioniert weiterhin. Auf Desktop und einem Touch-Gerät getestet.

**Vorhandene Gegenmaßnahme:** Esc, die native `fullscreenchange`-Behandlung (`index.html:1267`) und die Fallback-Toastmeldung bei fehlender API (`index.html:1264–1265`) sind korrekt.

---

### 3.4 Messen und Kalibrieren

---

#### UX-M01 · Mess-Canvas ist ohne Zeigegerät nicht bedienbar

**Art:** Defekt (belegt)

**Betroffener Ablauf:** Messen/Kalibrieren (Tastatur, Screenreader, Sprachsteuerung)

**Szenario/Repro:**
1. Ergebnis erstellen und den Messdialog öffnen (`index.html:1268`).
2. Mit Tab zum Canvas `#measure-canvas` navigieren. Der Canvas ist fokussierbar (`tabindex="0"`, `index.html:542`), hat eine Beschreibung (`aria-label`, `aria-describedby`) und einen Fokusring – aber **keinen** `keydown`-Handler.
3. Alle Punktoperationen hängen an `click`/`pointerdown` (`index.html:1297–1360`); der Canvas reagiert auf Enter/Space/Arrow-Tasten nicht. Auch das Verschieben der Beschriftungen ist ausschließlich Pointer-basiert (`index.html:1297–1333`).

**Nutzerfolge:** Tastatur- und Screenreader-Nutzer können keine einzige Strecke anlegen. Damit ist die Kalibrierung (die eine ausgewählte Referenzstrecke voraussetzt, `index.html:1106`) nicht erreichbar, und die Kernkette „Messen/Kalibrieren“ ist für diese Gruppe blockiert. Sie können das Bild zwar erstellen und als PNG exportieren, aber keine cm-Werte gewinnen.

**Schwere:** **3** (schwer; Kernablauf für eine Nutzergruppe blockiert, nicht die gesamte Zielgruppe)

**Fundstelle:** `index.html:542` (Canvas mit `tabindex`/Label), `index.html:537` (Instruktion), `index.html:1297–1360` (Pointer-/Click-Handler), `index.html:1104–1107` (Kalibrierung setzt Auswahl voraus), `index.html:1361–1365` (Reset/Clear)

**Verbesserung:** Eine vollständige Tastaturbedienung ergänzen:
- Pfeiltasten verschieben einen Crosshair (1 px, mit Shift 10 px),
- Enter setzt einen Punkt,
- Backspace/Entf nimmt den letzten Punkt zurück,
- Escape schließt den Dialog,
- Tab wechselt in die Sidebar.
Alternativ vier numerische Felder (x1/y1/x2/y2) mit einer Aktion „Strecke übernehmen“ anbieten. Die Beschriftungsverschiebung per Pfeiltasten ermöglichen.

**Akzeptanzkriterium:** Eine Strecke kann ausschließlich mit der Tastatur angelegt, ausgewählt, kalibriert und gelöscht werden; die Werte erscheinen in der Liste. Mit NVDA/VoiceOver und ohne Maus getestet.

**Vorhandene Gegenmaßnahme:** Der Canvas ist fokussierbar und beschriftet, der Dialog ist ein natives `<dialog>` mit Fokusfalle und Escape-Schließen (`index.html:1252–1254`), die Messwerte sind als Textliste zugänglich. Diese guten Grundlagen beheben die fehlende Bedienung nicht.

---

#### UX-M02 · Fokusverlust beim Auswählen/Löschen in der Messliste; widersprüchliche Toggle-Semantik

**Art:** Defekt (belegt, Fokus) / Heuristik (ARIA)

**Betroffener Ablauf:** Messliste bedienen (Tastatur/Screenreader)

**Szenario/Repro:**
1. Im Messdialog mehrere Strecken anlegen.
2. Mit der Tastatur den Button „Strecke 1 auswählen“ fokussieren und Enter drücken. Der Handler ruft `drawMeasurement()` (`index.html:1181`), das die gesamte Liste per `list.replaceChildren()` neu aufbaut (`index.html:1170`). Der fokussierte Button wird entfernt; der Fokus geht verloren (in der Regel auf `body`/Dialoganfang, browserabhängig).
3. Dasselbe beim Löschen einer Strecke (`index.html:1218–1221`), weil auch dort `drawMeasurement()` läuft.
4. Zusätzlich hat der Sichtbarkeits-Button `aria-pressed` = Sichtbarkeit, aber sein `aria-label` ist eine Aktion: „Strecke 1 ausblenden“ bei `aria-pressed="true"` (`index.html:1196–1201`). Für Screenreader entsteht die widersprüchliche Ansage „Strecke 1 ausblenden, gedrückt“.

**Nutzerfolge:** Nach jeder Auswahl/Löschung muss die Nutzerin erneut durch den Dialog tabben, um den Maßstab zu setzen – der nächste logische Schritt liegt in der Sidebar. Die Toggle-Ansage erschwert das Verständnis, ob eine Strecke gerade sichtbar ist.

**Schwere:** 2

**Fundstelle:** `index.html:1164–1226` (`drawMeasurement`), `index.html:1170` (`replaceChildren`), `index.html:1174–1181` (Select), `index.html:1196–1201` (Visibility/ARIA), `index.html:1218–1221` (Remove)

**Verbesserung:** Die Liste nicht komplett neu aufbauen, sondern nur die betroffenen Attribute/Elemente aktualisieren. Falls ein Rebuild nötig ist, den Fokus anhand der `measurement.id` auf den entsprechenden Button/das Namensfeld zurücksetzen. Für die Sichtbarkeit entweder einen stabilen Namen „Sichtbarkeit von Strecke 1“ mit `aria-pressed` verwenden oder `aria-pressed` entfernen und die Aktion „ausblenden/einblenden“ belassen.

**Akzeptanzkriterium:** Nach Auswahl und Löschen bleibt der Fokus auf dem entsprechenden Listeneintrag bzw. dem nächsten sinnvollen Element; die Sichtbarkeitsansage ist in sich konsistent. Mit Tastatur und Screenreader getestet.

---

#### UX-M03 · Messpunkte nach dem Setzen nicht korrigierbar; kein Undo

**Art:** Heuristik

**Betroffener Ablauf:** Messpunkte setzen/korrigieren

**Szenario/Repro:**
1. Zwei Punkte setzen; eine Strecke entsteht (`index.html:1347–1358`).
2. Feststellen, dass der erste Punkt 3 px daneben liegt. Es gibt keine Möglichkeit, einen Endpunkt zu verschieben: `pointerdown` auf dem Canvas prüft nur Beschriftungen (`index.html:1301`), keine Punkte/Linien.
3. Die einzige Korrektur ist Löschen (X in der Liste) und komplett neu setzen. Ein versehentlicher dritter Klick startet bereits einen neuen Entwurf; zwei weitere Klicks erzeugen eine ungewollte zweite Strecke.
4. „Neue Strecke“ (`index.html:1361`) verwirft nur den aktuellen Entwurf, nicht eine fertige Messung.

**Nutzerfolge:** Präzises Messen wird mühsam; auf einem Touchscreen mit großen Fingern ist ein Fehlklick wahrscheinlich. Die Fehlerkorrektur ist möglich, aber grob und fördert Frustration.

**Schwere:** 2

**Fundstelle:** `index.html:1340–1360` (Punktsetzen), `index.html:1297–1333` (nur Label-Drag), `index.html:1218–1222` (Löschen), `index.html:1361` (Neue Strecke)

**Verbesserung:** Endpunkte nach dem Setzen ziehbar machen (mit einem größeren Hit-Radius), einen Undo-Button für den letzten Punkt/die letzte Strecke ergänzen und einen klaren „Fertig“-Modus einführen, damit ein dritter Klick nicht sofort eine neue Strecke beginnt. Optional eine numerische Koordinatenkorrektur.

**Akzeptanzkriterium:** Ein falsch gesetzter Endpunkt kann ohne Löschen der gesamten Strecke korrigiert werden; der letzte Punkt kann rückgängig gemacht werden. Mit Maus und Touch getestet.

**Vorhandene Gegenmaßnahme:** „Neue Strecke“ verwirft den Entwurf, die Liste erlaubt das Löschen einzelner Strecken, und die Beschriftungen sind ziehbar. Das ist eine Basis, aber keine Feinkorrektur.

---

#### UX-M04 · Kein Zoom/Pan; Messlinien und Punkte auf kleinen Displays hauchdünn

**Art:** Heuristik (rechnerisch aus CSS/Geometrie; keine Geräteprüfung)

**Betroffener Ablauf:** Messen auf dem Smartphone

**Szenario/Repro:**
1. Ein 1280 × 720 px großes Ergebnis auf einem 375 px breiten Smartphone im Messdialog öffnen (`index.html:387–394`).
2. Die Messfläche ist ca. 339 px breit (nach Dialog-/Stage-/Bild-Padding); der Anzeigefaktor liegt bei ca. 0,26.
3. Die Linienstärke ist `Math.max(2, width / 500)` = 2,56 Bild-px (`index.html:1119`) → ca. 0,68 CSS-px. Der Punktradius ist `Math.max(4, width / 180)` = 7,1 Bild-px (`index.html:1118`) → ca. 3,7 CSS-px Durchmesser.
4. `#measure-canvas` hat `touch-action: none` (`index.html:278`); ein Pinch-Zoom auf dem Bild ist damit nicht möglich. Es gibt keine Lupe und keinen Zoom-Button.
5. Die Beschriftungen werden dagegen über `12 / displayScale` auf mindestens 12 CSS-px skaliert (`index.html:1082–1083`) – der Kontrast zwischen gut lesbaren Labels und fast unsichtbaren Linien/Punkten ist groß.

**Nutzerfolge:** Auf dem Telefon sind die Messlinien kaum zu sehen und die Endpunkte nur grob zu treffen; die Messgenauigkeit leidet, obwohl die App technisch präzise rechnen könnte. Die Kalibrierung mit einem kleinen Maßstab im Video wird dadurch unzuverlässig.

**Schwere:** 2

**Fundstelle:** `index.html:278` (`touch-action: none`), `index.html:1118–1119` (Radius/Linienstärke), `index.html:1082–1083` (Label-Skalierung), `index.html:1143–1153` (Canvas-Fit), `index.html:387–394` (mobile Messlayout)

**Verbesserung:** Linien und Punkte mit einer mindestens display-skalierungsbewussten Größe zeichnen, z. B. `lineWidth = Math.max(lineWidth, 2 / displayScale)` und `radius = Math.max(radius, 5 / displayScale)`. Zusätzlich eine Lupe beim Ziehen oder einen Zoom-/Pan-Modus (mit angepasster Koordinatenumrechnung) anbieten. Die 44-px-Empfehlung für Touch-Ziele beachten.

**Akzeptanzkriterium:** Auf einem 375-px-Gerät sind Linie und Endpunkte klar sichtbar (mindestens ca. 2 CSS-px Strich, ca. 10 CSS-px Punkt), und ein präzises Setzen ist per Lupe/Zoom möglich. Mit einem 1280-px-Ergebnis auf einem echten Telefon getestet.

**Vorhandene Gegenmaßnahme:** Die Beschriftungen sind korrekt skaliert, die Messwerte werden präzise aus den Bildkoordinaten berechnet, und die Punktkoordinaten werden bei Größenänderungen über den ResizeObserver neu gefittet (`index.html:1378–1381`).

---

#### UX-M05 · „Alle löschen“ ohne Bestätigung/Undo

**Art:** Defekt (belegt)

**Betroffener Ablauf:** Messungen löschen

**Szenario/Repro:**
1. Drei Strecken messen und kalibrieren.
2. Im Messdialog auf „Alle löschen“ tippen (`index.html:547`, Handler `index.html:1362–1365`). Alle Strecken und der Entwurf sind sofort weg; es gibt keine Rückfrage und kein Undo. Der Maßstab bleibt bestehen; da die Referenzstrecke gelöscht ist, zeigt die Notiz danach „1 Pixel = …“.

**Nutzerfolge:** Ein Fehlgriff – die beiden Textbuttons „Neue Strecke“ und „Alle löschen“ liegen nebeneinander – vernichtet alle Messungen. Ein Wiederherstellen ist nur durch erneutes Messen möglich.

**Schwere:** 2

**Fundstelle:** `index.html:547` (Button), `index.html:1362–1365` (Handler), `index.html:1169` (Disabled-Logik), `index.html:289–304` (Liste)

**Verbesserung:** Bestätigung mit Anzahl („3 Strecken löschen?“) oder ein Undo direkt im Dialog (nicht im Toast außerhalb des Top-Layers, siehe UX-M06). Den Button deutlicher als destruktiv kennzeichnen und räumlich von „Neue Strecke“ trennen.

**Akzeptanzkriterium:** „Alle löschen“ fragt bei mindestens einer Strecke nach oder bietet eine Rückgängig-Aktion an; die Aktion ist per Tastatur erreichbar und die Konsequenz ist vor dem Klick klar. Mit drei Strecken getestet.

**Vorhandene Gegenmaßnahme:** Der Button ist deaktiviert, wenn keine Strecke und kein Entwurf existiert (`index.html:1169`); das verhindert Leer-Klicks, nicht den Verlust.

---

#### UX-M06 · Toast im modalen Messdialog liegt außerhalb des Top-Layers

**Art:** Hypothese (Top-Layer-Verhalten; nicht visuell geprüft)

**Betroffener Ablauf:** Messen → ungültige Strecke

**Szenario/Repro:**
1. Im Messdialog zweimal exakt denselben Punkt anklicken. Die Strecke hat 0 px; der Code ruft `toast('Wähle zwei unterschiedliche Punkte für eine Strecke.')` auf (`index.html:1355`).
2. `#toast` ist ein normales `position: fixed`-Element mit `z-index: 9` (`index.html:269`, `index.html:562`) außerhalb des `<dialog>`. Der offene modale Dialog und sein Backdrop liegen im Top-Layer; normale Elemente werden darunter gezeichnet. Zusätzlich ist der Rest des Dokuments durch `showModal()` inert.
3. Die Meldung ist damit hinter dem Backdrop geblurrt/abgedunkelt und für Screenreader im inerten Teil wahrscheinlich nicht ansagbar. Dasselbe gilt für die Maßstabs-Toastmeldung (`index.html:1373`), dort gibt es aber die Änderung in `#measurement-value` als Countermeasure.

**Nutzerfolge:** Der Doppelklick wirkt wie ignoriert; die Nutzerin weiß nicht, warum keine Strecke entsteht. Das ist ein seltener, aber verwirrender Fall.

**Schwere:** 1

**Fundstelle:** `index.html:269` (Toast-CSS), `index.html:562` (Toast im Body), `index.html:881–885` (`toast()`), `index.html:1355` (Aufruf im Dialog), `index.html:535–561` (`dialog`)

**Verbesserung:** Im Messdialog ein eigenes `role="status"`-Element für Hinweise vorsehen (z. B. unter der Überschrift) und dort „Wähle zwei unterschiedliche Punkte“ ausgeben. Alternativ den Toast in das Dialog-Element verschieben, solange es offen ist. Mit einem Screenreader und einem modalen Dialog testen.

**Akzeptanzkriterium:** Bei zwei identischen Punkten erscheint die Meldung sichtbar im Dialog und wird von einem Screenreader angesagt. In Chrome, Firefox und Safari mit geöffnetem Modal getestet.

---

#### UX-M07 · Messen und Kalibrieren sind visuell schlecht auffindbar; Hilfe erklärt die Kalibrierung nicht

**Art:** Heuristik

**Betroffener Ablauf:** Messen/Kalibrieren finden

**Szenario/Repro:**
1. Ergebnis erstellt. Der Mess-Button ist ein reines Lineal-Icon ohne sichtbaren Text (`index.html:526`), mit `title` (nur Desktop-Hover) und `aria-label`.
2. Auf Mobil liegt die Kalibrierung im Dialog ganz unten in der scrollbaren Sidebar (`index.html:554–558`, mobile Grid-Regeln `index.html:387–394`); die Liste davor kann den Blick nach unten verschieben. Der einzige erklärende Satz steht im Dialog selbst (`index.html:557`).
3. Die Kurzanleitung beschreibt in Schritt 3 nur „miss direkt im Bild mit dem Lineal-Werkzeug“ (`index.html:533`), erklärt aber nicht, dass man zuerst eine bekannte Referenzstrecke messen, dann eine Länge in cm eingeben und „Als Maßstab verwenden“ drücken muss.
4. Der Hilfe-Button neben „Deine Frequenz“ öffnet dieselbe generische Anleitung am Anfang (`index.html:489`), nicht bei Schritt 2; auf Mobil muss gescrollt werden.

**Nutzerfolge:** Der zentrale Schritt „Kalibrierung“ wird leicht übersehen; Nutzer messen in Pixeln, obwohl sie cm-Werte für Physikaufgaben brauchen, oder sie finden den Messdialog gar nicht. Das ist ein Auffindbarkeits-, kein Funktionsfehler.

**Schwere:** 2

**Fundstelle:** `index.html:526` (Icon-Button), `index.html:533` (Hilfe Schritt 3), `index.html:489` (Frequenz-Hilfe), `index.html:554–558` (Maßstab), `index.html:387–394` (mobile Sidebar), `index.html:537` (Instruktion)

**Verbesserung:**
- Sichtbares Label „Messen“ am Button (oder ein Textbutton neben „PNG herunterladen“).
- Vierter Hilfe-Schritt „Maßstab kalibrieren“ mit dem Beispiel „Lineal = 10 cm“ und der Reihenfolge Messen → cm eingeben → Als Maßstab verwenden.
- Den Frequenz-Hilfe-Button direkt zu Schritt 2 springen lassen (ID/Scroll/Fokus).
- Auf Mobil die Kalibrierung sichtbarer machen (z. B. sticky CTA oder die Liste standardmäßig einklappen).

**Akzeptanzkriterium:** Eine Person, die die App zum ersten Mal nutzt, findet den Messdialog und die Kalibrierung ohne Ausprobieren; die Hilfe enthält den Kalibrierschritt. In einem kurzen Usability-Test (5 Personen) oder mindestens per Expertenwalkthrough auf 375 px und 1280 px geprüft.

---

#### UX-M08 · Video-Ton läuft beim Öffnen des Messdialogs weiter

**Art:** Defekt (belegt)

**Betroffener Ablauf:** Originalvideo ansehen → Messen

**Szenario/Repro:**
1. Ergebnis erstellen, auf den Tab „Originalvideo“ wechseln und das Video abspielen (das Video ist nicht stumm, `index.html:523`; nur der Verarbeitungs-Clone ist `muted`, `index.html:668`).
2. Bei laufendem Video auf das Lineal-Icon klicken. `showDialog($('measure-dialog'), …)` wird aufgerufen (`index.html:1268`), aber `#video-player.pause()` wird nicht aufgerufen.
3. Der modale Dialog und sein Backdrop erscheinen; der Ton läuft weiter, ist aber nicht mehr steuerbar, ohne den Dialog zu schließen.

**Nutzerfolge:** In einer Klasse oder bei einer Präsentation läuft der Ton unerwartet weiter, während die Messansicht geöffnet ist. Die Nutzerin muss den Dialog schließen, pausieren und erneut öffnen.

**Schwere:** 2

**Fundstelle:** `index.html:523` (Player, kein `muted`), `index.html:931` (`selectTab('result')` pausiert – hier nicht aufgerufen), `index.html:1268` (Mess-Button), `index.html:535–561` (Dialog)

**Verbesserung:** Beim Öffnen des Messdialogs `$('video-player').pause()` aufrufen (analog zu `selectTab('result')`). Optional auch beim Öffnen der Hilfe pausieren. Den Zustand „vorher abspielend“ nicht automatisch wiederherstellen, um Überraschungen zu vermeiden.

**Akzeptanzkriterium:** Öffnet man den Messdialog bei laufendem Originalvideo, ist der Ton sofort stumm/gestoppt; nach dem Schließen bleibt das Video pausiert. Mit einem Video mit Tonspur getestet.

---

### 3.5 Datenverlust und Persistenz

---

#### UX-D01 · Erfolgreiches neues Ergebnis löscht Messungen und Maßstab ohne Warnung

**Art:** Defekt (belegt)

**Betroffener Ablauf:** Erneut erstellen (z. B. mit anderer Frequenz oder Empfindlichkeit)

**Szenario/Repro:**
1. Ergebnis erstellen, mehrere Strecken messen und einen Maßstab setzen.
2. Die Frequenz ändern und erneut „Stroboskopbild erstellen“ klicken.
3. Bei Erfolg ruft `createResult()` `resetCalibration()` auf (`index.html:1022`). Das löscht `state.measurements`, `state.scale`, den Referenzbezug und die Liste (`index.html:942–950`). Es gibt keine Warnung und kein Undo.
4. Bei einem Abbruch oder Fehler bleiben die alten Messungen erhalten (weil `resetCalibration()` nur im Erfolgsfall läuft) – das ist gut, macht aber den Unterschied zum Erfolgsfall unvorhersehbar.

**Nutzerfolge:** Wer nach einer kleinen Parameteränderung ein besseres Bild erzeugt, verliert die gesamte Messarbeit. Da die neue Geometrie anders sein kann, ist ein automatisches Behalten nicht immer sinnvoll – eine Warnung oder ein Export der Messwerte ist es aber.

**Schwere:** 2

**Fundstelle:** `index.html:1010–1050` (`createResult`), `index.html:1022` (`resetCalibration`), `index.html:942–950` (`resetCalibration`), `index.html:1046–1049` (Abbruch/Fehler)

**Verbesserung:** Vor dem Erstellen prüfen, ob Messungen existieren; dann bestätigen lassen („Neues Ergebnis ersetzt deine Messungen“) oder die Messungen/Maßstab exportierbar machen. Wenn sich die Bildgröße nicht ändert, den Maßstab optional beibehalten. Den erfolgreichen Reset nicht stillschweigend durchführen.

**Akzeptanzkriterium:** Bei vorhandenen Messungen erscheint vor dem Erstellen eine Warnung mit Abbruchmöglichkeit, oder die Messungen bleiben nach einer bestätigten Aktion erhalten. Mit drei Strecken und einem Maßstab getestet.

**Vorhandene Gegenmaßnahme:** Abbruch und Fehler bewahren den alten Zustand; die Messungen bleiben außerdem beim Schließen des Dialogs erhalten (`state`-Objekt). Der Verlust tritt nur bei erfolgreicher Neuerstellung auf.

---

#### UX-D02 · Kein Schutz gegen Verlust bei Reload/Tab-Schließen; keine Persistenz

**Art:** Defekt (belegt) / Hypothese (bfcache)

**Betroffener Ablauf:** Reload/Tab schließen/Zurück

**Szenario/Repro:**
1. Video laden, Ergebnis erstellen, messen und kalibrieren.
2. Die Seite neu laden oder den Tab schließen. Der gesamte Zustand liegt nur im `state`-Objekt (`index.html:872`); es gibt kein `localStorage`/`sessionStorage` und keinen `beforeunload`-Handler (Suche im gesamten Skript).
3. `pagehide` bricht laufende Prozesse ab und widerruft die Object-URL (`index.html:1386`). Wird die Seite aus dem bfcache zurückgeholt, ist `state.url` weiterhin die widerrufene URL; ein erneutes Erstellen kann dann fehlschlagen (ungetestete Hypothese).

**Nutzerfolge:** Ein versehentlicher Reload oder Tab-Schließen vernichtet die gesamte Arbeit ohne Warnung. Das ist bei einer Offline-App ohne Server-Persistenz besonders schmerzhaft, weil nichts wiederhergestellt werden kann.

**Schwere:** 2

**Fundstelle:** `index.html:872` (`state`), `index.html:1386` (`pagehide`), kein `beforeunload`/Storage im Skript

**Verbesserung:** `beforeunload` mit Rückfrage registrieren, solange ein Ergebnis oder Messungen existieren. Optional Messmetadaten (Punkte, Maßstab, Frequenz, Dateiname) in `sessionStorage` sichern; das Video selbst kann nicht persistiert werden, aber die Messwerte schon. Bei `pagehide` `event.persisted` beachten und die URL im bfcache-Fall nicht widerrufen.

**Akzeptanzkriterium:** Ein Reload/Tab-Schließen mit vorhandenem Ergebnis löst eine Browser-Rückfrage aus oder die Messungen werden nach dem Reload wiederhergestellt. Auf Chrome, Firefox und Safari getestet; bfcache-Rückkehr geprüft.

**Vorhandene Gegenmaßnahme:** `pagehide` räumt Ressourcen korrekt auf; das ist für den Normalfall gut, verhindert aber keine Datenverluste.

---

### 3.6 Mobile Bedienung und Barrierefreiheit

---

#### UX-A01 · iOS-Autozoom bei 14-px-Eingabefeldern

**Art:** Hypothese (bekanntes Plattformverhalten, nicht auf Gerät getestet)

**Betroffener Ablauf:** Zeitbereich/Maßstab/Name auf iOS eingeben

**Szenario/Repro:**
1. Auf einem iPhone/iPad im Messdialog das Feld „Ausgewählte Referenzstrecke entspricht“ oder ein Zeitfeld fokussieren.
2. Diese Felder haben `font-size: .875rem` = 14 px (`index.html:164`: `.time-range input, .calibration input, .measurement-name`).
3. Safari zoomt bei Formularfeldern unter 16 px automatisch in die Seite hinein. Der Viewport erlaubt Zoom (`index.html:7`, kein `maximum-scale=1`), was für die Barrierefreiheit richtig ist, hier aber den Auto-Zoom begünstigt. Im modalen Messdialog kann das Layout dadurch verspringen.

**Nutzerfolge:** Beim Ausfüllen von Zeitbereich, Maßstab oder Streckennamen springt die Ansicht; die Nutzerin muss herauszoomen, um den Kontext wiederzusehen. Das betrifft die im App-Text ausdrücklich erwähnte iPad-Nutzung (`index.html:471`).

**Schwere:** 2

**Fundstelle:** `index.html:164` (14-px-Felder), `index.html:7` (Viewport), `index.html:498` (Zeitfelder), `index.html:556` (Maßstab), `index.html:1177` (Messungsname), `index.html:471` (iPad-Hinweis)

**Verbesserung:** Auf kleinen Viewports alle Text-/Zahlfelder mindestens 16 px groß machen (z. B. `font-size: max(16px, .875rem)` in der Mobile-Media-Query). Den Zoom nicht per `maximum-scale` abschalten, da das die Barrierefreiheit verschlechtert.

**Akzeptanzkriterium:** Auf iOS Safari führt der Fokus auf „Von“, „Bis“, den Maßstab und den Streckennamen zu keinem automatischen Zoom; die Seite bleibt auf 100 %. Auf einem echten iPhone/iPad getestet.

**Vorhandene Gegenmaßnahme:** Das Frequenzfeld ist mit 1,625 rem (26 px) ausreichend groß (`index.html:148`); das Problem betrifft nur die 14-px-Felder. Die Viewport-Konfiguration erlaubt bewusst Nutzer-Zoom.

---

#### UX-A02 · Sekundärtexte 9–10 px, teils unter 4,5:1 Kontrast

**Art:** Defekt (rechnerisch belegt)

**Betroffener Ablauf:** Sekundärtexte lesen (Dateiformate, Dateimetadaten, Bildnummern)

**Szenario/Repro:**
- `.dropzone > small` („MP4, MOV oder WebM“): 10 px, Farbe `--faint` #747e77 auf Weiß → **4,21:1** (`index.html:138`).
- `.file-info #file-meta` (Dauer/Auflösung): 10 px, `--muted` #67716b auf `--accent-soft` #e8f1eb → **4,39:1** (`index.html:187`).
- `.empty-frames > div > span` (Platzhalter 01–05): 9 px, `--faint` auf `--sidebar` #fafbf9 → **4,05:1** (`index.html:232`).
- Weitere 9-px-Texte: `.frames-title > span`, `.frame-item small`, `.example-watermark` (`index.html:228`, `238`, `207`); Kontrast teilweise ok, Größe sehr klein.
- `prefers-contrast: more` verbessert die Farben (`index.html:414–423`), aber nur wenn die Nutzerin diese Systemeinstellung aktiviert; die Standardgrößen bleiben.

**Nutzerfolge:** Für sehbeeinträchtigte Nutzer und auf Beamern/kleinen Displays sind diese Angaben schwer lesbar. Die Dateiformate und die Dauer/Auflösung sind relevante Entscheidungshilfen, keine reine Dekoration.

**Schwere:** 1
*(Formaler WCAG-1.4.3-AA-Verstoß für die genannten Texte; die Hauptinformationen der App sind nicht betroffen.)*

**Fundstelle:** `index.html:138`, `187`, `232`, `228`, `238`, `207`, `23`/`26` (Farbvariablen), `414–423` (Kontrast-Media-Query)

**Verbesserung:** Mindestens 12 px (besser 14 px) für relevante Sekundärtexte; `--faint` im hellen Theme dunkler machen (z. B. #5f6962) oder `--muted` verwenden. Die Dekoration (Bildnummern) darf klein bleiben, muss aber nicht die einzige Information sein. Kontrast nach der Änderung erneut berechnen.

**Akzeptanzkriterium:** Alle genannten Texte erreichen mindestens 4,5:1 bei ≤ 18 px und sind mindestens 12 px groß (relevante Metadaten). Mit einem Kontrastprüfer und auf 375 px/Beamer geprüft.

**Vorhandene Gegenmaßnahme:** `prefers-contrast: more` und `prefers-color-scheme: dark` sind vorhanden; im Dark Theme ist der Kontrast der `--faint`-Texte mit 5,84:1 ausreichend. Der Befund gilt für das helle Standard-Theme.

---

#### UX-A03 · Mobil werden Datenschutz-/Offline-Hinweis und „Beispielvorschau“-Label ausgeblendet

**Art:** Defekt (belegt) / Heuristik (Wirkung)

**Betroffener Ablauf:** Mobiler Einstieg

**Szenario/Repro:**
1. Die Seite auf einem 375-px-Smartphone öffnen.
2. `.privacy-badge` („Dein Video bleibt auf deinem Gerät“) ist bei ≤ 760 px ausgeblendet (`index.html:351`); `.intro-note` („Ohne Upload. Auch offline.“) ist bereits bei ≤ 1050 px ausgeblendet (`index.html:330`). Auf dem Telefon ist damit **keiner** der beiden Vertrauenshinweise sichtbar.
3. `.preview-tag` („Beispielvorschau“) ist bei ≤ 1050 px ausgeblendet (`index.html:325`). Die Beispielillustration bleibt sichtbar, ist aber nur noch über den 9-px-Schriftzug „ILLUSTRATION“ (`index.html:519`) und „Freier Fall“ als Beispiel erkennbar.

**Nutzerfolge:** Lehrkräfte, die die App auf einem Telefon (≤ 760 px) prüfen, sehen keinen der beiden Vertrauenshinweise; auf Tablets bis 1050 px fehlt zumindest der Offline-Hinweis. Lernende können die Beispielvorschau eher für ihr eigenes Ergebnis oder ihre Einstellung halten – verstärkt durch das statische Δt (UX-C07).

**Schwere:** 1
*(Kommunikations- und Vertrauensverlust, kein blockierter Ablauf.)*

**Fundstelle:** `index.html:325` (Preview-Tag), `index.html:330` (Intro-Note), `index.html:351` (Privacy-Badge), `index.html:465`/`478` (Texte), `index.html:510`/`513` (Beispiel), `index.html:519` (Wasserzeichen)

**Verbesserung:** Auf kleinen Screens einen kompakten Vertrauenshinweis behalten (z. B. unter der Dropzone: „Bleibt auf deinem Gerät – kein Upload“) und die Beispielillustration sichtbar als „Beispiel“ kennzeichnen. Das Beispiel-Label nicht nur für Screenreader, sondern auch visuell erhalten.

**Akzeptanzkriterium:** Auf 375 px ist ein Datenschutz-/Offline-Hinweis sichtbar und die Beispielillustration ist eindeutig als Beispiel markiert. Auf 375 px und 768 px geprüft.

---

## 4. Was gut funktioniert (und deshalb nicht als Befund gelistet ist)

Diese Gegenmaßnahmen wurden ausdrücklich berücksichtigt, um Fehlalarme zu vermeiden:

- **Abbruch:** Es gibt einen sichtbaren „Verarbeitung abbrechen“-Button (`index.html:505`), `AbortController` (`index.html:872`, `1014`), Abort-Behandlung in `waitForVideo`/`seekVideo` (`index.html:619–660`) und eine verständliche Abbruch-Toastmeldung (`index.html:1047`). Der Abbruch ist also vorhanden; die Befunde betreffen nur die Auffindbarkeit der Rückmeldung.
- **Tastaturnavigation der Tabs:** Die Preview-Tabs unterstützen Pfeiltasten, Home/End und eine Roving-Tabindex-Logik (`index.html:1244–1249`); das ist korrekt und wurde nicht beanstandet.
- **Dialoge:** Native `<dialog>`-Elemente mit `showModal`, Fokusfalle, Escape-Schließen und Fokus-Rückgabe (`index.html:1252–1260`); das ist eine solide Basis. Der Tastaturbefund betrifft nur den Canvas-Inhalt.
- **Fokus und Reduktion:** Skip-Link (`index.html:438`), sichtbare Fokusringe (`index.html:50–53`), `prefers-reduced-motion` inklusive federnder Animationen (`index.html:424–428`, `792–794`), `prefers-contrast`/`forced-colors` (`index.html:410–433`), Dark Mode (`index.html:400–409`).
- **Kein Upload/offline:** Die Datei ist vollständig offline nutzbar, verarbeitet lokal und hat keine externen Abhängigkeiten; die Datenschutzaussage stimmt (auf Desktop sichtbar).
- **Fehlerbehandlung:** `role="alert"` für die allgemeine Fehlermeldung (`index.html:506`), `role="status"` für Status/Preview (`index.html:526`), konkrete Fehlertexte für Format-, Lade- und Zeitüberschreitungsfehler (`index.html:630`, `644`, `978`).
- **Grenzen der Verarbeitung:** `MAX_FRAMES = 300` mit einer konkreten, handlungsorientierten Meldung inklusive Bildzahl (`index.html:566`, `574`); der Hinweis unter dem Button zeigt die erwartete Bildanzahl (`index.html:920`). Das ist eine gute Prävention gegen lange/überlastete Läufe.
- **Messliste:** Werte, Namen, Sichtbarkeit und Löschen sind als echte Text-/Button-Elemente zugänglich; die Messungen bleiben beim Schließen des Dialogs erhalten; die Beschriftungen sind ziehbar (`index.html:1164–1226`, `1297–1333`). Das ist mehr, als viele Canvas-Tools bieten.
- **Kalibrierungs-Feedback:** Der Maßstab wird in der Liste und in `#measurement-value` sichtbar; `#measurement-value` hat `role="status"` (`index.html:546`), sodass die Änderung von px zu cm für Screenreader grundsätzlich wahrnehmbar ist.
- **Mobile Layout:** Die App ist responsive, der Messdialog wird auf Portrait-Geräten vollflächig (`index.html:387–394`), die Sidebar ist scrollbar mit `overscroll-behavior: contain` (`index.html:279`).
- **Sicherheits-/Codequalitätsthemen** wurden auftragsgemäß nicht bewertet.

---

## 5. Empfohlene Reihenfolge

1. **UX-M01** (Tastatur-Messung) – einziger Schwere-3-Befund und Kernablauf für eine Nutzergruppe.
2. **UX-V02, UX-D01, UX-D02, UX-M05** – Datenverlust und fehlende Rückfragen; gemeinsam mit UX-V01 (Ersetzen) angehen.
3. **UX-C04, UX-C03, UX-C01, UX-C02** – Ergebnis-/Zeitbereichsvertrauen und Rückmeldung; diese Fehler führen zu falschen Bildern oder falschen Messwerten.
4. **UX-R01, UX-C07, UX-C08** – Zeit- und Beispielverständlichkeit; pädagogisch zentral.
5. **UX-M04, UX-A01, UX-V04, UX-M07** – mobile Messbarkeit und Auffindbarkeit.
6. **UX-M02, UX-C05, UX-R03, UX-M06, UX-A02, UX-A03, UX-R02** – Politur und Barrierefreiheit.

---

## 6. Zusammenfassung

STROBO ist funktional ungewöhnlich solide gebaut: lokale Verarbeitung, sauberer Abbruch, native Dialoge, Tastaturnavigation für Tabs, reduzierte Bewegung, Dark Mode und eine durchdachte Messliste sind vorhanden. Die größten UX-Risiken liegen nicht in fehlenden Funktionen, sondern in **Zustands- und Rückmeldungslücken**:

- Der **einzige Schwere-3-Befund** ist die fehlende Tastaturbedienung des Mess-Canvas: Der Canvas ist fokussierbar und beschriftet, aber ohne Enter/Pfeiltasten nicht bedienbar; damit ist die Kalibrierung für Tastatur-/Screenreader-Nutzer blockiert.
- **Datenverlust** droht an vier Stellen: „Video entfernen“ (inkl. 32-px-Ziel und ohne Rückfrage), „Alle löschen“, die erfolgreiche Neuerstellung (löscht Messungen/Maßstab) und Reload/Tab-Schließen ohne Guard.
- **Vertrauen in das Ergebnis** leidet durch das stille Weiterbestehen alter Ergebnisse nach Einstellungsänderungen, die während der Verarbeitung aktiven Tabs (Ergebnis bleibt verborgen) und die falsche Bezeichnung relativer Einzelbildzeiten als „im Video“.
- **Mobile** ist die Messung durch fehlenden Zoom und hauchdünne Overlays unpraktisch; die 14-px-Eingabefelder provozieren auf iOS Auto-Zoom; der Ladefehler liegt unter dem Fold; auf Telefonen verschwinden Datenschutz-/Offline-Hinweis und Beispiel-Label, auf Tablets der Offline-Hinweis.
- **Pädagogisch** ist die statische Beispielvorschau mit Δt = 0,10 s bei abweichender Frequenz irreführend.
- **Auffindbarkeit** von Messen/Kalibrieren ist durch das Icon-only-Lineal, die Kalibrierung am Ende der mobilen Sidebar und die fehlende Kalibrierungsanleitung in der Hilfe geschwächt.

Die meisten Befunde sind mit überschaubaren Änderungen behebbar; die Tastaturbedienung des Canvas und die Datenverlust-Guards sollten zuerst angegangen werden.

---

## 7. Datei und Testgrenzen (Abschluss)

**Ausgabedatei:** `docs/ux-audit/deepseek-v4.1-flash.md`

**Testgrenzen im Klartext:**
- Es wurden **keine Browser-, Geräte-, Touch-, Video- oder Screenreader-Tests** ausgeführt. Alle Interaktionsaussagen sind aus dem Code abgeleitet.
- Es wurden **keine visuellen Prüfungen** (Screenshots, Pixelmessungen, Farbwerte am Bildschirm) vorgenommen. Kontrast- und Größenaussagen sind aus den CSS-Werten berechnet (sRGB, relatives 16-px-Root).
- Die reine Logik von `samplingTimes`/`parseTime` wurde mit Node.js nachgebaut und für konkrete Fälle geprüft; das ist **kein** Test der laufenden App.
- Als **Hypothesen** markiert und noch zu verifizieren: UX-C06 (Komma in `type=number`), UX-M06 (Toast im Top-Layer), UX-A01 (iOS-Auto-Zoom), die bfcache-Teilaussage in UX-D02 sowie die Screenreader-Wirkung in UX-C05.
- Die Befunde zu Fokusverlust und Audio basieren auf belegten Codepfaden und Standard-Browserverhalten, wurden aber nicht interaktiv nachgestellt.
- Es wurden **keine App-Änderungen** vorgenommen und **kein Commit** erstellt. Es wurde **keine Subdelegation** verwendet und **keine andere Auditdatei gelesen**.
- Zeilenangaben beziehen sich auf den aktuellen Stand von `index.html` (1.392 Zeilen).
