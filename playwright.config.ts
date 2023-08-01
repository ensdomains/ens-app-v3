/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './playwright/tests',
  testMatch: '*.spec.ts',
  retries: process.env.CI ? 2 : 0,
  timeout: 45000, // add extra time for loading
  fullyParallel: true, // required to evenly shard
  workers: 1, // keep tests serial for now
  reporter: [['html', { open: 'never' }]],
  projects: [
    {
      name: 'stateless',
      testDir: './playwright/tests',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'stateful',
      testDir: './playwright/stateful',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
  use: {
    baseURL: process.env.CI ? 'http://localhost:8788' : 'http://localhost:3000',
  },
})
