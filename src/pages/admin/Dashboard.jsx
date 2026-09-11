import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, auth } from '../../lib/api.js'
import { Edit, Trash, Up, Down, Plus } from '../../components/Icons.jsx'

/* Resize/compress an uploaded image to a data URL so DB rows stay small. */
function fileToDataUrl(file, maxW = 1200, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const scale = Math.min(1, maxW / img.width)
        const w = Math.round(img.width * scale)
        const h = Math.round(img.height * scale)
        const canvas = document.createElement('canvas')
        canvas.width = w; canvas.height = h
        canvas.getContext('2d').drawImage(img, 0, 0, w, h)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.onerror = reject
      img.src = reader.result
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const BLANK = { title: '', subtitle: '', url: '', image: '', pinned: false }

function LinkEditor({ initial, onClose, onSave }) {
  const [form, setForm] = useState(initial || BLANK)
  const [uploading, setUploading] = useState(false)
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  async function onFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const dataUrl = await fileToDataUrl(file)
      setForm((f) => ({ ...f, image: dataUrl }))
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{initial?.id ? 'Edit link' : 'Add link'}</h3>

        {form.image && <img className="upload-preview" src={form.image} alt="" />}
        <div className="field">
          <label>Photo {form.pinned ? '(cover)' : '(thumbnail)'}</label>
          <input type="file" accept="image/*" onChange={onFile} />
          {uploading && <small style={{ color: 'var(--muted)' }}>Processing image…</small>}
          {form.image && (
            <button className="btn btn--ghost btn--sm mt-s" onClick={() => setForm((f) => ({ ...f, image: '' }))}>
              Remove photo
            </button>
          )}
        </div>

        <div className="field">
          <label>Title</label>
          <input value={form.title} onChange={set('title')} placeholder="e.g. Fall Mini Sessions" />
        </div>
        <div className="field">
          <label>Subtitle <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(optional)</span></label>
          <input value={form.subtitle} onChange={set('subtitle')} placeholder="e.g. Limited October dates now open" />
        </div>
        <div className="field">
          <label>URL</label>
          <input value={form.url} onChange={set('url')} placeholder="https://…" />
        </div>

        <div className="checkbox-row">
          <input id="pinned" type="checkbox" checked={form.pinned} onChange={(e) => setForm((f) => ({ ...f, pinned: e.target.checked }))} />
          <label htmlFor="pinned">Pin as a featured cover card (shows the photo large)</label>
        </div>

        <div className="modal__actions">
          <button className="btn btn--ghost btn--sm" onClick={onClose}>Cancel</button>
          <button
            className="btn btn--coral btn--sm"
            onClick={() => {
              if (!form.title.trim() || !form.url.trim()) return
              onSave(form)
            }}
          >
            Save link
          </button>
        </div>
      </div>
    </div>
  )
}

function LinksTab() {
  const [links, setLinks] = useState(null)
  const [editing, setEditing] = useState(null) // object or null
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    try {
      const { links } = await api.adminLinks()
      setLinks(links)
    } catch (e) { setError(e.message) }
  }, [])

  useEffect(() => { load() }, [load])

  async function save(form) {
    try {
      if (form.id) await api.updateLink(form.id, form)
      else await api.createLink(form)
      setEditing(null)
      load()
    } catch (e) { setError(e.message) }
  }

  async function remove(id) {
    if (!confirm('Delete this link?')) return
    await api.deleteLink(id); load()
  }

  async function move(index, dir) {
    const next = [...links]
    const swap = index + dir
    if (swap < 0 || swap >= next.length) return
    ;[next[index], next[swap]] = [next[swap], next[index]]
    setLinks(next)
    await api.reorderLinks(next.map((l) => l.id))
  }

  if (links === null) return <div className="spinner" />

  return (
    <>
      {error && <div className="notice notice--err">{error}</div>}
      <div className="panel">
        <div className="panel__head">
          <h2>Your links</h2>
          <button className="btn btn--coral btn--sm" onClick={() => setEditing(BLANK)}><Plus /> Add link</button>
        </div>

        {links.length === 0 ? (
          <div className="empty"><b>No links yet</b>Add your first one to fill your links page.</div>
        ) : (
          links.map((l, i) => (
            <div className="admin-link" key={l.id}>
              {l.image
                ? <img className="admin-link__thumb" src={l.image} alt="" />
                : <div className="admin-link__thumb" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--coral)', fontWeight: 700 }}>{(l.title || '?')[0]}</div>}
              <div className="admin-link__info">
                <b>{l.title}</b>
                <small>{l.url}</small>
                {l.pinned && <span className="admin-link__pin">★ Featured cover</span>}
              </div>
              <div className="admin-link__actions">
                <button className="icon-btn" onClick={() => move(i, -1)} aria-label="Move up"><Up /></button>
                <button className="icon-btn" onClick={() => move(i, 1)} aria-label="Move down"><Down /></button>
                <button className="icon-btn" onClick={() => setEditing(l)} aria-label="Edit"><Edit /></button>
                <button className="icon-btn icon-btn--danger" onClick={() => remove(l.id)} aria-label="Delete"><Trash /></button>
              </div>
            </div>
          ))
        )}
      </div>

      {editing && <LinkEditor initial={editing} onClose={() => setEditing(null)} onSave={save} />}
    </>
  )
}

function LeadsTab() {
  const [leads, setLeads] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.getLeads().then((d) => setLeads(d.leads)).catch((e) => setError(e.message))
  }, [])

  if (leads === null && !error) return <div className="spinner" />

  return (
    <div className="panel">
      <div className="panel__head"><h2>Inquiries</h2></div>
      {error && <div className="notice notice--err">{error}</div>}
      {leads && leads.length === 0 && (
        <div className="empty"><b>No inquiries yet</b>Messages from your contact form will appear here.</div>
      )}
      {leads && leads.map((l) => (
        <div className="lead-row" key={l.id}>
          <div className="lead-row__top">
            <span className="lead-row__name">{l.name} · <span style={{ color: 'var(--muted)', fontWeight: 400 }}>{l.project_type}</span></span>
            <span className="lead-row__date">{new Date(l.created_at).toLocaleDateString()}</span>
          </div>
          <a className="lead-row__email" href={`mailto:${l.email}`}>{l.email}</a>
          <p className="lead-row__msg">{l.message}</p>
        </div>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const [tab, setTab] = useState('links')
  const nav = useNavigate()

  function logout() { auth.clear(); nav('/admin', { replace: true }) }

  return (
    <div className="admin">
      <div className="admin__bar">
        <div className="wrap admin__bar-inner">
          <div className="admin__bar-brand">Owner <span>dashboard</span></div>
          <div style={{ display: 'flex', gap: 10 }}>
            <a className="btn btn--ghost btn--sm" style={{ color: 'var(--paper)', borderColor: 'rgba(255,255,255,0.3)' }} href="/links" target="_blank" rel="noreferrer">View site</a>
            <button className="btn btn--sm" onClick={logout}>Sign out</button>
          </div>
        </div>
      </div>

      <div className="wrap">
        {auth.isPreview() && (
          <div className="notice notice--ok" style={{ marginTop: 22 }}>
            Admin preview mode — link changes are saved only in this browser. Supabase is connected after purchase for secure login and permanent updates.
          </div>
        )}
        <div className="admin__tabs">
          <button className={`admin__tab ${tab === 'links' ? 'is-active' : ''}`} onClick={() => setTab('links')}>Links</button>
          <button className={`admin__tab ${tab === 'leads' ? 'is-active' : ''}`} onClick={() => setTab('leads')}>Inquiries</button>
        </div>
        {tab === 'links' ? <LinksTab /> : <LeadsTab />}
      </div>
    </div>
  )
}
