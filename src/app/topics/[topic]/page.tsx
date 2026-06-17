import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllTopicSlugs, getAllTopics, getLessonsForTopic } from '@/lib/content'
import type { Metadata } from 'next'
import clsx from 'clsx'

interface Props {
  params: { topic: string }
}

const DIFFICULTY_COLOR = {
  beginner:     'text-emerald-400 bg-emerald-400/10',
  intermediate: 'text-amber-400  bg-amber-400/10',
  advanced:     'text-red-400    bg-red-400/10',
}

export async function generateStaticParams() {
  return getAllTopicSlugs().map((topic) => ({ topic }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const topics = getAllTopics()
  const topic = topics.find((t) => t.slug === params.topic)
  if (!topic) return {}
  return {
    title: `${topic.title} | Modulus`,
    description: topic.description,
  }
}

export default function TopicPage({ params }: Props) {
  const topics = getAllTopics()
  const topic = topics.find((t) => t.slug === params.topic)
  if (!topic) notFound()

  const lessons = getLessonsForTopic(params.topic)

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm flex items-center gap-2" style={{ color: 'var(--color-text-muted)' }}>
        <Link href="/" style={{ color: 'var(--color-accent-bright)' }}>Home</Link>
        <span>/</span>
        <Link href="/topics/" style={{ color: 'var(--color-accent-bright)' }}>Topics</Link>
        <span>/</span>
        <span>{topic.title}</span>
      </nav>

      <h1
        className="text-3xl font-bold mb-3"
        style={{ color: 'var(--color-text-primary)' }}
      >
        {topic.title}
      </h1>
      {topic.description && (
        <p className="text-base mb-12" style={{ color: 'var(--color-text-secondary)' }}>
          {topic.description}
        </p>
      )}

      {/* Lesson list */}
      <ol className="space-y-3">
        {lessons.map((lesson, idx) => (
          <li key={lesson.slug}>
            <Link
              href={`/topics/${params.topic}/${lesson.slug}/`}
              className="flex items-start gap-4 rounded-lg p-4 transition-colors group"
              style={{
                background: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border)',
              }}
            >
              <span
                className="text-sm font-mono shrink-0 w-6 text-right mt-0.5"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {String(idx + 1).padStart(2, '0')}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span
                    className="font-medium group-hover:underline"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    {lesson.title}
                  </span>
                  <span
                    className={clsx(
                      'text-xs font-medium px-2 py-0.5 rounded-full capitalize shrink-0',
                      DIFFICULTY_COLOR[lesson.difficulty]
                    )}
                  >
                    {lesson.difficulty}
                  </span>
                </div>
                {lesson.description && (
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                    {lesson.description}
                  </p>
                )}
              </div>
              <span
                className="text-xs shrink-0 mt-0.5"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {lesson.readingTime} min
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  )
}
