import { ArrowRight, AudioLines, Check } from 'lucide-react'
import { type DragEvent, useState } from 'react'
import { TOOL_URL } from '../faust'
import { useCopy } from '../i18n'

export function Hero() {
  const { hero } = useCopy()
  const [dragging, setDragging] = useState(false)
  const [dropped, setDropped] = useState(false)

  // The box looks like a drop zone, so people will drop files on it. Without preventDefault the browser
  // would open the file and leave the page. Handing the file to the tool is out of scope for v1.
  const onDragOver = (e: DragEvent) => {
    e.preventDefault()
    setDragging(true)
  }
  const onDrop = (e: DragEvent) => {
    e.preventDefault()
    setDragging(false)
    setDropped(true)
  }

  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="container">
        <p className="eyebrow">{hero.eyebrow}</p>
        <h1 id="hero-heading">{hero.heading}</h1>
        <p className="lead">{hero.lead}</p>
        <a
          className={`cta-box${dragging ? ' is-dragging' : ''}`}
          href={TOOL_URL}
          onDragOver={onDragOver}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
        >
          <AudioLines size={48} aria-hidden="true" className="cta-icon" />
          <span className="btn btn-primary">
            {hero.cta}
            <ArrowRight size={20} aria-hidden="true" />
          </span>
          <span className="cta-meta">{hero.meta}</span>
        </a>
        <p className="drop-message" aria-live="polite">
          {dropped ? hero.dropMessage : ''}
        </p>
        <ul className="trust" role="list">
          {hero.trust.map((item) => (
            <li key={item}>
              <Check size={16} aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
        <p className="mobile-note">{hero.mobileNote}</p>
      </div>
    </section>
  )
}
