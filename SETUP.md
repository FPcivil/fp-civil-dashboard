# F&P Civil Project Hub — Setup Guide

## Quick Start (15 minutes)

### Step 1: Supabase Setup
1. Go to https://supabase.com and sign in (or create account)
2. Create a new project (or use your existing one: `kjpeenclbelrksbpjwse`)
3. Go to **SQL Editor** and paste the entire contents of `supabase/schema.sql`
4. Click **Run** — this creates all tables, views, triggers, and seed data
5. Go to **Settings → API** and copy:
   - Project URL (e.g. `https://xyz.supabase.co`)
   - `anon` public key

### Step 2: Supabase Auth
1. Go to **Authentication → Settings**
2. Enable **Email** sign-in
3. Go to **Authentication → Users** and create your first user:
   - Email: `paul@formpour.com`
   - Password: (choose one)
4. Link that user to the team_members table:
   ```sql
   UPDATE team_members
   SET auth_user_id = 'THE-AUTH-USER-UUID-FROM-STEP-3'
   WHERE email = 'paul@formpour.com';
   ```

### Step 3: Local Development
```bash
cd fp-dashboard
cp .env.local.example .env.local
# Edit .env.local with your Supabase URL and anon key

npm install
npm run dev
```
Open http://localhost:3000

### Step 4: Deploy to Vercel
1. Push the `fp-dashboard` folder to a GitHub repo
2. Go to https://vercel.com, import the repo
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy — your team can access via the Vercel URL

### Step 5: Add Team Members
1. In Supabase Auth, create accounts for each team member
2. In the app's Team page, add each person
3. Link their auth IDs using the SQL above

---

## File Structure

```
fp-dashboard/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # Dashboard home
│   │   ├── layout.tsx          # Root layout with sidebar
│   │   ├── globals.css         # Tailwind + custom styles
│   │   ├── login/page.tsx      # Login page
│   │   ├── projects/
│   │   │   ├── page.tsx        # Projects list
│   │   │   └── [id]/page.tsx   # Project detail (tabbed)
│   │   ├── tasks/page.tsx      # Task board (kanban + list)
│   │   ├── variations/page.tsx # Variations register
│   │   ├── rfis/page.tsx       # RFI register
│   │   ├── issues/page.tsx     # Issues & blockers
│   │   ├── daily-updates/
│   │   │  ├── page.tsx        # Update history
│   │   │  └── new/page.tsx    # New daily update form
│   │   ├── team/page.tsx       # Team members
│   │   └── settings/page.tsx   # Settings + sign out
│   ── components/            # Shared UI components
│   │   ├── Sidebar.tsx         # Desktop sidebar + mobile nav
│   │   ├── PageHeader.tsx      # Page title + action
│   │   ├── KpiCard.tsx         # Dashboard stat card
│   │   └── StatusBadge.tsx     # Coloured status chip
│   │   ├── ProgressBar.tsx     # Progress bar
│   │   ├── PriorityDot.tsx     # Priority indicator
│   │   ├── Modal.tsx           # Slide-up modal
│   │   ├── FormField.tsx       # Form helpers + Button
│   │   ├── EmptyState.tsx      # Empty state placeholder
│   ├── hooks/
│   │   └── useSupabase.ts      # Data fetching + mutations
│   ├── lib/
│   │   ├── supabase-client.ts  # Browser Supabase client
│   │   ├── supabase-server.ts  # Server Supabase client
│   │   ├── database.types.ts   # TypeScript types
│   │   ├── constants.ts        # Status/priority options
│   │   └── utils.ts            # Formatting helpers
│   └── middleware.ts           # Auth route protection
├── supabase/
│   └── schema.sql              # Full database schema
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

---

## Adding Automations (Stage 2)

### Supabase Edge Functions
Create overdue-check function:
```sql
-- Run daily via Supabase cron
select cron.schedule(
  'flag-overdue-tasks',
  '0 6 * * *',  -- 6am daily
  $$
    -- Tasks
    UPDATE tasks SET updated_at = now()
    WHERE due_date < current_date AND status NOT IN ('done');
  $$
);
```

### Supabase Realtime (live updates)
The `useSupabase` hooks can be extended with Supabase Realtime subscriptions so the dashboard updates live when another team member makes changes.

---

## Cost Estimate

| Service | Free Tier | Paid |
|---------|-----------|------|
| Supabase | 50,000 rows, 500MB, 50,000 auth users | $25/mo |
| Vercel | Unlimited personal, 100GB bandwidth | $20/mo/member |
| **Total for a team of 6** | **$0** (free tiers sufficient) | **$45/mo** if you outgrow free |
