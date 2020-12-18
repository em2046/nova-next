import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  external: ['vue', '@em2046/material-design-icons-vue-next'],
  plugins: [
    typescript({
      target: 'ES6',
      module: 'ESNext',
    }),
  ],
};
