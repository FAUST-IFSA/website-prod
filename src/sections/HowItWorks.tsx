import { AudioLines, Download, Upload, WandSparkles } from 'lucide-react'
import shot1x from '../assets/howto-1120.webp'
import shot2x from '../assets/howto-2240.webp'
import { SectionHead } from '../components'
import { TOOL_URL } from '../faust'
import { useCopy } from '../i18n'

const ICONS = [Upload, AudioLines, WandSparkles, Download]

export function HowItWorks() {
  const { how } = useCopy()
  return (
    <section className="section" aria-labelledby="how-heading">
      <div className="container">
        <SectionHead id="how-heading" eyebrow={how.eyebrow} title={how.heading} lead={how.lead} />
        <ol className="steps" role="list">
          {how.steps.map((step, i) => {
            const Icon = ICONS[i]
            return (
              <li key={step.title}>
                <div className="step-top">
                  <span className="label step-num" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <Icon size={24} aria-hidden="true" />
                </div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </li>
            )
          })}
        </ol>
        {/* Screenshot banner with the CTA centred on it. Only the button is a link (one tab stop). */}
        <div className="how-banner night">
          <img
            src={shot1x}
            srcSet={`${shot1x} 1120w, ${shot2x} 2240w`}
            sizes="(min-width: 1184px) 1120px, 100vw"
            width={1120}
            height={261}
            alt={how.imageAlt}
            loading="lazy"
          />
          <a className="btn btn-primary how-cta" href={TOOL_URL}>
            {how.button}
          </a>
        </div>
      </div>
    </section>
  )
}
