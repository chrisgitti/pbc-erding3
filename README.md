# pbc-erding3

Bootstrap-basierte HTML-Version der Vereinswebsite mit einfachem Redaktionssetup.

## Aufbau

- Jede Seite ist eine normale HTML-Datei.
- `includes/header.inc.html` und `includes/footer.inc.html` enthalten gemeinsame Layoutteile.
- `assets/css/site.css` enthaelt die Farblogik in Weiss, Lila und Schwarz.
- `assets/js/site.js` laedt die Include-Dateien nach.

## Inhalte bearbeiten

- Texte direkt in `index.html`, `verein.html`, `turniere.html` usw. aendern.
- Navigation oder Footer nur in den Include-Dateien anpassen.
- Danach Dateien direkt auf den Server hochladen.

## Wichtig zur lokalen Vorschau

Die Pfade sind relativ korrekt. Das Problem beim Doppelklick auf `index.html` ist nicht der Pfad, sondern das Browser-Sicherheitsmodell: `fetch()` darf Include-Dateien über `file:///` normalerweise nicht laden.

Zum lokalen Test daher bitte den kleinen Preview-Server starten:

```powershell
powershell -ExecutionPolicy Bypass -File .\preview-server.ps1
```

Danach im Browser öffnen:

```text
http://localhost:8080/
```
