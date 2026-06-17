import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/Nav'

export const metadata: Metadata = {
  title: 'Modulus — Embedded Systems Learning',
  description:
    'A structured learning resource for embedded systems engineering — UART, SPI, I2C, interrupts, memory-mapped peripherals, and more.',
  openGraph: {
    title: 'Modulus',
    description: 'Embedded systems learning, clearly explained.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Nav />
        <main>{children}</main>
        <footer
          className="mt-24 py-10 text-center text-sm"
          style={{
            color: 'var(--color-text-muted)',
            borderTop: '1px solid var(--color-border)',
          }}
        >
          Modulus — built to teach, built to last.
        </footer>
      </body>
    </html>
  )
}
