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
    sync: async (offset = 0, consoleWarning = true) => {
      if (consoleWarning)
        console.warn(
          'If you are calling time.sync() at the same time as makeName your Date object will be inaccurate',
        )
      const browserTime = await page.evaluate(() => Math.floor(Date.now() / 1000))
      const blockTime = await provider.getBlockTimestamp()
      const browserOffset = (blockTime - browserTime + offset) * 1000

      console.log(`Browser time: ${new Date(Date.now() + browserOffset)}`)

      await page.addInitScript(`{
        const __DateNow = Date.now;
        // Extend Date constructor to default to fakeNow
        Date = class extends Date {
          constructor(...args) {
            if (args.length === 0) {
              super(__DateNow() + ${browserOffset});
            } else {
              super(...args);
            }
          }
        }
        // Override Date.now() to start from fakeNow
        Date.now = () => __DateNow() + ${browserOffset};
      }`)
    },
  }
}
