import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, auth } from '../../lib/api.js'

export default function Login() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const nav = useNavigate()

  useEffect(() => { if (auth.isLoggedIn()) nav('/admin/dashboard', { replace: true }) }, [nav])

  async function submit() {
    if (!password) return
    setBusy(true); setError('')
    try {
      const { token } = await api.login(password)
      auth.set(token)
      nav('/admin/dashboard', { replace: true })
    } catch (err) {
      setError(err.message || 'Incorrect password.')
    } finally {
      setBusy(false)
    }
  }

  function preview() {
    auth.startPreview()
    nav('/admin/dashboard', { replace: true })
  }

  return (
    <div className="admin">
      <div className="login-card">
        <h1>Owner login</h1>
        <p>Sign in to manage your links and view inquiries.</p>
        {error && <div className="notice notice--err">{error}</div>}
        <div className="field">
          <label htmlFor="pw">Password</label>
          <input
            id="pw"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            placeholder="••••••••"
            autoFocus
          />
        </div>
        <button className="btn btn--coral" style={{ width: '100%', justifyContent: 'center' }} onClick={submit} disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
        <button className="btn btn--ghost mt-s" style={{ width: '100%', justifyContent: 'center' }} onClick={preview}>
          Preview the dashboard
        </button>
        <p style={{ marginTop: 14, fontSize: 12 }}>Preview edits stay on this device. The buyer’s Supabase account will provide the permanent login and live data.</p>
      </div>
    </div>
  )
}
