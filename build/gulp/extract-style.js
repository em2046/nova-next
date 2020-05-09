import path from 'path';
import { dest, series, src } from 'gulp';
import less from 'gulp-less';
import LessAutoprefix from 'less-plugin-autoprefix';
import rename from 'gulp-rename';
import { fromTheRoot } from '../utils';

const autoprefix = new LessAutoprefix();

const lessOptions = {
  paths: [path.join(__dirname, 'less', 'includes')],
  plugins: [autoprefix],
};

function styleBuildModule() {
  return src(fromTheRoot('src/components/**/index.less'))
    .pipe(less(lessOptions))
    .pipe(
      rename((p) => {
        return {
          dirname: '/',
          basename: p.dirname.split('\\')[0],
          extname: p.extname,
        };
      })
    )
    .pipe(dest(fromTheRoot('dist/css')));
}

function StyleBuildAll() {
  return src(fromTheRoot('src/styles/index.less'))
    .pipe(less(lessOptions))
    .pipe(
      rename((p) => {
        return {
          dirname: '/',
          basename: 'nova',
          extname: p.extname,
        };
      })
    )
    .pipe(dest(fromTheRoot('dist/')));
}

export default series(styleBuildModule, StyleBuildAll);
