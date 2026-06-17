import Link from 'next/link'
import { getAllTopics } from '@/lib/content'
import TopicCard from '@/components/TopicCard'

export default function Home() {
  const topics = getAllTopics()

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      {/* Hero */}
      <section className="mb-20 max-w-2xl">
        <p
          className="text-sm font-semibold uppercase tracking-widest mb-4"
          style={{ color: 'var(--color-accent-bright)' }}
        >
          Embedded Systems
        </p>
        <h1
          className="text-4xl sm:text-5xl font-bold leading-tight mb-6"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Learn the hardware.<br />
          <span style={{ color: 'var(--color-accent-bright)' }}>Understand the why.</span>
        </h1>
        <p
          className="text-lg leading-relaxed"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Modulus is a structured resource for learning embedded systems — the kind of resource
          I wish I had starting out. Clear explanations, real code, and the reasoning behind
          every decision.
        </p>
      </section>

      {/* Topics grid */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2
            className="text-2xl font-semibold"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Topics
          </h2>
          <Link
            href="/topics/"
            className="text-sm transition-colors"
            style={{ color: 'var(--color-accent-bright)' }}
          >
            View all →
          </Link>
        </div>

        {topics.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)' }}>No topics yet. Add MDX files to content/topics/.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {topics.map((topic) => (
              <TopicCard key={topic.slug} topic={topic} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
