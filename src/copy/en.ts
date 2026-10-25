import { faust } from '../faust'

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
  footer: {
    description: 'Recording studio, residential and creative space near Prague Castle. Since 1991.',
    contactLabel: 'Contact',
    contact: 'Contact and booking',
    phoneNote: '(Czech and English)',
    address: 'Na hutích 665/8, Prague, Czechia',
    copyright: '© 2026 Faust Studio',
  },
}

export type Copy = typeof en
