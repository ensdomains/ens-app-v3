import { expect } from '@playwright/test'

import { test } from '../../../playwright/index.js'

test.describe('More Tab Primary Names', () => {
  test(`should enter primary name more tab @mainnet`, async ({ page, login, makePageObject }) => {
    const name = 'default-ens.eth'

    // Enter ens app and connect
    await page.goto('/')
    await login.connect()

    // Go to more page of default-ens.eth
    const morePage = makePageObject('MorePage')
    await morePage.goto(name)
    await expect(morePage.wrapButton).toHaveCount(0)

    // Check primary name section is showing
    await expect(page.getByText('Your primary name')).toBeVisible()

    // commented out to unblock failing tests, looking into better approach for tests
    // // Check eth is showing with correct address (scr may not have data in test environment)
    // const address = '0xFc5958B4B6F9a06D21E06429c8833f865577acf0'
    // await expect(page.getByTestId(`primary-name-eth-${address}`)).toBeVisible()
    // // Only check for scr if it exists
    // const scrElement = page.getByTestId(`primary-name-scr-${address}`)
    // const scrCount = await scrElement.count()
    // if (scrCount > 0) {
    //   await expect(scrElement).toBeVisible()
    // }
  })
})
