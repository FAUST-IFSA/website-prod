import { Plus } from 'lucide-react'
import { SectionHead } from '../components'
import { useCopy } from '../i18n'

export function Faq() {
  const { faq } = useCopy()
  return (
    <section className="section section-alt" aria-labelledby="faq-heading">
      <div className="container">
        <SectionHead id="faq-heading" title={faq.heading} />
        <div className="faq-list">
          {faq.items.map((item) => (
            <details key={item.q}>
              <summary>
                {item.q}
                <Plus size={24} aria-hidden="true" className="faq-icon" />
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
