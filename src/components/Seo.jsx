import { useEffect } from 'react'

const ORIGIN = 'https://kurtz-photography.vercel.app'

export default function Seo({ title, description, path = '/' }) {
  useEffect(() => {
    document.title = title
    let meta = document.querySelector('meta[name="description"]')
    if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.appendChild(meta) }
    meta.content = description
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical) }
    canonical.href = `${ORIGIN}${path}`
  }, [title, description, path])
  return null
}
