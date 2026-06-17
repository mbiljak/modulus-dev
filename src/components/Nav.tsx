import Link from 'next/link'
import SearchBox from './SearchBox'

export default function Nav() {
  return (
    <header
      className="sticky top-0 z-40 backdrop-blur-sm"
      style={{
        background: 'rgba(13, 14, 23, 0.85)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center gap-6">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight shrink-0"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Modulus
          <span style={{ color: 'var(--color-accent-bright)' }}>.</span>
        </Link>

        <nav className="hidden sm:flex items-center gap-5 text-sm">
          <Link
            href="/topics/"
            className="transition-colors"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Topics
          </Link>
          <Link
            href="/projects/"
            className="transition-colors"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Projects
          </Link>
          <Link
            href="/resources/"
            className="transition-colors"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Resources
          </Link>
        </nav>

        <div className="ml-auto flex-1 max-w-sm">
          <SearchBox />
        </div>
      </div>
    </header>
  )
}
