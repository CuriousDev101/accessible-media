import { render } from 'preact'
import { Hello } from './Hello'
import css from './styles.css?inline'

// When the bundle runs as a classic <script>, document.currentScript tells us
// where it was loaded from. We assume the API lives on the same origin.
// (currentScript is null in `vite dev`, so we fall back to localhost.)
const script = document.currentScript as HTMLScriptElement | null
const defaultApiBase = script?.src ? new URL(script.src).origin : 'http://localhost:8787'

class SavannaHello extends HTMLElement {
  private root?: ShadowRoot

  static get observedAttributes() {
    return ['api-base']
  }

  connectedCallback() {
    // Shadow DOM: the host page's Bootstrap/CSS cannot leak in, and ours cannot leak out.
    this.root ??= this.attachShadow({ mode: 'open' })
    this.draw()
  }

  attributeChangedCallback() {
    if (this.isConnected) this.draw()
  }

  disconnectedCallback() {
    if (this.root) render(null, this.root)
  }

  private draw() {
    const apiBase = this.getAttribute('api-base') ?? defaultApiBase
    render(
      <>
        <style>{css}</style>
        <Hello apiBase={apiBase} />
      </>,
      this.root!,
    )
  }
}

if (!customElements.get('savanna-hello')) {
  customElements.define('savanna-hello', SavannaHello)
}
