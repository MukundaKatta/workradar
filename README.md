# workradar

> AI job discovery with Spotify-style 'for you' taste profile — tell it what you liked and disliked, it finds jobs you'd apply to.

![status](https://img.shields.io/badge/status-active_planning-blue)
![license](https://img.shields.io/badge/license-MIT-green)
![backlog](https://img.shields.io/badge/backlog-see_DESIGN.md-orange)

## What this is

LinkedIn shows you jobs based on title keywords and seniority matching. That's a coarse filter that misses everything about fit — culture, tech stack, team size, remote policy, compensation band, growth trajectory. You end up scrolling through 90% noise.

**Read the full [DESIGN.md](./DESIGN.md)** for problem statement, user personas, architecture, and roadmap.

## Status

**Active planning / pre-alpha.** The design is scoped (see DESIGN.md). Code is minimal — this repo is the home for the first real implementation, not a placeholder.

## MVP (v0.1) — what ships first

- Job feed UI with swipe/save/apply actions
- LLM extraction of: company stage, stack, remote policy, comp band, team size
- Taste profile = average of saved-job embeddings
- Ranked feed = cosine similarity of new jobs against taste profile

## Stack

- Next.js 14 monorepo (apps/web, apps/api)
- TypeScript throughout
- Supabase (auth + Postgres)
- Anthropic API for job-posting extraction (company size, stack, remote policy)
- pgvector for taste-profile similarity

See [DESIGN.md](./DESIGN.md#planned-stack) for complete stack rationale.

## Quick start

```bash
git clone https://github.com/MukundaKatta/workradar.git
cd workradar
# See DESIGN.md for full architecture
```


## Roadmap

| Version | Focus |
|---------|-------|
| v0.1 | MVP — see checklist in [DESIGN.md](./DESIGN.md) |
| v0.2 | 'Why this?' explainability panel |
| v0.3 | Email digest and saved-search alerts |

Full roadmap in [DESIGN.md](./DESIGN.md#roadmap).

## Contributing

Open an issue if:
- You'd use this tool and have a specific use case not covered
- You spot a design flaw in DESIGN.md
- You want to claim one of the v0.1 checklist items

## See also

- [My other projects](https://github.com/MukundaKatta)
- [mukunda.dev](https://mukunda-ai.vercel.app)
