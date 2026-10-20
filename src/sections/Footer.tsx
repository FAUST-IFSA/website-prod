import emblem1x from '../assets/faust-dark-96.webp'
import emblem2x from '../assets/faust-dark-192.webp'
import { LangSwitch, Outbound } from '../components'
import { faust } from '../faust'
import { useCopy } from '../i18n'

export function Footer() {
  const { footer, langSwitch } = useCopy()
  return (
    <footer className="footer night">
      <div className="container">
        <div className="footer-grid">
          <div>
            {/* Decorative emblem (alt=""): the wordmark text below names the brand. */}
            <img
              className="footer-emblem"
              src={emblem1x}
              srcSet={`${emblem1x} 1x, ${emblem2x} 2x`}
              width={96}
              height={96}
              alt=""
              loading="lazy"
            />
            <p className="wordmark">{faust.brandName}</p>
            <p className="muted">{footer.description}</p>
            <p className="footer-home">
              <Outbound href={faust.home}>fauststudio.net</Outbound>
            </p>
          </div>
          <div>
            <p className="label">{footer.contactLabel}</p>
            <ul className="footer-list" role="list">
              <li>
                <Outbound href={faust.contact}>{footer.contact}</Outbound>
              </li>
              <li>
                <a className="link" href={`mailto:${faust.email}`}>
                  {faust.email}
                </a>
              </li>
              <li>
                <a className="link" href={`tel:${faust.phone.replaceAll(' ', '')}`}>
                  {faust.phone}
                </a>{' '}
                <span className="muted">{footer.phoneNote}</span>
              </li>
              <li className="muted">{footer.address}</li>
            </ul>
          </div>
          <div>
            <p className="label">{langSwitch.label}</p>
            <LangSwitch />
            <ul className="footer-list" role="list">
              <li>
                <Outbound href={faust.instagram}>Instagram</Outbound>
              </li>
              <li>
                <Outbound href={faust.facebook}>Facebook</Outbound>
              </li>
            </ul>
          </div>
        </div>
        <p className="copyright">{footer.copyright}</p>
      </div>
    </footer>
  )
}
