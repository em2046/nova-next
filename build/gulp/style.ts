import fs from 'fs';
import { dest, series, src } from 'gulp';
import autoprefixer from 'autoprefixer';
import postcss from 'gulp-postcss';
import atImport from 'postcss-import';
import rename from 'gulp-rename';
import postcssNested from 'postcss-nested';
import glob from 'glob';
import prettierFormat from './prettier-format';

const cssPath = './dist/css';
if (!fs.existsSync(cssPath)) {
  fs.mkdirSync(cssPath, { recursive: true });
}

async function component(inputPath: string, outputPath: string): Promise<void> {
  src(inputPath)
    .pipe(postcss([atImport(), autoprefixer(), postcssNested()]))
    .pipe(rename(outputPath))
    .pipe(prettierFormat({ parser: 'css' }))
    .pipe(dest('.'));
}

async function components() {
  let list: Promise<void>[] = [];

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
