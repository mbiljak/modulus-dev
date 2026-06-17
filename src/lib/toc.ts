export interface TocEntry {
  id: string
  text: string
  level: number
}

export function extractToc(source: string): TocEntry[] {
  const headingRe = /^(#{2,4})\s+(.+)$/gm
  const entries: TocEntry[] = []

  let match: RegExpExecArray | null
  while ((match = headingRe.exec(source)) !== null) {
    const level = match[1].length
    const text = match[2].replace(/[`*_]/g, '').trim()
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
    entries.push({ id, text, level })
  }

  return entries
}
