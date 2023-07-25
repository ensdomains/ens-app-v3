/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './playwright/tests',
  testMatch: '*.spec.ts',
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'list',
  globalTeardown: './playwright/teardown/test.ts',
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  use: {
    baseURL: process.env.CI ? 'http://localhost:8788' : 'http://localhost:3000',
  },
})
