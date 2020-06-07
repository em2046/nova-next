import fs from 'fs';
import { dest, series, src } from 'gulp';
import concatCss from 'gulp-concat-css';

import glob from 'glob';

const cssPath = './dist/css';
if (!fs.existsSync(cssPath)) {
  fs.mkdirSync(cssPath, { recursive: true });
}

async function component(inputPath, outputPath) {
  src(inputPath).pipe(concatCss(outputPath)).pipe(dest('.'));
}

async function components() {
  let list = [];

  glob('src/components/*/styles/index.css', (er, files) => {
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
  await component('./src/styles/index.css', './dist/nova.css');
  await component('./src/styles/themes/index.css', './dist/css/themes.css');
}

export default series(components, bundle);
