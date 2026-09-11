import { useState } from 'react'
import { CREATOR } from '../lib/seed.js'
import { api } from '../lib/api.js'
import Seo from '../components/Seo.jsx'

const EMPTY = { name: '', email: '', projectType: 'Wedding', message: '' }

export default function Contact() {
  const [form, setForm] = useState(EMPTY)
  const [status, setStatus] = useState({ state: 'idle', msg: '' })
  const set = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }))

  async function submit() {
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return setStatus({ state: 'err', msg: 'Please fill in your name, email and a message.' })
    setStatus({ state: 'sending', msg: '' })
    try {
      await api.submitLead(form)
      setStatus({ state: 'ok', msg: 'Thank you—your inquiry is on its way. Amanda will be in touch soon.' })
      setForm(EMPTY)
    } catch {
      const subject = encodeURIComponent(`${form.projectType} photography inquiry from ${form.name}`)
      const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\nSession: ${form.projectType}\n\n${form.message}`)
      window.location.href = `mailto:${CREATOR.email}?subject=${subject}&body=${body}`
      setStatus({ state: 'ok', msg: 'Your email app is opening with the inquiry ready to send.' })
    }
  }

  return (
    <>
      <Seo title="Book a Pittsburgh Photographer | Kurtz Photography" description="Inquire with Kurtz Photography for weddings, engagements, senior pictures, fall minis and business shoots in Pittsburgh and Burgettstown." path="/contact" />
      <header className="kurtz-pagehead"><div className="wrap"><span className="kurtz-eyebrow">Start here</span><h1>Tell me what you want to remember.</h1></div></header>
      <section className="section">
        <div className="wrap contact-grid kurtz-contact-grid">
          <div><p className="lede">Share your date, location and the kind of session you have in mind. For weddings, include your venue if you have one. For portraits, tell Amanda a little about who will be photographed.</p><div className="kurtz-direct"><span className="kurtz-section-number">Prefer email?</span><a href={`mailto:${CREATOR.email}`}>{CREATOR.email}</a><p>{CREATOR.location}</p></div></div>
          <div className="panel kurtz-form">
            {status.state === 'ok' && <div className="notice notice--ok">{status.msg}</div>}
            {status.state === 'err' && <div className="notice notice--err">{status.msg}</div>}
            <div className="field"><label htmlFor="name">Your name</label><input id="name" value={form.name} onChange={set('name')} placeholder="Name" /></div>
            <div className="field"><label htmlFor="email">Email</label><input id="email" type="email" value={form.email} onChange={set('email')} placeholder="you@email.com" /></div>
            <div className="field"><label htmlFor="type">What are you planning?</label><select id="type" value={form.projectType} onChange={set('projectType')}><option>Wedding</option><option>Engagement</option><option>Senior pictures</option><option>Fall mini</option><option>Business shoot</option><option>Couples or family portraits</option><option>Something else</option></select></div>
            <div className="field"><label htmlFor="message">The details</label><textarea id="message" value={form.message} onChange={set('message')} placeholder="Date, location, who is being photographed and anything else Amanda should know…" /></div>
            <button className="btn kurtz-btn" onClick={submit} disabled={status.state === 'sending'}>{status.state === 'sending' ? 'Sending…' : 'Send your inquiry'}</button>
          </div>
        </div>
      </section>
    </>
  )
}

