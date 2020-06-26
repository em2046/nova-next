import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  external: ['vue'],
  plugins: [
    typescript({
      target: 'ES6',
      module: 'ESNext',
    }),
  ],
};
