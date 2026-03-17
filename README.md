# WorkRadar

**AI-powered job discovery platform — finds jobs for you the way Spotify discovers music.**

## What is WorkRadar?

Instead of keyword search on job boards, WorkRadar learns your taste, scans everywhere, and surfaces hidden gems — factoring in visa status, remote preferences, culture fit, career trajectory, and AI-displacement reskilling paths.

**Core Insight:** LinkedIn shows you jobs. Indeed searches jobs. WorkRadar *discovers* jobs for you.

## Architecture

```
workradar/
├── apps/
│   ├── web/        — Next.js 15 (App Router) + Tailwind + shadcn/ui
│   ├── mobile/     — Expo 52 + React Native
│   └── pipeline/   — Python job ingestion + AI matching engine
├── packages/
│   ├── shared/     — TypeScript types, validation (Zod)
│   ├── supabase/   — Database schema, migrations, client
│   ├── ui/         — Shared UI components
│   └── ai/         — AI utilities (embeddings, parsing, matching, coaching)
```

## Features

- **Discovery Feed** — AI-matched job cards ranked by fit score
- **Radar Scans** — Always-on job monitoring with custom filters
- **Visa Intelligence** — H-1B sponsorship data from DOL filings
- **Career Coach** — AI chat for career guidance and interview prep
- **Reskilling Paths** — AI displacement risk analysis + learning paths
- **Application Tracker** — Kanban pipeline from interested → offer
- **7 Job Sources** — HN, Greenhouse, Lever, Ashby, RemoteOK, WeWorkRemotely + more
- **Mobile App** — Swipe-based discovery (Tinder for jobs)

## Tech Stack

- **Web**: Next.js 15, TypeScript, Tailwind CSS, Framer Motion
- **Mobile**: Expo 52, React Native, Reanimated
- **Backend**: Supabase (PostgreSQL + pgvector + Auth + RLS)
- **AI**: Claude (Bedrock), OpenAI Embeddings, pgvector similarity search
- **Pipeline**: Python, httpx, BeautifulSoup, Playwright

## License

© 2026 Officethree Technologies Private Limited. All Rights Reserved.
