/* eslint-disable import/no-extraneous-dependencies */
import react from '@vitejs/plugin-react'
import svg from 'vite-plugin-magical-svg'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [svg({ target: 'react' }), react()],
  test: {
    globals: true,
    environment: 'jsdom',
    alias: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      '@app/': new URL('./src/', import.meta.url).pathname,
    },
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    setupFiles: ['./test/textencoder-setup.mts', './test/websocket-setup.mts'],
    globalSetup: ['./test/global-setup.mts'],
    coverage: {
      provider: 'v8',
    },
    environmentMatchGlobs: [['**/*.node.test.ts', 'node']],
  },
})
