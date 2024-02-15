/* eslint-disable import/no-extraneous-dependencies */
import react from '@vitejs/plugin-react'
// import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    alias: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      '@app/': new URL('./src/', import.meta.url).pathname,
    },
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    setupFiles: ['./vitest-setup.mts'],
  },
})
