/* eslint-disable import/no-extraneous-dependencies */
import { Page } from '@playwright/test'

import { publicClient } from './contracts/utils/addTestContracts'

export type Time = ReturnType<typeof createTime>

type Dependencies = {
  page: Page
}

export const createTime = ({ page }: Dependencies) => {
  return {
    sync: async (offset = 0) => {
      const blockTime = Number((await publicClient.getBlock()).timestamp)
      await page.clock.install({ time: new Date((blockTime + offset) * 1000)})
    },
    sync_old: async (offset = 0) => {
      const browserTime = await page.evaluate(() => Math.floor(Date.now() / 1000))
      const blockTime = Number((await publicClient.getBlock()).timestamp)
      const browserOffset = (blockTime - browserTime + offset) * 1000

      console.log(`Browser time: ${new Date(Date.now() + browserOffset)}`)

      await page.addInitScript(`{
        // Prevents Date from being extended multiple times
        if (Object.getPrototypeOf(Date).name !== 'Date') {
          const __DateNow = Date.now
          const browserOffset = ${browserOffset};
          Date = class extends Date {
            constructor(...args) {
              if (args.length === 0) {
                super(__DateNow() + browserOffset);
              } else {
                super(...args);
              }
            }

            static now() {
              return super.now() + browserOffset;
            }
          }
        }
      }`)
    },
  }
}
