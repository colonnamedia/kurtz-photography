import jwt from 'jsonwebtoken'

function secret() {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not set')
  return process.env.JWT_SECRET
}

export function signToken() {
  return jwt.sign({ role: 'owner' }, secret(), { expiresIn: '7d' })
}

// Throws if the request is missing a valid bearer token.
export function requireAuth(req) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) throw new Error('unauthorized')
  try {
    return jwt.verify(token, secret())
  } catch {
    throw new Error('unauthorized')
  }
}
