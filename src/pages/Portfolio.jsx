import { Link } from 'react-router-dom'
import { ArrowUpRight } from '../components/Icons.jsx'
import Seo from '../components/Seo.jsx'

const PHOTOS = [
  ['/images/kurtz/portfolio/wedding-party.webp', 'Wedding party celebrating together', 'Weddings', 'wide'],
  ['/images/kurtz/portfolio/ring-moment.webp', 'Black-and-white close-up of rings during a wedding moment', 'Weddings', 'tall'],
  ['/images/kurtz/portfolio/wedding-details.webp', 'Wedding bouquet, shoes, invitation and keepsake details', 'Weddings', 'tall'],
  ['/images/kurtz/portfolio/engagement-field.webp', 'Engaged couple laughing in a sunlit field', 'Engagements', 'wide'],
  ['/images/kurtz/portfolio/engagement-hands.webp', 'Black-and-white portrait of an engaged couple holding hands', 'Engagements', 'tall'],
  ['/images/kurtz/portfolio/senior-wildflowers.webp', 'Senior portrait among summer wildflowers', 'Senior pictures', 'tall'],
  ['/images/kurtz/portfolio/senior-campus.webp', 'Senior portrait outside historic campus architecture', 'Senior pictures', 'tall'],
  ['/images/kurtz/portfolio/senior-courtyard.webp', 'Relaxed senior portrait in a stone courtyard', 'Senior pictures', 'tall'],
  ['/images/kurtz/portfolio/fall-minis.webp', 'Two children smiling in a sunflower field', 'Fall minis', 'wide'],
  ['/images/kurtz/portfolio/business-branding.webp', 'Creative editorial portrait for a local business owner', 'Business shoots', 'tall'],
  ['/images/kurtz/portfolio/wedding-entrance.webp', 'Newlyweds outside an elegant venue', 'Weddings', 'tall'],
]

export default function Portfolio() {
  return (
    <>
      <Seo title="Photography Portfolio | Kurtz Photography Pittsburgh" description="Explore wedding, engagement, senior, fall mini and business photography by Kurtz Photography in Pittsburgh and Burgettstown, PA." path="/portfolio" />
      <header className="kurtz-pagehead">
        <div className="wrap"><span className="kurtz-eyebrow">Portfolio</span><h1>Real people. Good light. Stories with feeling.</h1><p>Weddings, engagements, seniors, fall minis and business portraits photographed across Western Pennsylvania.</p></div>
      </header>
      <section className="section kurtz-portfolio-section">
        <div className="wrap">
          <div className="kurtz-portfolio-nav" aria-label="Portfolio categories"><span>Weddings</span><span>Engagements</span><span>Seniors</span><span>Fall minis</span><span>Business</span></div>
          <div className="kurtz-portfolio-grid">
            {PHOTOS.map(([src, alt, category, shape]) => <figure className={`kurtz-portfolio-item kurtz-portfolio-item--${shape}`} key={src}><img src={src} alt={alt} loading="lazy" /><figcaption>{category}</figcaption></figure>)}
          </div>
        </div>
      </section>
      <section className="kurtz-portfolio-cta"><div className="wrap"><span className="kurtz-eyebrow">Your story belongs here</span><h2>Ready to make something worth keeping?</h2><Link className="btn kurtz-btn--light" to="/contact">Start your inquiry <ArrowUpRight /></Link></div></section>
    </>
  )
}

