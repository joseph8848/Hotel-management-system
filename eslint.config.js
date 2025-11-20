import html from 'eslint-plugin-html';

export default [
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
    ],
    files: ['**/*.js', '**/*.html'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
    },
    plugins: {
      html,
    },
    rules: {
      'no-undef': 'off',
      'no-unused-vars': 'warn',
      'no-console': 'off',
    },
  },
];
