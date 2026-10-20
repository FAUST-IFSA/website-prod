import emblem1x from '../assets/faust-light-64.webp'
import emblem2x from '../assets/faust-light-128.webp'
import { LangSwitch } from '../components'
import { faust } from '../faust'
import { useCopy } from '../i18n'

export function Header() {
  const { header } = useCopy()
  return (
    <header className="site-header">
      <a className="skip-link" href="#main">
        {header.skip}
      </a>
      <div className="container header-row">
        {/* Not a link: this is the home page, and an off-site first tab stop would pull people away before the CTA.
            The emblem is decorative (alt=""): the wordmark text next to it names the brand. */}
        <div className="brand">
          <img src={emblem1x} srcSet={`${emblem1x} 1x, ${emblem2x} 2x`} width={64} height={64} alt="" />
          <p className="wordmark">{faust.headerBrandName}</p>
        </div>
        <LangSwitch />
      </div>
    </header>
  )
}
