import { faust, PRIVACY_POLICY_VERSION } from '../faust'

// Export email gate, shown over the tool (src/gate.ts, design-spec §4.10 and §5 "Export gate"). A separate export
// so the gate's bundle carries only these strings. {subscribe} and {skip} are filled with those two labels.
export const gate = {
  heading: 'Want to hear from Faust Studio?',
  lead: 'Leave your email for news from Faust Studio, the Prague recording studio behind this free tuner, or skip this. Your export is the same either way.',
  emailLabel: 'Email (optional)',
  // Consent text for source "tool", version 2026-11-v2 (design-spec §4.8 table). Bump the version whenever this changes, in either language.
  consent:
    'By choosing “{subscribe}”, you agree that Faust Studio may email you about studio sessions, courses and tuner news, and may see whether you open the emails and which links you click. This is optional, and you can unsubscribe at any time.',
  // Links to our policy page (PRIVACY_URL), in a new tab so the audio work isn't lost.
  privacy: 'Privacy policy (opens in a new tab)',
  subscribe: 'Subscribe and export',
  sending: 'Subscribing…',
  skip: 'Export without subscribing',
  invalidEmail: 'Enter an email address like name@example.com, or choose “{skip}”.',
  close: 'Close',
  // No confirmation email is sent (double opt-in is off), so nothing here may say "check your inbox".
  successTitle: "Thanks, you're on the list.",
  successBody: 'Faust Studio will email you about studio sessions, courses and tuner news.',
  failedTitle: "Your subscription didn't go through.",
  failedBody: "We couldn't save your email, so you're not subscribed. Your export isn't affected.",
  continue: 'Continue to export',
}

// Final English copy from docs/design-spec.md §5. Visible copy says "the tuner", never "Auto-Tune" (TODO(name)).
export const en = {
  meta: {
    title: 'Free vocal tuner in your browser · Faust Studio',
  },
  header: {
    skip: 'Skip to main content',
  },
  langSwitch: {
    label: 'Language',
  },
  hero: {
    eyebrow: 'Free vocal tuner · by Faust Studio, Prague',
    heading: 'Tune your vocal in your browser, for free!',
    lead: 'See every note you sang, tune them in one click or by hand, and download the result.',
    cta: 'Try it free',
    meta: 'Opens the tuner · WAV, MP3, OGG or FLAC · up to 100 MB',
    // TODO(email): true while the export prompt is optional (design-spec §4.10). "No account" and "Free" must change if an email ever becomes required to export.
    trust: ['Free', 'No account', 'Your audio stays on your device'],
    mobileNote: 'Editing works best on a laptop or desktop.',
    dropMessage: 'Almost: open the tuner, then drop your file there.',
  },
  how: {
    eyebrow: 'How it works',
    heading: 'Four steps, a few minutes',
    lead: 'No plugins and no DAW. It all happens in the browser tab.',
    steps: [
      {
        title: 'Upload a vocal',
        body: 'Drop in a solo vocal recording, without the backing track. WAV, MP3, OGG or FLAC, up to 10 minutes.',
      },
      {
        title: 'See your notes',
        body: 'The tuner finds every note you sang and lays them out against a piano keyboard, colored by how far each one is from true pitch.',
      },
      {
        // "Tune Up" is the tool's button label at the pinned commit. If the tool renames it, update this.
        title: 'Tune Up, or drag to fix',
        body: 'Press Tune Up to move every off-pitch note to the nearest semitone in one click. Want more control? Drag any note up or down yourself. Undo is always there.',
      },
      { title: 'Download', body: 'Export a full-quality 24-bit WAV, or a smaller 192 kbps MP3.' },
    ],
    button: 'Open the tuner',
    imageAlt: "The tuner's pitch editor: every sung note laid out against a piano keyboard.",
  },
  studio: {
    eyebrow: 'The studio behind the tool',
    heading: 'Made at Faust Studio, Prague',
    // TODO(verify): the client site uses both "Faust Records" and "Faust Studio". Confirm which name to lead with.
    body: [
      'Studio Faust Records was founded in 1991 by musician Richard Mader, two years after the Velvet Revolution. It sits in a functionalist building near Prague Castle and has two studios. Underneath them runs a 300 m² concrete labyrinth where whole bands record live.',
      'The Blue Studio is built around an SSL 4000E console with a Neve front end and a Steinway grand. The Green Studio has 80-year-old hardwood floors and a 1935 Hofmann grand piano.',
    ],
    // TODO(verify): the Green Studio page mentions gear "shared with studio BLUE and BROWN". Confirm that 2 is right.
    stats: [
      { value: '1991', label: 'Founded' },
      { value: '2', label: 'Studios' },
      { value: '300 m²', label: 'Underground live space' },
    ],
    recordedLabel: 'Recorded here',
    links: [
      { label: 'About the studio', href: faust.about },
      { label: 'All references', href: faust.references },
    ],
    // The art's sign reads "FAUST RECORDS"; the alt says "Faust Studio" until the naming TODO(verify) is settled.
    artAlt: 'Line drawing of the Faust Studio building, a curved functionalist corner building, seen from the street.',
  },
  next: {
    eyebrow: 'Next step',
    heading: 'Ready for a real room?',
    lead: 'When a take deserves more than a quick fix, record it with an engineer or learn to do it yourself.',
    cards: [
      {
        title: 'Blue Studio',
        body: 'The heart of Faust: SSL 4000E console, Neve front end, a Steinway grand and access to the underground live rooms. For full tracking and mixing sessions.',
        // TODO(verify): confirm price with the studio before launch.
        meta: 'From 1,000 CZK (€45) per hour, with engineer',
        link: 'See the Blue Studio',
        href: faust.blueStudio,
      },
      {
        title: 'Green Studio',
        body: '80-year-old hardwood floors, a 1935 Hofmann grand and movable curtains to shape the sound. Used mainly for smaller sessions, mastering and budget projects.',
        // TODO(verify): confirm price with the studio before launch.
        meta: 'From 700 CZK (€30) per hour, with engineer',
        link: 'See the Green Studio',
        href: faust.greenStudio,
      },
      {
        title: 'Courses',
        body: "Short and long courses in recording, beat-making, synths, and analogue, tape and digital recording, for groups or individuals. Led by the studio's engineers and producers.",
        meta: 'Groups or one-to-one',
        link: 'See courses',
        href: faust.courses,
      },
    ],
    book: 'Book a session',
    rates: 'See all rates',
  },
  faq: {
    heading: 'Questions',
    items: [
      { q: 'Is it free?', a: 'Yes. You can upload, tune and download for free.' },
      // TODO(email): true while the export prompt is optional (design-spec §4.10); rewrite if an email ever becomes required.
      {
        q: 'Do I need an account?',
        a: "No. There is no account and nothing to sign up for. When you export, the tuner asks whether you'd like emails from Faust Studio. You can say no and export just the same.",
      },
      {
        q: 'Does my audio get uploaded?',
        a: 'No. The tuner runs entirely in your browser, and your audio is never sent to us or anyone else. Your recent files are kept in this browser, on this device, so you can reopen them. You can remove them at any time.',
      },
      {
        q: 'Which files work?',
        a: 'WAV, MP3, OGG and FLAC, up to 100 MB and 10 minutes long.',
      },
      {
        q: 'Can I use a track with music behind the vocal?',
        a: 'No. Your file must be vocals only, with no music, beat or backing track. A track with any backing in it will not work at all.',
      },
      { q: 'What do I get when I download?', a: 'A full-quality 24-bit WAV, or a smaller 192 kbps MP3.' },
      {
        q: 'Does it work on my phone?',
        a: 'You can open it on a phone. Moving notes is much easier with a mouse or trackpad, so a laptop or desktop is best.',
      },
    ],
  },
  signup: {
    eyebrow: 'Stay in touch',
    heading: 'Hear from the studio',
    lead: 'Leave your email for news about studio sessions, courses and the tuner. The tuner stays free, with or without it.',
    emailLabel: 'Email',
    // Consent text, version 2026-11-v2 (design-spec §4.8 lists every version). Bump SIGNUP_CONSENT_VERSION whenever this changes, in either language.
    consent: 'Faust Studio may email me about studio sessions, courses and tuner news, and may see whether I open the emails and which links I click. I can unsubscribe at any time.',
    // Links to our policy page (PRIVACY_URL).
    privacy: 'Privacy policy',
    submit: 'Subscribe',
    submitting: 'Sending…',
    retry: 'Try again',
    incomplete: 'Enter your email and tick the box first.',
    invalidEmail: 'Enter an email address like name@example.com.',
    errorRejected: "That email address wasn't accepted. Check it and try again.",
    errorGeneric: "Something went wrong and your email wasn't saved. Please try again.",
    successTitle: "Thanks, you're on the list.",
    successBody: 'Faust Studio will email you about studio sessions, courses and tuner news.',
  },
  gate,
  footer: {
    description: 'Recording studio, residential and creative space near Prague Castle. Since 1991.',
    contactLabel: 'Contact',
    contact: 'Contact and booking',
    phoneNote: '(Czech and English)',
    address: 'Na hutích 665/8, Prague, Czechia',
    copyright: '© 2026 Faust Studio',
    privacy: 'Privacy policy',
  },
  // Privacy policy page (/privacy/): docs/privacy-policy-spec.md, design-spec §4.9 (layout) and §5 (this text).
  // A block is a paragraph (string), a bullet list (string[]) or a standalone link line ({ label, href }).
  privacy: {
    meta: {
      title: 'Privacy policy · Faust Studio',
      description: 'How this site and the free vocal tuner handle your data. The tuner runs in your browser and uploads nothing; your email is stored only if you subscribe.',
    },
    back: 'Back to the tuner page',
    eyebrow: 'Faust Studio · vocal tuner',
    heading: 'Privacy policy',
    // Bump the date here (both languages) and PRIVACY_POLICY_VERSION together; every version is listed in design-spec §4.9.
    updated: `Last updated 12 November 2026 · Version ${PRIVACY_POLICY_VERSION}`,
    intro:
      'This page explains what happens to your data when you use the free vocal tuner and the site around it, and what Faust Studio keeps if you leave your email. The short version: the tuner works entirely in your browser and your audio never leaves your device. We store your email address only if you subscribe, and you can unsubscribe at any time.',
    // Rendered in the "scope" section only when faust.privacy is set.
    seeAlso: "See also: Faust Studio's privacy policy",
    // The "Who is responsible" section was removed by the user (2026-11-04) until Faust says which sole trader is the
    // controller. TODO(verify): Ing. Richard Mader, IČO 10170367 (founder) / Richard Mader, IČO 01577778 (jr.); address
    // Na hutích 665/8, 160 00 Praha 6. Restore the section (design-spec §5) when they answer.
    // The "Visiting this site" (hosting) section was removed too (user decision, 2026-11-04): GitHub Pages isn't the
    // permanent host. The launch host needs one back (processor, legitimate interest, transfer safeguard); see CLAUDE.md.
    sections: [
      {
        id: 'scope',
        heading: 'What this page covers',
        blocks: [
          "This policy covers the tuner's landing page, the tuner itself at /tool/, and the two places where you can leave your email: the form on the landing page and the prompt that appears when you export from the tuner.",
          "It does not cover fauststudio.net, Faust Studio's main site, which is run separately. Sites we link to (Ecomail, Instagram, Facebook) have their own privacy policies.",
        ],
      },
      {
        id: 'tuner',
        heading: 'The tuner',
        // True at the pinned autotuner commit (storage/recent.ts). Re-check when the pin moves.
        blocks: [
          'The tuner runs entirely in your browser. When you open an audio file, your browser decodes it, finds the notes, applies your changes and creates the download, all on your device. Nothing is uploaded: not the audio, not the file name, not what you changed. There is no account and no login.',
          "So that you can reopen a file later, the tuner keeps the files you have opened in your browser's own storage (IndexedDB) on your device. Only your browser can read them, and they are never sent anywhere.",
          'To remove them, clear this site\'s data in your browser\'s privacy settings (usually under "Cookies and site data" or "Website data"). Do the same if you used the tuner on a shared computer.',
          'When you export, the tuner asks whether you would like emails from Faust Studio. That is optional. It is the only point at which the tuner can send anything anywhere, and what it sends is your email address, only if you choose to subscribe (see "Email signup" below). Your audio is never part of it.',
        ],
      },
      {
        id: 'signup',
        heading: 'Email signup',
        blocks: [
          'Leaving your email is optional. The tuner is free and works exactly the same with or without it.',
          'We ask in two places: the form on the landing page, and a prompt that appears when you export from the tuner. If you close the prompt or export without subscribing, nothing is sent to us, and anything you typed into the email field is discarded.',
          'If you subscribe, Faust Studio stores:',
          [
            'your email address',
            'the language you were using (English or Czech)',
            'the date and time you subscribed',
            'the version of the consent text you agreed to',
            'where you subscribed (the landing page or the tuner)',
          ],
          "We don't ask for anything else: no name, no account, no password.",
          // True while double opt-in is off on the Ecomail list (worker/README.md). The with-confirmation wording is in design-spec §5, "Draft for double opt-in".
          "When you subscribe, your address is added to the list straight away. We don't send a confirmation email.",
          `We use your address to email you news about studio sessions, courses and the tuner. The legal basis is your consent (GDPR Article 6(1)(a)). You give it by ticking the box on the landing page form, or by choosing "${gate.subscribe}" in the tuner's prompt. Nothing is ticked or chosen for you.`,
          // Ecomail facts: reports/ecomail-email-gate.md F2. Don't write "EU only" or "Data Privacy Framework" for Ecomail.
          "Faust Studio's mailing list is kept in Ecomail, an email service run by ECOMAIL.CZ, s.r.o., Prague, Czechia. Ecomail processes the list on Faust Studio's behalf. Its main servers are in Frankfurt, Germany. Ecomail states that the data is kept in the EU and that some of its suppliers may also send data to the United States under EU-approved transfer arrangements.",
          { label: "Ecomail's terms and data-processing agreement (in Czech)", href: faust.ecomailTerms },
          // Report F1. It makes no promise that tracking can be switched off, because none is documented.
          'When Faust Studio emails you, the emails go out through Ecomail, which measures how they are read. Each email contains a small invisible image that tells Ecomail when the email is opened, and its links pass through Ecomail so that clicks are counted. Faust Studio can therefore see whether you opened an email, which links you clicked, and when. When an email is opened or a link is clicked, Ecomail also receives your IP address, an approximate location worked out from it, and details of your device and mail program. This is part of what you agree to when you subscribe.',
          // TODO(host): PROVISIONAL. The relay's host is not decided (pm, 2026-11-11) and nothing is deployed. This
          // paragraph and the link under it must be rewritten for whichever host the relay ends up on, before the
          // signup endpoint goes live. "Stores nothing itself" is a requirement on the relay (worker/README.md).
          // TODO(verify): the Data Privacy Framework sentence, against Cloudflare's entry on the official list (report F3).
          'Your signup reaches Ecomail through a small relay that Faust Studio runs on Cloudflare (Cloudflare, Inc., United States). Cloudflare processes the request, including your IP address, on its worldwide network, so it may be handled outside the EU. The relay passes your signup on to Ecomail and stores nothing itself. Transfers to the United States rest on the EU-US Data Privacy Framework.',
          { label: "Cloudflare's privacy policy", href: faust.cloudflarePrivacy },
          // TODO(verify): Faust must confirm they delete on request (handover note in docs/email-capture-migration.md).
          'We keep your email address until you unsubscribe or ask us to delete it.',
          "Every email we send has an unsubscribe link. You can also withdraw your consent at any time by writing to the email address under \"Your rights\". Withdrawing stops future emails; it doesn't affect what was sent while your consent was valid.",
        ],
      },
      {
        id: 'cookies',
        heading: 'No cookies, no tracking',
        blocks: [
          "This site sets no cookies, runs no analytics and has no trackers or embedded social media buttons. We don't build profiles of you and make no automated decisions about you.",
          'Three things are stored in your browser, and only there:',
          [
            "your language choice (English or Czech), saved in your browser's local storage only when you click the EN/CS switch",
            'the tuner\'s recent files (see "The tuner" above)',
            // The gate's keys (src/gate.ts, faust-landing:gate). If what it stores changes, this item changes.
            "your answer to the tuner's email prompt, saved only when you answer it, so that you aren't asked again: if you subscribed, in local storage; if you chose not to, in session storage, which your browser clears when you close the tab. It records only which answer you gave, never your email address.",
          ],
          "All of these stay on your device and go away when you clear this site's data.",
          // Verified by the programmer on preview (gate-spec criterion 8): the landing page, /privacy/ and /tool/ request
          // nothing off-origin except the one signup POST.
          'Nothing on this site is loaded from other companies. The fonts, scripts and images all come from the site itself, so no third party learns that you visited. The one time your browser contacts another company from this site is when you subscribe: it then sends your signup to the service described under "Email signup".',
          'This section is about the site. The emails you get if you subscribe are measured differently; "Email signup" above explains how.',
        ],
      },
      {
        id: 'rights',
        heading: 'Your rights',
        blocks: [
          'Under the GDPR you can ask Faust Studio to:',
          [
            'tell you what data it holds about you and give you a copy (access)',
            'correct it (rectification)',
            'delete it (erasure)',
            'limit how it is used (restriction)',
            'send it to you or to another provider in a common file format (portability)',
            'stop using it (objection)',
          ],
          'You can also withdraw your consent at any time.',
          'To do any of this, email Faust Studio:',
          { label: faust.email, href: `mailto:${faust.email}` },
          "You'll get a reply within one month, as the GDPR requires.",
          'If you think your data has been handled wrongly, you can complain to the Czech data protection authority, the Úřad pro ochranu osobních údajů, Pplk. Sochora 27, 170 00 Praha 7.',
          { label: 'uoou.gov.cz', href: faust.uoou },
        ],
      },
      {
        id: 'changes',
        heading: 'Changes to this policy',
        blocks: [
          `When this policy changes, the date and version number at the top of the page change with it. The current version is ${PRIVACY_POLICY_VERSION}.`,
          'Version 2026-11-v2 changed three things: signups now go to Ecomail instead of Wix, the tuner now offers the signup when you export, and this page now explains how the emails record opens and clicks.',
          'If you subscribed, the version of the consent text you agreed to is stored with your email, so we can always tell which wording you saw.',
        ],
      },
    ],
  },
}

export type Copy = typeof en
