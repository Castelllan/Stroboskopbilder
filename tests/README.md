# Lokale UX-Prüfung

Die Anwendung benötigt weiterhin nur `index.html`. Die folgenden Abhängigkeiten sind ausschließlich für die Entwicklungstests nötig.

Benötigt werden Node.js, FFmpeg und Chromium. Installiere die festgelegte Playwright-Core-Version im Testverzeichnis:

```sh
npm --prefix tests install
```

Prüfe zuerst Validierung und Kontraste:

```sh
node docs/ux-audit/verify-findings.cjs
```

Starte dann die Anwendungstests. `CHROMIUM_PATH` bezeichnet die ausführbare Chromium-Datei:

```sh
CHROMIUM_PATH=/pfad/zu/chromium node tests/ux.cjs
```

Bei einer schon vorhandenen Playwright-Core-Installation kann `PLAYWRIGHT_CORE_PATH` auf deren Paketverzeichnis zeigen. Ohne `CHROMIUM_PATH` verwendet Playwright seine Standardinstallation.

Der Test erzeugt synthetische Videos mit FFmpeg in einem temporären Verzeichnis. Er öffnet die lokale HTML-Datei, verarbeitet Videos, bedient die Messung mit Tastatur, Maus und emulierten Touch-Ereignissen und vergleicht die exportierten PNG-Pixel mit dem Ergebnis-Canvas. Er prüft außerdem Validierung, veraltete Ergebnisse, Bestätigungen, Rückgängig, Abbruch, Dateiersatz, Zoom, Fokus, Qualitätswarnung und Vollbild. Das temporäre Verzeichnis mit PNG und Bildschirmaufnahme wird am Ende ausgegeben.

Die mobile Prüfung emuliert Chromium. Sie ersetzt weder echte iOS-Geräte noch Screenreader- und Nutzertests. Der Test greift auf keine externen Dienste zu und benötigt keinen Webserver.
