import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  project: ['src/**/*.{js,jsx,ts,tsx,mjs,mts}'],
  include: ['files', 'duplicates'],
  exclude: ['types', 'exports', 'unlisted'],
  next: {
    entry: ['next.config.{js,ts,cjs,mjs}', 'src/pages/**/*.{js,jsx,ts,tsx}'],
  },
  playwright: {
    config: ['playwright.config.{js,ts}'],
    entry: ['e2e/**/*.@(spec|test).?(c|m)[jt]s?(x)'],
  },
  vitest: {
    config: ['vitest.config.{js,mjs,ts,cjs,mts,cts}'],
    entry: ['src/**/*.test.{js,ts,jsx,tsx}'],
  },
  ignore: [
    // Duplicate exports. Removal is currently blocked due to potential E2E test failures.
    'src/transaction-flow/input/EditResolver/EditResolver-flow.tsx',
    'src/utils/metamask/firefox.ts',
    // We still need the `test-d` files
    'src/hooks/ensjs/public/useRecords.test-d.ts',
    'src/utils/query/match/matchExactOrNullParamItem.test-d.ts',
    'src/utils/query/match/matchQueryKeyMeta.test-d.ts',
    'src/utils/query/match/queryKeyToInternalParams.test-d.ts',
    // Will need later
    'src/components/pages/migrate/Carousel.tsx',
  ],
}

export default config
