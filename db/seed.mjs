// Optional: load the demo links into your database so the admin shows
// content out of the box. Run with:  node db/seed.mjs
// Requires DATABASE_URL in your environment (or a .env loaded by your shell).

import { neon } from '@neondatabase/serverless'

const SEED = [
  { title: 'Explore the Portfolio', subtitle: 'Weddings, engagements, seniors and more', url: '/portfolio', image: '/images/kurtz/portfolio/wedding-party.webp', pinned: true },
  { title: 'Inquire About Your Date', subtitle: 'Tell Amanda what you are planning', url: '/contact', image: '/images/kurtz/portfolio/engagement-field.webp', pinned: true },
  { title: 'Instagram', subtitle: '@kurtz_photos_', url: 'https://instagram.com/kurtz_photos_', image: '', pinned: false },
  { title: 'Senior Pictures + Fall Minis', subtitle: 'Portrait sessions across Western Pennsylvania', url: '/portfolio', image: '', pinned: false },
  { title: 'Weddings + Engagements', subtitle: 'See the experience and check your date', url: '/weddings', image: '', pinned: false },
  { title: 'Email Amanda', subtitle: 'amkurtzphotography@gmail.com', url: 'mailto:amkurtzphotography@gmail.com', image: '', pinned: false },
]

const sql = neon(process.env.DATABASE_URL)

for (let i = 0; i < SEED.length; i++) {
  const l = SEED[i]
  const id = 'lnk_' + Math.random().toString(36).slice(2, 10)
  await sql`INSERT INTO links (id, title, subtitle, url, image, pinned, position)
            VALUES (${id}, ${l.title}, ${l.subtitle}, ${l.url}, ${l.image}, ${l.pinned}, ${i})`
  console.log('seeded:', l.title)
}
console.log('Done.')
