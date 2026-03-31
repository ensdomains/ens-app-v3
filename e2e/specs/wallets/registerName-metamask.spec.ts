import { expect, test } from '@playwright/test'
import dappwright from '@tenkeylabs/dappwright'
import type { Dappwright } from '@tenkeylabs/dappwright'

import { SafeEnsConfig } from './config/safe-ens-config'
import { navigateToHome, openWalletAndConfirm, searchForName } from './config/test-utilities'
import { connectWalletToEns } from './config/wallet-ens-config'

// Global variables to share state
let metaMask: Dappwright
let page: any // Using any to avoid Playwright version conflicts with dappwright
let context: any
let ensName: string

// Register unowned name
async function performRegistration(name: string): Promise<void> {
  console.log(`🎯 Starting registration for ${name}`)

  // Search for name
  await searchForName(page, name)

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

  // Open wallet and confirm commit transaction
  await openWalletAndConfirm(page, { type: 'commit', name })

  // Wait 60s for commit
  await page.waitForTimeout(75000)

  // Wait for "Finish" button and confirm register
  const finishButton = page.locator('[data-testid="finish-button"]')
  await finishButton.waitFor({ timeout: 10000 })
  await finishButton.click()

  // Open wallet and confirm register transaction
  await openWalletAndConfirm(page, { type: 'register', name })

  // Wait for registration completion page to load
  // Registration flow auto-closes the modal and navigates to the completion step
  // We wait for the "View Name" button which appears on the completion page
  const viewNameButton = page.getByTestId('view-name')
  await viewNameButton.waitFor({ state: 'visible', timeout: 120000 })

  console.log('🎉 ENS registration completed!')
}

// Register owned name
async function registerOwnedName() {
  const registeredName = 'registered-name.eth'

  console.log(`🎯 Starting registration for ${registeredName}`)

  // Search for name and verify it shows as registered
  await searchForName(page, registeredName)

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

    // Generate a unique ENS name for tests
    ensName = `registername-${Date.now()}.eth`
  })

  test.beforeEach('Navigate to home page', async () => {
    // Use utility function instead of manual navigation + timeout
    await navigateToHome(page)
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
