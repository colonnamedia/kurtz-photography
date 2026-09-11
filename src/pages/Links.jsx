import { useEffect, useState } from 'react'
import { CREATOR } from '../lib/seed.js'
import { api } from '../lib/api.js'
import { PinnedCard, LinkRow } from '../components/LinkCard.jsx'
import Seo from '../components/Seo.jsx'

export default function Links() {
  const [links, setLinks] = useState(null)
  useEffect(() => { api.getLinks().then(setLinks) }, [])
  const pinned = (links || []).filter((link) => link.pinned)
  const rows = (links || []).filter((link) => !link.pinned)

  return (
    <section className="kurtz-links">
      <Seo title="Kurtz Photography Links" description="Portfolio, booking and social links for Kurtz Photography in Pittsburgh and Burgettstown." path="/links" />
      <div className="wrap"><div className="linkspage kurtz-links__card">
        <div className="linkspage__head"><div className="kurtz-links__monogram">KP</div><span className="kurtz-eyebrow">Pittsburgh · Burgettstown</span><h1>{CREATOR.name}</h1><p>Weddings · Engagements · Seniors · Fall Minis · Business</p><p className="linkspage__handle">{CREATOR.handle}</p></div>
        {links === null ? <div className="spinner" /> : <>{pinned.length > 0 && <div className="pinned-grid">{pinned.map((link) => <PinnedCard key={link.id} link={link} />)}</div>}<div>{rows.map((link) => <LinkRow key={link.id} link={link} />)}</div>{links.length === 0 && <div className="empty"><b>No links yet</b>Add your first link from the owner dashboard.</div>}</>}
        <div className="kurtz-links__footer">© {new Date().getFullYear()} Kurtz Photography</div>
      </div></div>
    </section>
  )
}

