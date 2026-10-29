// Aktivt språk leses fra <html lang>, som boot-snutten i index.html setter før første maling
// (nb · en, lagret i localStorage kz-lang). Dansk copy er parkert for senere bruk.
// Trygg i Node (tester): uten document er språket norsk.
const tag=(typeof document!=='undefined'&&document.documentElement.lang||'').toLowerCase();
export const LANG=/^en/.test(tag)?'en':/^da/.test(tag)?'da':'nb';
export const LANGS=['nb','en'];
// Norsk er kilden. Mangler en dansk verdi, faller vi til norsk, aldri til engelsk.
export const pick=(nb,en,da)=>LANG==='en'?en:LANG==='da'?(da??nb):nb;
