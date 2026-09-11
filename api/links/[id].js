import { getSql, readBody, send } from '../_db.js'
import { requireAuth } from '../_auth.js'

export default async function handler(req, res) {
  try {
    requireAuth(req)
  } catch {
    return send(res, 401, { error: 'unauthorized' })
  }

  const sql = getSql()
  const { id } = req.query

  if (req.method === 'PUT') {
    try {
      const { title, subtitle = '', url, image = '', pinned = false } = readBody(req)
      if (!title || !url) return send(res, 400, { error: 'Title and URL are required.' })
      const [link] = await sql`
        UPDATE links
        SET title = ${title}, subtitle = ${subtitle}, url = ${url}, image = ${image}, pinned = ${pinned}
        WHERE id = ${id}
        RETURNING id, title, subtitle, url, image, pinned, position`
      if (!link) return send(res, 404, { error: 'Link not found.' })
      return send(res, 200, { link })
    } catch (e) {
      return send(res, 500, { error: e.message })
    }
  }

  if (req.method === 'DELETE') {
    try {
      await sql`DELETE FROM links WHERE id = ${id}`
      return send(res, 200, { ok: true })
    } catch (e) {
      return send(res, 500, { error: e.message })
    }
  }

  return send(res, 405, { error: 'Method not allowed' })
}
