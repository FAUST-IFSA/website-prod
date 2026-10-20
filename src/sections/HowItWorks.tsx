import { AudioLines, Download, Upload, WandSparkles } from 'lucide-react'
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
        <a className="btn btn-secondary how-cta" href={TOOL_URL}>
          {how.button}
        </a>
      </div>
    </section>
  )
}
