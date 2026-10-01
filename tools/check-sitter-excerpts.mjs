// Checks that every code excerpt on the Sitter work sample is the source, byte for byte.
//
// Reads work/sitter/index.html, finds each element marked with data-file, data-lines
// ("a-b") and data-commit, and compares its text (tags stripped, entities decoded)
// with lines a to b of that file at that commit in sbbstudio/sitter-app. Also checks
// that the line-number counter starts at a - 1 and that the page links the permalink
// for the same range. Prints one line per excerpt and exits 1 on any mismatch.
//
// Usage:
//   node tools/check-sitter-excerpts.mjs                      # fetches raw.githubusercontent.com
//   node tools/check-sitter-excerpts.mjs --local ../sitter-app # reads with git show, offline
//
// Not part of the commit-time tests: it needs the network or a local clone.
import { readFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const REPO = 'sbbstudio/sitter-app'
const PAGE = fileURLToPath(new URL('../work/sitter/index.html', import.meta.url))

const args = process.argv.slice(2)
const localAt = args.indexOf('--local')
const localPath = localAt === -1 ? null : args[localAt + 1]
if (localAt !== -1 && !localPath) {
  console.error('--local needs the path to a sitter-app clone')
  process.exit(2)
}

const html = readFileSync(PAGE, 'utf8')

// The excerpts are <pre> elements; their content holds only spans, so a non-greedy
// match to the closing </pre> is enough.
const blockPattern = /<pre\b([^>]*\bdata-file="[^"]*"[^>]*)>([\s\S]*?)<\/pre>/g

function attr(attrs, name) {
  const match = attrs.match(new RegExp(`\\b${name}="([^"]*)"`))
  return match ? match[1] : null
}

function decode(text) {
  return text
    .replace(/<[^>]*>/g, '')
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&amp;/g, '&')
}

async function source(file, commit) {
  if (localPath) {
    return execFileSync('git', ['-C', localPath, 'show', `${commit}:${file}`], {
      encoding: 'utf8',
      maxBuffer: 16 * 1024 * 1024,
    })
  }
  const url = `https://raw.githubusercontent.com/${REPO}/${commit}/${file}`
  const response = await fetch(url)
  if (!response.ok) throw new Error(`${response.status} for ${url}`)
  return response.text()
}

let blocks = 0
let failures = 0
for (const [, attrs, inner] of html.matchAll(blockPattern)) {
  blocks += 1
  const file = attr(attrs, 'data-file')
  const range = attr(attrs, 'data-lines')
  const commit = attr(attrs, 'data-commit')
  const name = `${file}:${range}`
  const problems = []

  const [from, to] = (range || '').split('-').map(Number)
  if (!file || !commit || !Number.isInteger(from) || !Number.isInteger(to) || from > to) {
    console.log(`FAIL ${name}  missing or malformed data-file, data-lines or data-commit`)
    failures += 1
    continue
  }

  let text
  try {
    text = await source(file, commit)
  } catch (error) {
    console.log(`FAIL ${name}  could not read the source: ${error.message}`)
    failures += 1
    continue
  }

  const expected = text.split('\n').slice(from - 1, to)
  const actual = decode(inner).split('\n')
  if (expected.length !== to - from + 1) problems.push(`the file has fewer than ${to} lines`)
  if (actual.length !== expected.length) {
    problems.push(`${actual.length} lines on the page, ${expected.length} in the source`)
  }
  const firstDiff = expected.findIndex((line, i) => line !== actual[i])
  if (firstDiff !== -1) {
    problems.push(`line ${from + firstDiff} differs: page ${JSON.stringify(actual[firstDiff] ?? '')}`)
  }

  // Line numbers come from a CSS counter; it must start one below the first line.
  const counter = (attr(attrs, 'style') || '').match(/counter-reset:\s*line\s+(\d+)/)
  if (!counter || Number(counter[1]) !== from - 1) {
    problems.push(`counter-reset should be "line ${from - 1}"`)
  }

  const permalink = `https://github.com/${REPO}/blob/${commit}/${file}#L${from}-L${to}`
  if (!html.includes(`href="${permalink}"`)) problems.push('no link to its permalink')

  if (problems.length) {
    failures += 1
    console.log(`FAIL ${name}  ${problems.join('; ')}`)
  } else {
    console.log(`ok   ${name}  ${expected.length} lines at ${commit.slice(0, 7)}`)
  }
}

if (blocks === 0) {
  console.log('FAIL no excerpts found (data-file) in work/sitter/index.html')
  process.exit(1)
}
console.log(`${blocks} excerpts, ${failures} failed (${localPath ? `local: ${localPath}` : 'raw.githubusercontent.com'})`)
process.exit(failures ? 1 : 0)
