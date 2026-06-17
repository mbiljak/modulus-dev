# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Node is managed by **mise** (see `mise.toml`). Prefix all npm commands:

```bash
/opt/homebrew/bin/mise exec node@22 -- npm run dev      # local dev server
/opt/homebrew/bin/mise exec node@22 -- npm run build    # prebuild (search index) + next build → .next/
/opt/homebrew/bin/mise exec node@22 -- npm run lint     # ESLint
```

`npm run build` automatically runs `scripts/build-search-index.ts` first via the `prebuild` hook. Vercel runs this natively — no static export needed.

## Architecture

### Content pipeline

All content lives in `content/topics/<topic-slug>/`. Files are sorted alphabetically, so lessons are numbered (`01-`, `02-`, …) to control order. Each topic directory may have an optional `_meta.json` for display title and description; if absent, the title is derived from the slug.

`src/lib/content.ts` is the single entry point for all content access:
- `getAllTopics()` — reads topic directories + `_meta.json`, calls `getLessonsForTopic` for each
- `getLessonsForTopic(slug)` — reads frontmatter only via `gray-matter` (fast, no MDX compile)
- `getLessonBySlug(topic, lesson)` — full compile via `next-mdx-remote/rsc`'s `compileMDX`, returns rendered React element + adjacent lesson metadata for prev/next nav
- `getAllLessons()` — flat list used only by the search prebuild script

### Routing

Every dynamic route (`/topics/[topic]`, `/topics/[topic]/[lesson]`) exports `generateStaticParams()` which calls into `content.ts`. Vercel pre-renders these at build time. No API routes exist.

### MDX compilation

Each lesson is compiled with:
- `remark-gfm` (tables, strikethrough)
- `rehype-slug` + `rehype-autolink-headings` (heading anchor IDs for ToC)
- `rehype-pretty-code` with Shiki, theme `one-dark-pro`, `defaultLang: 'c'`

The code block background is controlled by `--color-bg-overlay` in CSS, not Shiki (`keepBackground: false`).

### Search

`scripts/build-search-index.ts` runs at prebuild and writes `public/search-index.json` — a flat array of `SearchDocument` objects with stripped plain text. `src/components/SearchBox.tsx` (`"use client"`) lazy-imports FlexSearch on first focus, fetches the JSON, and builds an in-memory inverted index. No server involved.

### Theme / styling

Design tokens are CSS custom properties in `src/app/globals.css` (`--color-bg-base`, `--color-accent-bright`, etc.). Tailwind's theme extension in `tailwind.config.ts` maps these to utility classes (`bg-bg-surface`, `text-accent-bright`, …). Always use the CSS variable utilities rather than raw hex colours so the palette stays consistent. The `prose` class comes from `@tailwindcss/typography`; overrides are in `globals.css` under `/* Prose customisation */`.

### Frontmatter schema

Required fields for every MDX lesson:

```yaml
---
title: "Lesson Title"
description: "One sentence shown in listings and search results."
date: YYYY-MM-DD
tags: [tag1, tag2]
topic: topic-slug          # must match parent directory name
order: 1                   # controls lesson ordering
difficulty: beginner       # beginner | intermediate | advanced
---
```

### Adding a new topic

1. Create `content/topics/<slug>/` with a `_meta.json` (`{ "title": "…", "description": "…" }`)
2. Add `.mdx` files numbered from `01-`
3. No code changes needed — `getAllTopics()` picks up new directories automatically

## Deployment

Vercel native GitHub integration reads `vercel.json`. Push to `main` triggers a build. The `prebuild` script runs in Vercel's build environment — no extra CI config needed.
