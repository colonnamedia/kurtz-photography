# Kurtz Photography Website

A Vite/React photography website for Kurtz Photography, serving Pittsburgh,
Burgettstown and Western Pennsylvania. The site is designed to drive inquiries for
weddings, engagements, senior pictures, fall minis and business shoots.

Pages: **Home · Portfolio · Weddings · About · Contact · Links** + an **/admin** owner dashboard.

## Stack

- **Frontend:** Vite + React + React Router
- **Backend:** Vercel serverless functions (`/api`) — single repo, single deploy
- **Database:** Neon (Postgres)
- **Email:** Resend (contact-form notifications)
- **Auth:** password + JWT (no third-party auth service)

> Demo mode: with no database configured, the public site still renders using the
> seed content in `src/lib/seed.js`. The admin's **Preview the dashboard** button
> also demonstrates link editing locally in the browser.

## Admin and buyer database plan

For new sales, use the Supabase setup documented in
[`ADMIN_DATABASE_HANDOFF.md`](ADMIN_DATABASE_HANDOFF.md). It covers the owner login,
links and inquiries tables, image storage, Row Level Security and the post-sale
connection checklist. The older Neon/API files remain only as a reference implementation.

---

## 1. Run locally

```bash
npm install
npm run dev          # frontend on http://localhost:5173
```

The frontend proxies `/api` to a local Vercel dev server. To run the API locally too:

```bash
npm i -g vercel
vercel dev           # serves /api on http://localhost:3000
```

Put your secrets in `.env` (copy from `.env.example`).

## 2. Database (Neon)

1. Create a project at neon.tech and copy the **pooled** connection string into `DATABASE_URL`.
2. Open the Neon SQL editor and run everything in [`db/schema.sql`](db/schema.sql).
3. (Optional) Seed the demo links: `node db/seed.mjs`

## 3. Email (Resend) — optional

1. Add and verify your domain in Resend, create an API key.
2. Set `RESEND_API_KEY`, `FROM_EMAIL` (on the verified domain), and `OWNER_EMAIL`.

The contact form works without email — inquiries are always saved to the database
and visible in the dashboard. Email just adds a notification.

## 4. Deploy (Vercel)

```bash
git init && git add . && git commit -m "Creator site"
# push to GitHub, then "Import Project" in Vercel
```

In Vercel → **Settings → Environment Variables**, add: `DATABASE_URL`, `ADMIN_PASSWORD`,
`JWT_SECRET`, and (optional) `RESEND_API_KEY`, `FROM_EMAIL`, `OWNER_EMAIL`. Redeploy.

Vercel auto-detects Vite (build `vite build`, output `dist`) and the `/api` functions.

---

## Portfolio images

The current portfolio is stored in `public/images/kurtz/portfolio`. Replace files
there while keeping the filenames to update the full site without changing code.
Page metadata and the temporary Vercel canonical domain are in `index.html` and
`src/components/Seo.jsx`; change both when the final custom domain is connected.

## Admin

- Visit `/admin`, sign in with `ADMIN_PASSWORD`.
- **Links tab:** add/edit/delete, drag-free reorder (↑/↓), pin a link to render it as a
  large cover card, upload a photo (auto-resized to ~1200px and stored in the DB).
- **Inquiries tab:** every contact-form submission, newest first.

### Image storage note
The preview dashboard saves link changes in browser storage. After sale, connect
Supabase Auth, Postgres and Storage as specified in `ADMIN_DATABASE_HANDOFF.md`.

## Want the Render split instead?
The `/api` folder is plain Node handlers. To match the usual Vercel-frontend /
Render-backend setup, move `/api` into a small Express app on Render (one route per
file), set `VITE` to call that backend's URL, and deploy the frontend to Vercel as a
static site. The DB and email code is unchanged.
