// The export email gate (docs/email-gate-spec.md, design-spec §4.10). Not part of the landing page:
// scripts/build-tool.mjs builds this file on its own and injects it into the tool's built HTML, because we can't
// change the tool's repo. Plain DOM, no React: the only thing it knows about the tool is the Export button's selector.
import { gate as cs } from './copy/cs'
import { gate as en } from './copy/en'
import { PRIVACY_URL, SIGNUP_CONSENT_VERSION, SIGNUP_ENDPOINT } from './faust'
import css from './gate.css?inline'
import { initialLang, type Lang } from './lang'

const KEY = 'faust-landing:gate'
const TIMEOUT_MS = 10_000

// Same endpoint and JSON contract as the landing form (src/sections/Signup.tsx); the Worker is in worker/.
// Only called on a Subscribe press: skipping sends nothing. `website` is the honeypot.
async function subscribe(email: string, lang: Lang, website: string): Promise<'ok' | 'failed'> {
  const res = await fetch(SIGNUP_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, lang, source: 'tool', consent: true, consentVersion: SIGNUP_CONSENT_VERSION, website }),
  })
  return res.ok ? 'ok' : 'failed'
}

// Also kept in memory, so a blocked store can't make the gate reappear on the click that follows an answer.
let answered = false

function isAnswered() {
  if (answered) return true
  try {
    // localStorage: subscribed, never ask again. sessionStorage: skipped or signup failed, not again this session.
    return localStorage.getItem(KEY) !== null || sessionStorage.getItem(KEY) !== null
  } catch {
    return false
  }
}

function answer(save: () => void) {
  answered = true
  try {
    save()
  } catch {
    // Storage blocked: remembered for this page load only.
  }
}

function el<K extends keyof HTMLElementTagNameMap>(tag: K, name: string, text = '') {
  const node = document.createElement(tag)
  node.className = `faust-gate-${name}`
  node.textContent = text
  return node
}

// Lucide icons (X, CircleAlert, MailCheck), inlined: lucide-react would pull React into the tool's page.
const ICONS = {
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  alert: '<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>',
  mailCheck:
    '<path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/><path d="m16 19 2 2 4-4"/>',
}
const icon = (name: keyof typeof ICONS, size: number) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`

function ask(button: HTMLElement) {
  const lang = initialLang()
  const copy = { en, cs }[lang]

  const dialog = document.createElement('dialog')
  dialog.className = 'faust-gate'
  dialog.lang = lang // the tool's page is lang="en"

  const heading = el('h2', 'title', copy.heading)
  heading.id = 'faust-gate-title'
  heading.tabIndex = -1
  const lead = el('p', 'text', copy.lead)
  lead.id = 'faust-gate-text'
  dialog.setAttribute('aria-labelledby', heading.id)
  dialog.setAttribute('aria-describedby', lead.id)

  const email = el('input', 'input')
  email.id = 'faust-gate-email'
  email.type = 'email'
  email.autocomplete = 'email'
  email.inputMode = 'email'
  email.spellcheck = false
  email.setAttribute('aria-describedby', 'faust-gate-consent')
  const label = el('label', 'label', copy.emailLabel)
  label.htmlFor = email.id
  const error = el('p', 'error')
  error.id = 'faust-gate-error'
  error.hidden = true
  error.innerHTML = icon('alert', 20)
  error.append(el('span', 'error-text', copy.invalidEmail.replace('{skip}', copy.skip)))
  const consent = el('p', 'consent', `${copy.consent.replace('{subscribe}', copy.subscribe)} `)
  consent.id = 'faust-gate-consent'
  // New tab: leaving /tool/ in this one would destroy the visitor's unsaved audio work.
  const privacy = el('a', 'privacy', copy.privacy)
  privacy.href = PRIVACY_URL
  privacy.target = '_blank'
  privacy.rel = 'noopener'
  consent.append(privacy)
  const submit = el('button', 'btn', copy.subscribe)
  submit.classList.add('faust-gate-subscribe')
  const skip = el('button', 'btn', copy.skip)
  skip.type = 'button'
  const form = el('form', 'form')
  form.noValidate = true // our own message, and only on a Subscribe attempt
  // Honeypot, as on the landing form (design-spec §4.8 item 5): off-screen, hidden from assistive tech, out of the
  // tab order. The server rejects any value.
  const website = el('input', 'trap-input')
  website.type = 'text'
  website.name = 'website'
  website.tabIndex = -1
  website.autocomplete = 'off'
  const trap = el('div', 'trap')
  trap.setAttribute('aria-hidden', 'true')
  trap.append(website)
  // One wrapper so the two answers stay in view together on a small phone (sticky, see gate.css).
  const actions = el('div', 'actions')
  actions.append(submit, skip)
  form.append(label, email, error, consent, trap, actions)
  const question = el('div', 'ask')
  question.append(heading, lead, form)

  // Last in the DOM so Tab reaches the two answers first; drawn top-right.
  const close = el('button', 'close')
  close.type = 'button'
  close.setAttribute('aria-label', copy.close)
  close.innerHTML = icon('x', 24)
  const status = el('p', 'status')
  status.setAttribute('role', 'status')
  dialog.append(question, close, status)

  // While the pair is sticky: a rule above it when text is scrolled underneath, and scroll padding of its height
  // so a focused field or link is never hidden behind it.
  const fit = () => {
    const sticky = getComputedStyle(actions).position === 'sticky'
    dialog.style.scrollPaddingBottom = sticky ? `${actions.offsetHeight}px` : ''
    actions.classList.toggle('is-stuck', dialog.scrollTop + dialog.clientHeight < dialog.scrollHeight - 1)
  }
  dialog.addEventListener('scroll', fit)
  window.addEventListener('resize', fit)

  let sending = false

  // After an answer: click Export again (it now passes the listener below) so the tool's own menu opens.
  const proceed = () => {
    dialog.close()
    button.click()
  }
  // The tool listens for shortcuts on window (space plays, undo, delete resets notes). Inert doesn't stop those, and
  // focus can sit on <body> while the dialog is open, so keep every key from the tool until it closes.
  const blockKeys = (e: KeyboardEvent) => e.stopPropagation()
  window.addEventListener('keydown', blockKeys, true)
  dialog.addEventListener('close', () => {
    window.removeEventListener('keydown', blockKeys, true)
    window.removeEventListener('resize', fit)
    dialog.remove()
    button.focus()
  })
  // Escape and Close leave without exporting and without an answer. Both are ignored while submitting.
  dialog.addEventListener('cancel', (e) => {
    if (sending) e.preventDefault()
  })
  close.addEventListener('click', () => {
    if (!sending) dialog.close()
  })

  skip.addEventListener('click', () => {
    if (sending) return
    answer(() => sessionStorage.setItem(KEY, 'skipped'))
    proceed()
  })

  const isValid = () => email.value.trim() !== '' && email.validity.valid
  email.addEventListener('input', () => {
    if (error.hidden || !isValid()) return
    error.hidden = true
    email.removeAttribute('aria-invalid')
    email.setAttribute('aria-describedby', consent.id)
    fit()
  })

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    if (sending) return
    if (!isValid()) {
      error.hidden = false
      email.setAttribute('aria-invalid', 'true')
      email.setAttribute('aria-describedby', `${consent.id} ${error.id}`)
      fit()
      email.focus()
      return
    }
    sending = true
    // aria-disabled, never disabled: a disabled button drops the keyboard focus and would look like the lesser choice.
    form.setAttribute('aria-busy', 'true')
    submit.setAttribute('aria-disabled', 'true')
    skip.setAttribute('aria-disabled', 'true')
    submit.textContent = status.textContent = copy.sending
    // The export never waits on the signup for more than TIMEOUT_MS.
    const ok =
      (await Promise.race([
        subscribe(email.value.trim(), lang, website.value).catch(() => 'failed' as const),
        new Promise<'failed'>((resolve) => setTimeout(resolve, TIMEOUT_MS, 'failed')),
      ])) === 'ok'
    sending = false
    if (ok) answer(() => localStorage.setItem(KEY, 'subscribed'))
    else answer(() => sessionStorage.setItem(KEY, 'failed'))

    // Result step: the visitor must be told to confirm by email, or that the signup failed, before the menu opens.
    const title = el('h2', 'title', ok ? copy.successTitle : copy.failedTitle)
    title.id = heading.id
    title.tabIndex = -1
    const head = el('div', 'result-head')
    head.innerHTML = icon(ok ? 'mailCheck' : 'alert', 24)
    head.append(title)
    const body = el('p', 'text', ok ? copy.successBody : copy.failedBody)
    body.id = lead.id
    const go = el('button', 'btn', copy.continue)
    go.type = 'button'
    go.addEventListener('click', proceed)
    const result = el('div', 'result')
    result.append(head, body, go)
    question.replaceWith(result)
    title.focus()
    status.textContent = title.textContent
  })

  document.body.append(dialog)
  // showModal() gives the modal behaviour: top layer, focus trapped, the page behind inert, Escape handled.
  dialog.showModal()
  fit()
  // Not the email field: that would favour one answer, and on a phone open the keyboard over the Skip button.
  heading.focus()
}

document.head.append(Object.assign(document.createElement('style'), { textContent: css }))

// Capture phase on document runs before React's listener on #root, so the tool's menu doesn't open. Keyboard
// activation arrives as the same click event. If the selector matches nothing, the tool works as without the gate.
document.addEventListener(
  'click',
  (e) => {
    const button = e.target instanceof Element ? e.target.closest<HTMLElement>(__EXPORT_BUTTON__) : null
    if (!button || isAnswered()) return
    try {
      ask(button)
    } catch {
      return // e.g. no <dialog> support: let the click through
    }
    e.preventDefault()
    e.stopPropagation()
  },
  true,
)

// Fetch the font when the Export button first appears (the editor screen), so the card doesn't reflow on first open.
if (!isAnswered()) {
  const seen = new MutationObserver(() => {
    if (!document.querySelector(__EXPORT_BUTTON__)) return
    seen.disconnect()
    // The sample text decides which unicode-range files load: Czech also needs latin-ext.
    void document.fonts.load('600 17px "Jost Variable"', initialLang() === 'cs' ? 'aě' : 'a')
  })
  seen.observe(document.documentElement, { childList: true, subtree: true })
}
