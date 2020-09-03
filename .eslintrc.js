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
  extends: ['airbnb-typescript', 'prettier'],
  plugins: ['@typescript-eslint', 'react', 'prettier'],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    'react/prop-types': 0,
    'react/no-unescaped-entities': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    'no-console': ['warn', { allow: ['warn', 'error', 'debug'] }],
    'no-confusing-arrow': 'off',
    'import/no-extraneous-dependencies': 'off',
  },
};
