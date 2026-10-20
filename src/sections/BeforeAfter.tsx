import { ArrowRight, Play } from 'lucide-react'
import { SectionHead } from '../components'
import { TOOL_URL } from '../faust'
import { useCopy } from '../i18n'

// Decorative static waveform: 48 bars, same shape for both rows (it's the same take).
const BARS = Array.from({ length: 48 }, (_, i) => 0.2 + 0.8 * Math.abs(Math.sin(i * 0.55) * Math.cos(i * 0.21)))

function Waveform() {
  return (
    <svg className="waveform" viewBox="0 0 48 32" preserveAspectRatio="none" aria-hidden="true">
      {BARS.map((h, i) => (
        <line key={i} x1={i + 0.5} x2={i + 0.5} y1={16 - h * 15} y2={16 + h * 15} vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
  )
}

// TODO(audio): no samples yet (asset A6), so v1 ships the disabled state. When they arrive (design-spec §4.3):
// one <audio> per row without native controls, enable the buttons, toggle Play/Pause (icon and aria-label
// "Pause before sample" / "Pause after sample"), pause the other row on play, fill played bars with --rust,
// show the time, and drop the "Samples coming soon" tag.
export function BeforeAfter() {
  const { beforeAfter } = useCopy()
  return (
    <section className="section section-alt" aria-labelledby="before-after-heading">
      <div className="container">
        <SectionHead
          id="before-after-heading"
          eyebrow={beforeAfter.eyebrow}
          title={beforeAfter.heading}
          lead={beforeAfter.lead}
        />
        <div className="player">
          <p className="label player-tag">{beforeAfter.tag}</p>
          {beforeAfter.tracks.map((track) => (
            <div className="track" key={track.label}>
              <span className="label track-label">{track.label}</span>
              <button type="button" className="play" aria-label={track.play} disabled>
                <Play size={20} aria-hidden="true" />
              </button>
              <span className="track-title">{track.title}</span>
              <Waveform />
              <span className="track-time">–:––</span>
            </div>
          ))}
        </div>
        <a className="link player-link" href={TOOL_URL}>
          {beforeAfter.link}
          <ArrowRight size={16} aria-hidden="true" className="link-icon" />
        </a>
      </div>
    </section>
  )
}
