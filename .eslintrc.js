module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    createDefaultProgram: true, // https://github.com/typescript-eslint/typescript-eslint/issues/967 - doing "**/src/**/*.ts" would not work
  },
  plugins: [
    '@typescript-eslint',
    'eslint-comments',
    'promise',
    'unicorn',
    'import',
    'security',
  ],
  extends: [
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:eslint-comments/recommended',
    'plugin:promise/recommended',
    'plugin:unicorn/recommended',
    'prettier',
    'prettier/@typescript-eslint',
  ],
  env: {
    browser: true,
  },
  globals: {
    moment: 'readonly',
  },
  rules: {
    'unicorn/prevent-abbreviations': 'off', // for react-app-env.d.ts (can't be renamed to react-app-environment.d.ts)
    'unicorn/no-null': 'off',
    'no-console': 'off', // sentry.io can harness console messages to help debugging prod issues
  },
}
