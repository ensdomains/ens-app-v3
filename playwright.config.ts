/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e/specs',
  testMatch: '*.spec.ts',
  retries: process.env.CI ? 2 : 0,
  timeout: 120000, // add extra time for loading
  fullyParallel: true,
  workers: '100%',
  reporter: process.env.CI
    ? [['blob', { fileName: 'report.zip' }]]
    : [['html', { open: 'always' }]],
  projects: [
    {
      name: 'setup balances',
      testMatch: /global\.setup\.ts/,
    },
    {
      name: 'stateless-parallel',
      fullyParallel: true,
      testDir: './e2e/specs/stateless/parallel',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup balances'],
    },
    {
      name: 'stateless-serial',
      fullyParallel: false,
      testDir: './e2e/specs/stateless/serial',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'stateful',
      testDir: './e2e/specs/stateful',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
  use: {
    baseURL: process.env.CI ? 'http://127.0.0.1:8788' : 'http://localhost:3000',
  },
})
