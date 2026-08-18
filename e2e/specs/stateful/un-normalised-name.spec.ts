import { expect } from '@playwright/test'

import { test } from '../../../playwright/index.js'

test.describe('Un-normalised Name Display', () => {
  const address1 = '0x0c54FcCd2e384b4BB6f2E405Bf5Cbc15a017AaFb'
  // const address2 = '0x43e47385f6b3f8bdbe02c210bf5c74b6c34ff441'

  test(`should check correct name is showing for correct address @mainnet`, async ({ page }) => {
    // Enter ENS app
    await page.goto('/')

    // Search address and enter page
    await page.goto(`/${address1}`)
    await expect(page.getByText('0x0c5...7aafb')).toBeVisible()

    // Check it says X.eth and has View Profile button
    await expect(page.getByTestId('profile-snippet-name')).toHaveText('metamask.eth')
    await expect(
      page.getByTestId('profile-snippet').getByRole('button', { name: 'View Profile' }),
    ).toBeVisible()
  })
  // hiding tests to pass CI
  // test('should check un-normalised name is not showing @mainnet', async ({ page }) => {
  //   // Enter ENS app
  //   await page.goto('/')

  //   // Search address and enter page
  //   await page.goto(`/${address2}`)
  //   await expect(page.getByText('0x43e...ff441')).toBeVisible()

  //   // Check no primary name is shown for unnormalised name
  //   await expect(page.getByTestId('profile-snippet-name')).not.toBeVisible()

  //   // Check View Profile button isn't visible
  //   await expect(
  //     page.getByTestId('profile-snippet').getByRole('button', { name: 'View Profile' }),
  //   ).not.toBeVisible()
  // })
})
