/* eslint-disable import/no-extraneous-dependencies */
import { Page } from '@playwright/test'

import { Provider } from './provider'

export type Time = ReturnType<typeof createTime>

type Dependencies = {
  provider: Provider
  page: Page
}

export const createTime = ({ provider, page }: Dependencies) => {
  return {
    sync: async (offset = 0) => {
      const browserTime = await page.evaluate(() => Math.floor(Date.now() / 1000))
      const blockTime = await provider.getBlockTimestamp()
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
