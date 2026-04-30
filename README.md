# Yoo SeungTaik — Portfolio

A static one-page portfolio for Yoo SeungTaik (유승택), a data scientist with
22 years at LG Electronics.

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

The site is published with **GitHub Pages** from the `main` branch root at
<https://lgyust-del.github.io/>.

To publish a change:

```bash
git add .
git commit -m "update: <what changed>"
git push
```

GitHub Pages typically picks up the new commit within 30 seconds.

## Editing content

Almost everything visible on the page comes from [data.json](./data.json):

- `meta` — name, wordmark, contact links (`email`, `github`, `linkedin`,
  `portfolio`, `instagram` — only the ones you set show up in the footer).
- `hero` — eyebrow + headline (with one italic-accented word) + lede + CTAs.
- `stats`, `approach.values`, `work.projects`, `philosophy.principles` —
  arrays you can extend or shrink.
- `contact`, `footer` — closing CTA and footer copy.

Each project card supports an optional `image` (path under `assets/`) and
`imageAlt`. If `image` is omitted, the card falls back to a tone-driven
gradient — set `tone` to `warm`, `neutral`, or `cool`.
