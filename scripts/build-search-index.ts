import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const CONTENT_ROOT = path.join(process.cwd(), 'content')
const TOPICS_ROOT = path.join(CONTENT_ROOT, 'topics')
const OUTPUT = path.join(process.cwd(), 'public', 'search-index.json')

function stripMdx(source: string): string {
  return source
    .replace(/^---[\s\S]*?---/m, '')        // frontmatter
    .replace(/import\s+.*?from\s+['"].*?['"]/g, '')  // imports
    .replace(/<[^>]+>/g, ' ')               // JSX tags
    .replace(/```[\s\S]*?```/g, ' ')        // code blocks
    .replace(/`[^`]+`/g, ' ')              // inline code
    .replace(/[#*_~\[\]]/g, '')             // markdown syntax
    .replace(/\s+/g, ' ')
    .trim()
}

function getTopicSlugs(): string[] {
  if (!fs.existsSync(TOPICS_ROOT)) return []
  return fs.readdirSync(TOPICS_ROOT).filter((d) =>
    fs.statSync(path.join(TOPICS_ROOT, d)).isDirectory()
  )
}

interface Doc {
  id: string
  title: string
  description: string
  topic: string
  tags: string[]
  body: string
  slug: string
}

const docs: Doc[] = []

for (const topicSlug of getTopicSlugs()) {
  const dir = path.join(TOPICS_ROOT, topicSlug)
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .sort()

  for (const file of files) {
    const raw = fs.readFileSync(path.join(dir, file), 'utf-8')
    const { data, content } = matter(raw)
    const slug = file.replace(/\.mdx$/, '')

    docs.push({
      id: `${topicSlug}/${slug}`,
      title: data.title ?? slug,
      description: data.description ?? '',
      topic: topicSlug,
      tags: data.tags ?? [],
      body: stripMdx(content),
      slug,
    })
  }
}

fs.mkdirSync(path.dirname(OUTPUT), { recursive: true })
fs.writeFileSync(OUTPUT, JSON.stringify(docs, null, 0))
console.log(`[search] wrote ${docs.length} documents → ${OUTPUT}`)
