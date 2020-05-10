import { dest, series, src } from 'gulp';
import { fromTheRoot } from '../utils';
import concatCss from 'gulp-concat-css';
import glob from 'glob';

function styleBuildModule(file, componentName) {
  return new Promise((resolve) => {
    src(fromTheRoot(file))
      .pipe(concatCss(`${componentName}.css`))
      .pipe(dest(fromTheRoot('dist/css')))
      .on('end', () => {
        resolve();
      });
  });
}

function styleBuildModules(cb) {
  let promiseList = [];

  glob('src/components/**/index.css', (er, files) => {
    files.forEach((file) => {
      const componentName = file.replace(
        /^.*?components\/(.*)\/styles.*?$/,
        '$1'
      );
      const promise = styleBuildModule(file, componentName);
      promiseList.push(promise);
    });
  });

  Promise.all(promiseList).then(() => {
    cb();
  });
}

function styleBuildAll() {
  return src(fromTheRoot('src/styles/index.css'))
    .pipe(concatCss('nova.css'))
    .pipe(dest(fromTheRoot('dist')));
}

export default series(styleBuildModules, styleBuildAll);
