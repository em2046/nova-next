import { build } from 'esbuild';

export function bundleScript(cb: () => void) {
  build({
    entryPoints: ['./src/index.ts'],
    format: 'esm',
    outfile: './dist/index.esm.js',
    sourcemap: 'external',
    bundle: true,
    target: 'es6',
    external: ['vue'],
    jsxFactory: 'vueJsxCompat',
  })
    .then(() => {
      cb();
    })
    .catch(() => process.exit(1));

  build({
    entryPoints: ['./src/index.ts'],
    format: 'cjs',
    outfile: './dist/index.js',
    sourcemap: 'external',
    bundle: true,
    target: 'es6',
    external: ['vue'],
    jsxFactory: 'vueJsxCompat',
  })
    .then(() => {
      cb();
    })
    .catch(() => process.exit(1));
}
