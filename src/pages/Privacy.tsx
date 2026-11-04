import { ArrowLeft } from 'lucide-react'
import { useEffect } from 'react'
import { Outbound } from '../components'
import { faust } from '../faust'
import { useCopy } from '../i18n'
import { Footer } from '../sections/Footer'
import { Header } from '../sections/Header'

// Privacy policy page (docs/privacy-policy-spec.md). Layout: design-spec §4.9. Text: copy privacy.*.
export function Privacy() {
  const { privacy } = useCopy()

  // The <title> follows the language via LangProvider; the description tag is static HTML, so it's updated here.
  useEffect(() => {
    document.querySelector('meta[name="description"]')?.setAttribute('content', privacy.meta.description)
  }, [privacy])

  // The header wordmark is not a link (§3.2), so this link is the way back, shown above the eyebrow and after the text.
  const back = (
    <a className="link privacy-back" href={import.meta.env.BASE_URL}>
      <ArrowLeft size={16} aria-hidden="true" className="link-icon" />
      {privacy.back}
    </a>
  )

  return (
    <>
      <Header />
      <main id="main">
        <div className="container">
          <article className="section privacy">
            <p>{back}</p>
          <p className="eyebrow">{privacy.eyebrow}</p>
          <h1>{privacy.heading}</h1>
          <p className="muted privacy-updated">{privacy.updated}</p>
          <p className="privacy-intro">{privacy.intro}</p>
          {privacy.sections.map((section) => (
            <section key={section.id}>
              <h2 id={section.id}>{section.heading}</h2>
              {section.blocks.map((block, i) =>
                typeof block === 'string' ? (
                  <p key={i}>{block}</p>
                ) : Array.isArray(block) ? (
                  <ul key={i}>
                    {block.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  // Another site gets the ↗ (§3.1); a mailto link doesn't.
                  <p key={i}>
                    {block.href.startsWith('mailto:') ? (
                      <a className="link" href={block.href}>
                        {block.label}
                      </a>
                    ) : (
                      <Outbound href={block.href}>{block.label}</Outbound>
                    )}
                  </p>
                ),
              )}
              {/* Faust's own policy, once they send its URL (faust.privacy, TODO(verify)). */}
              {section.id === 'scope' && faust.privacy && (
                <p>
                  <Outbound href={faust.privacy}>{privacy.seeAlso}</Outbound>
                </p>
              )}
            </section>
          ))}
          <p className="privacy-end">{back}</p>
          </article>
        </div>
      </main>
      <Footer />
    </>
  )
}
