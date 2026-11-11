import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

// The host page (e.g. localhost:3000) is a different origin from this API (8787),
// so the browser needs CORS headers for fetch(). Script tags do not need them.
app.use('*', cors())

app.get('/api/health', (c) => c.json({ ok: true, time: new Date().toISOString() }))

// Fake lesson data. Later this is where captions (WebVTT) and media info come from.
app.get('/api/lesson', (c) =>
  c.json({
    title: 'Hello lesson (sample data)',
    captions: [
      { lang: 'en', label: 'English', text: 'Hello, welcome to the lesson.' },
      { lang: 'am', label: 'አማርኛ', text: 'ሰላም፣ እንኳን ወደ ትምህርቱ በደህና መጡ።' },
    ],
  }),
)

// Serve the built widget at /widget/savanna-hello.js (from ./dist, run `npm run build` first).
app.use(
  '/widget/*',
  serveStatic({ root: './dist', rewriteRequestPath: (p) => p.replace(/^\/widget/, '') }),
)

const port = 8787
serve({ fetch: app.fetch, port })
console.log(`API:    http://localhost:${port}/api/lesson`)
console.log(`Widget: http://localhost:${port}/widget/savanna-hello.js`)
