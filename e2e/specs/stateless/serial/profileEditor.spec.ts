/* eslint-disable no-restricted-syntax */

import { expect } from '@playwright/test'

import { test } from '../../../../playwright'

test.describe('migrations', () => {
  test('should force a name on the old registry to go to update registry', async ({
    page,
    login,
    makePageObject,
  }) => {
    await page.goto('/legacy.test')

    await login.connect('user2')

    const profilePage = makePageObject('ProfilePage')
    await profilePage.editProfileButton.click()

    await expect(page.getByText('Registry out of date')).toBeVisible()
    await expect(page.getByTestId('warning-overlay-next-button')).toHaveAttribute(
      'href',
      `https://legacy.ens.domains/name/legacy.test`,
    )
  })
})
