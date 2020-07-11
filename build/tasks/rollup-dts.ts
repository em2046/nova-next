const rollup = require('rollup');
const rollupTypescript = require('@rollup/plugin-typescript');

export async function rollupDts() {
  const bundle = await rollup.rollup({
    input: './src/index.ts',
    external: ['vue'],
    plugins: [
      rollupTypescript({
        target: 'ES6',
        module: 'ESNext',
      }),
    ],
  });

  await bundle.write({
    dir: './temp',
    format: 'es',
    sourcemap: true,
  });
}
