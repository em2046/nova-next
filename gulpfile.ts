import style from './build/tasks/style';
import clean from './build/tasks/clean-directories';
import { series } from 'gulp';
import { rollupDts } from './build/tasks/rollup-dts';
import { apiExtractor } from './build/tasks/api-extractor';
import { bundleScript } from './build/tasks/bundle-script';

const lib = series(rollupDts, apiExtractor, bundleScript);

export { clean, style, lib };
