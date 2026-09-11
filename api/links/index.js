import { getSql, readBody, send } from '../_db.js'
import { requireAuth } from '../_auth.js'

export default async function handler(req, res) {
  const sql = getSql()

  if (req.method === 'GET') {
    try {
      const links = await sql`
        SELECT id, title, subtitle, url, image, pinned, position
        FROM links ORDER BY position ASC, created_at ASC`
      return send(res, 200, { links })
    } catch (e) {
      return send(res, 500, { error: e.message })
    }
  }

  if (req.method === 'POST') {
    try {
      requireAuth(req)
    } catch {
      return send(res, 401, { error: 'unauthorized' })
    }
    try {
      const { title, subtitle = '', url, image = '', pinned = false } = readBody(req)
      if (!title || !url) return send(res, 400, { error: 'Title and URL are required.' })
      const id = 'lnk_' + Math.random().toString(36).slice(2, 10)
      const [{ max }] = await sql`SELECT COALESCE(MAX(position), -1) AS max FROM links`
      const position = (max ?? -1) + 1
      const [link] = await sql`
        INSERT INTO links (id, title, subtitle, url, image, pinned, position)
        VALUES (${id}, ${title}, ${subtitle}, ${url}, ${image}, ${pinned}, ${position})
        RETURNING id, title, subtitle, url, image, pinned, position`
      return send(res, 201, { link })
    } catch (e) {
      return send(res, 500, { error: e.message })
    }
  }

  return send(res, 405, { error: 'Method not allowed' })
}
