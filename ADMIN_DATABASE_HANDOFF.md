# Kurtz Photography Admin — Supabase Handoff

The site already includes the complete owner-facing admin interface:

- `/admin` login screen
- `/admin/dashboard` owner dashboard
- add, edit, delete and reorder Linktree-style links
- pin featured links as large cover cards
- upload a thumbnail or cover image
- view contact and partnership inquiries
- public `/links` page populated from the managed links

Before a buyer is connected, **Preview the dashboard** opens a safe demonstration mode. Preview edits use browser storage on that device only. They are not shared or permanent.

## Recommended buyer setup

Use one Supabase project per sold website. The Supabase free tier is enough to launch a typical creator site.

### 1. Authentication

Use Supabase Auth with the buyer's email and password.

- Create the initial owner account during client onboarding.
- Disable open public sign-ups; this is an owner-only dashboard.
- Use Supabase password reset emails instead of storing a shared password in the code.
- Protect every admin write with Row Level Security (RLS), not only with hidden routes in React.

### 2. Database tables

#### `links`

| Column | Type | Purpose |
| --- | --- | --- |
| `id` | uuid, primary key | Unique link record |
| `owner_id` | uuid, references `auth.users` | Limits editing to the site owner |
| `title` | text | Main link label |
| `subtitle` | text, nullable | Optional supporting copy |
| `url` | text | Destination or affiliate URL |
| `image_url` | text, nullable | Supabase Storage image URL |
| `pinned` | boolean | Featured cover-card placement |
| `active` | boolean | Show or hide without deleting |
| `position` | integer | Manual display order |
| `created_at` | timestamptz | Creation time |
| `updated_at` | timestamptz | Last edit time |

#### `leads`

| Column | Type | Purpose |
| --- | --- | --- |
| `id` | uuid, primary key | Unique inquiry |
| `name` | text | Contact name |
| `email` | text | Contact email |
| `project_type` | text | Wedding, engagement, senior, fall mini, business, etc. |
| `message` | text | Inquiry details |
| `status` | text | `new`, `replied`, or `archived` |
| `created_at` | timestamptz | Submission time |

No separate profile table is required for a single-owner site. Add `site_settings` later only if the buyer needs to edit their bio, social accounts or homepage content from the dashboard.

### 3. Image storage

Create a Supabase Storage bucket named `link-images`. Store the actual images in Storage and save only each image URL in `links.image_url`. Do not store large base64 images in the database.

### 4. Row Level Security

Required policies:

- anyone may read links where `active = true`
- only the authenticated owner may create, edit, reorder or delete links
- anyone may submit a lead
- only the authenticated owner may read or update leads
- only the authenticated owner may upload, replace or delete files in `link-images`

### 5. Environment variables

Add these to the buyer's Vercel project, never to committed source:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Use a server-side Supabase key only if a future server function needs privileged work. Never expose a service-role key to the browser.

### 6. Conversion work after sale

1. Create the buyer's Supabase project and owner account.
2. Create the tables, indexes, Storage bucket and RLS policies.
3. Replace the current preview/legacy API client in `src/lib/api.js` with Supabase Auth and database calls.
4. Upload the buyer's real link images and seed their approved links.
5. Connect the contact form to `leads` and optionally send notifications through Resend.
6. Test login, logout, password reset, link CRUD, pinning, reordering, image uploads and inquiry access.
7. Remove the preview dashboard button before the buyer's production launch.

## What is not needed before a sale

- No paid database plan
- No shared master Supabase project
- No buyer password in GitHub
- No permanent demo data

This keeps the template presentable now and gives each purchaser a separate, secure database and login when the site is sold.
