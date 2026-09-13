import { build } from 'esbuild';
await build({ entryPoints: ['kai-src/index.js', 'kai-src/scene.js', 'kai-src/stack-entry.js'], outdir: 'assets/kai/runtime', bundle: true, splitting: true, format: 'esm', target: 'es2022', minify: true, logLevel: 'info' });
