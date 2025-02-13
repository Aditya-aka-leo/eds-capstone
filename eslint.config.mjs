import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  pluginJs.configs.recommended,
  {
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      'import/extensions': ['error', { js: 'always' }],
      'linebreak-style': ['error', 'unix'],
      'no-param-reassign': [2, { props: false }],
    },
  },
];