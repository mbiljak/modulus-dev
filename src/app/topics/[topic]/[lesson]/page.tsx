import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllTopicSlugs, getLessonsForTopic, getLessonBySlug } from '@/lib/content'
import { extractToc } from '@/lib/toc'
import LessonNav from '@/components/LessonNav'
import TableOfContents from '@/components/TableOfContents'
import type { Metadata } from 'next'
import fs from 'fs'
import path from 'path'
import clsx from 'clsx'

interface Props {
  params: { topic: string; lesson: string }
}

const DIFFICULTY_COLOR = {
  beginner:     'text-emerald-400 bg-emerald-400/10',
  intermediate: 'text-amber-400  bg-amber-400/10',
  advanced:     'text-red-400    bg-red-400/10',
}

export async function generateStaticParams() {
  const params: { topic: string; lesson: string }[] = []
  for (const topic of getAllTopicSlugs()) {
    for (const lesson of getLessonsForTopic(topic)) {
      params.push({ topic, lesson: lesson.slug })
    }
  }
  return params
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const lesson = await getLessonBySlug(params.topic, params.lesson)
    return {
      title: `${lesson.title} | Modulus`,
      description: lesson.description,
    }
  } catch {
    return {}
  }
}

export default async function LessonPage({ params }: Props) {
  let lesson
  try {
    lesson = await getLessonBySlug(params.topic, params.lesson)
  } catch {
    notFound()
  }

  // Extract ToC from raw source for sidebar
  const rawPath = path.join(process.cwd(), 'content', 'topics', params.topic, `${params.lesson}.mdx`)
  const rawSource = fs.existsSync(rawPath) ? fs.readFileSync(rawPath, 'utf-8') : ''
  const tocEntries = extractToc(rawSource)

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm flex items-center gap-2" style={{ color: 'var(--color-text-muted)' }}>
        <Link href="/" style={{ color: 'var(--color-accent-bright)' }}>Home</Link>
        <span>/</span>
        <Link href="/topics/" style={{ color: 'var(--color-accent-bright)' }}>Topics</Link>
        <span>/</span>
        <Link href={`/topics/${params.topic}/`} style={{ color: 'var(--color-accent-bright)' }}>
          {params.topic.toUpperCase()}
        </Link>
        <span>/</span>
        <span className="truncate">{lesson.title}</span>
      </nav>

      <div className="lg:grid lg:grid-cols-[1fr_220px] lg:gap-12">
        {/* Main content */}
        <article>
          {/* Header */}
          <header className="mb-10">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span
                className={clsx(
                  'text-xs font-medium px-2.5 py-1 rounded-full capitalize',
                  DIFFICULTY_COLOR[lesson.difficulty]
                )}
              >
                {lesson.difficulty}
              </span>
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                {lesson.readingTime} min read
              </span>
              {lesson.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded"
                  style={{
                    background: 'var(--color-bg-subtle)',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
            <h1
              className="text-3xl sm:text-4xl font-bold leading-tight mb-4"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {lesson.title}
            </h1>
            {lesson.description && (
              <p className="text-lg leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                {lesson.description}
              </p>
            )}
          </header>

          {/* MDX content */}
          <div className="prose prose-invert max-w-none">
            {lesson.content}
          </div>

          <LessonNav prev={lesson.prevLesson} next={lesson.nextLesson} />
        </article>

        {/* Table of contents sidebar */}
        <aside className="hidden lg:block">
          <TableOfContents entries={tocEntries} />
        </aside>
      </div>
    </div>
  )
}
