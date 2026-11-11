import { useEffect, useState } from 'preact/hooks'

type Caption = { lang: string; label: string; text: string }
type Lesson = { title: string; captions: Caption[] }

export function Hello({ apiBase }: { apiBase: string }) {
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [lang, setLang] = useState('en')

  useEffect(() => {
    setError(null)
    fetch(`${apiBase}/api/lesson`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then(setLesson)
      .catch((e) => setError(String(e.message ?? e)))
  }, [apiBase])

  const current = lesson?.captions.find((c) => c.lang === lang)

  return (
    <section class="card" aria-labelledby="am-title">
      <h2 id="am-title">{lesson?.title ?? 'Accessible media (hello)'}</h2>

      {error && (
        <p role="alert" class="error">
          Could not reach the API ({error}). Is it running at {apiBase}?
        </p>
      )}

      {lesson && (
        <>
          <div role="group" aria-label="Caption language" class="row">
            {lesson.captions.map((c) => (
              <button
                type="button"
                key={c.lang}
                lang={c.lang}
                aria-pressed={c.lang === lang}
                onClick={() => setLang(c.lang)}
              >
                {c.label}
              </button>
            ))}
          </div>
          {/* aria-live: screen readers announce the caption when it changes */}
          <p class="caption" lang={current?.lang} aria-live="polite">
            {current?.text}
          </p>
        </>
      )}

      <p class="meta">API: {apiBase}</p>
    </section>
  )
}
