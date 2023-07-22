/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './playwright/tests',
  testMatch: '*.spec.ts',
  retries: 0,
  workers: 4,
  reporter: 'list',
  globalTeardown: './playwright/teardown/test.ts',
  projects: [
    {
      name: 'setup',
      testMatch: 'setup.spec.ts',
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
    },
  ],
  use: {
    baseURL: 'http://localhost:3000',
  },
})
