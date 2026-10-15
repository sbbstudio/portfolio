// Builds dist/, the files runeoverland.no serves, from the repo source.
//
// What it does: empties dist/ and copies the files named in SERVED (an allowlist, not
// "everything except") into it, keeping their paths. Nothing else reaches dist/, so a new
// source folder is never published by accident.
// In: the working tree, after `npm run build` has regenerated studio/runtime and
//   assets/kai/runtime (the `build` script runs the two in that order).
// Out: dist/, which the publish workflow pushes to the gh-pages branch.
// Used by: `npm run build:site`, `npm run build`, .github/workflows/publish.yml.
// On failure: exits 1 with the missing allowlist entry named. Stale dist/ is removed first,
//   so a failed build never leaves an old site behind.
// Side effects: deletes and recreates dist/ in the repo root; writes nothing else.
import { cp, rm, stat } from 'node:fs/promises'
import { basename } from 'node:path'
import { fileURLToPath } from 'node:url'

// Every path the pages fetch, relative to the repo root. A folder is copied whole.
// Checked against href/src in the HTML, CSS and JS: see PR C0.
export const SERVED = [
  // pages
  'index.html',
  'grid-video.html',
  'contact.html',
  'how-i-work.html',
  'kaizen.html',
  'kaizen-ai.html',
  'legal-casework.html',
  'nyme.html',
  // folders
  'assets',
  'build',
  'work',
  'studio',
  'vendor',
  'decoders',
  'models',
  // shared styles and site files
  'cta-system.css',
  'nav-system.css',
  'CNAME',
  '.nojekyll',
  'favicon.ico',
]

const root = fileURLToPath(new URL('..', import.meta.url))
const dist = `${root}dist`

if (import.meta.url === `file://${process.argv[1]}`) {
  await rm(dist, { recursive: true, force: true })
  for (const entry of SERVED) {
    try {
      await stat(`${root}${entry}`)
    } catch {
      console.error(`build-site: "${entry}" is in SERVED but missing from the repo`)
      process.exit(1)
    }
    await cp(`${root}${entry}`, `${dist}/${entry}`, {
      recursive: true,
      filter: (source) => basename(source) !== '.DS_Store',
    })
  }
  console.log(`build-site: ${SERVED.length} entries copied to dist/`)
}
