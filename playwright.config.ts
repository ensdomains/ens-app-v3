/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './playwright/tests',
  testMatch: '*.spec.ts',
  retries: 0,
  workers: 4,
  reporter: 'list',
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
})
