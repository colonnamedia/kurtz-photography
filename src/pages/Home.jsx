import { Link } from 'react-router-dom'
import { FEATURES, MARQUEE } from '../lib/seed.js'
import { ArrowUpRight } from '../components/Icons.jsx'
import Seo from '../components/Seo.jsx'

export default function Home() {
  return (
    <>
      <Seo title="Pittsburgh Photographer | Kurtz Photography" description="Wedding, engagement, senior, fall mini and business photography serving Pittsburgh, Burgettstown and Western Pennsylvania." path="/" />
      <header className="kurtz-hero">
        <img src="/images/kurtz/portfolio/engagement-field.webp" alt="Engaged couple laughing together in a sunlit Western Pennsylvania field" fetchPriority="high" />
        <div className="kurtz-hero__veil" />
        <div className="wrap kurtz-hero__inner">
          <div className="kurtz-hero__copy">
            <span className="kurtz-eyebrow">Pittsburgh · Burgettstown · Western PA</span>
            <h1>Your day.<br /><em>Honestly</em> remembered.</h1>
            <p>Weddings, engagements, senior pictures, seasonal minis and business portraits—captured with warmth and made to feel like you.</p>
            <div className="kurtz-actions">
              <Link className="btn kurtz-btn" to="/contact">Check your date <ArrowUpRight /></Link>
              <Link className="btn kurtz-btn--light" to="/portfolio">View the portfolio</Link>
            </div>
          </div>
        </div>
      </header>
      <div className="marquee kurtz-marquee" aria-hidden="true"><div className="marquee__track">{[...MARQUEE, ...MARQUEE].map((item, index) => <span className="marquee__item" key={index}>{item}</span>)}</div></div>
      <section className="section kurtz-intro">
        <div className="wrap kurtz-intro__grid">
          <figure className="kurtz-welcome-photo">
            <img src="/images/kurtz/photographer-welcome-preview.webp" alt="Wedding photographer holding her camera at an outdoor venue" />
            <figcaption>Photographer portrait shown for preview</figcaption>
          </figure>
          <div className="kurtz-welcome-copy">
            <span className="kurtz-section-number">01 / Welcome</span>
            <p className="kurtz-welcome-note">Welcome to Kurtz Photography</p>
            <h2>Photographs that feel like the people in them.</h2>
            <p className="lede">The best photographs are more than beautiful. They bring back how the moment felt, who made you laugh and the details you never want to forget.</p>
            <p>Hi, I’m Amanda. I create warm, natural imagery with thoughtful direction when you need it and room for your real personality to come through. My goal is to help you feel comfortable, enjoy the experience and leave with photographs you cannot wait to share.</p>
            <Link to="/about" className="kurtz-text-link">A little more about Amanda <ArrowUpRight /></Link>
          </div>
        </div>
      </section>
      <section className="kurtz-featured-work">
        <div className="wrap">
          <div className="kurtz-heading-row">
            <div><span className="kurtz-eyebrow">Selected stories</span><h2>A glimpse of the good stuff.</h2></div>
            <Link className="kurtz-text-link" to="/portfolio">Explore the full portfolio <ArrowUpRight /></Link>
          </div>
          <div className="kurtz-gallery-grid">
            <Link to="/portfolio" className="kurtz-photo kurtz-photo--tall"><img src="/images/kurtz/portfolio/senior-wildflowers.webp" alt="Senior portrait in a Western Pennsylvania wildflower field" loading="lazy" /><span>Senior stories</span></Link>
            <Link to="/portfolio" className="kurtz-photo kurtz-photo--wide"><img src="/images/kurtz/portfolio/wedding-party.webp" alt="Joyful wedding party celebrating together" loading="lazy" /><span>Wedding days</span></Link>
            <Link to="/portfolio" className="kurtz-photo kurtz-photo--detail"><img src="/images/kurtz/portfolio/fall-minis.webp" alt="Children smiling among sunflowers during a seasonal mini session" loading="lazy" /><span>Fall minis</span></Link>
          </div>
        </div>
      </section>
      <section className="section kurtz-services">
        <div className="wrap">
          <div className="kurtz-heading-row">
            <div><span className="kurtz-eyebrow">Ways to work together</span><h2>Stories worth keeping.</h2></div>
            <p>Serving couples throughout Pittsburgh, Burgettstown and surrounding Western Pennsylvania communities.</p>
          </div>
          <div className="kurtz-service-grid">{FEATURES.map((feature, index) => <article key={feature.title}><span>0{index + 1}</span><h3>{feature.title}</h3><p>{feature.body}</p></article>)}</div>
        </div>
      </section>
      <section className="kurtz-location">
        <div className="wrap kurtz-location__grid">
          <div><span className="kurtz-eyebrow">Local knowledge matters</span><h2>At home in Western Pennsylvania.</h2></div>
          <div><p>From Pittsburgh architecture and senior campuses to open fields, family farms and intimate venues near Burgettstown, your setting becomes part of the story without taking over the people in it.</p><Link to="/contact" className="kurtz-text-link">Tell me what you’re planning <ArrowUpRight /></Link></div>
        </div>
      </section>
      <section className="kurtz-final-cta">
        <img src="/images/kurtz/portfolio/wedding-entrance.webp" alt="Newlyweds embracing outside an elegant Western Pennsylvania venue" loading="lazy" /><div className="kurtz-final-cta__overlay" />
        <div className="wrap kurtz-final-cta__content"><span className="kurtz-eyebrow">Now booking</span><h2>Let’s make space for every moment.</h2><p>Share your date, location and what you want your photographs to feel like.</p><Link to="/contact" className="btn kurtz-btn--light">Start your inquiry <ArrowUpRight /></Link></div>
      </section>
    </>
  )
}
