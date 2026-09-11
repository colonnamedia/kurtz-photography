import { Link } from 'react-router-dom'
import { ArrowUpRight } from '../components/Icons.jsx'
import Seo from '../components/Seo.jsx'

export default function About() {
  return (
    <>
      <Seo title="About Amanda | Kurtz Photography" description="Meet Amanda of Kurtz Photography, serving weddings, seniors, families and local businesses throughout Pittsburgh, Burgettstown and Western Pennsylvania." path="/about" />
      <header className="kurtz-pagehead">
        <div className="wrap"><span className="kurtz-eyebrow">Behind the camera</span><h1>The person helping you feel at home in front of the lens.</h1></div>
      </header>
      <section className="section">
        <div className="wrap kurtz-about-grid">
          <img src="/images/kurtz/portfolio/business-branding.webp" alt="Creative business portrait photographed by Kurtz Photography" />
          <div>
            <span className="kurtz-section-number">Hi, I’m Amanda</span>
            <h2>Real connection makes the best photograph.</h2>
            <p className="lede">Kurtz Photography is built around a simple idea: you should recognize yourself in your photos—not just the way you looked, but the way the moment felt.</p>
            <p>Whether Amanda is photographing a full wedding day, an engagement, a senior milestone, a fall mini or a local business, the experience is relaxed, encouraging and thoughtfully guided.</p>
            <p>Based in the Pittsburgh and Burgettstown area, Kurtz Photography serves people and celebrations throughout Western Pennsylvania.</p>
            <Link to="/contact" className="btn kurtz-btn">Tell Amanda what you’re planning <ArrowUpRight /></Link>
          </div>
        </div>
      </section>
    </>
  )
}

