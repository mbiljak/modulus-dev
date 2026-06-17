export const metadata = {
  title: 'Projects | Modulus',
  description: 'Embedded systems project writeups.',
}

export default function ProjectsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1
        className="text-3xl font-bold mb-4"
        style={{ color: 'var(--color-text-primary)' }}
      >
        Projects
      </h1>
      <p style={{ color: 'var(--color-text-muted)' }}>
        Project writeups coming soon.
      </p>
    </div>
  )
}
