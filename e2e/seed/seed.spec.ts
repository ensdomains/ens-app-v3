/**
 * Test-data seeder for exploratory / manual testing sessions (used by the Claude manual-test
 * workflow, but works locally too).
 *
 * It is a Playwright "test" only to reuse the runner's TypeScript/path resolution and the `makeName`
 * helper — it never opens a browser, so it deliberately builds its own fixtures instead of taking
 * them from the test context (the standard `time` fixture needs a `page`, which would force a
 * browser launch just to seed a name).
 *
 * Usage:
 *   SEED_NAMES='[{"label":"my-name","type":"legacy","owner":"user"}]' pnpm seed
 *
 * `SEED_NAMES` is the exact argument you would pass to `makeName(...)` in an e2e spec, so every
 * option in playwright/fixtures/makeName is available (type: 'legacy' | 'legacy-register' |
 * 'wrapped', owner, manager, duration — negative for grace period — fuses, records, subnames...).
 * Optional: SEED_TIME_OFFSET (seconds), SEED_SYNC_SUBGRAPH ('false' to skip subgraph sync).
 */
import { test } from '@playwright/test'

import { createAccounts } from '../../playwright/fixtures/accounts'
import { testClient } from '../../playwright/fixtures/contracts/utils/addTestContracts'
import { createMakeNames } from '../../playwright/fixtures/makeName/index'
import { createSubgraph } from '../../playwright/fixtures/subgraph'
import type { Time } from '../../playwright/fixtures/time'

// Everything the browser clock would do is a no-op here; chain-side time travel still works.
const headlessTime: Time = {
  sync: async () => {},
  syncFixed: async () => {},
  logBrowserTime: async () => {},
  logBlockTime: async () => {},
  increaseTime: async ({ seconds }) => {
    await testClient.increaseTime({ seconds })
    await testClient.mine({ blocks: 1 })
  },
  increaseTimeByTimestamp: async ({ seconds }) => {
    await testClient.increaseTime({ seconds })
    await testClient.mine({ blocks: 1 })
  },
}

test('seed names', async () => {
  const raw = process.env.SEED_NAMES
  test.skip(!raw, 'SEED_NAMES not set')
  test.setTimeout(300_000)

  const makeName = createMakeNames({
    accounts: createAccounts(),
    time: headlessTime,
    subgraph: createSubgraph(),
  })

  const names = JSON.parse(raw!)
  const result = await makeName(Array.isArray(names) ? names : [names], {
    timeOffset: process.env.SEED_TIME_OFFSET ? Number(process.env.SEED_TIME_OFFSET) : undefined,
    syncSubgraph: process.env.SEED_SYNC_SUBGRAPH !== 'false',
  })

  console.log(`SEEDED: ${JSON.stringify(result)}`)
})
