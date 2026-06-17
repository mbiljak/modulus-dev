'use client'

import { useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import type { SearchDocument } from '@/types/content'

type FlexSearchResult = { id: string; doc: SearchDocument }

let indexPromise: Promise<{ search: (q: string) => FlexSearchResult[] }> | null = null

function getIndex() {
  if (indexPromise) return indexPromise
  indexPromise = (async () => {
    const [{ Document }, res] = await Promise.all([
      import('flexsearch'),
      fetch('/search-index.json'),
    ])
    const docs: SearchDocument[] = await res.json()

    const idx = new Document({
      tokenize: 'forward',
      cache: true,
      document: {
        id: 'id',
        index: [
          { field: 'title',       tokenize: 'full',    resolution: 9 },
          { field: 'tags',        tokenize: 'full',    resolution: 7 },
          { field: 'description', tokenize: 'forward', resolution: 5 },
          { field: 'body',        tokenize: 'forward', resolution: 3 },
        ],
        store: ['title', 'description', 'topic', 'tags', 'slug'],
      },
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const doc of docs) idx.add(doc as any)

    return {
      search: (q: string): FlexSearchResult[] => {
        const results = idx.search(q, { enrich: true, limit: 10 })
        const seen = new Set<string>()
        const out: FlexSearchResult[] = []
        for (const field of results) {
          for (const r of field.result) {
            if (!seen.has(r.id as string)) {
              seen.add(r.id as string)
              out.push(r as FlexSearchResult)
            }
          }
        }
        return out
      },
    }
  })()
  return indexPromise
}

export default function SearchBox() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<FlexSearchResult[]>([])
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value
    setQuery(q)
    if (q.length < 2) { setResults([]); return }
    const idx = await getIndex()
    setResults(idx.search(q))
  }, [])

  const handleFocus = () => {
    setOpen(true)
    getIndex() // warm cache on first focus
  }

  return (
    <div className="relative w-full max-w-xl">
      <div
        className="flex items-center gap-2 rounded-lg px-3 py-2"
        style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' }}
      >
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" style={{ color: 'var(--color-text-muted)', flexShrink: 0 }}>
          <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search lessons…"
          value={query}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          className="flex-1 bg-transparent text-sm outline-none"
          style={{ color: 'var(--color-text-primary)' }}
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setResults([]); inputRef.current?.focus() }}
            style={{ color: 'var(--color-text-muted)' }}
            className="text-lg leading-none"
          >
            ×
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <ul
          className="absolute top-full mt-1 w-full rounded-lg overflow-hidden z-50 shadow-xl"
          style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}
        >
          {results.map(({ id, doc }) => (
            <li key={id}>
              <Link
                href={`/topics/${doc.topic}/${doc.slug}/`}
                className="flex flex-col gap-0.5 px-4 py-3 text-sm transition-colors"
                style={{ borderBottom: '1px solid var(--color-border)' }}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => { setOpen(false); setQuery('') }}
              >
                <span
                  className="font-medium"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {doc.title}
                </span>
                <span style={{ color: 'var(--color-text-secondary)' }}>
                  {doc.description}
                </span>
                <span
                  className="text-xs capitalize"
                  style={{ color: 'var(--color-accent-bright)' }}
                >
                  {doc.topic}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {open && query.length >= 2 && results.length === 0 && (
        <div
          className="absolute top-full mt-1 w-full rounded-lg px-4 py-3 text-sm"
          style={{
            background: 'var(--color-bg-elevated)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text-muted)',
          }}
        >
          No results for &ldquo;{query}&rdquo;
        </div>
      )}
    </div>
  )
}
