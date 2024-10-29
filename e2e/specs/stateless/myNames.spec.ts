import { expect } from '@playwright/test'
import { testClient } from '@root/playwright/fixtures/contracts/utils/addTestContracts'

import { test } from '../../../playwright'
import { Name } from '../../../playwright/fixtures/makeName'

test('myNames', async ({ page, login, makeName }) => {
  await testClient.increaseTime({ seconds: 3 * 365 * 24 * 60 * 60 })
  await testClient.mine({ blocks: 1 })

  const nameConfig: Name[] = Array.from({ length: 20 }).map((_, i) => ({
    label: `name${i}`,
    type: 'legacy',
    owner: 'user2',
  }))

  const names = await makeName(nameConfig)

  await page.goto('/')
  await login.connect('user2')

  await page.goto('/my/names')

  const timestamps = await Promise.all(
    names.map(async (name) => {
      return page
        .getByTestId(`name-item-${name}`)
        .getByTestId('short-expiry')
        .getAttribute('data-timestamp')
    }),
  )

  expect(timestamps.every((timestamp) => timestamp === timestamps[0])).toBe(true)
})
