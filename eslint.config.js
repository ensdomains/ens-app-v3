import js from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import airbnb from 'eslint-config-airbnb';
import airbnbTypescript from 'eslint-config-airbnb-typescript';
import prettier from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import testingLibrary from 'eslint-plugin-testing-library';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import vitestPlugin from 'eslint-plugin-vitest';

export default [
  {
    ignores: [
      'next.config.js',
      'deploy/**/*',
      'src/**/*.test.tsx',
      'src/**/*.test.ts',
      'src/**/*.test-d.ts',
      'playwright/**/*.ts',
    ],
  },
  js.configs.recommended,
  ...airbnb.configs,
  ...airbnbTypescript.configs,
  prettier.configs,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      'testing-library': testingLibrary,
      '@typescript-eslint': typescript,
      prettier: prettierPlugin,
      vitest: vitestPlugin,
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/jsx-filename-extension': [1, { extensions: ['.tsx', '.jsx'] }],
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          js: 'never',
          jsx: 'never',
          ts: 'never',
          tsx: 'never',
        },
      ],
      'no-console': 'off',
      'no-restricted-syntax': [
        'error',
        {
          selector: "CallExpression[callee.object.name='console'][callee.property.name!=/^(log|warn|error|info|trace)$/]",
          message: 'Unexpected property on console object was called',
        },
        {
          selector: '*[value=/\\b(0x)?[a-f0-9]{64}\\b/i]',
          message: 'No private keys allowed',
        },
      ],
      'prettier/prettier': 'error',
      'import/prefer-default-export': 'off',
      'no-underscore-dangle': 'off',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'default',
          format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
          leadingUnderscore: 'allow',
          trailingUnderscore: 'allow',
        },
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
          leadingUnderscore: 'allow',
          trailingUnderscore: 'allow',
        },
        {
          selector: 'property',
          format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
          leadingUnderscore: 'allowSingleOrDouble',
          trailingUnderscore: 'allow',
        },
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
      ],
      radix: 'off',
      'consistent-return': 'off',
      'jsx-a11y/anchor-is-valid': 'off',
      'no-return-assign': 'off',
      'react/require-default-props': 'off',
      'react/function-component-definition': 'off',
      'react/no-unstable-nested-components': ['off', { allowAsProps: true }],
      'react/jsx-no-useless-fragment': 'off',
    },
  },
  {
    files: ['src/**/*.test.[jt]sx?', 'src/**/*.test-d.[jt]sx?'],
    plugins: {
      vitest: vitestPlugin,
    },
    rules: {
      ...vitestPlugin.configs.recommended.rules,
    },
  },
  {
    files: ['functions/**/*'],
    languageOptions: {
      parserOptions: {
        project: './functions/tsconfig.json',
      },
    },
  },
]; 