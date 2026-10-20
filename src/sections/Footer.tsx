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
            {/* TODO(asset A1): replace the wordmark with the Faust logo (light version, alt "Faust Studio"). */}
            <p className="wordmark">Faust Studio</p>
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
