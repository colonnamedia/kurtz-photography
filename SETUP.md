# Setup — getting the site (and the links admin) live

> **Current product direction:** New buyers should be connected to Supabase after
> purchase. Follow [`ADMIN_DATABASE_HANDOFF.md`](ADMIN_DATABASE_HANDOFF.md). The
> Neon instructions below document the original reference backend only.

The public site runs immediately with the demo content in `src/lib/seed.js`.
The **admin + links page** need three things: a database, a password, and a
deploy. Here's the whole path.

## 1. Local preview (optional)

```bash
npm install
npm run dev        # http://localhost:5173
```

Copy `.env.example` to `.env` and fill it in if you want the admin working
locally too.

## 2. Create the database (Neon — free tier is fine)

1. Make a project at neon.tech and open the **SQL Editor**.
2. Paste the contents of `db/schema.sql` and run it. That creates the `links`
   and `leads` tables.
3. Copy the **pooled** connection string — that's your `DATABASE_URL`.

## 3. Deploy (Vercel)

1. Import the repo into Vercel (it auto-detects Vite; `vercel.json` handles
   routing so `/admin` and deep links work).
2. In **Project → Settings → Environment Variables**, add:

   | Variable | Required | Notes |
   |---|---|---|
   | `DATABASE_URL` | yes | Neon pooled connection string |
   | `ADMIN_PASSWORD` | yes | Your studio login password |
   | `JWT_SECRET` | yes | Any long random string |
   | `RESEND_API_KEY` | no | Only for contact-form emails |
   | `FROM_EMAIL` | no | Verified Resend sender |
   | `OWNER_EMAIL` | no | Where inquiries are emailed |

3. Deploy.

## 4. Set up your links page

1. Go to `/admin` and sign in with `ADMIN_PASSWORD`.
2. On the **Links** tab:
   - **Add link** — title, optional subtitle, URL, and a thumbnail (upload one
     right in the form — it's compressed and stored automatically).
   - **Pin** a link to show it as a large cover card at the top of the page.
   - Reorder with the up/down arrows; edit or delete anytime.
3. Visit `/links` to see it live. Until you add links, the page shows the demo
   set from `seed.js`.

The **Inquiries** tab collects every contact-form submission.

## Notes

- No database yet? The site still works — it falls back to the demo links.
- Link thumbnails uploaded in the admin are stored inline in the database. If you
  later move to Cloudinary/R2 for image hosting, that only changes how uploads
  are saved; nothing else moves.
- To rebrand: edit `src/lib/seed.js` (all copy + content) and the `:root` colors
  at the top of `src/index.css`. Swap photos in `public/images/`.
