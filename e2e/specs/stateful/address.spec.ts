import { expect } from '@playwright/test'
import { test } from '@root/playwright'

test('should allow user to connect', async ({ page, login }) => {
  test.slow()
  await page.goto('/')
  await login.connect()

  await page.getByTestId('header-profile').click()
  await expect(page.getByText('Profile')).toBeVisible()
  await page.getByTestId('header-profile').click()
  await expect(page.getByText('Profile')).not.toBeVisible()
})

test('should go to the address page', async ({ page, login }) => {
  test.slow()
  await page.goto('/')
  await login.connect()

  await page.pause()
  await page
    .getByPlaceholder('Search for a name')
    .fill('0x866b3c4994e1416b7c738b9818b31dc246b95eee')
  await page.getByPlaceholder('Search for a name').press('Enter')
  await expect(page.getByTestId('profile-snippet')).toBeVisible({ timeout: 25000 })
})

test('should not show the profile if there is no primary name for the address', async ({
  page,
  login,
}) => {
  test.slow()
  await page.goto('/')
  await login.connect()
  await page
    .getByPlaceholder('Search for a name')
    .fill('0x2330eb2d92167c3b6b22690c03b508e0ca532980')
  await page.getByPlaceholder('Search for a name').press('Enter')
  await expect(page.getByTestId('no-profile-snippet')).toBeVisible({ timeout: 25000 })
  await expect(page.getByText('No primary name set')).toBeVisible()
})
