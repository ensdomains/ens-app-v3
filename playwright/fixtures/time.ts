/* eslint-disable import/no-extraneous-dependencies */
import { Page } from '@playwright/test'

import { publicClient, testClient } from './contracts/utils/addTestContracts'

export type Time = ReturnType<typeof createTime>

type Dependencies = {
  page: Page
}

export const createTime = ({ page }: Dependencies) => {
  return {
    // Offset is used to set the browser forward in time. This is useful for testing contract where
    // the contract relies on block timestamp, but anvil's block timestamp is unpredictable.
    sync: async (offset = 0) => {
      const blockTime = Number((await publicClient.getBlock()).timestamp)
      const time = new Date((blockTime + offset) * 1000)
      console.log(`Browser time: ${time}`)
      await page.clock.install({ time })
    },
    logBlockTime: async () => {
      const blockTime = Number((await publicClient.getBlock()).timestamp)
      console.log(`Block time: ${new Date(blockTime * 1000)}`)
    },
    logBrowserTime: async () => {
      const time = await page.evaluate(() => new Date().toString())
      console.log(`Browser time: ${time}`)
    },
    syncFixed: async () => {
      const blockTime = Number((await publicClient.getBlock()).timestamp)
      const time = new Date(blockTime * 1000)
      await page.clock.setFixedTime(time)
      console.log(`Fixed Browser time: ${time}`, blockTime)
    },
    increaseTime: async ({ seconds }: { seconds: number }) => {
      await testClient.increaseTime({ seconds })
      await page.clock.fastForward(seconds * 1000)
    },
    increaseTimeByTimestamp: async ({ seconds }: { seconds: number }) => {
        const tryIncreaseTime = async () => {
        try {
          const blockTimestamp = Number((await publicClient.getBlock()).timestamp)
          await testClient.setNextBlockTimestamp({ timestamp: BigInt(blockTimestamp + seconds) })
          await testClient.mine({ blocks: 1 })
          return true
        } catch {
          return false
        }
      }

      let success = false
      let attempts = 0
      while (!success && attempts < 3) {
        success = await tryIncreaseTime()
        attempts += 1
      }
    }
  }
}
