import { CircleAlert, MailCheck } from 'lucide-react'
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { Outbound, SectionHead } from '../components'
import { faust, SIGNUP_CONSENT_VERSION, SIGNUP_ENDPOINT } from '../faust'
import { useCopy, useLang } from '../i18n'

// States from design-spec §4.8. 'rejected' is the endpoint's 400; 'failed' is anything else (5xx, network, timeout).
type Status = 'idle' | 'incomplete' | 'submitting' | 'success' | 'rejected' | 'failed'

export function Signup() {
  const { signup } = useCopy()
  const { lang } = useLang()
  const [email, setEmail] = useState('')
  const [emailValid, setEmailValid] = useState(false)
  const [emailInvalid, setEmailInvalid] = useState(false) // the field error is shown (on blur or attempt, never while typing)
  const [consent, setConsent] = useState(false)
  const [website, setWebsite] = useState('') // honeypot; the server rejects any value
  const [status, setStatus] = useState<Status>('idle')
  const emailRef = useRef<HTMLInputElement>(null)
  const consentRef = useRef<HTMLInputElement>(null)
  const doneRef = useRef<HTMLDivElement>(null)

  const complete = emailValid && consent
  const sending = status === 'submitting'

  // The focused button has just been removed with the form, so the confirmation takes focus.
  useEffect(() => {
    if (status === 'success') doneRef.current?.focus()
  }, [status])

  // Editing after a hint or an error returns the form to idle, which also clears the announcer.
  const backToIdle = () => {
    if (status === 'incomplete' || status === 'rejected' || status === 'failed') setStatus('idle')
  }

  const onEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const valid = e.target.value !== '' && e.target.validity.valid
    setEmail(e.target.value)
    setEmailValid(valid)
    if (valid) setEmailInvalid(false)
    backToIdle()
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (sending) return
    if (!complete) {
      setEmailInvalid(email !== '' && !emailValid)
      setStatus('incomplete')
      ;(emailValid ? consentRef : emailRef).current?.focus()
      return
    }
    void send()
  }

  const send = async () => {
    setStatus('submitting')
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 10_000)
    try {
      const res = await fetch(SIGNUP_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, lang, source: 'landing', consent: true, consentVersion: SIGNUP_CONSENT_VERSION, website }),
        signal: controller.signal,
      })
      setStatus(res.ok ? 'success' : res.status === 400 ? 'rejected' : 'failed')
    } catch {
      setStatus('failed')
    } finally {
      clearTimeout(timer)
    }
  }

  const announce = {
    idle: '',
    incomplete: signup.incomplete,
    submitting: signup.submitting,
    success: signup.successTitle,
    rejected: signup.errorRejected,
    failed: signup.errorGeneric,
  }[status]
  const buttonLabel = sending ? signup.submitting : status === 'rejected' || status === 'failed' ? signup.retry : signup.submit

  return (
    <section className="section signup" aria-labelledby="signup-heading">
      <div className="container signup-grid">
        <SectionHead id="signup-heading" eyebrow={signup.eyebrow} title={signup.heading} lead={signup.lead} />
        {status === 'success' ? (
          <div className="signup-done" tabIndex={-1} ref={doneRef}>
            <MailCheck size={24} aria-hidden="true" className="signup-done-icon" />
            <div>
              <p className="signup-done-title">{signup.successTitle}</p>
              <p className="muted">{signup.successBody}</p>
            </div>
          </div>
        ) : (
          <form className="signup-form" noValidate aria-busy={sending || undefined} onSubmit={onSubmit}>
            <label className="label" htmlFor="signup-email">
              {signup.emailLabel}
            </label>
            <input
              ref={emailRef}
              className="signup-input"
              id="signup-email"
              type="email"
              name="email"
              autoComplete="email"
              inputMode="email"
              spellCheck={false}
              value={email}
              onChange={onEmailChange}
              onBlur={() => setEmailInvalid(email !== '' && !emailValid)}
              aria-invalid={emailInvalid || undefined}
              aria-describedby={emailInvalid ? 'signup-email-error' : undefined}
            />
            {emailInvalid && (
              <p id="signup-email-error" className="signup-error">
                <CircleAlert size={20} aria-hidden="true" />
                {signup.invalidEmail}
              </p>
            )}
            <div className="signup-consent">
              <input
                ref={consentRef}
                id="signup-consent"
                type="checkbox"
                checked={consent}
                onChange={(e) => {
                  setConsent(e.target.checked)
                  backToIdle()
                }}
              />
              {/* The privacy link sits after the label, not inside it: a link in a label toggles the box in some browsers. */}
              <p>
                <label htmlFor="signup-consent">{signup.consent}</label>
                {faust.privacy && <> <Outbound href={faust.privacy}>{signup.privacy}</Outbound></>}
              </p>
            </div>
            {/* Honeypot: off-screen (not display:none, which some bots skip), hidden from assistive tech, out of the tab order. */}
            <div className="signup-trap" aria-hidden="true">
              <input type="text" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
            </div>
            {/* aria-disabled, not disabled: stays focusable so an incomplete attempt can explain itself (§4.8). */}
            <button
              type="submit"
              className={`btn btn-primary${sending ? ' is-sending' : complete ? '' : ' is-inactive'}`}
              aria-disabled={!complete || sending || undefined}
            >
              {buttonLabel}
            </button>
            {status === 'incomplete' && <p className="signup-status">{signup.incomplete}</p>}
            {(status === 'rejected' || status === 'failed') && (
              <p className="signup-status signup-error">
                <CircleAlert size={20} aria-hidden="true" />
                {status === 'rejected' ? signup.errorRejected : signup.errorGeneric}
              </p>
            )}
          </form>
        )}
        {/* Mounted for the section's whole life, outside the form, so it survives the swap to the confirmation. */}
        <p className="sr-only" role="status" aria-live="polite">
          {announce}
        </p>
      </div>
    </section>
  )
}
