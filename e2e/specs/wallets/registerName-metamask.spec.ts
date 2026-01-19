import { BrowserContext, expect, Page, test } from '@playwright/test'
import dappwright from '@tenkeylabs/dappwright'

import { SafeEnsConfig } from './config/safe-ens-config'
import {
  confirmTransactionWithMetaMask,
  connectWalletToEns,
  switchToUser2AndSepolia,
} from './config/wallet-ens-config'

// Global variables to share state
let page: Page
let context: BrowserContext
let ensName: string

// Register unowned name
async function performRegistration(name: string): Promise<void> {
  console.log(`🎯 Starting registration for ${name}`)

  // Search for name
  const searchInput = page.locator('input[placeholder="Search for a name"]')
  await searchInput.waitFor({ timeout: 15000 })
  await searchInput.fill(name)
  await searchInput.press('Enter')

  // Wait for registration page
  await page.getByRole('heading', { name: `Register ${name}` }).waitFor({ timeout: 15000 })
  console.log('✅ Registration page loaded')

  // Payment + primary toggle
  await page.locator('[data-testid="payment-choice-ethereum"]').check()
  await page.locator('[data-testid="primary-name-toggle"]').check()

  // Proceed to profile step
  await page.locator('[data-testid="next-button"]').click()

  const profileSubmitButton = page.locator('[data-testid="profile-submit-button"]')
  if (await profileSubmitButton.isVisible({ timeout: 5000 }).catch(() => false)) {
    await profileSubmitButton.click()
  }

  // Proceed to commit step
  await page.locator('[data-testid="next-button"]').click()

  // Wait for "Open Wallet" and confirm commit
  await page.locator('text=Open Wallet').waitFor({ timeout: 10000 })
  await page.locator('text=Open Wallet').click()

  // Confirm transaction
  await confirmTransactionWithMetaMask(page, 'commit', name)

  // Wait 60s for commit
  await page.waitForTimeout(75000)

  // Wait for "Finish" button and confirm register
  const finishButton = page.locator('[data-testid="finish-button"]')
  await finishButton.waitFor({ timeout: 10000 })
  await finishButton.click()

  // Open wallet modal and click
  await page.locator('text=Open Wallet').waitFor({ timeout: 10000 })
  await page.locator('text=Open Wallet').click()

  // Confirm transaction
  await confirmTransactionWithMetaMask(page, 'register', name)

  console.log('🎉 ENS registration completed!')
}

// Register owned name
async function registerOwnedName() {
  const registeredName = 'registered-name.eth'

  console.log(`🎯 Starting registration for ${registeredName}`)

  // Search for name
  const searchInput = page.locator('input[placeholder="Search for a name"]')
  const searchResult = page.getByTestId('search-result-name')

  await searchInput.waitFor({ timeout: 15000 })
  await searchInput.fill(registeredName)
  await expect(searchResult).toHaveText(registeredName)
  await expect(searchResult).toContainText('Registered')
  await searchInput.press('Enter')

  // Register should not appear, profile shows instead
  await expect(page.getByRole('heading', { name: `Register ${registeredName}` })).not.toBeVisible({
    timeout: 15000,
  })

  const profileSnippet = page.getByTestId('profile-snippet-name')
  await expect(profileSnippet).toHaveText('registered-name.eth', { timeout: 15000 })
  await expect(page.getByTestId('address-profile-button-eth')).toHaveText('0xaEa...1974F', {
    timeout: 15000,
  })

  console.log(`❌ ${registeredName} has already been registered`)
}

test.describe('ENS Name Registration', () => {
  // Setup MM before the tests run
  test.beforeAll('Setup Metamask', async () => {
    console.log('🦊 Setting up MetaMask...')
    const [, pg, ctx] = await dappwright.bootstrap('chromium', {
      wallet: 'metamask',
      version: SafeEnsConfig.METAMASK.VERSION,
      seed: SafeEnsConfig.SEED_PHRASE,
      password: SafeEnsConfig.WALLET_PASSWORD,
      headless: SafeEnsConfig.BROWSER.HEADLESS,
      slowMo: SafeEnsConfig.BROWSER.SLOW_MO,
    })

    page = pg
    context = ctx

    console.log('✅ MetaMask setup complete')

    // Switch to User 2 account and Sepolia network
    await switchToUser2AndSepolia(page)

    // Connect wallet to ENS Sepolia
    await connectWalletToEns(page, context)

    // Generate a unique ENS name for tests
    ensName = `registername-${Date.now()}.eth`
  })

  test('Connect MetaMask to ENS localhost', async () => {
    await expect(
      page.locator('button:has-text("Connect"), [data-testid="connect-button"]'),
    ).toBeHidden({ timeout: 5000 })

    console.log('✅ Wallet is connected and ready')
  })

  test('Register ENS name', async () => {
    await performRegistration(ensName)
  })

  test('Register owned ENS name', async () => {
    await registerOwnedName()
  })
})
