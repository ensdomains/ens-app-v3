import { expect } from '@playwright/test'

import { test } from '../../../playwright/index.js'

test.describe('More Tab Primary Names', () => {
  test(`should enter primary name more tab @mainnet`, async ({ page, login, makePageObject }) => {
    const name = 'default-ens.eth'
    await page.goto('/')
    await login.connect()

    // Go to more page of default-ens.eth
    const morePage = makePageObject('MorePage')
    await morePage.goto(name)
    await expect(morePage.wrapButton).toHaveCount(0)

    // Check eth and scr is showing with correct address
    const address = '0xFc5958B4B6F9a06D21E06429c8833f865577acf0'

    await expect(page.locator(`button:has-text("eth"):has-text("${address}")`)).toBeVisible()
    await expect(page.locator(`button:has-text("scr"):has-text("${address}")`)).toBeVisible()
  })
})
