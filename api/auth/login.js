import { signToken } from '../_auth.js'
import { readBody, send } from '../_db.js'

export default function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'Method not allowed' })
  try {
    const { password } = readBody(req)
    if (!process.env.ADMIN_PASSWORD) return send(res, 500, { error: 'ADMIN_PASSWORD is not set' })
    if (!password || password !== process.env.ADMIN_PASSWORD) {
      return send(res, 401, { error: 'Incorrect password.' })
    }
    return send(res, 200, { token: signToken() })
  } catch (e) {
    return send(res, 500, { error: e.message })
  }
}
