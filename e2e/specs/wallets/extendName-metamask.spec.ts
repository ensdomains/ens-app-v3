import { BrowserContext, expect, Page, test } from '@playwright/test'
import dappwright from '@tenkeylabs/dappwright'
import type { Dappwright } from '@tenkeylabs/dappwright'

import { dateToDateInput, roundDurationWithDay, secondsToDateInput } from '@app/utils/date'

import { SafeEnsConfig } from './config/safe-ens-config'
import { confirmTransactionWithMetaMask, connectWalletToEns } from './config/wallet-ens-config'

// Global variables to share state
let metaMask: Dappwright
let page: Page
let context: BrowserContext

// Extend owned name
async function extendOwnedName(): Promise<void> {
  const name = 'extend-name-test.eth'

  console.log(`🎯 Starting extension for ${name}`)

  // Search for name
  const searchInput = page.locator('input[placeholder="Search for a name"]')
  await searchInput.waitFor({ timeout: 15000 })
  await searchInput.fill(name)
  await searchInput.press('Enter')

  // Grab the current expiry timestamp from profile
  const expiryElement = page.getByTestId('owner-profile-button-name.expiry')
  await expiryElement.waitFor({ state: 'visible', timeout: 15000 })

  const timestampAttr = await expiryElement.getAttribute('data-timestamp')
  if (!timestampAttr) throw new Error('❌ Could not read expiry timestamp from UI')

  const currentExpiryTimestamp = parseInt(timestampAttr, 10)
  console.log(`📅 Current expiry: ${new Date(currentExpiryTimestamp).toISOString()}`)

  // Click "extend"
  const extendButton = page.getByTestId('extend-button')
  await extendButton.waitFor({ state: 'visible', timeout: 15000 })
  await extendButton.click()

  // Switch to "pick by date"
  const dateSelection = page.getByTestId('date-selection')
  await expect(dateSelection).toHaveText('Pick by date')
  await dateSelection.click()

  // Fill the calendar with a date one day later
  const expiryTime = currentExpiryTimestamp / 1000
  const calendar = page.getByTestId('calendar')
  const dayLater = await page.evaluate((ts) => {
    const expiryDate = new Date(ts)
    expiryDate.setDate(expiryDate.getDate() + 1)
    return expiryDate
  }, currentExpiryTimestamp)

  await calendar.fill(dateToDateInput(dayLater))
  await expect(page.getByTestId('calendar-date')).toHaveValue(
    secondsToDateInput(expiryTime + roundDurationWithDay(dayLater, expiryTime)),
  )

  // Confirm extension
  const confirmButton = page.getByTestId('extend-names-confirm')
  await confirmButton.click()

  // Transaction modal check BEFORE confirming
  await expect(page.getByText('1 day')).toBeVisible()
  await page.locator('text=Open Wallet').waitFor({ timeout: 10000 })
  await page.locator('text=Open Wallet').click()

  // Confirm in Metamask pop up
  await confirmTransactionWithMetaMask(page)

  // Wait for transaction to complete
  await page.waitForTimeout(25000)

  // Close transaction complete modal
  const transactionCompleteButton = page.getByTestId('transaction-modal-complete-button')
  await transactionCompleteButton.click()

  // Verify new expiry is +1 day
  const newTimestampAttr = await expiryElement.getAttribute('data-timestamp')
  if (!newTimestampAttr) throw new Error('❌ Could not read new expiry timestamp')

  const newExpiryTimestamp = parseInt(newTimestampAttr, 10)
  const expectedDate = new Date(currentExpiryTimestamp)
  expectedDate.setDate(expectedDate.getDate() + 1)
  const expectedTimestamp = expectedDate.getTime()

  expect(newExpiryTimestamp).toBe(expectedTimestamp)
  console.log(
    `✅ Name successfully extended by 1 day (new expiry: ${new Date(
      newExpiryTimestamp,
    ).toISOString()})`,
  )
}

// Extend unowned name
async function extendUnownedName(): Promise<void> {
  const name = 'user1-extend.eth'

  console.log(`🎯 Starting extension for ${name}`)

  // Search for name
  const searchInput = page.locator('input[placeholder="Search for a name"]')
  await searchInput.waitFor({ timeout: 15000 })
  await searchInput.fill(name)
  await searchInput.press('Enter')

  // Grab the current expiry timestamp from profile
  const expiryElement = page.getByTestId('owner-profile-button-name.expiry')
  await expiryElement.waitFor({ state: 'visible', timeout: 15000 })

  const timestampAttr = await expiryElement.getAttribute('data-timestamp')
  if (!timestampAttr) throw new Error('❌ Could not read expiry timestamp from UI')

  const currentExpiryTimestamp = parseInt(timestampAttr, 10)
  console.log(`📅 Current expiry: ${new Date(currentExpiryTimestamp).toISOString()}`)

  // Click "extend"
  const extendButton = page.getByTestId('extend-button')
  await extendButton.waitFor({ state: 'visible', timeout: 15000 })
  await extendButton.click()

  // Acknowledge extension of unowned name
  const extendUnownedConfirm = page.getByTestId('extend-names-confirm')
  await extendUnownedConfirm.waitFor({ state: 'visible', timeout: 5000 })
  await extendUnownedConfirm.click()

  // Switch to "pick by date"
  const dateSelection = page.getByTestId('date-selection')
  await expect(dateSelection).toHaveText('Pick by date', { timeout: 5000 })
  await dateSelection.click()

  // Fill the calendar with a date one day later
  const expiryTime = currentExpiryTimestamp / 1000
  const calendar = page.getByTestId('calendar')
  const dayLater = await page.evaluate((ts) => {
    const expiryDate = new Date(ts)
    expiryDate.setDate(expiryDate.getDate() + 1)
    return expiryDate
  }, currentExpiryTimestamp)

  await calendar.fill(dateToDateInput(dayLater))
  await expect(page.getByTestId('calendar-date')).toHaveValue(
    secondsToDateInput(expiryTime + roundDurationWithDay(dayLater, expiryTime)),
  )

  // Confirm extension
  const confirmButton = page.getByTestId('extend-names-confirm')
  await confirmButton.click()

  // Transaction modal check BEFORE confirming
  await expect(page.getByText('1 day')).toBeVisible()
  await page.locator('text=Open Wallet').waitFor({ timeout: 10000 })
  await page.locator('text=Open Wallet').click()

  // Confirm in Metamask pop up
  await confirmTransactionWithMetaMask(page)

  // Wait for transaction to complete
  await page.waitForTimeout(15000)

  // Close transaction complete modal
  const transactionCompleteButton = page.getByTestId('transaction-modal-complete-button')
  await transactionCompleteButton.click()

  // Verify new expiry is +1 day
  const newTimestampAttr = await expiryElement.getAttribute('data-timestamp')
  if (!newTimestampAttr) throw new Error('❌ Could not read new expiry timestamp')

  const newExpiryTimestamp = parseInt(newTimestampAttr, 10)
  const expectedDate = new Date(currentExpiryTimestamp)
  expectedDate.setDate(expectedDate.getDate() + 1)
  const expectedTimestamp = expectedDate.getTime()

  expect(newExpiryTimestamp).toBe(expectedTimestamp)
  console.log(
    `✅ Name successfully extended by 1 day (new expiry: ${new Date(
      newExpiryTimestamp,
    ).toISOString()})`,
  )
}

test.describe('ENS Sepolia Extend Name', () => {
  test.beforeAll('Setup Metamask', async () => {
    console.log('🦊 Setting up MetaMask...')
    const [mm, pg, ctx] = await dappwright.bootstrap('chromium', {
      wallet: 'metamask',
      version: SafeEnsConfig.METAMASK.VERSION,
      seed: SafeEnsConfig.SEED_PHRASE,
      password: SafeEnsConfig.WALLET_PASSWORD,
      headless: SafeEnsConfig.BROWSER.HEADLESS,
      slowMo: SafeEnsConfig.BROWSER.SLOW_MO,
    })

    metaMask = mm
    page = pg
    context = ctx

    console.log('✅ MetaMask setup complete')

    // Switch to User 2 account
    await page.click('[data-testid="account-menu-icon"]')
    await page.click('[data-testid="multichain-account-menu-popover-action-button"]')
    await page.click('[data-testid="multichain-account-menu-popover-add-account"]')
    await page.click('[data-testid="submit-add-account-with-name"]')

    console.log('✅ Switched to User 2 account')

    try {
      await metaMask.switchNetwork('Sepolia')
      console.log('✅ Switched to Sepolia network')
    } catch (error) {
      console.log('⚠️ Could not switch to Sepolia:', error)
    }

    // Connect wallet to ENS Sepolia
    await connectWalletToEns(page, context)
  })

  test.beforeEach('Navigate to home page', async () => {
    // Navigate back to home page before each test to ensure clean state
    await page.goto('http://localhost:3000/')
    await page.waitForTimeout(2000)
  })

  test('Connect MetaMask to ENS localhost app', async () => {
    await expect(
      page.locator('button:has-text("Connect"), [data-testid="connect-button"]'),
    ).toBeHidden({ timeout: 5000 })

    console.log('✅ Wallet is connected and ready')
  })

  test('Extend user owned ENS name', async () => {
    await extendOwnedName()
  })

  test('Extend not user owned ENS name', async () => {
    await extendUnownedName()
  })
})
