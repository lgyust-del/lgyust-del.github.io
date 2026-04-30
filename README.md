# Park Yuna — Portfolio

A static one-page portfolio for the fashion designer Park Yuna (demo content).

Built with vanilla HTML, CSS, and JavaScript — no build step, no framework.
Content lives in [data.json](./data.json); the page is rendered by
[main.js](./main.js) at load time.

## Local preview

```bash
python -m http.server 8000
```

Then open <http://localhost:8000>.

A simple HTTP server is required because `main.js` fetches `data.json` —
opening `index.html` directly via `file://` will hit a CORS error.

## Deploy

The site is published with **GitHub Pages** from the `main` branch root.

## Image credits

Cover photography via Unsplash — MANITO SILK, Svitlana, Reistor.
Free to use under the [Unsplash License](https://unsplash.com/license).
