import { faust, PRIVACY_POLICY_VERSION } from '../faust'
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
  // TODO(cs-review): consent sentence must keep the three facts of the EN one (who emails, about what, unsubscribe any time).
  signup: {
    eyebrow: 'Zůstaňte v kontaktu',
    heading: 'Novinky ze studia',
    lead: 'Nechte nám e‑mail a dozvíte se o nahrávání ve studiu, kurzech a novinkách nástroje. Nástroj zůstává zdarma, s e‑mailem i bez něj.',
    emailLabel: 'E‑mail',
    consent: 'Faust Studio mi může posílat e‑maily o nahrávání ve studiu, kurzech a novinkách nástroje a mohu se kdykoli odhlásit.',
    privacy: 'Zásady ochrany osobních údajů',
    submit: 'Odebírat novinky',
    submitting: 'Odesílám…',
    retry: 'Zkusit znovu',
    incomplete: 'Nejdřív zadejte e‑mail a zaškrtněte políčko.',
    invalidEmail: 'Zadejte e‑mailovou adresu ve tvaru jmeno@priklad.cz.',
    errorRejected: 'Tuto e‑mailovou adresu se nepodařilo přijmout. Zkontrolujte ji a zkuste to znovu.',
    errorGeneric: 'Něco se pokazilo a váš e‑mail se neuložil. Zkuste to prosím znovu.',
    successTitle: 'Díky, jste na seznamu.',
    successBody: 'Faust Studio vám bude posílat e‑maily o nahrávání ve studiu, kurzech a novinkách nástroje.',
  },
  footer: {
    description: 'Nahrávací studio, rezidenční a tvůrčí prostor nedaleko Pražského hradu. Od roku 1991.',
    contactLabel: 'Kontakt',
    contact: 'Kontakt a rezervace',
    phoneNote: '(česky a anglicky)',
    address: 'Na hutích 665/8, Praha, Česko',
    copyright: '© 2026 Faust Studio',
    privacy: 'Ochrana osobních údajů',
  },
  // TODO(cs-review): strojový překlad PRÁVNÍHO textu (zásady ochrany osobních údajů podle GDPR). Před tím, než
  // web opustí noindex, ho MUSÍ zkontrolovat rodilý mluvčí, ideálně s právním povědomím. Předloha: design-spec §5.
  privacy: {
    meta: {
      title: 'Ochrana osobních údajů · Faust Studio',
      description: 'Jak tento web a bezplatný nástroj na ladění zpěvu nakládají s vašimi daty. Nástroj běží ve vašem prohlížeči a nic nenahrává; váš e-mail ukládáme jen tehdy, když se přihlásíte k odběru.',
    },
    back: 'Zpět na stránku nástroje',
    eyebrow: 'Faust Studio · ladění zpěvu',
    heading: 'Ochrana osobních údajů',
    updated: `Poslední aktualizace 4. listopadu 2026 · Verze ${PRIVACY_POLICY_VERSION}`,
    intro:
      'Tato stránka vysvětluje, co se děje s vašimi daty, když používáte bezplatný nástroj na ladění zpěvu a web kolem něj, a co si Faust Studio uchová, pokud nám necháte svůj e-mail. Stručně: nástroj pracuje výhradně ve vašem prohlížeči a vaše nahrávka nikdy neopustí vaše zařízení. Vaši e-mailovou adresu ukládáme jen tehdy, když se přihlásíte k odběru, a odběr můžete kdykoli zrušit.',
    seeAlso: 'Viz také: zásady ochrany osobních údajů Faust Studia',
    // Části „Kdo za zpracování odpovídá“ a „Návštěva tohoto webu“ jsou odstraněny (viz komentář v en.ts).
    sections: [
      {
        id: 'scope',
        heading: 'Čeho se tato stránka týká',
        blocks: [
          'Tyto zásady se týkají tří věcí: úvodní stránky nástroje, samotného nástroje na adrese /tool/ a formuláře pro přihlášení k e-mailům na úvodní stránce.',
          'Netýkají se webu fauststudio.net, hlavního webu Faust Studia, který je provozován samostatně. Weby, na které odkazujeme (Wix, Instagram, Facebook), mají vlastní zásady ochrany osobních údajů.',
        ],
      },
      {
        id: 'tuner',
        heading: 'Nástroj',
        blocks: [
          'Nástroj běží výhradně ve vašem prohlížeči. Když otevřete zvukový soubor, váš prohlížeč ho dekóduje, najde noty, použije vaše úpravy a vytvoří soubor ke stažení, to vše ve vašem zařízení. Nic se nenahrává na server: ani nahrávka, ani název souboru, ani to, co jste změnili. Není tu žádný účet ani přihlášení.',
          'Abyste mohli soubor později znovu otevřít, nástroj si otevřené soubory uchovává ve vlastním úložišti vašeho prohlížeče (IndexedDB) ve vašem zařízení. Číst je může jen váš prohlížeč a nikam se neodesílají.',
          'Odstraníte je vymazáním dat tohoto webu v nastavení soukromí vašeho prohlížeče (obvykle pod „Cookies a data webů“ nebo „Data webových stránek“). Totéž udělejte, pokud jste nástroj používali na sdíleném počítači.',
        ],
      },
      {
        id: 'signup',
        heading: 'Přihlášení k e-mailům',
        blocks: [
          'Zanechat e-mail je dobrovolné. Nástroj je zdarma a funguje úplně stejně s ním i bez něj.',
          'Pokud se přihlásíte k odběru, Faust Studio uloží:',
          [
            'vaši e-mailovou adresu',
            'jazyk, který jste používali (angličtina nebo čeština)',
            'datum a čas, kdy jste zaškrtli políčko souhlasu',
            'verzi věty se souhlasem, se kterou jste souhlasili',
            'ze které stránky jste se přihlásili',
          ],
          'K vašemu přihlášení nezaznamenáváme IP adresu ani údaje o prohlížeči.',
          'Údaje používáme k tomu, abychom vám e-mailem posílali novinky o studiových nahrávkách, kurzech a nástroji. Právním základem je váš souhlas (čl. 6 odst. 1 písm. a) GDPR), který dáváte zaškrtnutím políčka. Políčko není nikdy předem zaškrtnuté.',
          'Seznam kontaktů Faust Studia je uložen ve Wixu, platformě, která hostuje fauststudio.net. Společnost Wix.com Ltd. se sídlem v Izraeli ho zpracovává jménem Faust Studia a ukládá ho v datových centrech ve Spojených státech a Irsku. EU uznává Izrael za zemi s odpovídající úrovní ochrany údajů; předání do Spojených států je kryto standardními smluvními doložkami EU podle podmínek zpracování údajů společnosti Wix.',
          { label: 'Zásady ochrany soukromí Wixu', href: faust.wixPrivacy },
          // TODO(verify): Faust must confirm they delete on request (handover note in docs/email-capture-migration.md).
          'Váš e-mail uchováváme, dokud se neodhlásíte nebo nás nepožádáte o jeho smazání.',
          'Každý e-mail, který posíláme, obsahuje odkaz pro odhlášení. Souhlas můžete také kdykoli odvolat e-mailem na adresu uvedenou v části „Vaše práva“. Odvolání zastaví další e-maily; netýká se toho, co bylo odesláno, dokud váš souhlas platil.',
        ],
      },
      {
        id: 'cookies',
        heading: 'Žádné cookies, žádné sledování',
        blocks: [
          'Tento web nenastavuje žádné cookies, neprovozuje žádnou analytiku a nemá žádné sledovací prvky ani vložená tlačítka sociálních sítí. Nevytváříme o vás profily a neděláme o vás žádná automatizovaná rozhodnutí.',
          'Ve vašem prohlížeči, a pouze tam, se ukládají dvě věci:',
          [
            'vaše volba jazyka (angličtina nebo čeština), uložená v místním úložišti prohlížeče jen tehdy, když kliknete na přepínač EN/CS',
            'nedávné soubory nástroje (viz „Nástroj“ výše)',
          ],
          'Obojí zůstává ve vašem zařízení a zmizí, když vymažete data tohoto webu.',
          'Nic na tomto webu se nenačítá od jiných společností. Písma, skripty i obrázky pocházejí ze samotného webu, takže se žádná třetí strana nedozví, že jste ho navštívili.',
        ],
      },
      {
        id: 'rights',
        heading: 'Vaše práva',
        blocks: [
          'Podle GDPR můžete Faust Studio požádat, aby:',
          [
            'vám sdělilo, jaké údaje o vás má, a dalo vám jejich kopii (přístup)',
            'je opravilo (oprava)',
            'je smazalo (výmaz)',
            'omezilo jejich používání (omezení zpracování)',
            'vám je nebo jinému poskytovateli poslalo v běžném formátu souboru (přenositelnost)',
            'je přestalo používat (námitka)',
          ],
          'Svůj souhlas můžete také kdykoli odvolat.',
          'Pro kterýkoli z těchto kroků napište Faust Studiu:',
          { label: faust.email, href: `mailto:${faust.email}` },
          'Odpověď dostanete do jednoho měsíce, jak vyžaduje GDPR.',
          'Pokud si myslíte, že s vašimi údaji bylo nakládáno nesprávně, můžete podat stížnost u českého dozorového úřadu, Úřadu pro ochranu osobních údajů, Pplk. Sochora 27, 170 00 Praha 7.',
          { label: 'uoou.gov.cz', href: faust.uoou },
        ],
      },
      {
        id: 'changes',
        heading: 'Změny těchto zásad',
        blocks: [
          `Když se tyto zásady změní, změní se s nimi i datum a číslo verze v horní části stránky. Aktuální verze je ${PRIVACY_POLICY_VERSION}.`,
          'Pokud jste se přihlásili k odběru, verze věty se souhlasem, se kterou jste souhlasili, je uložena spolu s vaším e-mailem, takže vždy víme, jaké znění jste viděli.',
        ],
      },
    ],
  },
})
