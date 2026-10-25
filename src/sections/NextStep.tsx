import blueStudio from '../assets/BS.avif'
import courses from '../assets/CS.avif'
import greenStudio from '../assets/GS.avif'
import { Outbound, SectionHead } from '../components'
import { faust } from '../faust'
import { useCopy } from '../i18n'

// Card photos, in the same order as next.cards in the copy files.
const photos = [blueStudio, greenStudio, courses]

export function NextStep() {
  const { next } = useCopy()
  return (
    <section className="section" aria-labelledby="next-heading">
      <div className="container">
        <SectionHead id="next-heading" eyebrow={next.eyebrow} title={next.heading} lead={next.lead} />
        <ul className="cards" role="list">
          {next.cards.map((card, i) => (
            <li className="card" key={card.title}>
              {/* Decorative (alt ""): the card title names it. */}
              <img className="card-photo" src={photos[i]} alt="" loading="lazy" />
              <div className="card-body">
                <h3>{card.title}</h3>
                <p>{card.body}</p>
                <p className="card-meta">{card.meta}</p>
                {/* The card's only link; its ::after overlay makes the whole card clickable. */}
                <Outbound href={card.href} className="link card-link">
                  {card.link}
                </Outbound>
              </div>
            </li>
          ))}
        </ul>
        <div className="link-row closing">
          <a className="btn btn-primary" href={faust.contact}>
            {next.book}
          </a>
          <Outbound href={faust.rates}>{next.rates}</Outbound>
        </div>
      </div>
    </section>
  )
}
