import { ArrowUpRight } from './Icons.jsx'

export function PinnedCard({ link }) {
  const external = /^(https?:|mailto:|tel:)/.test(link.url)
  return (
    <a className="pinned-card" href={link.url} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}>
      {link.image ? (
        <img className="pinned-card__img" src={link.image} alt="" loading="lazy" />
      ) : (
        <div className="pinned-card__img" style={{ background: 'linear-gradient(135deg,#2b2a6b,#161310)' }} />
      )}
      <span className="pinned-card__tag">Featured</span>
      <div className="pinned-card__overlay">
        <div className="pinned-card__title">{link.title}</div>
        {link.subtitle && <div className="pinned-card__desc">{link.subtitle}</div>}
      </div>
    </a>
  )
}

export function LinkRow({ link }) {
  const initial = (link.title || '?').trim().charAt(0).toUpperCase()
  const external = /^(https?:|mailto:|tel:)/.test(link.url)
  return (
    <a className="link-row" href={link.url} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}>
      {link.image ? (
        <img className="link-row__thumb" src={link.image} alt="" loading="lazy" />
      ) : (
        <div className="link-row__thumb link-row__thumb--placeholder">{initial}</div>
      )}
      <div className="link-row__body">
        <div className="link-row__title">{link.title}</div>
        {link.subtitle && <div className="link-row__sub">{link.subtitle}</div>}
      </div>
      <ArrowUpRight className="link-row__arrow" />
    </a>
  )
}
