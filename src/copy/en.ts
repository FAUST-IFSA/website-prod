import { faust, PRIVACY_POLICY_VERSION } from '../faust'

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
    // TODO(email): "No account" must change when the tool adds an email step.
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
      // TODO(email): placeholder until the tool team decides on email. Don't promise "email only at download".
      { q: 'Do I need an account?', a: 'Not right now. You can use the tuner without signing up.' },
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
    // Consent text, version 2026-11-v1 (design-spec §4.8). Bump SIGNUP_CONSENT_VERSION whenever this changes, in either language.
    consent: 'Faust Studio may email me about studio sessions, courses and tuner news, and I can unsubscribe at any time.',
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
    updated: `Last updated 4 November 2026 · Version ${PRIVACY_POLICY_VERSION}`,
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
          "This policy covers three things: the tuner's landing page, the tuner itself at /tool/, and the email signup form on the landing page.",
          "It does not cover fauststudio.net, Faust Studio's main site, which is run separately. Sites we link to (Wix, Instagram, Facebook) have their own privacy policies.",
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
        ],
      },
      {
        id: 'signup',
        heading: 'Email signup',
        blocks: [
          'Leaving your email is optional. The tuner is free and works exactly the same with or without it.',
          'If you subscribe, Faust Studio stores:',
          [
            'your email address',
            'the language you were using (English or Czech)',
            'the date and time you ticked the consent box',
            'the version of the consent sentence you agreed to',
            'which page you signed up from',
          ],
          "We don't record your IP address or browser details with your signup.",
          'We use this to email you news about studio sessions, courses and the tuner. The legal basis is your consent (GDPR Article 6(1)(a)), which you give by ticking the box. The box is never pre-ticked.',
          "Faust Studio's contact list lives in Wix, the platform that hosts fauststudio.net. Wix.com Ltd., based in Israel, processes it on Faust Studio's behalf and stores it in data centres in the United States and Ireland. The EU recognises Israel as having adequate data protection; transfers to the United States are covered by EU standard contractual clauses under Wix's data-processing terms.",
          { label: "Wix's privacy policy", href: faust.wixPrivacy },
          // TODO(verify): Faust must confirm they delete on request (handover note in docs/email-capture-migration.md).
          'We keep your email until you unsubscribe or ask us to delete it.',
          "Every email we send has an unsubscribe link. You can also withdraw your consent at any time by writing to the email address under \"Your rights\". Withdrawing stops future emails; it doesn't affect what was sent while your consent was valid.",
        ],
      },
      {
        id: 'cookies',
        heading: 'No cookies, no tracking',
        blocks: [
          "This site sets no cookies, runs no analytics and has no trackers or embedded social media buttons. We don't build profiles of you and make no automated decisions about you.",
          'Two things are stored in your browser, and only there:',
          [
            "your language choice (English or Czech), saved in your browser's local storage only when you click the EN/CS switch",
            'the tuner\'s recent files (see "The tuner" above)',
          ],
          "Both stay on your device and go away when you clear this site's data.",
          // Verified by the programmer on preview (spec criterion 9): the landing page and /tool/ request nothing off-origin.
          'Nothing on this site is loaded from other companies. The fonts, scripts and images all come from the site itself, so no third party learns that you visited.',
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
          'If you subscribed, the version of the consent sentence you agreed to is stored with your email, so we can always tell which wording you saw.',
        ],
      },
    ],
  },
}

export type Copy = typeof en
