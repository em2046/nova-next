import { dest, series, src } from 'gulp';
import { fromRoot } from '../utils';
import concatCss from 'gulp-concat-css';
import glob from 'glob';

function component(file, componentName) {
  return new Promise((resolve) => {
    src(fromRoot(file))
      .pipe(concatCss(`${componentName}.css`))
      .pipe(dest(fromRoot('dist/css')))
      .on('end', () => {
        resolve();
      });
  });
}

async function components() {
  let list = [];

  glob('src/components/**/index.css', (er, files) => {
    files.forEach((file) => {
      const componentName = file.replace(
        /^.+components\/(.+)\/styles.+$/,
        '$1'
      );
      const promise = component(file, componentName);
      list.push(promise);
    });
  });

  await Promise.all(list);
}

function bundle() {
  return src(fromRoot('src/styles/index.css'))
    .pipe(concatCss('nova.css'))
    .pipe(dest(fromRoot('dist')));
}

export default series(components, bundle);
