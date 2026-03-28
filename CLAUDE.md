# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**ProjectHub** — Project Management SaaS built with Next.js 15, React 19, TypeScript, Stripe billing, JWT auth, and Drizzle ORM on Supabase (PostgreSQL). Features: project/task management, contact/client management, team collaboration, dashboard analytics, and CSV/PDF report export.

All pages are wired to **real Supabase data**. Mock data file (`lib/db/mock-data.ts`) exists but is no longer used.

**Design:** Refined editorial aesthetic — dark slate (`bg-gray-900`) for primary CTAs and authority sections, orange used sparingly (gradient accent text only). Sticky header with blur backdrop. Split-layout auth pages. Landing page has alternating feature sections with mock product UI, social proof, stats, and dark CTA section.

## Commands

```bash
pnpm dev              # Dev server (Turbopack)
pnpm build            # Production build
pnpm db:setup         # Interactive Postgres + Stripe setup
pnpm db:generate      # Generate Drizzle migrations after schema changes
pnpm db:migrate       # Run migrations
pnpm db:seed          # Seed with test data (test@test.com / admin123)
pnpm db:studio        # Drizzle Studio GUI
```

No test or lint scripts are configured.

## Architecture

### Routing

**App Router** with two route groups:
- `(login)/` — auth pages (`/sign-in`, `/sign-up`) and auth server actions in `actions.ts`
- `(dashboard)/` — protected pages with shared header layout

**Dashboard routes**:
- `/dashboard` — overview with KPI cards, recent tasks, upcoming deadlines
- `/dashboard/projects` — project list; `/dashboard/projects/[id]` — project detail with tasks
- `/dashboard/tasks` — all tasks across projects (filterable by status/priority/assignee)
- `/dashboard/contacts` — contact list; `/dashboard/contacts/[id]` — contact detail
- `/dashboard/reports` — report generation and CSV export
- `/dashboard/settings/*` — team, general, activity, security settings
- `/pricing` — free vs Pro tier comparison

### Page Pattern

Every page follows: async **server component** (`page.tsx`) fetches data and checks auth → passes props to **client component** (`*-list.tsx` or `*-client.tsx`) that uses `useActionState` for mutations via server actions. Create forms use shadcn `Dialog` components.

**Public pages** (landing, pricing, auth) are in the `(dashboard)/` and `(login)/` route groups with a shared sticky header. Landing page (`app/(dashboard)/page.tsx`) is a marketing page with hero, features, social proof, stats, CTA, and footer. Auth pages (`app/(login)/login.tsx`) use a split layout with benefits panel.

### Auth

JWT (HS256 via `jose`) stored in httpOnly cookies. Global middleware (`middleware.ts`) protects `/dashboard` routes and auto-refreshes tokens on GET requests. Session expires after 24 hours.

### Server Actions

Wrapped with validation decorators from `lib/auth/middleware.ts`:
- `validatedAction` — Zod schema validation on FormData
- `validatedActionWithUser` — adds auth requirement
- `withTeam` — adds team context to the action

Action files:
- `app/(login)/actions.ts` — auth, account, team management
- `lib/actions/projects.ts` — createProject, updateProject, deleteProject
- `lib/actions/tasks.ts` — createTask, updateTaskStatus, deleteTask
- `lib/actions/contacts.ts` — createContact, deleteContact

### Database

Drizzle ORM with Supabase (PostgreSQL). Schema in `lib/db/schema.ts`, queries in `lib/db/queries.ts`. Connection configured in `lib/db/drizzle.ts` with `max: 1` pool limit (Supabase free tier session pooler constraint).

**Core tables**: `users`, `teams`, `teamMembers`, `activityLogs`, `invitations`

**PM tables**: `projects`, `tasks`, `contacts`, `comments`, `labels`, `taskLabels` (join), `contactProjects` (join)

All PM queries are scoped by `teamId` for multi-tenant isolation. Activity logging via `activityLogs` table in server actions.

### Payments & Pricing

14-day free trial with full features → Pro plan ($12/mo). After trial expires without subscription: limited to 3 projects, 20 tasks, 10 contacts, no export.

- Trial tracked via `trialEndsAt` on `teams` table
- Limits enforced via `lib/payments/limits.ts` — checked in all create actions
- Stripe checkout via `lib/payments/actions.ts`, webhook at `app/api/stripe/webhook/route.ts`
- Pro product created in Stripe with 14-day trial

### Export

- **CSV**: Client-side export from `app/(dashboard)/dashboard/reports/reports-client.tsx` using real DB data
- **PDF**: `window.print()` from reports page (no extra dependency)

### UI

shadcn/ui components (New York style, Zinc color) in `components/ui/`. Uses `@/` path alias mapping to project root. Icons from `lucide-react`.

Available shadcn components: button, input, label, card, avatar, dropdown-menu, radio-group, table, dialog, select, badge, tabs, textarea, separator, progress, tooltip.

**Header** (`app/(dashboard)/layout.tsx`): Sticky with scroll-aware blur backdrop. Dark square logo. Mobile hamburger menu. Features anchor link for landing page. User dropdown with Dashboard, Settings, Sign out.

**Color conventions**: `bg-gray-900` for primary buttons and dark sections. Orange only as gradient accent (`from-orange-500 to-amber-500`) in hero text. Feature icons use contextual colors (orange, blue, violet, emerald). Pricing uses `border-gray-900` for the recommended plan.

## Environment Variables

Required: `POSTGRES_URL`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `BASE_URL`, `AUTH_SECRET`

`POSTGRES_URL` uses the Supabase session pooler connection string (not direct connection — IPv6 unreachable from this environment).

## PR Comments

When addressing PR comments, use `gh` CLI with `| cat` to get comments:
```bash
gh pr list --head $(git branch --show-current) | cat
gh api repos/:owner/:repo/pulls/PR_NUMBER/comments --jq '.[] | {author: .user.login, body: .body, path: .path, line: .line}' | cat
```
