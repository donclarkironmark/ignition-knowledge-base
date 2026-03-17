# Ignition Knowledge Base — Pipeline Status

## Feature Intent

Build an internal knowledge website that surfaces ~799 markdown documents from the product-management repo. Searchable, branded, Supabase-authenticated. Audience: Sales, Marketing, Account Managers, executives.

## Architecture Decisions

- **Content ingestion**: Build-time GitHub API fetch via `scripts/sync-content.ts`
- **Search**: Client-side FlexSearch index, lazy-loaded
- **Navigation**: SUMMARY.md editorial structure + auto-discovery of uncurated files
- **Auth**: Shared Supabase project (same as PM app)
- **Deploy**: Manual trigger via `/deploy-kb` skill in PM repo
- **Stack**: Next.js 16, React 19, TypeScript 5.9, Tailwind 3.4, shadcn/ui patterns

## Status

| Step | Stage | Status | Agent | Artifact |
|------|-------|--------|-------|----------|
| 0 | Pipeline setup | COMPLETE | orchestrator | pipeline.md, CLAUDE.md, repo scaffold |
| 1 | Research | PENDING | researcher | 01-research/brief.md |
| 2 | PO-1: Review research | BLOCKED | orchestrator | — |
| 3 | Requirements (PM-A) | BLOCKED | product-manager | 02-requirements/draft.md |
| 4 | Requirements challenge (PM-B) | BLOCKED | product-manager-reviewer | 02-requirements/challenge.md |
| 5 | Requirements consolidation | BLOCKED | requirements-consolidator | 02-requirements/approved.md |
| 6 | PO-2: Review requirements | BLOCKED | orchestrator | — |
| 7 | Don reviews requirements | BLOCKED | human | — |
| 8 | Spec + Test plan | BLOCKED | architect + test-writer | 03-spec/spec.md, 04-tests/test-plan.md |
| 9 | PO-3: Review spec + tests | BLOCKED | orchestrator | — |
| 10 | Validation gate | BLOCKED | requirements-validator | 05-validation/spec.md |
| 11 | PO-4: Review validation | BLOCKED | orchestrator | — |
| 12 | Write failing tests (TDD) | BLOCKED | test-writer | test files |
| 13 | Implementation (layered) | BLOCKED | implementer | source files |
| 14 | Test execution | BLOCKED | test-writer | test results |
| 15 | Code review + validation | BLOCKED | code-reviewer + validator | 06-review/, 05-validation/ |
| 16 | PO-5: Review quality | BLOCKED | orchestrator | — |
| 17 | Final gate | BLOCKED | requirements-validator | 05-validation/final.md |
| 18 | Delivery | BLOCKED | delivery-writer | 07-results/recap.md, manual-tests.md |

## Step Log

### Step 0 — Pipeline Setup (Orchestrator)
- Created repo: github.com/donclarkironmark/ignition-knowledge-base
- Scaffolded Next.js 16 project (TypeScript, Tailwind, App Router, pnpm)
- Created pipeline directory structure
- Created CLAUDE.md
- Next: Run researcher agent (Step 1)
