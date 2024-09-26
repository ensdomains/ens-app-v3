import { expect } from '@playwright/test'

import { setPrimaryName } from '@ensdomains/ensjs/wallet'

import { test } from '../../../playwright'
import { createAccounts } from '../../../playwright/fixtures/accounts'
import { walletClient } from '../../../playwright/fixtures/contracts/utils/addTestContracts'

test('should allow box registration with available name', async ({
  page,
  login,
  time,
  makePageObject,
  consoleListener,
}) => {
  const name = `box-registration-${Date.now()}.box`

  await setPrimaryName(walletClient, {
    name: '',
    account: createAccounts().getAddress('user') as `0x${string}`,
  })

  const homePage = makePageObject('HomePage')

  await consoleListener.initialize({
    regex: new RegExp(
      `Event triggered on local development.*?(${[
        'search_selected_box',
        'register_started_box',
      ].join('|')})`,
    ),
  })

  await time.sync(500)

  await homePage.goto()
  await login.connect()

  await homePage.searchInput.fill(name)
  await page.locator(`[data-testid="search-result-name"]`, { hasText: name }).waitFor()
  await page.locator(`[data-testid="search-result-name"]`, { hasText: 'Available' }).waitFor()
  await homePage.searchInput.press('Enter')

  await test.step('should fire tracking event: search_selected_box', async () => {
    await expect(consoleListener.getMessages()).toHaveLength(1)
    await expect(consoleListener.getMessages().toString()).toMatch(
      new RegExp(`search_selected_box.*?${name}`),
    )
    consoleListener.clearMessages()
  })

  await page.waitForURL(new RegExp(`/${name}/dotbox`))
  await expect(page.locator(`text=${name}`).first()).toBeVisible()
  await expect(page.locator('text=Available')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Register on my.box' })).toBeVisible()

  const [newTab] = await Promise.all([
    page.waitForEvent('popup'),
    page.click('text=Register on my.box'),
  ])

  await newTab.waitForLoadState()

  await expect(newTab).toHaveURL(
    `https://my.box/search?domain=${name.replace('.box', '')}&ref=ensdomains`,
  )

  await test.step('should fire tracking event: register_started_box', async () => {
    await expect(consoleListener.getMessages()).toHaveLength(1)
    await expect(consoleListener.getMessages().toString()).toContain('register_started_box')
    consoleListener.clearMessages()
  })
})

test('should not direct to the registration page if name is not available', async ({
  page,
  login,
  makePageObject,
  consoleListener,
}) => {
  await setPrimaryName(walletClient, {
    name: '',
    account: createAccounts().getAddress('user') as `0x${string}`,
  })

  const name = 'google.box'

  await consoleListener.initialize({
    regex: new RegExp(
      `Event triggered on local development.*?(${[
        'search_selected_box',
        'register_started_box',
      ].join('|')})`,
    ),
  })

  const homePage = makePageObject('HomePage')
  await homePage.goto()
  await login.connect()

  await homePage.searchInput.fill(name)
  await page.locator(`[data-testid="search-result-name"]`, { hasText: name }).waitFor()
  await page.locator(`[data-testid="search-result-name"]`, { hasText: 'Registered' }).waitFor()
  await homePage.searchInput.press('Enter')

  await expect(page).toHaveURL('/')

  await test.step('should not fire tracking event: search_selected_box', async () => {
    await expect(consoleListener.getMessages()).toHaveLength(0)
  })
})
