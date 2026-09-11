import { getSql, readBody, send } from '../_db.js'
import { requireAuth } from '../_auth.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'Method not allowed' })
  try {
    requireAuth(req)
  } catch {
    return send(res, 401, { error: 'unauthorized' })
  }
  try {
    const { order } = readBody(req) // array of ids in new order
    if (!Array.isArray(order)) return send(res, 400, { error: 'order must be an array' })
    const sql = getSql()
    await Promise.all(order.map((id, i) => sql`UPDATE links SET position = ${i} WHERE id = ${id}`))
    return send(res, 200, { ok: true })
  } catch (e) {
    return send(res, 500, { error: e.message })
  }
}
