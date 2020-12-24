import { build, BuildOptions } from 'esbuild';

let config: BuildOptions = {
  entryPoints: ['./src/index.ts'],
  sourcemap: 'external',
  bundle: true,
  target: 'es6',
  external: ['vue', '@em2046/material-design-icons-vue-next'],
  jsxFactory: 'vueJsxCompat',
};

function bundleEsm() {
  return new Promise<void>((resolve, reject) => {
    build({
      format: 'esm',
      outfile: './dist/index.esm.js',
      ...config,
    })
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function bundleCjs() {
  return new Promise<void>((resolve, reject) => {
    build({
      format: 'cjs',
      outfile: './dist/index.js',
      ...config,
    })
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export async function bundleScript() {
  try {
    await Promise.all([bundleEsm(), bundleCjs()]);
    console.log(`Bundle script completed successfully`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
