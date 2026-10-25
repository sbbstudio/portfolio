// Shared: generates the same static footer for the eight portfolio pages.
// Edit the template, not marked page blocks. Build-time expansion keeps links and
// photographs available without JavaScript and uses root-relative URLs on nested pages.
import { readFile, writeFile } from 'node:fs/promises'
const root = new URL('../', import.meta.url)
const pages = ['grid-video.html', 'build/index.html', 'work/sitter/index.html', 'nyme.html', 'kaizen.html', 'how-i-work.html', 'contact.html', 'legal-casework.html']
const template = (await readFile(new URL('tools/templates/portfolio-footer.html', root), 'utf8')).trim()
const pattern = /<!-- portfolio-footer:start -->[\s\S]*?<!-- portfolio-footer:end -->/g
// Validate every insertion point before writing, so a missing marker cannot leave
// a partially updated set of pages. Page-specific contact sections stay outside it.
const updates = await Promise.all(pages.map(async path => {
  const file = new URL(path, root)
  const source = await readFile(file, 'utf8')
  if ([...source.matchAll(pattern)].length !== 1) throw new Error(`Expected one footer block in ${path}`)
  return [file, source.replace(pattern, `<!-- portfolio-footer:start -->\n${template}\n<!-- portfolio-footer:end -->`)]
}))
for (const [file, source] of updates) await writeFile(file, source)
