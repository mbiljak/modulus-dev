import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import { compileMDX } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrettyCode from 'rehype-pretty-code'
import type { LessonMeta, TopicMeta } from '@/types/content'

const CONTENT_ROOT = path.join(process.cwd(), 'content')
const TOPICS_ROOT = path.join(CONTENT_ROOT, 'topics')

function titleFromSlug(slug: string): string {
  return slug
    .replace(/^\d+-/, '')
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

function getLessonFiles(topicSlug: string): string[] {
  const dir = path.join(TOPICS_ROOT, topicSlug)
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .sort()
}

export function getAllTopicSlugs(): string[] {
  if (!fs.existsSync(TOPICS_ROOT)) return []
  return fs.readdirSync(TOPICS_ROOT).filter((d) => {
    return fs.statSync(path.join(TOPICS_ROOT, d)).isDirectory()
  })
}

export function getLessonsForTopic(topicSlug: string): LessonMeta[] {
  const files = getLessonFiles(topicSlug)
  return files.map((filename) => {
    const filePath = path.join(TOPICS_ROOT, topicSlug, filename)
    const raw = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(raw)
    const lessonSlug = filename.replace(/\.mdx$/, '')
    return {
      title: data.title ?? titleFromSlug(lessonSlug),
      description: data.description ?? '',
      date: data.date ? String(data.date) : new Date().toISOString().split('T')[0],
      tags: data.tags ?? [],
      topic: topicSlug,
      order: data.order ?? (parseInt(lessonSlug.split('-')[0]) || 0),
      difficulty: data.difficulty ?? 'beginner',
      slug: lessonSlug,
      readingTime: Math.ceil(readingTime(content).minutes),
    } satisfies LessonMeta
  })
}

export function getAllTopics(): TopicMeta[] {
  const slugs = getAllTopicSlugs()
  return slugs.map((slug) => {
    const lessons = getLessonsForTopic(slug)
    const metaPath = path.join(TOPICS_ROOT, slug, '_meta.json')
    let title = titleFromSlug(slug)
    let description = ''
    if (fs.existsSync(metaPath)) {
      const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'))
      title = meta.title ?? title
      description = meta.description ?? description
    }
    return {
      slug,
      title,
      description,
      lessons,
      lessonCount: lessons.length,
      difficulties: Array.from(new Set(lessons.map((l) => l.difficulty))),
    } satisfies TopicMeta
  })
}

export function getAllLessons(): LessonMeta[] {
  const slugs = getAllTopicSlugs()
  return slugs.flatMap((s) => getLessonsForTopic(s))
}

export async function getLessonBySlug(topicSlug: string, lessonSlug: string) {
  const filePath = path.join(TOPICS_ROOT, topicSlug, `${lessonSlug}.mdx`)
  const raw = fs.readFileSync(filePath, 'utf-8')

  const { content, frontmatter } = await compileMDX<Omit<LessonMeta, 'slug' | 'readingTime' | 'topic'>>({
    source: raw,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: 'wrap' }],
          [
            rehypePrettyCode,
            {
              theme: 'one-dark-pro',
              keepBackground: false,
              defaultLang: 'c',
            },
          ],
        ],
      },
    },
  })

  const lessons = getLessonsForTopic(topicSlug)
  const idx = lessons.findIndex((l) => l.slug === lessonSlug)

  return {
    ...frontmatter,
    topic: topicSlug,
    slug: lessonSlug,
    readingTime: Math.ceil(readingTime(raw).minutes),
    content,
    prevLesson: idx > 0 ? lessons[idx - 1] : null,
    nextLesson: idx < lessons.length - 1 ? lessons[idx + 1] : null,
  }
}
