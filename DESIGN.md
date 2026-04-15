# workradar — Design

> AI job discovery with Spotify-style 'for you' taste profile — tell it what you liked and disliked, it finds jobs you'd apply to.

## Problem

LinkedIn shows you jobs based on title keywords and seniority matching. That's a coarse filter that misses everything about fit — culture, tech stack, team size, remote policy, compensation band, growth trajectory. You end up scrolling through 90% noise.

workradar ingests job postings from many sources, enriches each with structured attributes (via LLM extraction), and builds a user-specific taste profile from their swipe signals ('apply' / 'skip' / 'save'). The recommendation engine is explicit about why: 'showing this because you liked 2 other series-B fintechs with Go backends.'

## Primary users

- Senior engineers doing passive job search who want curation without noise
- Recruiters building boutique matchmaking services (B2B api)
- Career coaches who want to show clients targeted postings

## Use cases

- Swipe through 20 jobs → profile learns 'likes: Go, remote-first, Series A-C, <200 people'
- Weekly email digest of the top 5 new fits
- Filter explainer: 'why these 5? Here's the vector similarity to the 3 you saved last month'
- Share a profile link with a recruiter who wants to send you relevant roles
- Export applied/interested jobs as CSV for your tracker

## Planned stack

- Next.js 14 monorepo (apps/web, apps/api)
- TypeScript throughout
- Supabase (auth + Postgres)
- Anthropic API for job-posting extraction (company size, stack, remote policy)
- pgvector for taste-profile similarity
- Daily ingestion jobs pulling Greenhouse/Ashby/Lever public feeds

## MVP scope (v0.1)

- [ ] Job feed UI with swipe/save/apply actions
- [ ] LLM extraction of: company stage, stack, remote policy, comp band, team size
- [ ] Taste profile = average of saved-job embeddings
- [ ] Ranked feed = cosine similarity of new jobs against taste profile

## Roadmap

- v0.2: 'Why this?' explainability panel
- v0.3: Email digest and saved-search alerts
- v0.4: Browser extension to swipe from LinkedIn/Greenhouse directly
- v1.0: B2B API for recruiters, whitelabel


## UI wireframe

```
┌────────────────────────────────────────────────┐
│ WorkRadar · 142 new jobs match your taste      │
├────────────────────────────────────────────────┤
│                                                │
│   Staff Engineer · Acme Fintech (Series B)     │
│   San Francisco · remote-friendly              │
│   Go · Kubernetes · $240k-$300k + equity       │
│                                                │
│   [ Why this? ▾ ]                              │
│   • 87% similar to "Staff SRE @ Plaid" (saved) │
│   • Matches: Series B, Go, remote-friendly     │
│                                                │
│   [  ×  Skip  ] [ ★ Save ] [ ✓ Apply ]         │
└────────────────────────────────────────────────┘
```


---

_This is a living design document. Status: **concept / active planning**. Follow progress at [github.com/MukundaKatta](https://github.com/MukundaKatta)._
