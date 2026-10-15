import { build } from 'esbuild'
import { mkdir } from 'node:fs/promises'
const outdir = 'studio/runtime'
// esbuild does not clear outdir: a hashed file this build makes outdated stays until it is
// deleted, in the same PR as the build (AGENTS.md, Rules).
await mkdir(outdir, { recursive: true })
await build({ entryPoints: ['studio-src/integration/rune-system/index.ts', 'studio-src/integration/rune-system/build-hero.tsx'], outdir, bundle: true, splitting: true, format: 'esm', target: 'es2020', minify: true, define: { 'process.env.NODE_ENV': '"production"' }, logLevel: 'info' })
