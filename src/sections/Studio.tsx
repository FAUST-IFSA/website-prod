import { Outbound, PhotoPlaceholder, SectionHead } from '../components'
import { faust } from '../faust'
import { useCopy } from '../i18n'

export function Studio() {
  const { studio } = useCopy()
  return (
    <section className="section night" aria-labelledby="studio-heading">
      <div className="container studio-grid">
        {/* TODO(asset A2): Blue Studio control room photo, ≥1600×1200, alt "The Blue Studio control room at Faust
            Studio, with an SSL mixing console and vintage gear". */}
        <PhotoPlaceholder label={studio.photo} className="studio-photo" />
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
      </div>
    </section>
  )
}
