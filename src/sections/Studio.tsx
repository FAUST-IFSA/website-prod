import art1x from '../assets/faust-dark-360.webp'
import art2x from '../assets/faust-dark-512.webp'
import { Outbound, SectionHead } from '../components'
import { faust } from '../faust'
import { useCopy } from '../i18n'

export function Studio() {
  const { studio } = useCopy()
  return (
    <section className="section night" aria-labelledby="studio-heading">
      <div className="container studio-grid">
        <div className="studio-text">
          <SectionHead id="studio-heading" eyebrow={studio.eyebrow} title={studio.heading} />
          <p>{studio.body[0]}</p>
          <p className="muted">{studio.body[1]}</p>
          <ul className="stats" role="list">
            {studio.stats.map((stat) => (
              <li key={stat.label}>
                <span className="stat-value">{stat.value}</span>
                <span className="label stat-label">{stat.label}</span>
              </li>
            ))}
          </ul>
          <p className="recorded">
            <span className="label">{studio.recordedLabel}</span>
            {faust.artists}
          </p>
          <p className="link-row">
            {studio.links.map((link) => (
              <Outbound key={link.href} href={link.href}>
                {link.label}
              </Outbound>
            ))}
          </p>
        </div>
        {/* After the text in the DOM (reading order and the one-column layout); placed in the left column at ≥1024.
            Its cut-off base sits on the band's bottom edge (design-spec §4.4). */}
        <img
          className="studio-art"
          src={art1x}
          srcSet={`${art1x} 1x, ${art2x} 2x`}
          width={360}
          height={360}
          alt={studio.artAlt}
          loading="lazy"
        />
      </div>
    </section>
  )
}
