import { LangSwitch } from '../components'
import { useCopy } from '../i18n'

export function Header() {
  const { header } = useCopy()
  return (
    <header className="site-header">
      <a className="skip-link" href="#main">
        {header.skip}
      </a>
      <div className="container header-row">
        {/* Plain text, not a link: this is the home page, and an off-site first tab stop would pull people away
            before the CTA. TODO(asset A1): replace with the Faust logo (dark version, 28 px tall, alt "Faust Studio"). */}
        <p className="wordmark">Faust Studio</p>
        <LangSwitch />
      </div>
    </header>
  )
}
