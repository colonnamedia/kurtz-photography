import { useState } from 'react'
import { CREATOR } from '../lib/seed.js'
import { api } from '../lib/api.js'
import Seo from '../components/Seo.jsx'

const SPECIALTIES = ['Wedding', 'Engagement', 'Senior pictures', 'Fall mini', 'Business shoot', 'Couples or family portraits']
const EMPTY = {
  requestKind: 'specialty',
  projectType: 'Wedding',
  name: '',
  email: '',
  phone: '',
  potentialDate: '',
  dateTbd: false,
  location: '',
  message: '',
}

export default function Contact() {
  const [form, setForm] = useState(EMPTY)
  const [status, setStatus] = useState({ state: 'idle', msg: '' })
  const set = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }))

  function chooseKind(requestKind) {
    setForm((current) => ({
      ...current,
      requestKind,
      projectType: requestKind === 'general' ? 'General request' : (current.projectType === 'General request' ? 'Wedding' : current.projectType),
    }))
  }

  async function submit() {
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus({ state: 'err', msg: 'Please fill in your name, email and a short message.' })
      return
    }

    const date = form.dateTbd ? 'TBD' : (form.potentialDate || 'Not provided')
    const details = [
      `Potential date: ${date}`,
      `Phone: ${form.phone || 'Not provided'}`,
      `Location or venue: ${form.location || 'Not provided'}`,
      '',
      form.message,
    ].join('\n')

    setStatus({ state: 'sending', msg: '' })
    try {
      await api.submitLead({ name: form.name, email: form.email, projectType: form.projectType, message: details })
      setStatus({ state: 'ok', msg: 'Thank you—your request is on its way. Amanda will be in touch soon.' })
      setForm(EMPTY)
    } catch {
      const subject = encodeURIComponent(`${form.projectType} photography request from ${form.name}`)
      const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\nSession: ${form.projectType}\n${details}`)
      window.location.href = `mailto:${CREATOR.email}?subject=${subject}&body=${body}`
      setStatus({ state: 'ok', msg: 'Your email app is opening with the request ready to send.' })
    }
  }

  return (
    <>
      <Seo title="Book a Pittsburgh Photographer | Kurtz Photography" description="Inquire with Kurtz Photography for weddings, engagements, senior pictures, fall minis and business shoots in Pittsburgh and Burgettstown." path="/contact" />
      <header className="kurtz-pagehead"><div className="wrap"><span className="kurtz-eyebrow">Booking + questions</span><h1>Tell me what you want to remember.</h1></div></header>
      <section className="section">
        <div className="wrap contact-grid kurtz-contact-grid">
          <div>
            <p className="lede">Choose a specialty booking to request a session, or send a general request if you are still deciding what you need.</p>
            <div className="kurtz-booking-guide">
              <span className="kurtz-section-number">Specialty sessions</span>
              <ul>{SPECIALTIES.map((specialty) => <li key={specialty}>{specialty}</li>)}</ul>
            </div>
            <div className="kurtz-direct"><span className="kurtz-section-number">Prefer email?</span><a href={`mailto:${CREATOR.email}`}>{CREATOR.email}</a><p>{CREATOR.location}</p></div>
          </div>

          <div className="panel kurtz-form">
            <div className="kurtz-request-tabs" aria-label="Request type">
              <button type="button" className={form.requestKind === 'specialty' ? 'is-active' : ''} onClick={() => chooseKind('specialty')}>Specialty booking</button>
              <button type="button" className={form.requestKind === 'general' ? 'is-active' : ''} onClick={() => chooseKind('general')}>General request</button>
            </div>

            {status.state === 'ok' && <div className="notice notice--ok">{status.msg}</div>}
            {status.state === 'err' && <div className="notice notice--err">{status.msg}</div>}

            {form.requestKind === 'specialty' && (
              <fieldset className="kurtz-specialty-picker">
                <legend>What would you like to book?</legend>
                <div>{SPECIALTIES.map((specialty) => (
                  <button type="button" key={specialty} className={form.projectType === specialty ? 'is-active' : ''} onClick={() => setForm((current) => ({ ...current, projectType: specialty }))}>{specialty}</button>
                ))}</div>
              </fieldset>
            )}

            <div className="kurtz-form-row">
              <div className="field"><label htmlFor="name">Your name</label><input id="name" value={form.name} onChange={set('name')} placeholder="Name" /></div>
              <div className="field"><label htmlFor="email">Email</label><input id="email" type="email" value={form.email} onChange={set('email')} placeholder="you@email.com" /></div>
            </div>
            <div className="kurtz-form-row">
              <div className="field"><label htmlFor="phone">Phone <span>(optional)</span></label><input id="phone" type="tel" value={form.phone} onChange={set('phone')} placeholder="(412) 555-0123" /></div>
              <div className="field"><label htmlFor="location">Location or venue <span>(optional)</span></label><input id="location" value={form.location} onChange={set('location')} placeholder="Pittsburgh, Burgettstown or venue" /></div>
            </div>

            <div className="kurtz-date-block">
              <div className="field"><label htmlFor="date">Potential date</label><input id="date" type="date" value={form.potentialDate} onChange={set('potentialDate')} disabled={form.dateTbd} /></div>
              <label className="kurtz-tbd"><input type="checkbox" checked={form.dateTbd} onChange={(event) => setForm((current) => ({ ...current, dateTbd: event.target.checked, potentialDate: event.target.checked ? '' : current.potentialDate }))} /> My date is TBD</label>
            </div>

            <div className="field"><label htmlFor="message">{form.requestKind === 'general' ? 'How can Amanda help?' : 'Tell Amanda about the session'}</label><textarea id="message" value={form.message} onChange={set('message')} placeholder={form.requestKind === 'general' ? 'Ask a question or tell Amanda what you have in mind…' : 'Who is being photographed, what matters most to you and anything else Amanda should know…'} /></div>
            <button className="btn kurtz-btn" onClick={submit} disabled={status.state === 'sending'}>{status.state === 'sending' ? 'Sending…' : form.requestKind === 'general' ? 'Send general request' : 'Request this session'}</button>
          </div>
        </div>
      </section>
    </>
  )
}

