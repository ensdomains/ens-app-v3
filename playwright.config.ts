import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e/specs',
  testMatch: '*.spec.ts',
  retries: process.env.CI ? 2 : 0,
  timeout: 120000, // add extra time for loading
  fullyParallel: true, // required to evenly shard
  workers: 1, // keep tests serial for now
  reporter: [['html', { open: 'always' }]],
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
    baseURL: process.env.CI ? 'http://127.0.0.1:8788' : 'http://localhost:3000',
  },
})
