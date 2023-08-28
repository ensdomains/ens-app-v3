/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e/specs',
  testMatch: '*.spec.ts',
  retries: process.env.CI ? 2 : 0,
  timeout: 60000, // add extra time for login
  fullyParallel: true, // required to evenly shard
  workers: 1, // keep tests serial for now
  reporter: [['html', { open: 'never' }]],
  expect: {
    timeout: 15000, // add extra time to account for page loads
  },
  projects: [
    {
      name: 'stateless',
      testDir: './e2e/specs/stateless',
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
    baseURL: process.env.CI ? 'http://localhost:8788' : 'http://localhost:3000',
  },
})
