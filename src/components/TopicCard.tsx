import Link from 'next/link'
import type { TopicMeta } from '@/types/content'
import clsx from 'clsx'

const DIFFICULTY_COLOR = {
  beginner:     'text-emerald-400 bg-emerald-400/10',
  intermediate: 'text-amber-400  bg-amber-400/10',
  advanced:     'text-red-400    bg-red-400/10',
}

interface Props {
  topic: TopicMeta
}

export default function TopicCard({ topic }: Props) {
  const topDifficulty = topic.difficulties[0]

  return (
    <Link
      href={`/topics/${topic.slug}/`}
      className="block rounded-lg p-6 transition-all duration-200 hover:scale-[1.02]"
      style={{
        background: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border)',
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3
          className="text-lg font-semibold leading-snug"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {topic.title}
        </h3>
        {topDifficulty && (
          <span
            className={clsx(
              'shrink-0 text-xs font-medium px-2 py-0.5 rounded-full capitalize',
              DIFFICULTY_COLOR[topDifficulty]
            )}
          >
            {topDifficulty}
          </span>
        )}
      </div>

      {topic.description && (
        <p
          className="text-sm leading-relaxed mb-4"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {topic.description}
        </p>
      )}

      <div
        className="text-xs font-medium"
        style={{ color: 'var(--color-accent-bright)' }}
      >
        {topic.lessonCount} {topic.lessonCount === 1 ? 'lesson' : 'lessons'} →
      </div>
    </Link>
  )
}
