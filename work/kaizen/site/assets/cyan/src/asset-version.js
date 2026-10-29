// Én kilde for Kai-lagets ressurs-URL-er. Alle URL-ene er versjonert (?v=) så Vercel kan
// sende dem med «immutable»-cache (vercel.json): repeat-besøk laster 0 byte modell/bevegelse.
// Bump ASSET_V når glb/json/css endres. index.html forhåndslaster de samme URL-ene i <head>;
// tests/cyan-loading.test.mjs sjekker at strengene der er identiske med disse.
export const ASSET_V = '20261027-mobile-spacing-nb-en';
export const KAI_MODEL_URL = '/work/kaizen/site/assets/cyan/cyan-approved.glb?v=' + ASSET_V;
export const KAI_ENTRANCE_URL = '/work/kaizen/site/assets/cyan/approved-entrance.json?v=' + ASSET_V;
export const KAI_STACK_MOTION_URL = '/work/kaizen/site/assets/cyan/stack-motion.json?v=' + ASSET_V;
export const KAI_STYLES = [
  '/work/kaizen/site/assets/cyan/preview.css?v=' + ASSET_V,
  '/work/kaizen/site/assets/cyan/experience.css?v=' + ASSET_V,
  '/work/kaizen/site/assets/cyan/stack-component.css?v=' + ASSET_V,
];
// Dekodede byte-størrelser (= filstørrelse på disk) for ærlig framdrift i loading-skjermen.
// Testen sjekker at tallene stemmer med filene; `npm run build:model` skriver dem ut.
export const KAI_MODEL_BYTES = 741244;
export const KAI_ENTRANCE_BYTES = 320552;
