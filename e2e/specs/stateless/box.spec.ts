import { expect } from '@playwright/test'

import { setPrimaryName } from '@ensdomains/ensjs/wallet'

import { test } from '../../../playwright'
import { createAccounts } from '../../../playwright/fixtures/accounts'
import { walletClient } from '../../../playwright/fixtures/contracts/utils/addTestContracts'

const chain = 'localhost'
const trackEventPrefix = 'Event triggered on local development'
const validEventTypesRegex = /"type":"(search_selected_box|register_started_box)"/

test('should allow box registration with available name', async ({
  page,
  login,
  time,
  makePageObject,
}) => {
  const name = `box-registration-${Date.now()}.box`

  await setPrimaryName(walletClient, {
    name: '',
    account: createAccounts().getAddress('user') as `0x${string}`,
  })

  const events: string[] = []
  page.on('console', (msg) => {
    const message = msg.text()

    if (validEventTypesRegex.test(message)) {
      events.push(message.replace(trackEventPrefix, '').trim())
    }
  })

  const homePage = makePageObject('HomePage')
  await time.sync(500)

  await homePage.goto()
  await login.connect()

  await homePage.searchInput.fill(name)
  await page.locator(`[data-testid="search-result-name"]`, { hasText: name }).waitFor()
  await page.locator(`[data-testid="search-result-name"]`, { hasText: 'Available' }).waitFor()
  await homePage.searchInput.press('Enter')

  await test.step('should fire tracking event: search_selected_box', async () => {
    await expect(events).toHaveLength(1)
    await expect(events[0]).toContain(
      JSON.stringify({ type: 'search_selected_box', chain, props: { name } }),
    )
    events.length = 0
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
    await expect(events).toHaveLength(1)
    await expect(events[0]).toContain(JSON.stringify({ type: 'register_started_box', chain }))
    events.length = 0
  })
})

test('should not direct to the registration page if name is not available', async ({
  page,
  login,
  makePageObject,
}) => {
  await setPrimaryName(walletClient, {
    name: '',
    account: createAccounts().getAddress('user') as `0x${string}`,
  })

  const name = 'google.box'

  const events: string[] = []
  page.on('console', (msg) => {
    const message = msg.text()

    if (validEventTypesRegex.test(message)) {
      events.push(message.replace(trackEventPrefix, '').trim())
    }
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
    await expect(events.some((event) => event.includes('search_selected_box'))).toBeFalsy()
  })
})
