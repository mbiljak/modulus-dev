'use client'

import { useEffect, useState } from 'react'
import type { TocEntry } from '@/lib/toc'
import clsx from 'clsx'

interface Props {
  entries: TocEntry[]
}

export default function TableOfContents({ entries }: Props) {
  const [active, setActive] = useState<string>('')

  useEffect(() => {
    if (entries.length === 0) return

    const observer = new IntersectionObserver(
      (obs) => {
        const visible = obs.filter((e) => e.isIntersecting)
        if (visible.length > 0) {
          setActive(visible[0].target.id)
        }
      },
      { rootMargin: '0px 0px -70% 0px', threshold: 0 }
    )

    entries.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [entries])

  if (entries.length === 0) return null

  return (
    <aside className="sticky top-24 text-sm">
      <p
        className="mb-3 text-xs font-semibold uppercase tracking-wider"
        style={{ color: 'var(--color-text-muted)' }}
      >
        On this page
      </p>
      <ul className="space-y-1">
        {entries.map((entry) => (
          <li
            key={entry.id}
            style={{ paddingLeft: `${(entry.level - 2) * 12}px` }}
          >
            <a
              href={`#${entry.id}`}
              className={clsx(
                'block py-0.5 transition-colors duration-150',
                active === entry.id
                  ? 'font-medium'
                  : 'hover:opacity-80'
              )}
              style={{
                color:
                  active === entry.id
                    ? 'var(--color-accent-bright)'
                    : 'var(--color-text-secondary)',
              }}
            >
              {entry.text}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  )
}
