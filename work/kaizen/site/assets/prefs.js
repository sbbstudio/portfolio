// Aktive språk (nb/en) og tema (lys/mørk) for begge flater. Boot-snutten i <head> setter
// <html lang> og data-theme før første maling; dette skriptet monterer bryteren i
// headeren og legger engelsk copy på grunnflaten; dansk copy er parkert. Kai-laget henter sitt eget
// språk fra <html lang> (assets/cyan/src/lang.mjs). Språkbytte laster siden på nytt.
// Prisregel (CEO 2026-09-11, språk = marked): nb 9 900 kr eks. mva · da 6.900 kr. ekskl. moms · en NOK 9,900 excl. VAT.
(function () {
  var html = document.documentElement;
  var LANGS = ['nb', 'en'];
  var lang = /^en/i.test(html.lang) ? 'en' : /^da/i.test(html.lang) ? 'da' : 'nb';
  var media = window.matchMedia('(prefers-color-scheme: dark)');
  function store(key, value) { try { localStorage.setItem(key, value); } catch (e) {} }
  function isDark() { return html.dataset.theme === 'dark' || (!html.dataset.theme && media.matches); }

  // Språkknappene bærer målspråkets eget navn (som knappen selv står i), så leseren kjenner igjen sitt.
  var LANG_CODE = { nb: 'NO', da: 'DA', en: 'EN' };
  var LANG_ARIA = { nb: 'Bytt til norsk', da: 'Skift til dansk', en: 'Switch to English' };
  var LABELS = {
    nb: { light: 'Lys', dark: 'Mørk', themeAria: function (d) { return d ? 'Bytt til lyst tema' : 'Bytt til mørkt tema'; } },
    da: { light: 'Lys', dark: 'Mørk', themeAria: function (d) { return d ? 'Skift til lyst tema' : 'Skift til mørkt tema'; } },
    en: { light: 'Light', dark: 'Dark', themeAria: function (d) { return d ? 'Switch to light theme' : 'Switch to dark theme'; } }
  };

  function mountPrefs() {
    var header = document.querySelector('body > header');
    if (!header || header.querySelector('.site-prefs')) return;
    var L = LABELS[lang];
    var wrap = document.createElement('div');
    wrap.className = 'site-prefs';
    var langButtons = LANGS.filter(function (l) { return l !== lang; }).map(function (l) {
      var b = document.createElement('button');
      b.type = 'button'; b.dataset.pref = 'lang'; b.dataset.lang = l;
      b.textContent = LANG_CODE[l]; b.setAttribute('aria-label', LANG_ARIA[l]); b.lang = l;
      b.addEventListener('click', function () {
        store('kz-lang', l);
        var url = new URL(location.href);
        if (url.searchParams.has('lang')) { url.searchParams.delete('lang'); location.replace(url); }
        else location.reload();
      });
      return b;
    });
    var themeButton = document.createElement('button');
    themeButton.type = 'button'; themeButton.dataset.pref = 'theme';
    function paint() {
      var dark = isDark();
      themeButton.textContent = dark ? L.light : L.dark;
      themeButton.setAttribute('aria-label', L.themeAria(dark));
      themeButton.setAttribute('aria-pressed', String(dark));
    }
    themeButton.addEventListener('click', function () {
      var next = isDark() ? 'light' : 'dark';
      html.dataset.theme = next; store('kz-theme', next); paint();
    });
    media.addEventListener('change', paint);
    paint();
    langButtons.forEach(function (b) { wrap.append(b); }); wrap.append(themeButton);
    header.append(wrap);
  }

  // Engelsk og dansk copy for grunnflaten. Norsk i index.html er kilden, og de to ordbøkene
  // speiler den selektor for selektor (tests/cyan-lang.test.mjs låser pariteten). «\n» = <br>,
  // «**…**» = <strong>. Elementer med egne barn (pil-span) får bare første tekstnode byttet.
  var BASE_EN = {
    title: 'KAIZEN — Meet Kai',
    text: {
      // Fallback-flaten (vises når Kai ikke laster) står i samme språk som resten.
      '.kai-startup h1': 'This is Kai.',
      '.kai-startup p': [
        'Kai is the assistant you get. Under Kai, agents write quotes, draft replies and follow up customers, in the systems you already use.',
        "Let's find your first task. A no-obligation conversation, and you decide whether we go on."
      ],
      '.kai-startup nav a': ['Call us →', 'Send an email →'],
      '.kai-startup small': 'The animation is not available right now. You can still get in touch.',
      'body > header nav a': ['Workflows', 'Method', 'Contact'],
      '#hero-title': 'This is Kai.',
      '.hero-copy p': [
        'KAIZEN builds AI agents that take responsibility for\nspecific workflows in the systems you already use.\nThey learn from how you work, and keep developing\nas the business does.',
        'You keep control.\nThe agents keep the work moving.'
      ],
      '#avtalen-title': 'We find the work\nthat eats your week,\nand take it away.',
      '.agreement-promise': "If it doesn't work, you don't pay.",
      '.agreement-copy p': [
        'We look at how you work today and find out what is worth taking first. It might be the quotes that take too long, or the email nobody gets round to answering. What we build, we agree on together.',
        'Installation costs **NOK 9,900 excl. VAT** (DKK 6,900 in Denmark). We build as many agents as the task requires and set them up in the systems you use, or are about to. You deal with a few. They coordinate the rest in the background.'
      ],
      '#arbeidsflyter-title': 'Three places to start',
      '.workflow-card h3': ['Quotes', 'Margin', 'Payment'],
      '.workflow-card__summary': [
        "The request came in.\nThe quote didn't.",
        'The job looks profitable.\nUntil the hours are counted.',
        'The invoice is sent.\nThe follow-up is left waiting.'
      ],
      '.workflow-card__details': [
        'The agent gathers the basis from the systems you use, writes a draft and sends it for approval. Once you approve, the agent sends the quote and follows up until the customer replies.',
        'The agent links the quote, the hours and the invoice, and alerts you when hours or costs change.',
        'The agent sees what is overdue, prepares the follow-up and stops when the customer replies. Questions and exceptions go to you.'
      ],
      '.workflow-card__label': ['Result', 'Result', 'Result'],
      '.workflow-card__outcome': [
        'You approve.\nThe agent follows up.',
        'You see it in time\nto make a decision.',
        'The agent handles the routine.\nYou handle the exceptions.'
      ],
      '#metode-title': 'From agreement\nto operation',
      '.method-copy p': 'We start with the task you want solved. Together we clarify what the agents will do, which systems they will work in and what you will approve before they go live.',
      '.method-step h3': ['We agree', 'We build', 'We run them together', 'The job is done'],
      '.method-step p:nth-of-type(2)': [
        'We walk through an ordinary working week with you and write down what the agents will do.',
        'The agents are set up in the systems you already use, and do the work there.',
        'We go through the list with you while the agents are doing real work.',
        'If everything on the list holds, the job is done. If you disagree, there is no invoice.'
      ],
      '.method-step p:nth-of-type(3)': ['You approve the list.', 'We do the work.', 'You watch them run.', 'You decide.'],
      '#kontakt-title': 'Just ask.',
      '.contact-copy p': [
        "The first step can be a single question. Call or send an email. We answer what you are wondering about and tell you if AI isn't the right way.",
        "If we see something worth taking further, we explain what the next step could be. We don't take on work we don't believe we can deliver."
      ],
      '.contact-actions__title span': 'Call',
      '.contact-actions__note': 'Nothing is agreed until you say yes.',
      '.contact-actions a': ['Call us', 'Send an email']
    },
    attr: {
      '.kai-startup nav': { 'aria-label': 'Contact KAIZEN' },
      '.contact-actions a[href^="tel:"]': { 'aria-label': 'Call us on +47 411 67 940' }
    }
  };

  var BASE_DA = {
    title: 'KAIZEN — Mød Kai',
    text: {
      '.kai-startup h1': 'Dette er Kai.',
      '.kai-startup p': [
        'Kai er den assistent, I får. Under Kai arbejder agenter, der skriver tilbud, laver svarudkast og følger op på kunder, i de systemer, I bruger.',
        'Lad os finde jeres første opgave. En uforpligtende samtale, og I bestemmer, om vi går videre.'
      ],
      '.kai-startup nav a': ['Ring til os →', 'Send en mail →'],
      '.kai-startup small': 'Animationen er ikke tilgængelig lige nu. I kan stadig kontakte os.',
      'body > header nav a': ['Arbejdsgange', 'Metode', 'Kontakt'],
      '#hero-title': 'Dette er Kai.',
      '.hero-copy p': [
        'KAIZEN bygger AI-agenter, der tager ansvar for\nkonkrete arbejdsgange i de systemer, I bruger.\nDe lærer af, hvordan I arbejder, og udvikler sig\ni takt med virksomheden.',
        'I beholder kontrollen.\nAgenterne holder arbejdet i gang.'
      ],
      '#avtalen-title': 'Vi finder det arbejde,\nder æder jeres uge,\nog fjerner det.',
      '.agreement-promise': 'Virker det ikke, betaler I ikke.',
      '.agreement-copy p': [
        'Vi ser på, hvordan I arbejder i dag, og finder ud af, hvad der er værd at tage først. Det kan være tilbuddene, der tager for lang tid, eller den mail, ingen når at svare på. Hvad vi bygger, bliver vi enige om sammen.',
        'Installationen koster **6.900 kr. ekskl. moms**. Vi bygger så mange agenter, som opgaven kræver, og sætter dem op i de systemer, I bruger eller er på vej til at bruge. I forholder jer til nogle få. De koordinerer resten i baggrunden.'
      ],
      '#arbeidsflyter-title': 'Tre steder at begynde',
      '.workflow-card h3': ['Tilbud', 'Margin', 'Betaling'],
      '.workflow-card__summary': [
        'Forespørgslen kom ind.\nTilbuddet gjorde ikke.',
        'Opgaven ser rentabel ud.\nIndtil timerne tælles.',
        'Fakturaen er sendt.\nOpfølgningen bliver liggende.'
      ],
      '.workflow-card__details': [
        'Agenten henter grundlaget fra de systemer, I bruger, skriver et udkast og sender det til godkendelse. Når I godkender, sender agenten tilbuddet og følger op, indtil kunden svarer.',
        'Agenten kobler tilbuddet, timerne og fakturaen sammen og giver besked, når timeforbrug eller omkostninger ændrer sig.',
        'Agenten ser, hvad der er forfaldet, forbereder opfølgningen og stopper, når kunden svarer. Spørgsmål og afvigelser går til jer.'
      ],
      '.workflow-card__label': ['Resultat', 'Resultat', 'Resultat'],
      '.workflow-card__outcome': [
        'I godkender.\nAgenten følger op.',
        'I ser det i tide\ntil at træffe en beslutning.',
        'Agenten tager rutinen.\nI tager undtagelserne.'
      ],
      '#metode-title': 'Fra aftale\ntil drift',
      '.method-copy p': 'Vi starter med den opgave, I vil have løst. Sammen afklarer vi, hvad agenterne skal gøre, hvilke systemer de skal arbejde i, og hvad I skal godkende, før de sættes i drift.',
      '.method-step h3': ['Vi bliver enige', 'Vi bygger', 'Vi kører dem sammen', 'Jobbet er gjort'],
      '.method-step p:nth-of-type(2)': [
        'Vi gennemgår en almindelig arbejdsuge med jer og skriver ned, hvad agenterne skal gøre.',
        'Agenterne sættes op i de systemer, I allerede bruger, og gør arbejdet der.',
        'Vi gennemgår listen med jer, mens agenterne står i rigtigt arbejde.',
        'Holder alt på listen, er jobbet gjort. Mener I noget andet, får I ingen faktura.'
      ],
      '.method-step p:nth-of-type(3)': ['I godkender listen.', 'Vi gør arbejdet.', 'I ser dem køre.', 'I afgør.'],
      '#kontakt-title': 'Bare spørg.',
      '.contact-copy p': [
        'Første skridt kan være ét spørgsmål. Ring eller send en mail. Vi svarer på det, I undrer jer over, og siger til, hvis AI ikke er den rigtige vej.',
        'Ser vi noget, der er værd at gå videre med, forklarer vi, hvad næste skridt kan være. Vi påtager os ikke arbejde, vi ikke tror, vi kan levere.'
      ],
      '.contact-actions__title span': 'Ring',
      '.contact-actions__note': 'Ingen aftale, før I siger ja.',
      '.contact-actions a': ['Ring til os', 'Send en mail']
    },
    attr: {
      '.kai-startup nav': { 'aria-label': 'Kontakt KAIZEN' },
      '.contact-actions a[href^="tel:"]': { 'aria-label': 'Ring til os på +47 411 67 940' }
    }
  };

  function render(el, value) {
    if (el.children.length && value.indexOf('\n') < 0 && value.indexOf('**') < 0) {
      var node = Array.prototype.find.call(el.childNodes, function (n) { return n.nodeType === 3 && n.textContent.trim(); });
      if (node) node.textContent = value + ' ';
      return;
    }
    var frag = document.createDocumentFragment();
    var lines = value.split('\n');
    lines.forEach(function (line, i) {
      if (i) frag.append(document.createElement('br'));
      // Mellomrom før <br>: på mobil skjules linjeskiftene, og ordene må ikke smelte sammen.
      if (i < lines.length - 1) line += ' ';
      line.split(/\*\*(.+?)\*\*/).forEach(function (part, j) {
        if (!part) return;
        if (j % 2) { var s = document.createElement('strong'); s.textContent = part; frag.append(s); }
        else frag.append(part);
      });
    });
    el.replaceChildren(frag);
  }

  function applyBase(BASE) {
    document.title = BASE.title;
    Object.keys(BASE.text).forEach(function (selector) {
      var value = BASE.text[selector];
      var els = document.querySelectorAll(selector);
      els.forEach(function (el, i) {
        var v = Array.isArray(value) ? value[i] : value;
        if (typeof v === 'string') render(el, v);
      });
    });
    Object.keys(BASE.attr).forEach(function (selector) {
      var attrs = BASE.attr[selector];
      document.querySelectorAll(selector).forEach(function (el) {
        Object.keys(attrs).forEach(function (name) { el.setAttribute(name, attrs[name]); });
      });
    });
  }

  var BASE = { en: BASE_EN, da: BASE_DA }[lang];
  if (BASE) applyBase(BASE);
  mountPrefs();
})();
