# Claude Code Routines — Ignition Insider

Three scheduled Claude Code sessions power the Insider feed's automated
research and edition assembly. Each runs in Anthropic's cloud, clones this
repo fresh, and talks to the deployed KB app via HTTPS.

| # | Routine | Schedule (UTC) | What it does |
|---|---|---|---|
| 1 | [Daily Competitor Scan](./01-daily-competitor-scan.md) | `0 11 * * *` (daily 11:00 UTC / 7am ET) | Searches web for news on top DMP competitors, drafts posts, POSTs to `/api/insider/admin/posts` as `status=review` |
| 2 | [Weekly Category & MarTech Scan](./02-weekly-category-scan.md) | `0 10 * * 1` (Monday 10:00 UTC / 6am ET) | Broader scan of industry trends and vertical news, same POST pattern |
| 3 | [Friday Edition Prep](./03-friday-edition-prep.md) | `0 19 * * 5` (Friday 19:00 UTC / 3pm ET) | Reads the week's published posts from Supabase, drafts an edition, POSTs to `/api/insider/admin/editions` as `status=draft` |

All three Routines write to the same deployed KB app and share the same env vars.
None of them ever publish anything — everything lands in a draft/review state
so Don approves before subscribers see it.

---

## One-time setup

### 1. Prerequisite: the app must be deployed

Routines can only reach the app over the public internet. Before creating
any Routine, confirm the app is deployed on Vercel and the following URL
returns `{"posts":[],"total":0,"page":1,"pageSize":10}` (empty list, HTTP 200):

```bash
curl https://YOUR-VERCEL-URL/api/insider/posts
```

### 2. Go to claude.ai/code/routines

Open https://claude.ai/code/routines and click **New Routine**.

### 3. Connect the GitHub repo

Connect `donclarkironmark/ignition-knowledge-base` (the Github repo for Ignition Insider; rename pending). All three Routines use
the same repo — no code in the repo is used by the routine prompts directly,
but connecting it gives the Routine a working directory and lets it commit
back if needed in the future.

### 4. Configure the cloud environment

Environment variables live on a **cloud environment**, which is shared
across all Routines that reference it (same system as Claude Code on the
Web — see [docs](https://code.claude.com/docs/en/claude-code-on-the-web#the-cloud-environment)).
Configure it once; all three Routines inherit.

**Click path:** at `claude.ai/code/routines`, click **New routine**. In the
**"Select an environment"** section, pick an existing environment (the
default one is fine) or create a new one, then click the **gear / settings
icon** next to its name. A dialog appears with an **Environment variables**
field that accepts `.env` format — one `KEY=value` per line, no quotes.

Paste this block:

```
APP_URL=https://YOUR-VERCEL-URL
INSIDER_SERVICE_TOKEN=174b24d56b25f1200aa3b36279a51820945c4a78456e8e2fa4f0872b1e3adec6
SUPABASE_URL=https://pzwxjfgireeumrspkjvm.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6d3hqZmdpcmVldW1yc3BranZtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjQyMzgxMywiZXhwIjoyMDkxOTk5ODEzfQ.vh5NV2vBEtG2g9nfCy4vX61_qGL3rX20YX3VZtNTTlA
```

Summary of what each does:

| Variable | Used by |
|---|---|
| `APP_URL` | All 3 — base URL for POSTs to the KB app |
| `INSIDER_SERVICE_TOKEN` | All 3 — bearer token for admin POSTs |
| `SUPABASE_URL` | Routine 3 only — reads posts directly |
| `SUPABASE_SERVICE_ROLE_KEY` | Routine 3 only |

> **About secret storage.** Anthropic notes that a dedicated secrets store
> isn't yet available — environment variables are stored with the environment
> configuration and are visible to anyone who can edit that environment. For
> a two-person admin set that's fine; revisit if the environment becomes
> shared broadly.
>
> Secrets are write-only after save — to change a value you delete the entry
> and add it back.

> **Security note.** The `INSIDER_SERVICE_TOKEN` bypasses session auth — it
> grants write access to the Insider admin API. The `SUPABASE_SERVICE_ROLE_KEY`
> bypasses RLS entirely. Treat both as production secrets. If either leaks,
> rotate (`openssl rand -hex 32` for the service token; regenerate the
> service_role key in the Supabase dashboard).

### 5. Create each Routine

For each of the three routines:

1. Click **New Routine**.
2. Paste the name from the table above.
3. Paste the schedule (e.g. `0 11 * * *`).
4. Paste the prompt from the corresponding `.md` file in this directory
   (just the prompt text, not the YAML header).
5. Save.

### 6. Manual first run

On each Routine, click **Run now** to test. Watch the transcript:

- **Routine 1** should create 2–5 draft posts. Verify by visiting
  `/insider/admin` → Review Queue.
- **Routine 2** should create 3–8 posts. Same verification.
- **Routine 3** requires the week's feed to have some published posts.
  If the feed is empty, the Routine will report `no_posts_to_bundle` and exit.

---

## Troubleshooting

**Routine reports `409 duplicate source_url`** — working as designed. The
Insider API dedups by `source_url`, so re-running a Routine in the same day
produces skips rather than duplicates.

**Routine reports `Unknown tags`** — the Routine tried to use a tag name
that isn't in the seeded vocabulary. Either update the Routine prompt's tag
list, or seed the missing tag in Supabase (`insider_tags` table).

**All POSTs return 401** — either `INSIDER_SERVICE_TOKEN` is wrong in the
environment, or the app's `INSIDER_SERVICE_TOKEN` env var doesn't match.
Both must be the same string.

**Routine silently produces zero posts** — check the transcript. Common
causes: WebSearch returned nothing in the last 24 hours (legitimate);
relevance threshold filtered everything out; the auto-publish "So What"
check failed for every draft (drafts without that section route to review
anyway, not to nothing — if none appear, the issue is earlier).

---

## Cost / frequency tuning

Routines run as full Claude Code sessions — they count against the same
usage budget as interactive sessions. A 5-minute Daily Scan session running
365 times a year is ~30 hours of Claude usage annually. If that's more
than desired:

- Relax the schedule on Routine 1 to `0 11 * * 1-5` (weekdays only)
- Merge Routine 1 + 2 into a single daily scan that rotates category focus
  (competitor Mon/Wed/Fri, category/martech Tue/Thu)
- Shorten the prompts to narrow scope (fewer competitors, tighter time
  window, no tag inference)
