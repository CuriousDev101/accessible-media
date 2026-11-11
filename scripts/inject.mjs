// Makes a TEST COPY of a Savanna page with our script tag added.
// The original pages in the Savanna repo are never modified.
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

console.log(process.env.HOST_DIR, "host")

const hostDir = process.env.HOST_DIR ?? '/home/curi/Dev/Projects/Web/Sandbox/Savanna-static-pages'
const widgetSrc = process.env.WIDGET_SRC ?? 'http://localhost:8787/widget/savanna-hello.js'

const source = path.join(hostDir, 'pages', 'concept-with-navigation.html')
const output = path.join(hostDir, 'pages', '_am-test-concept.html')

const html = await readFile(source, 'utf8')
const end = html.lastIndexOf('</body>')
if (end === -1) throw new Error(`No </body> found in ${source}`)

// Fixed box at the bottom-right so we do not depend on the page's layout yet.
const snippet = `
<!-- accessible-media test injection -->
<div style="position:fixed;right:16px;bottom:16px;z-index:9999;max-width:360px">
  <savanna-hello></savanna-hello>
</div>
<script src="${widgetSrc}"></script>
`

await writeFile(output, html.slice(0, end) + snippet + html.slice(end), 'utf8')
console.log(`Wrote ${output}`)
