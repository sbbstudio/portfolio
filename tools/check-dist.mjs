// Checks that dist/ is exactly the served part of the repo, byte for byte.
//
// What it does: copies every git-tracked file except the source files that are not served
// (NOT_SERVED) into a temp folder, then runs `diff -r` between that copy and dist/.
// In: dist/ (run `npm run build` first) and the tracked files in the working tree.
// Out: prints "check-dist: dist/ equals the served tree" and exits 0, or prints the diff
//   and exits 1.
// Used by: `npm run check:dist`, .github/workflows/publish.yml (before publishing). Temporary:
//   it goes away in the PR that moves the sources into site/ and src/, when dist/ no longer
//   mirrors the repo root.
// On failure: exit 1 with the diff; exit 2 when dist/ is missing.
// Side effects: creates and removes a folder in the OS temp directory.
import { execFileSync, spawnSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

// Tracked files that are source or repo plumbing, not served. A path matches when it
// equals an entry or sits under a folder entry (ending in "/"); root *.md are matched below.
const NOT_SERVED = [
  'kai-src/', 'studio-src/', 'tools/', 'tests/', 'docs/', '.github/',
  'package.json', 'package-lock.json', 'tsconfig.json',
  '.editorconfig', '.prettierrc', '.gitattributes', '.gitignore',
]

const root = fileURLToPath(new URL('..', import.meta.url))
if (!existsSync(`${root}dist`)) {
  console.error('check-dist: dist/ is missing; run `npm run build` first')
  process.exit(2)
}

const tracked = execFileSync('git', ['-C', root, 'ls-files', '-z'], { encoding: 'utf8' })
  .split('\0')
  .filter(Boolean)
const isSource = (file) =>
  (!file.includes('/') && file.endsWith('.md')) ||
  NOT_SERVED.some((entry) => (entry.endsWith('/') ? file.startsWith(entry) : file === entry))

const expected = mkdtempSync(`${tmpdir()}/check-dist-`)
try {
  for (const file of tracked.filter((file) => !isSource(file))) {
    mkdirSync(dirname(`${expected}/${file}`), { recursive: true })
    cpSync(`${root}${file}`, `${expected}/${file}`)
  }
  const result = spawnSync('diff', ['-r', expected, `${root}dist`], { stdio: 'inherit' })
  if (result.status !== 0) {
    console.error('check-dist: dist/ differs from the served tree (diff above)')
    process.exitCode = 1
  } else {
    console.log('check-dist: dist/ equals the served tree')
  }
} finally {
  rmSync(expected, { recursive: true, force: true })
}
