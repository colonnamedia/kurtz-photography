import { Link } from 'react-router-dom'
import { ArrowUpRight } from '../components/Icons.jsx'
import Seo from '../components/Seo.jsx'

const STEPS = [
  ['01', 'Say hello', 'Share your date, venue or location, and the parts of the day that matter most to you.'],
  ['02', 'Plan with confidence', 'We will talk through timing, portrait priorities and a photo plan that gives the day room to breathe.'],
  ['03', 'Be fully present', 'Amanda offers easy direction when it helps, then steps back for the candid moments that happen naturally.'],
  ['04', 'Relive it all', 'Your finished gallery brings the big celebration and the quiet in-between moments back together.'],
]

export default function Book() {
  return (
    <>
      <Seo title="Pittsburgh Wedding & Engagement Photographer | Kurtz Photography" description="Warm, natural wedding and engagement photography in Pittsburgh, Burgettstown and throughout Western Pennsylvania." path="/weddings" />
      <header className="kurtz-pagehead kurtz-pagehead--photo">
        <img src="/images/kurtz/portfolio/wedding-party.webp" alt="Wedding party celebrating with the couple in Western Pennsylvania" />
        <div className="kurtz-pagehead__shade" />
        <div className="wrap"><span className="kurtz-eyebrow">Weddings + engagements</span><h1>The big promises. The little glances. All of it.</h1></div>
      </header>
      <section className="section">
        <div className="wrap kurtz-intro__grid">
          <span className="kurtz-section-number">The wedding experience</span>
          <div><h2>Beautiful images without turning your day into a photo shoot.</h2><p className="lede">Your wedding deserves photographs that are polished, personal and full of life. The approach pairs calm direction for portraits with an observant eye for the moments you could never script.</p></div>
        </div>
      </section>
      <section className="kurtz-process">
        <div className="wrap kurtz-process__grid">{STEPS.map(([n, title, copy]) => <article key={n}><span>{n}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </section>
      <section className="section">
        <div className="wrap kurtz-wedding-split">
          <img src="/images/kurtz/portfolio/engagement-field.webp" alt="Engagement session at golden hour near Pittsburgh" />
          <div><span className="kurtz-eyebrow">Before the aisle</span><h2>Engagement sessions that feel like a date.</h2><p>Choose a meaningful location, wear what feels like you and leave the posing worries behind. Engagement sessions are a relaxed way to get comfortable together in front of the camera before the wedding day.</p><Link to="/contact" className="btn kurtz-btn">Check your date <ArrowUpRight /></Link></div>
        </div>
      </section>
    </>
  )
}

