/* eslint-disable import/no-extraneous-dependencies */
import react from '@vitejs/plugin-react'
import svg from 'vite-plugin-magical-svg'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    svg({ target: 'react' }),
    react(),
    {
      name: 'jsdom-cleanup',
      config: () => ({
        test: {
          include: ['src/**/*.test.tsx'],
          setupFiles: ['./test/dom-setup.mts'],
        },
      }),
    },
  ],
  test: {
    globals: false,
    environment: 'jsdom',
    alias: {
      /* eslint-disable @typescript-eslint/naming-convention */
      '@app/': new URL('./src/', import.meta.url).pathname,
      '@root/': new URL('./', import.meta.url).pathname,
      /* eslint-enable @typescript-eslint/naming-convention */
    },
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    setupFiles: ['./test/textencoder-setup.mts', './test/websocket-setup.mts'],
    globalSetup: ['./test/global-setup.mts'],
    // Under coverage the default worker count oversubscribes CPU and starves async
    // react-hook-form validation/timers, intermittently failing timing-sensitive
    // tests. Cap concurrency so each worker stays responsive.
    minWorkers: 1,
    maxWorkers: '50%',
    coverage: {
      provider: 'v8',
      include: ['src/**/*'],
    },
    typecheck: {
      ignoreSourceErrors: true,
    },
    environmentMatchGlobs: [['**/*.node.test.ts', 'node']],
    deps: {
      optimizer: {
        web: {
          include: ['vitest-canvas-mock'],
        },
      },
    },
  },
})
