// Tiny API client. All admin calls send the JWT from localStorage.
// Public link fetching falls back to seed data so the site still demos
// nicely before the database/backend is wired up.

import { SEED_LINKS } from './seed.js'

const TOKEN_KEY = 'kurtz_admin_token'
const PREVIEW_TOKEN = 'kurtz-admin-preview'
const PREVIEW_LINKS_KEY = 'kurtz_photography_preview_links'

function previewLinks() {
  try {
    const saved = JSON.parse(localStorage.getItem(PREVIEW_LINKS_KEY) || 'null')
    return Array.isArray(saved) ? saved : SEED_LINKS
  } catch {
    return SEED_LINKS
  }
}

function savePreviewLinks(links) {
  localStorage.setItem(PREVIEW_LINKS_KEY, JSON.stringify(links))
  return links
}

export const auth = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
  isLoggedIn: () => !!localStorage.getItem(TOKEN_KEY),
  isPreview: () => localStorage.getItem(TOKEN_KEY) === PREVIEW_TOKEN,
  startPreview: () => localStorage.setItem(TOKEN_KEY, PREVIEW_TOKEN),
}

async function request(path, { method = 'GET', body, authed = false } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (authed) headers.Authorization = `Bearer ${auth.get()}`
  const res = await fetch(`/api${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
  if (res.status === 401) {
    auth.clear()
    throw new Error('Your session expired. Please sign in again.')
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Something went wrong.')
  return data
}

export const api = {
  // ----- public -----
  async getLinks() {
    try {
      const data = await request('/links')
      // If the DB is empty, show the seed so a fresh deploy still looks alive.
      return data.links && data.links.length ? data.links : previewLinks()
    } catch {
      return previewLinks() // backend not configured yet — demo mode
    }
  },
  submitLead(body) {
    return request('/leads', { method: 'POST', body })
  },

  // ----- admin -----
  login(password) {
    return request('/auth/login', { method: 'POST', body: { password } })
  },
  async adminLinks() {
    if (auth.isPreview()) return { links: previewLinks() }
    return request('/links', { authed: true })
  },
  async createLink(body) {
    if (auth.isPreview()) {
      const links = previewLinks()
      const link = { ...body, id: `preview_${Date.now()}`, position: links.length }
      savePreviewLinks([...links, link])
      return { link }
    }
    return request('/links', { method: 'POST', body, authed: true })
  },
  async updateLink(id, body) {
    if (auth.isPreview()) {
      const links = savePreviewLinks(previewLinks().map((link) => link.id === id ? { ...link, ...body, id } : link))
      return { link: links.find((link) => link.id === id) }
    }
    return request(`/links/${id}`, { method: 'PUT', body, authed: true })
  },
  async deleteLink(id) {
    if (auth.isPreview()) {
      savePreviewLinks(previewLinks().filter((link) => link.id !== id))
      return { ok: true }
    }
    return request(`/links/${id}`, { method: 'DELETE', authed: true })
  },
  async reorderLinks(order) {
    if (auth.isPreview()) {
      const byId = new Map(previewLinks().map((link) => [link.id, link]))
      savePreviewLinks(order.map((id, position) => ({ ...byId.get(id), position })).filter((link) => link.id))
      return { ok: true }
    }
    return request('/links/reorder', { method: 'POST', body: { order }, authed: true })
  },
  async getLeads() {
    if (auth.isPreview()) return { leads: [] }
    return request('/leads', { authed: true })
  },
}
