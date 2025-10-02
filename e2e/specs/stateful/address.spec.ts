import { expect } from '@playwright/test'

import { test } from '../../../playwright/index.js'

test('should allow user with primary name to connect', async ({ page, login }) => {
  test.slow()
  await page.goto('/?chain=sepolia')
  await login.connect()

  await page.getByTestId('header-profile').click()
  await expect(page.getByText('Disconnect')).toBeVisible()
})

test('should go to the address page', async ({ page, login }) => {
  test.slow()
  await page.goto('/?chain=sepolia')
  await login.connect()

  await page
    .getByPlaceholder('Search for a name')
    .fill('0xFc5958B4B6F9a06D21E06429c8833f865577acf0')
  await page.getByPlaceholder('Search for a name').press('Enter')
  await expect(page.getByTestId('profile-snippet')).toBeVisible({ timeout: 25000 })
})

test('should not show the profile if there is no primary name for the address', async ({
  page,
  login,
}) => {
  test.slow()
  await page.goto('/?chain=sepolia')
  await login.connect()
  await page
    .getByPlaceholder('Search for a name')
    .fill('0x2330eb2d92167c3b6b22690c03b508e0ca532980')
  await page.getByPlaceholder('Search for a name').press('Enter')
  await expect(page.getByTestId('no-profile-snippet')).toBeVisible({ timeout: 25000 })
  await expect(page.getByText('No primary name set')).toBeVisible()
})
