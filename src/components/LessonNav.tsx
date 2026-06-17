import Link from 'next/link'
import type { LessonMeta } from '@/types/content'

interface Props {
  prev: LessonMeta | null
  next: LessonMeta | null
}

export default function LessonNav({ prev, next }: Props) {
  if (!prev && !next) return null

  return (
    <nav
      className="mt-16 pt-8 grid grid-cols-2 gap-4"
      style={{ borderTop: '1px solid var(--color-border)' }}
    >
      {prev ? (
        <Link
          href={`/topics/${prev.topic}/${prev.slug}/`}
          className="group flex flex-col gap-1 rounded-lg p-4 text-sm transition-colors"
          style={{
            background: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border)',
          }}
        >
          <span style={{ color: 'var(--color-text-muted)' }}>← Previous</span>
          <span
            className="font-medium group-hover:underline"
            style={{ color: 'var(--color-accent-bright)' }}
          >
            {prev.title}
          </span>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link
          href={`/topics/${next.topic}/${next.slug}/`}
          className="group flex flex-col gap-1 rounded-lg p-4 text-sm text-right transition-colors"
          style={{
            background: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border)',
          }}
        >
          <span style={{ color: 'var(--color-text-muted)' }}>Next →</span>
          <span
            className="font-medium group-hover:underline"
            style={{ color: 'var(--color-accent-bright)' }}
          >
            {next.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
    </nav>
  )
}
