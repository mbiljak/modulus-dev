import { getAllTopics } from '@/lib/content'
import TopicCard from '@/components/TopicCard'

export const metadata = {
  title: 'Topics | Modulus',
  description: 'All embedded systems topics covered on Modulus.',
}

export default function TopicsPage() {
  const topics = getAllTopics()

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1
        className="text-3xl font-bold mb-4"
        style={{ color: 'var(--color-text-primary)' }}
      >
        Topics
      </h1>
      <p
        className="text-base mb-12"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        {topics.length} topic{topics.length !== 1 ? 's' : ''} covering the breadth of embedded systems engineering.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {topics.map((topic) => (
          <TopicCard key={topic.slug} topic={topic} />
        ))}
      </div>
    </div>
  )
}
