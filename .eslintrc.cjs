module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'simple-import-sort', 'prettier'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  overrides: [
    {
      files: ['*.ts'], // Your TypeScript files extension
      // As mentioned in the comments, you should extend TypeScript plugins here,
      // instead of extending them outside the `overrides`.
      // If you don't want to extend any rules, you don't need an `extends` attribute.
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],
      parserOptions: {
        project: ['./tsconfig.json'], // Specify it only for TypeScript files
      },
      rules: {
        '@typescript-eslint/restrict-template-expressions': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/consistent-type-imports': 'error',
        '@typescript-eslint/consistent-type-exports': 'error',
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/no-misused-promises': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/no-unsafe-argument': 'warn',
        '@typescript-eslint/no-unsafe-return': 'warn',
        '@typescript-eslint/no-empty-interface': 'warn',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/require-await': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/await-thenable': 'off',
        '@typescript-eslint/restrict-plus-operands': 'off',
      },
    },
  ],
  env: {
    browser: true,
    node: true,
    es6: true,
    jest: true,
  },
  globals: {
    JSX: true,
    React: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:import/recommended',
    'plugin:prettier/recommended',
    'plugin:sonarjs/recommended', // enforce high code standards / best practices
    'plugin:security/recommended',
    'plugin:react-hooks/recommended',
    'next',
    'next/core-web-vitals',
  ],
  rules: {
    // eslint base rules
    'no-case-declarations': 'off',
    'no-console': 'error',
    'no-unused-vars': 'warn',
    'import/prefer-default-export': 'error',
    // react
    'react/react-in-jsx-scope': 'off',
    'react/no-unescaped-entities': 'off',
    'react-hooks/exhaustive-deps': 'off',
    // unicorn
    'unicorn/filename-case': 'off',
    // next
    'next/no-img-element': 'off',
    '@next/next/no-img-element': 'off',
    // security
    'security/detect-object-injection': 'off',
    'security/detect-non-literal-require': 'off',
    // simple import
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    // sonar
    'sonarjs/cognitive-complexity': 'off',
    'sonarjs/no-duplicate-string': 'off',
    'sonarjs/no-nested-template-literals': 'off',
    'sonarjs/no-identical-functions': 'off', // <- turn this back on eventually
    'sonarjs/no-small-switch': 'off',
    'sonarjs/prefer-immediate-return': 'off',
  },
};
