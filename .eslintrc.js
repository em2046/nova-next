module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'prettier',
    'prettier/vue',
  ],
  overrides: [
    {
      files: ['**/*.ts?(x)'],
      parser: 'vue-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
      plugins: ['@typescript-eslint'],
      extends: [
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:vue/vue3-recommended',
      ],
      rules: {
        '@typescript-eslint/no-unused-vars': [
          'warn',
          { varsIgnorePattern: '^(h|vueJsxCompat)$' },
        ],
      },
    },
  ],
};
