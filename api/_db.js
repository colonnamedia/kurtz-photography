import { neon } from '@neondatabase/serverless'

// Lazily create the SQL client so a missing env var fails loudly per-request
// rather than at import time.
export function getSql() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set')
  }
  return neon(process.env.DATABASE_URL)
}

export function readBody(req) {
  // Vercel's Node runtime usually parses JSON into req.body already.
  if (req.body && typeof req.body === 'object') return req.body
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body) } catch { return {} }
  }
  return {}
}

export function send(res, status, payload) {
  res.status(status).setHeader('Content-Type', 'application/json')
  res.send(JSON.stringify(payload))
}
