const nextJest = require('next/jest')

const createJestConfig = nextJest({ dir: '.' })

const customJestConfig = {
  testEnvironment: 'jest-environment-jsdom',
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.yarn/**',
    '!**/.next/**',
    '!**/cypress',
  ],
  testMatch: [
    '<rootDir>/__tests__/**/?(*.)+(spec|test).[jt]s?(x)',
    '<rootDir>/src/**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  moduleNameMapper: {
    // Handle image imports
    // https://jestjs.io/docs/webpack#handling-static-assets
    '\\.svg$': '<rootDir>/__mocks__/svgMock.tsx',
    '^__tests__/(.*)$': '<rootDir>/__tests__/$1',
    '^@app/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.yarn/',
    '<rootDir>/.next/',
    '<rootDir>/cypress/',
  ],
  transformIgnorePatterns: [
    '/node_modules/',
    '/.yarn/',
    '/.next/',
    '^.+\\.module\\.(css|sass|scss)$',
    'cypress',
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
    'cypress',

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
  collectCoverage: true,
}

module.exports = createJestConfig(customJestConfig)
