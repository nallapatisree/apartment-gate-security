# Green Valley Residency — Gate Security Management System

A working prototype of the apartment gate security system, built with **Next.js 14, TypeScript and Tailwind CSS**.

It covers the full MVP scope from the spec: admin / guard / resident logins, flats & blocks,
resident management, visitor entry + resident approval/rejection, visitor exit, delivery
management, vehicle management, pre-approved visitors, household staff, a block list,
notifications, dashboards for all three roles, and CSV reports.

**There is no backend or database to configure.** All data lives in the browser
(`localStorage`), seeded with a small demo dataset on first load. That means:
- Zero environment variables, zero API keys, zero setup cost.
- It deploys to Vercel with no configuration and won't fail a build for missing services.
- Data is per-browser — clearing site data resets it back to the demo seed.

This keeps the first deployable version simple and free to run. Wiring it to a real
database (e.g. Firebase, as the spec proposes) is a natural next step once the flows
are approved — see "Going further" below.

## Demo logins

| Role     | How to sign in                                           |
|----------|------------------------------------------------------------|
| Admin    | Username `admin`, password `admin123`                     |
| Guard    | Pick any guard from the dropdown, any password (3+ chars) |
| Resident | Pick any resident from the dropdown, any password (3+ chars) |

Try this flow to see the whole loop: sign in as **Guard → New Visitor**, register someone
against flat A-203, then open a second (private/incognito) browser tab, sign in as
**Resident → Rahul Kumar**, and approve or reject them from the dashboard.

## Run it locally

Requires [Node.js](https://nodejs.org) 18 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Deploy to Vercel (no errors, no config)

**Option A — Vercel dashboard (easiest)**
1. Push this folder to a new GitHub repository.
2. Go to https://vercel.com/new and import that repository.
3. Vercel auto-detects Next.js. Leave every setting on default.
4. Click **Deploy**. No environment variables are needed.

**Option B — Vercel CLI**
```bash
npm i -g vercel
vercel        # first deploy, follow the prompts
vercel --prod # subsequent production deploys
```

### If the build fails on Vercel
This project pins exact dependency versions in `package.json` specifically so the
Vercel build installs the same versions every time — if you see an install error,
double-check you didn't hand-edit version numbers there. Beyond that, the most common
causes on a fresh Next.js project are: a Node version below 18 (set it in Vercel
Project Settings → General → Node.js Version), or leftover local-only files — this repo's
`.gitignore` already excludes `node_modules` and `.next` so they won't be committed.

## Project structure

```
app/
  login/            Role-based sign-in
  admin/             Admin console: dashboard, residents, flats, guards, vehicles, visitor log + block list, reports
  guard/             Guard console: dashboard, new visitor, visitor log, deliveries, pre-approved check-in
  resident/          Resident console: dashboard, approvals, pre-approve, history, vehicles, household staff
lib/
  types.ts          Shared data model
  seed.ts           Demo apartment / residents / guards / vehicles
  store.ts          Zustand store — all read/write logic, persisted to localStorage
  auth.tsx          Mock session/auth context
components/
  AppShell.tsx      Sidebar + topbar + notifications, shared by all three roles
  ui.tsx            Buttons, cards, badges, form fields, modal
```

## Going further (not built yet, by design)

The spec's "Future Enhancements" section — QR passes, face recognition, ANPR, RFID,
boom barrier / CCTV integration, real push/SMS/WhatsApp notifications, a real Firebase
or Postgres backend with proper authentication — are all intentionally left out of this
first version to keep it lean and free to host. Each is a scoped follow-up once the
flows here are signed off.
