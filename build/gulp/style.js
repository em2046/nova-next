import fs from 'fs';
import { series } from 'gulp';
import { rollup } from 'rollup';
import rollupTypescript from '@rollup/plugin-typescript';
import css from 'rollup-plugin-css-only';
import glob from 'glob';

const cssPath = './dist/css';
if (!fs.existsSync(cssPath)) {
  fs.mkdirSync(cssPath, { recursive: true });
}

async function component(inputPath, outputPath) {
  const bundle = await rollup({
    input: inputPath,
    plugins: [
      rollupTypescript(),
      css({
        output: (styles) => {
          fs.writeFileSync(outputPath, styles);
        },
      }),
    ],
  });

  return await bundle.generate({
    format: 'esm',
    sourcemap: true,
  });
}

async function components() {
  let list = [];

  glob('src/components/*/styles/index.ts', (er, files) => {
    files.forEach((file) => {
      const componentName = file.replace(
        /^.+components\/(.+)\/styles.+$/,
        '$1'
      );
      const promise = component(file, `./dist/css/${componentName}.css`);
      list.push(promise);
    });
  });

  return await Promise.all(list);
}

async function bundle() {
  await component('./src/styles/index.ts', './dist/nova.css');
  await component('./src/styles/themes/index.ts', './dist/css/themes.css');
}

export default series(components, bundle);
