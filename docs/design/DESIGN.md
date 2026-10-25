# DESIGN.md — Rune Portfolio

Eier: Rune Øverland. Oppdatert 25. oktober 2026. Omfang: hele porteføljen, inkludert Technical og Sitter.

## Fasiten og kildene

Den godkjente hovedsiden er fasit for tilsvarende komponenter på undersidene. `/` videresender til `grid-video.html`; `index.html` er ikke den rendrede hovedsiden. Tidligere tabeller basert på innholdet bak videresendingen er erstattet med denne referansen.

Hovedsiden laster inline CSS, `nav-system.css`, `cta-system.css`, `studio/integration.css`, `assets/css/build.css` og til slutt `assets/css/card-system.css`. Les hele kaskaden før en verdi endres. JavaScript i `assets/js/portfolio-shell.js` eier nav, Hero-parallax og kontaktbildet; `hero-roles.js` eier rolletittelen.

Gjenbruk samme spacing, type og tilstander for samme komponentrolle. Undersidene kan fortsatt ha avvik; denne filen er ikke en påstand om at hele nettstedet allerede er harmonisert. Ikke innfør nye felles regler gjennom en tilfeldig lokal overstyring.

## Grid og spacing

| Rolle | Desktop fra 1024 px | Mobil til 1023 px |
|---|---|---|
| Ytterramme `--pad` | 10 px | 8 px |
| Cellepadding `--cell` | 20 px | 1rem |
| Rotstørrelse | Nettleserstandard | `clamp(13px, calc(100vw / 24.375), 18px)` |
| Kolonner | Fire like, uten gutter | Innholdsrekkefølge per seksjon |
| Modul `--box` | `calc(100vh - 2 * var(--pad))` | Automatisk høyde |
| Radhøyde `--row` | Halv modul | Innholdsbestemt |
| Linje `--hair` | 1 px | 1 px |
| Node `--node` | 6 px | 6 px ved seksjonskanter |

Ved desktopbredde 1024–1279 px eller høyde under 761 px har hovedsidens moduler minimum 960 px høyde, slik at tekst ikke klippes i en halv rad. Rute 1–4 er øverste rad, 5–8 nederste. Contact/footer bruker fire rader, altså to moduler.

Gridet eier seksjonslinjene; ikke legg ekstra border oppå. Desktoplinjene og mobilens `.mline` bruker `--line: rgba(255,255,255,.16)`. Nodene ligger over linjene, også ved ytterkantene. Mobilens vertikale rammelinjer er fortsatt hvit med .3 alfa.

Celler har ingen radius. Naboceller har hver sin padding, ikke et ekstra grid-gap. `.cols` bruker på mobil gap 40 px og vertikal padding 72 px. Skjemaer, videokontroller og 3D-overlegg har egne avstander og skal ikke gjøres om til cellepadding.

## Typografi

Systemfont: `ui-sans-serif, -apple-system, "Helvetica Neue", Arial, sans-serif`.

| Token | Desktop |
|---|---|
| `--t-display` | `min(9.375rem, 9.9vw)` |
| `--t-xxl` | `min(6.875rem, 7.3vw)` |
| `--t-xl` | `5rem` |
| `--t-h1` | `3.75rem` |
| `--t-h2` | `2.8125rem` |
| `--t-h3` | `1.875rem` |
| `--t-h4` | `1.31rem` |
| `--t-body` | `1.125rem` |
| `--t-base` | `1rem` |
| `--t-meta`, `--t-caption` | `.9375rem` |
| `--t-fine` | `.75rem` |

Mobil erstatter display med 13vw, xl med 2.8125rem, h1/h2 med 1.875rem og h3 med 1.31rem. Rolle, ikke HTML-tag, bestemmer størrelse.

Kortbrødtekst bruker `--t-meta`, line-height 1.5 og tracking -.012em. Ingressen i Section 1 (`system-copy__intro`) bruker `--t-body`; nederste avsnitt beholder meta. CTA bruker `--t-meta`, line-height 1.6 og vekt 400 via `cta-system.css`. Nav bruker body på desktop og meta på mobil. Hero-rolletittel bruker h4.

Section 1-tittelen er uppercase, vekt 500, line-height 1 og tracking -.04em. Desktopstørrelse: `min(8vw, calc(var(--row) / 2.4))`; mobil: `clamp(45px, 12vw, 80px)`. NYME bruker xxl, med den opprinnelige fullbreddekomposisjonen og 12 % av radhøyden ekstra bunnpadding for å samle linjene.

## Farger og overflater

- Ytterramme: `#fff`; mørk grunn: `#000`; primær tekst på mørk grunn: `#fff`.
- Section 1 og NYME: `#888C8F`.
- Hero-tekst og nav over Hero: `#000`.
- Glassnav ved scroll opp: hvit tekst, 18 % hvit bakgrunn, `blur(18px) saturate(110%)`, uten skygge, bunnborder eller egne kolonneskillelinjer. Toppen ligger ved 0. Mobil bruker glassflaten også i starttilstand, med sort tekst over Hero.
- Kort over foto/video i Hero, SBB og Jelsa bruker samme glassverdier. Hero-kortet har sort tekst; øvrige mediekort har hvit tekst. Kort på ensfargede flater er flate uten blur/skygge.
- Delt kortflate eies av `card-system.css`. KAIZEN AI bruker den flate grunnvarianten.

Hvit liten tekst på `#888C8F` og glass over skiftende media er ikke dokumentert som WCAG AA-kontrast. Ikke rapporter generell tilgjengelighetsgodkjenning basert på layout-QA.

## Hovedsidens innhold og plassering

Hero har sitt eget tåkefoto (`contact-fog.webp`). Fotografiet strekker seg ikke inn i Section 1. Rolletittel ligger i rute 5, hovedtekst i rute 7 og CTA i rute 8.

Section 1 er alltid seksjonen rett etter Hero. Den introduserer Runes eget AI-harness og skal motivere klikk til Technical:

- Tittel over øverste rad: «There’s a system behind the work.»
- Rute 5: ingress øverst, avsluttende avsnitt nederst.
- Rute 7: fjellbildet som fyller cellen, uten blur.
- Rute 8: «See how I build →» til `/build/`.
- Mobil: tittel, eget bilde, tekstkort og CTA etter hverandre på grå grunn. Bildet skal ikke dekke tittelen eller teksten.

NYME følger Section 1. Footerportrettet ligger i rute 8 i den andre kontaktmodulen, med Back to top over. Kontaktbildet bruker solnedgangsportrettet. På mobil er bildene i normal dokumentflyt med deklarert sideforhold.

## Bevegelse og interaksjon

- Hero-roller: UX Designer, Forward Deployment Engineer, Fullstack Engineer. 65 ms per bokstav inn, 1.8 sekunders pause, 35 ms ut. Skjulte originaltekster reserverer høyden. Skjermlesernavnet er stabilt. Bakgrunnsfaner pauser timeren; redusert bevegelse viser Fullstack Engineer statisk.
- Hero-parallax: 0–40 px ned, bare desktop og uten redusert bevegelse; ingen horisontal bevegelse.
- CTA-pil: .35ch frem/tilbake over 3.2 sekunder med pause. Bare uten redusert bevegelse. Back to top er ikke med i løkken.
- Nav skjules etter scrolling ned og kommer tilbake etter 120 px samlet scroll opp under Hero. Tastaturfokus holder nav synlig.
- Kontaktbildet skaleres ved scrolling; redusert bevegelse og mobil bruker statisk sluttilstand.

Behold synlig tastaturfokus. Tilstander for skjema og 3D må testes separat fra hovedsiden.

## Undersider og avgrensninger

Technical (`/build/`) og Sitter (`/work/sitter/`) inngår i porteføljen, men hovedside-QA er ikke en full revisjon av disse. Technical har egne animasjonskapitler og lesemodus; disse er særroller. Sitter har kodeprøver og høyder bestemt av innholdet.

Kjente harmoniseringsoppgaver: Technical bruker fast 16 px mobilpadding, Sitter beholder 10/20 px ramme/celle, flere undersider har egne nav-/footerkopier. Glassnav og de nye mediekortvariantene er avgrenset til hovedsiden; delte CTA-piler og fjerning av nav-dividere gjelder sider som laster de delte filene.

Avklart videre: Technical er steget med 3D-modellen, ikke et prosjektkort eller en separat teknisk dokumentasjonsside. [FigJam-sitemap](https://www.figma.com/board/3mwhXw8SCggg33evk6Qjm2/Portefolio).

## QA før levering

Kontroller desktop, smal desktop, mobil og 1023/1024-grensen. Se etter klippet tekst, bildeoverlegg, scrollbredde, døde lenker og footer som mangler. Test scrollnav, tastaturfokus, redusert bevegelse og CTA til Technical. Kjør prosjektets tester og build før commit. Målinger og begrensninger fra leveransen står i `HOMEPAGE-QA.md`.

## Technical — tre steg i 3D-opplevelsen

Desktopoversikten bruker én felles glassflate over rute 1–8 med 58 % sort og 6 px blur. Native scrolling bytter mellom tre steg: Context, Projects og Knowledge. Tittel ligger i 5–6, forklaring i 7; rute 8 er åpen. En indikator viser stegnummer av tre og alle stegnavn; aktivt steg har understrek. Ingen plusstegn eller klikk kreves. Stegnavnene er knapper som hopper til midten av riktig leseintervall; aktiv markering følger samme scrolltilstand. Knappene har minst 44 px høyde, synlig fokus og hover/trykkrespons. Tilbakescrolling går tilbake gjennom stegene. Kameravendingen kommer først, og den eksisterende avslutningen følger etter. Mobil beholder stablet innhold; lesemodus viser alle tre uten fremdriftsindikator.

Oversikten ligger ved kamera .29 etter vendingen, med stillestående kamera fra scrollprogresjon .30 til .65. De tre tekstene deler det fullt synlige intervallet likt. Scrollområdet er 750svh for lesetid; avslutningen beholder sitt eksisterende innhold og siste kameravinkel.

Technical har en egen overskriftsrad med «See it in practice.» øverst til venstre. Under ligger Sitter i rute 6 og kontakt i rute 8; rute 5 og 7 er åpne. Porteføljerepoet promoteres ikke som kodebevis. Desktop fyller én modul (`--box`, skjermhøyden minus ytterrammen) med to like rader, cellepadding, xxl-overskrift, h3-korttitler, meta-brødtekst og delte CTA-er nederst. Mobil viser overskrift og to handlinger i én kolonne. Gridlinjene bruker `--line` med hele 6 px noder over linjene, også ved ytterkantene.

Global navigasjon: `assets/js/portfolio-nav.js` eier primærlenkene på sidene som bruker `nav-system.css`. Åpen variant beholder sidens komposisjon og seksjonslenker. Technical velger `data-variant="compact"`: navn og hamburger under 3D-opplevelsen, vanlig åpen navigasjon etterpå og i lesemodus. Hamburgeren folder ut de vanlige navcellene i samme grid, med glassflate og lukkekryss. Escape lukker og returnerer fokus; klikk utenfor, lenkevalg eller fokus ut lukker også. Ingen separat dialog. Uten JavaScript vises de opprinnelige lenkene.

Lesbarhetsprøve for Technical: stegenes overskrift bruker h1 på desktop og h2 på mobil. Stegindikatoren ligger på desktop nederst i rute 1–3, med vanlig cellepadding over midtlinjen. Mobil beholder indikatoren over innholdet. Mens oversikten er synlig, skjules den nederste scroll-instruksjonen; lenken til lesemodus beholdes.

Stegenes innhold toppjusteres i sine gridruter med vanlig `--cell` padding: tittel øverst i 5–6, brødtekst i 7 og åpen rute 8. Ingen baseline-forskyvning mellom cellene. Mobil beholder stablet tekstflyt.

Stegknappene står nederst i hver sin rute: 1, 2 og 3. Rute 4 er åpen. På desktop ligger «1 / 3 · Scroll to continue» nederst i rute 5 med cellepadding; den gjentatte steglabelen under tittelen er fjernet fra alle tre steg. Mobil beholder teller og knapper samlet over innholdet.

## Felles navigasjon etter QA

`portfolio-nav.js` eier synlighet, glass-tilstand, lenker og aktiv side gjennom data-attributter. Lokale scripts kan fortsatt markere seksjonslenker, men lokale `is-paper`/`is-hidden`-klasser styrer ikke den rendrede navflaten når den felles komponenten er startet. CSS lastes sist i head på alle åtte sider. Desktop: fire kolonner, 20 px padding og 18 px tekst. Mobil: to kolonner, 16 px padding, meta-tekst og lenker på egen rad. Toppen er 0, uten skygge, border eller kolonneskiller. Glass er 18 % hvitt, 18 px blur og 110 % saturation, med hvit tekst. Hovedsidens Hero og How I work beholder sort starttekst. Opp-scroll på 120 px viser nav; tastaturfokus holder den synlig. Technical bruker hamburger kun i 3D-opplevelsen.

Technical-avslutningen oppsummerer nå de tre faktiske stegene, og ordtelling/indekser er oppdatert. De to lenkene til How I work bruker samme navn. Den korte kontaktinvitasjonen gjentar ikke neste seksjons avsnitt.

CTA-er er fjernet fra de tre scrollstegene. Sitter og kontakt finnes i avslutningen, slik at hovedfortellingen kan følges uten avstikkere.

## Godkjent innhold — engelsk nettside

Technical er en forlengelse av Section 1 for rekruttereren. Intro: «Slik bygger jeg». Tre steg på siden: «People and product», «The system behind» og «Learning from use». Oppsummeringen er «Forstå behovet. Bygge sammenhengen. Forbedre gjennom bruk.» Norsk brukes bare til tekstgjennomgang i samtalen. Publisert og lokal side skal være engelsk, med samme godkjente innhold. Stegknappene fordeles likt over rute 1–3 med vanlig cellepadding og klikkflate over hele innholdsbredden i hver celle. Ved desktop 1024–1279 px bruker brødteksten rute 7–8; på bred desktop rute 7. På korte mobilskjermer brukes meta-størrelse på brødteksten for lesbar plassering. Global navigasjon beholder felles navn på tvers av språk.
