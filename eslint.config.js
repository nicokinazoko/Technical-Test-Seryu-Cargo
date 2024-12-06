import globals from 'globals';
import pluginJs from '@eslint/js';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['**/*.js'], // Apply to all JavaScript files
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      'no-unused-vars': 'error',
    },
  },
  pluginJs.configs.recommended,
];

