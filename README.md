# Ignition Insider

Internal product marketing website for Ironmark's Ignition platform — capability deep-dives, weekly competitive intelligence, and demo enablement. Audience: sales, marketing, account managers, executives.

> Repo name still says `ignition-knowledge-base` (legacy); the deployed site is branded **Ignition Insider**.

## Stack

- **Next.js 16** (App Router) + React 19 + TypeScript
- **Tailwind 4** with `@tailwindcss/typography`
- **jose** for JWT cookie auth (dual-password: viewer + admin)
- **Supabase** for the Intel & Insights feed (posts, editions, subscriptions)
- **OpenAI** for the "Suggest insight" admin helper
- **Nodemailer** for digest + alert emails
- **Vercel** deployment with weekly cron triggering the digest send

## Run locally

```bash
npm install
npm run dev          # http://localhost:3000
npm run typecheck
npm run build
```

Copy `.env.example` to `.env.local` and fill in values before running. The Insider feature requires Supabase credentials; static capability pages render without them.

## Project layout

- `src/app/(site)/` — authenticated pages (capabilities, resources, Intel & Insights)
- `src/app/api/insider/` — Insider feed + admin + cron API routes
- `src/lib/insider*.service.ts` — feed, edition, and email services
- `src/components/` — shared UI components and layout shell
- `src/config/navigation.ts` — sidebar nav (3 sections, capabilities listed in roadmap order)
- `docs/routines/` — setup + prompts for the three Claude Code Routines that populate the feed

## Routines

Three scheduled Claude Code Routines run autonomously to populate the feed:

1. **Daily Competitor Scan** — scans top DMP competitors for news
2. **Weekly Category & MarTech Scan** — broader industry scan
3. **Friday Edition Prep** — drafts the next weekly edition for review

Setup: see [`docs/routines/README.md`](docs/routines/README.md). All Routines POST to `/api/insider/admin/*` via the `INSIDER_SERVICE_TOKEN` bearer; nothing ever auto-publishes — drafts land in the review queue.

## Deploy

Vercel project auto-deploys from `master`. The Monday-morning digest cron is configured in [`vercel.json`](vercel.json) and uses `CRON_SECRET` for auth. After deploy, verify environment variables are set in the Vercel project settings (matches the [`.env.example`](.env.example) keys).
