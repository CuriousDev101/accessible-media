# accessible-media (minimal workflow sandbox)

One custom element (`<savanna-hello>`, Preact + TypeScript + Shadow DOM) and one tiny API (Hono),
tested inside the Savanna static pages by adding a single `<script>` tag.

## How the pieces fit

```
Savanna-static-pages (host, :3000)  ──loads──▶  /widget/savanna-hello.js  ┐
        │  <savanna-hello> tag                                            │ served by the API (:8787)
        └──────────── fetch /api/lesson (CORS) ───────────────────────────┘
```

- `src/element.tsx`  registers the custom element, attaches a Shadow DOM, renders Preact into it
- `src/Hello.tsx`    the component: fetches the lesson, language toggle, aria-live caption
- `src/styles.css`   imported as a string and injected inside the shadow root
- `vite.config.ts`   library mode, IIFE output -> `dist/savanna-hello.js` (one classic script)
- `server/index.ts`  Hono API: `/api/health`, `/api/lesson`, and serves `dist/` at `/widget/`
- `scripts/inject.mjs` copies a Savanna page to `pages/_am-test-concept.html` with our tag added

## Setup (once)

```bash
cd /home/curi/Dev/Projects/Web/Sandbox/accessible-media
npm install preact hono @hono/node-server
npm install -D vite @preact/preset-vite typescript tsx
npm run typecheck
```

## Run (3 terminals)

```bash
# 1. rebuild the widget on every change
npm run watch

# 2. the API (also serves the built widget)
npm run api

# 3. once: make the test page, then serve the Savanna repo
npm run inject
cd /home/curi/Dev/Projects/Web/Sandbox/Savanna-static-pages
npx serve .
```

Open `http://localhost:3000/pages/_am-test-concept.html` (use the port `serve` prints).
The widget is in the bottom-right corner.

Optional: `npm run dev` gives a quick harness page with hot reload (no host page).

To keep the generated page out of git in the Savanna repo (without editing its .gitignore):

```bash
echo 'pages/_am-test-*.html' >> /home/curi/Dev/Projects/Web/Sandbox/Savanna-static-pages/.git/info/exclude
```

## Things to check

1. Browser devtools, Elements: `<savanna-hello>` contains `#shadow-root`
2. Network: `savanna-hello.js` (size?) and `/api/lesson` both load
3. The host's Bootstrap styles do not change the widget's look
4. Keyboard: Tab to the language buttons, Enter/Space switches caption
5. Screen reader (NVDA/TalkBack): buttons announce "pressed", caption change is announced
6. Stop the API, reload: the error message appears (`role="alert"`)
7. Zoom to 200%: still usable
8. Change the tag to `<savanna-hello api-base="http://localhost:8787">` to see the attribute override

## Notes

- Dependency versions are not pinned in package.json on purpose; npm writes the current ones on install.
- Opening the host page via `file://` also works for the script tag (classic script), but `fetch` and
  service workers are only reliable over http://localhost.
