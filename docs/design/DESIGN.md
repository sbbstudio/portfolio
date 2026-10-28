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

Celler har ingen radius. Naboceller har hver sin padding, ikke et ekstra grid-gap.

### Rot-størrelse

Under 1440 px: `clamp(13px, 100vw / 24.375, 18px)` per side. Fra 1441 px: `clamp(16px, 10.857px + .357vw, 20px)` i `nav-system.css`, altså 16 px ved 1440 og 20 px ved 2560, slik at alle rem-tokens vokser med skjermen. `--t-display` er 9.9vw uten tak.

## Vertikal rytme i en celle

Avstand sier hva som hører sammen. Fire trinn, alle avledet av `--cell`, og aldri like avstander mellom alt:

| Token | Verdi | Brukes mellom |
|---|---|---|
| `--s-1` | 6 px | Etikett og tittelen den tilhører; lenke og avsnittet over |
| `--s-2` | 20 px (`--cell`) | Elementer i samme blokk: tittel og ingress, avsnitt og avsnitt |
| `--s-3` | 40 px (2 × `--cell`) | Blokker i samme celle: tekstblokk og faktaliste, tekst og statuslinje |
| `--s-4` | 100 px (5 × `--cell`) | Dødrom: tekst og medie, tekst og neste seksjon i samme celle |

Innenfor én celle skal minst to trinn være i bruk, ellers leses alt som én liste. Tokenene ligger i `assets/css/module-system.css`; forsidens 6 px lenkeavstand og 100 px dødrom er samme trinn. `.cols` bruker på mobil gap 40 px og vertikal padding 72 px. Skjemaer, videokontroller og 3D-overlegg har egne avstander og skal ikke gjøres om til cellepadding.

## Glass

Én oppskrift, to varianter, i `assets/css/module-system.css`: `[data-glass="dark"]` og `[data-glass="light"]`. Begge bruker nav-ens blur (`blur(18px) saturate(110%)`). Tinten er motsatt av teksten: mørkt glass (`rgba(0,0,0,.88)`) bærer hvit tekst, lyst glass (`rgba(255,255,255,.64)`) bærer svart. Velg varianten ut fra teksten som skal stå på den, ikke ut fra underlaget. `data-fade="top|bottom"` faser én kant ut over 80 px, slik at glasset slipper innholdet bak uten en hard linje. Ingen radius, ingen skygge, ingen kantlinje. Nav-komponentens eget glass (`nav-system.css`, hvit .18) er den eldre varianten og harmoniseres senere.

## Typografi

Systemfont: `ui-sans-serif, -apple-system, "Helvetica Neue", Arial, sans-serif`.

| Token | Desktop |
|---|---|
| `--t-display` | `9.9vw` |
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

Section 1-tittelen er uppercase, vekt 500, line-height 1 og tracking -.04em. Desktopstørrelse: `min(8vw, calc(var(--row) / 2.4))`; mobil: `clamp(45px, 12vw, 80px)`. NYME bruker xxl med fullbreddekomposisjon. «STARTS WITH THE JOB.» ligger nederst i øverste rad med vanlig cellepadding. Mobil beholder venstrejusterte linjer i normal flyt.

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
- Nav skjules ved scrolling ned etter 40 px, også i hovedsidens Hero, og kommer tilbake etter 120 px samlet scroll opp. Alle åtte sider bruker samme 0.45 sekunders nav-animasjon. Tastaturfokus holder nav synlig.
- Kontaktbildet holdes i full størrelse i 0.2 moduler scroll før det skaleres over én modul. Wrapperen er 3.2 moduler høy; redusert bevegelse og mobil bruker statisk sluttilstand.

Behold synlig tastaturfokus. Tilstander for skjema og 3D må testes separat fra hovedsiden.

## Undersider og avgrensninger

Technical (`/build/`) og Sitter (`/work/sitter/`) inngår i porteføljen, men hovedside-QA er ikke en full revisjon av disse. Technical har egne animasjonskapitler og lesemodus; disse er særroller. Sitter har kodeprøver og høyder bestemt av innholdet.

Kjente harmoniseringsoppgaver: Technical bruker fast 16 px mobilpadding, Sitter beholder 10/20 px ramme/celle, flere undersider har egne nav-/footerkopier. Glassnav og de nye mediekortvariantene er avgrenset til hovedsiden; delte CTA-piler og fjerning av nav-dividere gjelder sider som laster de delte filene.

Avklart videre: Technical er steget med 3D-modellen, ikke et prosjektkort eller en separat teknisk dokumentasjonsside. [FigJam-sitemap](https://www.figma.com/board/3mwhXw8SCggg33evk6Qjm2/Portefolio).

## Vindu-modulen (`/work/nyme/`, `/work/kaizen/`)

Godkjent felles oppsett: én modul (`--box`) med to like høye rader. Rute 1–3/5–7 er ett vindu som kjører en lokal kopi av prosjektets nettsted i 100 %, uten skalering. Vinduet er scrolleren. Gridet tegner bare skillet mot kolonne 4 og linjen mellom rute 4 og 8.

Rute 4 viser etikett (`--t-meta`), prosjektnavn på steg 1 (`--t-xl`) eller seksjonstittel (`--t-h3`). Undertittelen bruker også `--t-h3`. Nederst står en seksjonsspesifikk oppsummering (`.pin__credits`, `--t-h4`, vekt 500, linjehøyde 1.1, tracking -.025em, sekundær tekstfarge). Separate seksjonsnumre over titlene er fjernet. NYME og KAIZEN har samme hierarki.

Rute 8 viser begrunnelsen med etiketter og tekst (`--t-meta`, linjehøyde 1.5). Etiketten står 6 px over teksten, med 20 px mellom ledd. Feltet kan scrolles vertikalt hvis teksten ikke får plass; ingen navigasjon ligger over teksten.

Tallvelgeren ligger nederst til venstre i rute 5 og nettsidelenken nederst til høyre i rute 7, begge over nettstedvinduet og tilgjengelige gjennom alle steg. Begge bruker den eksisterende mørke glassklassen (`data-glass="dark"`), uten radius, border eller skygge. Padding er 9 px vertikalt (1.5 × `--s-1`) og 15 px horisontalt på desktop (.75 × `--s-2`). Tallene bruker `--t-meta`: aktivt tall er hvitt med vekt 600, øvrige sekundære med vekt 400. Nettsidelenken bruker meta-typografi. Velgeren erstatter den separate stegmarkøren. Contact-lenken er fjernet fra panelene.

Seksjonen hvis topp har passert øvre tredjedel av vinduet aktiverer tilhørende panel. KAIZENs avtale måles ved den synlige overskriften, ikke starten på wrapperen som overlapper introen. Steg 3 starter ved `.kai-capability-track`, med `#arbeidsflyter` som fallback før runtime har opprettet oversikten. Målene slås opp på nytt når nettstedets runtime endrer strukturen. Siste stegknapp går helt til bunnen og aktiverer avslutningen: Learning på KAIZEN, Validation på NYME. Innkommende paneler toner inn og løfter 12 px; redusert bevegelse fjerner overgangen.

Mobil: introtittel og første oppsummering, 40 px luft, så vinduet i 4:5 helt ut til rammen, så begrunnelsene i normal flyt med 100 px dødrom mellom seksjonene. Vinduet viser der et stillbilde av nettstedets egen mobilversjon (`--poster-m`, 780×976) i stedet for rammen: rammen lastes bare fra 1024 px, så iOS ikke kan strekke den til nettstedets høyde, og preluden fjernes sammen med den. Senere oppsummeringer følger sin tittel. Tallvelgeren er skjult; nettsidelenken ligger nederst til høyre over vinduet. Et stillbilde (`--poster`) ligger bak rammen mens nettstedet lastes. `data-hide` og `data-css` tilpasser nettstedets oppstartslag i vinduet. Preluden bruker mørkt glass med prosjektnavn, undertittel og lukkekryss.

## Mobil (til 1023 px)

Samme grid, én kolonne. Ingen egen mobildesign og ingen «bruk desktop»-melding: sidene bygges om innenfor rammen, i samme rekkefølge som rutene leses på desktop.

Regler:

- **Rammen og cellen.** `--pad` 8 px rundt alt, `--cell` 1rem inne i tekstceller, rotstørrelse `clamp(13px, 100vw / 24.375, 18px)`. Modulhøyden er innholdsbestemt (`--box` og `--row` er `auto`); ingen `100vh`-flater med tomrom under.
- **Media går helt ut til rammen.** Foto, video, vindu og stillbilde fyller bredden mellom ytterrammene, uten sideinnrykk. Kortmodulene på hovedsiden har derfor null sidepadding på mobil; bare tekstblokkene (`.card__box`, `.card__note`, statement og CTA) bærer cellepaddingen. Ingen boks inne i en rute: et glasskort over foto fyller rutens bredde.
- **Tekstruter.** Samme logikk som desktop: innholdet limes i topp og bunn, midten puster. Ruta er minst 4:5 av bredden (`--mcell`, aldri høyere enn skjermen), flex-kolonne med `space-between`, 3 × `--cell` over og under. Står en CTA-celle under ruta, trekkes CTA-cellens høyde (`--mcta`) fra, så rute og CTA sammen er 4:5. Gjelder hero-rute 2, kortboksene, system-boksen, kontaktruta og utsagnsmodulene på How I work.
- **Hero.** Rute 1 og 2 stablet loddrett. Rute 1 er fotoet helt ut til rammen, 4:5 og aldri høyere enn skjermen, med tittelen øverst til venstre under nav. Rute 2 er svart grunn med påstand, liste og CTA nederst, 3 × `--cell` over og under. Modul-linja med noder skiller rutene. Ingen glassboks over fotoet på mobil.
- **Rekkefølge per seksjon.** Tittel først, så media, så tekst og CTA. I vindu-modulen: introtittel og oppsummering, 40 px luft, vinduet i 4:5, så begrunnelsene stablet. I kortmodulene på hovedsiden: påstand, media, tekstboks, CTA rett under boksen. SBB-kontrollene står i én rad under filmen, transport til venstre og teller til høyre. Jelsa-veggen står over tekstboksen. Påstandene på NYME- og KAIZEN-kortene står i `--t-h1`, samme trinn som hero-tittelen. Tekstboksene er flate på svart grunn: glass og terreng-lag hører til foto på desktop.
- **Rytme mellom seksjoner.** Minst to trinn i bruk. Mellom tittel og media `--s-3` (40 px), mellom stablede seksjoner `--s-4` (100 px), kortmoduler har 3 × `--cell` over og under. Naboceller har hver sin padding, aldri et grid-gap.
- **Vindu og tunge lag.** Live-rammen lastes bare fra 1024 px; mobil viser et stillbilde av nettstedets egen mobilversjon (`--poster-m`, 780 × 976) i samme rute. Preluden, glasslappene i vinduet og panelsynken finnes ikke på mobil. iOS Safari strekker ellers en iframe til innholdets høyde.
- **Tekst.** Venstrejustert og toppjustert, også der desktop sentrerer (utsagnsmodulene på How I work, «Let’s talk.» på Contact). CTA uten egen linje og i cta-system-stemmen. Display 13vw, xl 2.8125rem, h1/h2 1.875rem, h3 1.31rem, brødtekst meta. Nav bruker to kolonner og meta.
- **Bevegelse.** Hover-tilstander erstattes av synlig sluttilstand (Jelsa-veggen viser sidene, kontaktbildet står statisk). Innfasing (`.iv`) beholdes.

Status 2026-10-28 (headless Chrome, 390 px, stegvis scroll i ekte viewport): hovedsiden, Contact, How I work, Sitter, `/work/nyme/` og `/work/kaizen/` følger reglene. Legal casework har egne rammer, vignetter og sentrerte sperrede titler fra sin egen stil og er ikke rettet. Technical (`/build/`) og KAIZEN AI (`kaizen-ai.html`, ikke lenket fra nav) er ikke vurdert for mobil. Ikke bevist i headless: iOS Safari, WebGL-heroen og video-autoplay; de sjekkes på ekte telefon.

## Ikke i dette designet

Avvist av CEO. Står her så ingen må be om det to ganger. Et unntak må bes om, ikke antas.

- **Egne streker.** Gridet eier linjene. Ingen hårlinje over lister, under titler, rundt kort eller som fremdriftsindikator. Trengs en linje, spør først.
- **Like avstander mellom alt.** Vertikal rytme bruker minst to trinn i hver celle (se *Vertikal rytme i en celle*).
- **Media som ikke fyller ruten.** Bilde, video og vindu går helt ut til gridlinjene, uten innrykk, hjørnemerker eller bildetekst under.
- **Radius, skygge, kantlinje** på celler, glass, knapper og lapper.
- **Gradienter og vignetter** på svart grunn. Grunnen er `#000`, ren.
- **Bakgrunnsfarge bak navnet i nav.** Navnet står rett på flaten, og i kompakt nav er det skjult til menyen er åpen.
- **Sentrert tekst i gridceller.** Tekst er venstrejustert og toppjustert med cellepadding. Preluden er unntaket: den er en dialog, ikke en celle.
- **Interne navn, agentnavn og pipeline-diagrammer** på offentlige sider.
- **Stockfoto** (håndtrykk og lignende).
- **Stiplede `.fact-gap`-felt i produksjon.** De er utkastmarkører og skal være erstattet med sanne tall før merge.
- **Egen lastelogikk som ikke er bundet til noe ekte.** En lasteskjerm venter på faktisk innlasting, ikke en timer.

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

Lukket hamburgernav er transparent uten blur, også ved scroll. Åpning viser den vanlige glassflaten. Den åpne standardnavigasjonen beholder glass ved scroll.

## Felles footer

Alle åtte porteføljesider bruker samme statiske mal: `tools/templates/portfolio-footer.html`, med stil i `assets/css/portfolio-footer.css`. Kontaktbudskapet foran er sidespesifikt. Desktop: solnedgangsbildet fyller rute 1–2, kolofon med navn, lenker og kontakt i rute 4, ticker nederst i rute 5–6 og profilbildet i rute 8 med Back to top og copyright over. Rute 3 og 7 er åpne. Modulen har to like rader, fire kolonner, 20 px padding, felles linjefarge og 6 px noder over linjene. Hovedsidens eksisterende kontaktanimasjon og grid eier fortsatt rammen rundt denne modulen. Mobil: landskapsbilde, kontakt/lenker, ticker og profilbilde med Back to top i normal flyt; 16 px padding og meta-tekst. Bildene lazy-loades med deklarerte dimensjoner; redusert bevegelse stopper tickeren.

Technical: aktivt steg markeres på desktop med en 2 px strek på den felles midtlinjen, over hele bredden av stegets gridrute uten innrykk. Teksten beholder cellepadding. Mobil beholder understreken under knappen.

## Sitter — case-layout

`/work/sitter/` bruker `assets/css/sitter-case.css` og de felles nav-/footerkomponentene. Desktopintro fyller en modul: Sitter-tittelen og undertittelen i rute 5, forklaring i rute 6, tekniske lenker i 7 og Try Sitter i 8. Innholdsseksjonene har fire kolonner med h1-titler i 1–2 og brødtekst i 3–4, 20 px cellepadding og felles linjer/noder. Hver tekstrad er minst en halv modul, og kan vokse med innholdet. Kode, tester, migrering og repo-struktur ligger i native details/summary under seksjonen; kode bruker lesbar monospace og lokal horisontal scrolling fremfor nedskalering. Ingen skygger, gradientflater eller dekorativt korn. Mobil bruker 8 px ramme, 16 px padding, stablet innhold, h2-størrelse på seksjonstitler og fullbredde utfellingsfelt. Kildeutdrag er fortsatt bundet til samme commit og verifiseres av `check-sitter-excerpts.mjs`.

Sitter: begrensningsseksjonens tekstfelt er én sort, flat flate over kolonne 3–4. Den indre vertikale linjen skjules, mens ytterlinjer og noder beholdes. Ingen radius eller skygge.

Sitter: scroll anchoring er deaktivert på siden, slik at åpning av kodefeltene beholder knappen på samme sted i vinduet og skyver resten av innholdet nedover. Native details/summary og tastaturbetjening beholdes.

Sitter-intro: H1 og etiketten under ligger øverst i rute 5. Begge forklaringsavsnitt ligger øverst i rute 6. Lenker ligger i 7 og Try Sitter i 8. Alle fire feltene har vanlig cellepadding under den felles midtlinjen. Mobil bruker normal leserekkefølge uten tomme gridrader.

Sitter: «A learning app / for children.» står rett under H1 i rute 5, med h3-størrelse på desktop og h2 på mobil. Work sample-etiketten følger under.


## KAIZEN — design case narrative

The case explains product-design judgment through the website: making an abstract service tangible for small businesses without an in-house development team; a character-led identity; consistency across motion and navigation; plain language, visual hierarchy and familiar task examples; and the balance between attention and comprehension. Kai’s head direction is an intended attention cue, not a measured usability improvement. The alternative explored was a direction without a character. Feedback to date consists of informal walkthroughs and positive visual reactions, not structured usability testing or conversion evidence. The closing panel states those limits and proposes task-based testing. Technical implementation belongs on the separate Technical page. Personal feedback quotations are not public case content.

## Process-page accessibility and snapshot navigation

NYME and KAIZEN expose only the active desktop panel to assistive technology; inactive panels are inert and aria-hidden. Mobile exposes all panels in reading order, including when resizing across 1024 px. Step navigation respects reduced-motion preferences. The shared `assets/js/portfolio-snapshot-links.js` keeps snapshot section anchors local and opens full-site routes on the live project domain in a new tab; it also handles links inserted by the site's runtime. This preserves the annotated portfolio view while avoiding missing local routes.

## NYME — design case narrative

The case focuses on comprehension, information hierarchy, inspectable examples, process transparency and candidate control. Reasoning is labelled as design reasoning rather than user-research findings. The timing panel explicitly identifies the risk that an example timeline may be read as a guarantee. The final panel separates delivered design from proposed comprehension testing; it does not claim measured usability, conversion or hiring outcomes. Audience specifics, explored alternatives and feedback require confirmation before being added.

NYME audience working assumption (2026-10-27): candidates seeking relevant roles with limited time to prepare a considered application. Inferred from the public homepage and `/soknadstjenesten` (especially “Du har ikke tid. Søknaden trenger den likevel.”), not from confirmed interviews. Rune authorised this inference for next-day review. The case highlights the switcher’s focus/comparison trade-off and the process accordion’s overview/detail trade-off. No claim is made that these choices improved measured outcomes or that alternative versions were tested. Review with Rune: actual audience, alternatives explored, feedback and learning. Sources: https://www.nymestudio.no and https://www.nymestudio.no/soknadstjenesten .
