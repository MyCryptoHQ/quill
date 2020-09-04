module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  parserOptions: {
    project: './tsconfig.json',
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  extends: ['airbnb', 'prettier'],
  plugins: ['prettier'],

  // https://eslint.org/docs/user-guide/configuring#configuration-based-on-glob-patterns
  // Glob pattern overrides have higher precedence than the regular configuration in the same config file.
  // Multiple overrides within the same config are applied in order.
  // That is, the last override block in a config file always has the highest precedence.
  overrides: [
    /**
     * Config files
     */
    {
      files: ['webpack_config/*.js'],
      settings: {
        'import/core-modules': [
          'fork-ts-checker-webpack-plugin',
          'tsconfig-paths-webpack-plugin',
        ],
      },
    },
    /**
     * Electron specific (eg. node)
     */
    {
      files: ['src/**/*.ts', 'src/**/*.tsx'],
      parser: '@typescript-eslint/parser',
      extends: ['airbnb-typescript', 'prettier'],
      plugins: ['@typescript-eslint', 'prettier'],
      settings: {
        'import/core-modules': ['electron'],
      },
      rules: {
        'import/prefer-default-export': 'off',
      },
    },
    /**
     * React specific (eg. browser)
     */
    {
      files: ['src/app/**/*.ts', 'src/app/**/*.tsx'],
      parser: '@typescript-eslint/parser',
      extends: ['airbnb-typescript', 'prettier'],
      plugins: ['@typescript-eslint', 'react', 'prettier'],
      rules: {
        'import/prefer-default-export': 'off',
      },
    },
  ],
};
