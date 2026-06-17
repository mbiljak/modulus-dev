import SearchBox from '@/components/SearchBox'

export const metadata = {
  title: 'Search | Modulus',
  description: 'Search all Modulus lessons.',
}

export default function SearchPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1
        className="text-3xl font-bold mb-8"
        style={{ color: 'var(--color-text-primary)' }}
      >
        Search
      </h1>
      <SearchBox />
      <p className="mt-6 text-sm" style={{ color: 'var(--color-text-muted)' }}>
        Search across all lessons, descriptions, and tags.
      </p>
    </div>
  )
}
