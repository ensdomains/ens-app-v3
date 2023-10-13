/* eslint-disable @typescript-eslint/naming-convention */
import type { Config } from 'jest'
import nextJest from 'next/jest'

process.env.TZ = 'UTC'

const createJestConfig = nextJest({ dir: '.' })

const customJestConfig: Config = {
  testEnvironment: 'jest-environment-jsdom',
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.yarn/**',
    '!**/.next/**',
  ],
  testMatch: [
    '<rootDir>/__tests__/**/?(*.)+(spec|test).[jt]s?(x)',
    '<rootDir>/src/**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  moduleNameMapper: {
    // Handle image imports
    // https://jestjs.io/docs/webpack#handling-static-assets
    '^.+\\.(svg)$': '<rootDir>/__mocks__/svgMock.tsx',
    '^__tests__/(.*)$': '<rootDir>/__tests__/$1',
    '^@app/(.*)$': '<rootDir>/src/$1',
    '^@rainbow-me/rainbowkit$': '<rootDir>/__mocks__/rainbowkitMock.js',
    '@ensdomains/ensjs/(.*)$': '<rootDir>/node_modules/@ensdomains/ensjs/dist/cjs/$1',
    getDefaultWallets: '<rootDir>/__mocks__/getDefaultWalletsMock.js',
    '@adraffy/ens-normalize': '<rootDir>/node_modules/@adraffy/ens-normalize/dist/index.cjs',
    '^wagmi(.*)$': 'wagmi-cjs$1',
    '^@wagmi/core(.*)$': '@wagmi/core-cjs$1',
    '^multiformats$': '<rootDir>/node_modules/multiformats/dist/index.min.js',
    '^multiformats/(.*)$': '<rootDir>/node_modules/multiformats/src/$1',
    '^isows$': '<rootDir>/node_modules/isows/_cjs/index.js',
    '^uint8arrays$':
      '<rootDir>/node_modules/.pnpm/uint8arrays@3.1.1/node_modules/uint8arrays/cjs/src/index.js',
  },
  setupFilesAfterEnv: ['<rootDir>/jest/jest.setup.ts'],
  setupFiles: ['<rootDir>/jest/setEnvVars.js', 'jest-canvas-mock'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.yarn/', '<rootDir>/.next/'],
  transformIgnorePatterns: [
    '/node_modules/!(multiformats)',
    '/.yarn/',
    '/.next/',
    '^.+\\.module\\.(css|sass|scss)$',
    '.storybook',

    'config.js',
    'coverage',

    '_document.tsx',
    '_app.tsx',
    '_error.tsx',
    '404.tsx',
    '500.tsx',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/.yarn/',
    '/.next/',
    '^.+\\.module\\.(css|sass|scss)$',
    '.config.',
    'coverage',
    '_document.tsx',
    '_app.tsx',
    '_error.tsx',
    '404.tsx',
    '500.tsx',
  ],
  coverageThreshold: {
    global: {
      branches: 1.09,
      functions: 1.7,
      lines: 2.57,
      statements: 2.29,
    },
  },
  collectCoverage: false,
}

export default createJestConfig(customJestConfig)
