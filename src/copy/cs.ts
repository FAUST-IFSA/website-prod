import { faust } from '../faust'
import type { Copy } from './en'

// TODO(cs-review): the whole file is a draft translation of en.ts and needs a native Czech speaker's review.
// "the tuner" is translated descriptively ("ladění zpěvu" / "nástroj"), never as "Auto-Tune" (TODO(name)).
// Czech typography: a one-letter preposition or conjunction (k s v z o u a i) must not end a line,
// so the space after it becomes a non-breaking space. Applied to every string below.
const ONE_LETTER_WORD = /(?<=^|\s)([ksvzouai])\s+/giu

function bindOneLetterWords<T>(value: T): T {
  if (typeof value === 'string') return value.replace(ONE_LETTER_WORD, '$1\u00a0') as T
  if (Array.isArray(value)) return value.map(bindOneLetterWords) as T
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, bindOneLetterWords(v)])) as T
  }
  return value
}

export const cs: Copy = bindOneLetterWords({
  meta: {
    title: 'Ladění zpěvu zdarma v prohlížeči · Faust Studio',
  },
  header: {
    skip: 'Přeskočit na hlavní obsah',
  },
  langSwitch: {
    label: 'Jazyk',
  },
  hero: {
    eyebrow: 'Ladění zpěvu zdarma · od Faust Studia, Praha',
    heading: 'Nalaďte svůj zpěv v prohlížeči, zdarma!',
    lead: 'Uvidíte každou notu, kterou jste zazpívali, nalaďte je jedním kliknutím nebo ručně a stáhněte si výsledek.',
    cta: 'Vyzkoušet zdarma',
    meta: 'Otevře nástroj · WAV, MP3, OGG nebo FLAC · do 100 MB',
    // TODO(email): "No account" must change when the tool adds an email step.
    trust: ['Zdarma', 'Bez registrace', 'Nahrávka zůstává ve vašem zařízení'],
    mobileNote: 'Úpravy nejlépe fungují na notebooku nebo počítači.',
    dropMessage: 'Skoro: otevřete nástroj a soubor přetáhněte tam.',
  },
  how: {
    eyebrow: 'Jak to funguje',
    heading: 'Čtyři kroky, pár minut',
    lead: 'Žádné pluginy ani DAW. Všechno proběhne v záložce prohlížeče.',
    steps: [
      {
        title: 'Nahrajte zpěv',
        body: 'Přetáhněte samotný zpěv, bez doprovodu. WAV, MP3, OGG nebo FLAC, do 10 minut.',
      },
      {
        title: 'Uvidíte své noty',
        body: 'Nástroj najde každou zazpívanou notu a rozloží ji podle klaviatury. Barva ukazuje, jak daleko je nota od čistého tónu.',
      },
      {
        // "Tune Up" is the tool's (English) button label at the pinned commit, so it stays untranslated.
        title: 'Tune Up, nebo posuňte ručně',
        body: 'Tlačítko Tune Up posune jedním kliknutím všechny rozladěné noty na nejbližší půltón. Chcete víc kontroly? Posuňte kteroukoli notu nahoru nebo dolů sami. Krok zpět jde vždycky.',
      },
      { title: 'Stáhněte', body: 'Exportujte WAV v plné kvalitě (24 bitů) nebo menší MP3 (192 kb/s).' },
    ],
    button: 'Otevřít nástroj',
    // TODO(cs-review)
    imageAlt: 'Editor ladění v nástroji: každá zazpívaná nota rozložená podle klaviatury.',
  },
  studio: {
    eyebrow: 'Studio za nástrojem',
    heading: 'Vzniklo ve Faust Studiu v Praze',
    // TODO(verify): the client site uses both "Faust Records" and "Faust Studio". Confirm which name to lead with.
    body: [
      'Studio Faust Records založil v roce 1991 hudebník Richard Mader, dva roky po sametové revoluci. Sídlí ve funkcionalistické budově nedaleko Pražského hradu a má dvě studia. Pod nimi se táhne betonový labyrint o rozloze 300 m², kde celé kapely nahrávají naživo.',
      'Blue Studio je postavené kolem mixážního pultu SSL 4000E s předzesilovači Neve a křídla Steinway. Green Studio má 80 let staré dřevěné podlahy a křídlo Hofmann z roku 1935.',
    ],
    // TODO(verify): the Green Studio page mentions gear "shared with studio BLUE and BROWN". Confirm that 2 is right.
    stats: [
      { value: '1991', label: 'Založeno' },
      { value: '2', label: 'Studia' },
      { value: '300 m²', label: 'Podzemní nahrávací prostor' },
    ],
    recordedLabel: 'Nahrávali tu',
    links: [
      { label: 'O studiu', href: faust.about },
      { label: 'Všechny reference', href: faust.references },
    ],
    // The art's sign reads "FAUST RECORDS"; the alt says "Faust Studio" until the naming TODO(verify) is settled.
    artAlt: 'Kresba budovy Faust Studia, zaoblené funkcionalistické nárožní budovy, při pohledu z ulice.',
  },
  next: {
    eyebrow: 'Další krok',
    heading: 'Připraveni na skutečné studio?',
    lead: 'Když si nahrávka zaslouží víc než rychlou opravu, nahrajte ji se zvukařem, nebo se to naučte sami.',
    cards: [
      {
        title: 'Blue Studio',
        body: 'Srdce Faustu: pult SSL 4000E, předzesilovače Neve, křídlo Steinway a přístup do podzemních nahrávacích prostor. Pro celé nahrávání i mix.',
        // TODO(verify): confirm price with the studio before launch.
        meta: 'Od 1 000 Kč (45 €) za hodinu, se zvukařem',
        link: 'Prohlédnout Blue Studio',
        href: faust.blueStudio,
      },
      {
        title: 'Green Studio',
        body: '80 let staré dřevěné podlahy, křídlo Hofmann z roku 1935 a posuvné závěsy, kterými se ladí zvuk místnosti. Hlavně pro menší nahrávání, mastering a projekty s menším rozpočtem.',
        // TODO(verify): confirm price with the studio before launch.
        meta: 'Od 700 Kč (30 €) za hodinu, se zvukařem',
        link: 'Prohlédnout Green Studio',
        href: faust.greenStudio,
      },
      {
        title: 'Kurzy',
        body: 'Krátké i dlouhé kurzy nahrávání, tvorby beatů, syntezátorů a analogového, páskového i digitálního záznamu, pro skupiny i jednotlivce. Vedou je zvukaři a producenti studia.',
        meta: 'Skupinově nebo individuálně',
        link: 'Zobrazit kurzy',
        href: faust.courses,
      },
    ],
    book: 'Rezervovat studio',
    rates: 'Všechny ceny',
  },
  faq: {
    heading: 'Otázky',
    items: [
      { q: 'Je to zdarma?', a: 'Ano. Nahrát, naladit i stáhnout můžete zdarma.' },
      // TODO(email): placeholder until the tool team decides on email. Don't promise "email only at download".
      { q: 'Potřebuji účet?', a: 'Teď ne. Nástroj můžete používat bez registrace.' },
      {
        q: 'Nahrává se můj zvuk někam?',
        a: 'Ne. Nástroj běží celý ve vašem prohlížeči a vaše nahrávka se nikdy neposílá nám ani nikomu jinému. Nedávné soubory zůstávají uložené v tomto prohlížeči na tomto zařízení, abyste je mohli znovu otevřít. Kdykoli je můžete smazat.',
      },
      {
        q: 'Jaké soubory fungují?',
        a: 'WAV, MP3, OGG a FLAC, do 100 MB a délky 10 minut.',
      },
      {
        q: 'Mohu použít nahrávku s hudbou v pozadí?',
        a: 'Ne. Soubor musí obsahovat jen zpěv, bez hudby, beatu nebo doprovodu. Nahrávka s jakýmkoli doprovodem nebude vůbec fungovat.',
      },
      { q: 'Co dostanu při stažení?', a: 'WAV v plné kvalitě (24 bitů) nebo menší MP3 (192 kb/s).' },
      {
        q: 'Funguje to na telefonu?',
        a: 'Otevřít ho na telefonu můžete. Posouvat noty je ale mnohem snazší myší nebo touchpadem, takže nejlepší je notebook nebo počítač.',
      },
    ],
  },
  footer: {
    description: 'Nahrávací studio, rezidenční a tvůrčí prostor nedaleko Pražského hradu. Od roku 1991.',
    contactLabel: 'Kontakt',
    contact: 'Kontakt a rezervace',
    phoneNote: '(česky a anglicky)',
    address: 'Na hutích 665/8, Praha, Česko',
    copyright: '© 2026 Faust Studio',
  },
})
