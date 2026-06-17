import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

export default {
  content: [
    './src/**/*.{ts,tsx}',
    './content/**/*.mdx',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          base:     'var(--color-bg-base)',
          surface:  'var(--color-bg-surface)',
          elevated: 'var(--color-bg-elevated)',
          overlay:  'var(--color-bg-overlay)',
          subtle:   'var(--color-bg-subtle)',
        },
        accent: {
          base:   'var(--color-accent-base)',
          bright: 'var(--color-accent-bright)',
          pop:    'var(--color-accent-pop)',
          glow:   'var(--color-accent-glow)',
        },
        text: {
          primary:   'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          muted:     'var(--color-text-muted)',
        },
        border: 'var(--color-border)',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      },
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body':         'var(--color-text-primary)',
            '--tw-prose-headings':     'var(--color-text-primary)', /* overridden per-level in globals.css */
            '--tw-prose-lead':         'var(--color-text-secondary)',
            '--tw-prose-links':        'var(--light-blue)',
            '--tw-prose-bold':         'var(--color-text-primary)',
            '--tw-prose-counters':     'var(--color-text-muted)',
            '--tw-prose-bullets':      'var(--vauxhall-fg)',
            '--tw-prose-hr':           'var(--color-border)',
            '--tw-prose-quotes':       'var(--color-text-secondary)',
            '--tw-prose-quote-borders':'var(--vauxhall-fg)',
            '--tw-prose-captions':     'var(--color-text-muted)',
            '--tw-prose-code':         'var(--vauxhall-fg)',
            '--tw-prose-pre-code':     'var(--color-text-primary)',
            '--tw-prose-pre-bg':       'var(--color-bg-overlay)',
            '--tw-prose-th-borders':   'var(--color-border)',
            '--tw-prose-td-borders':   'var(--color-border)',
            'a:hover': { color: 'var(--cool-cyan)' },
            'code::before': { content: '""' },
            'code::after': { content: '""' },
          },
        },
      },
    },
  },
  plugins: [typography],
} satisfies Config
