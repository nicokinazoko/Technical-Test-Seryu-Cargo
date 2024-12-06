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
    env: {
      node: true,
    },
  },
  pluginJs.configs.recommended,
];
