import { BrowserContext, expect, Page, test } from '@playwright/test'
import dappwright from '@tenkeylabs/dappwright'
import type { Dappwright } from '@tenkeylabs/dappwright'

import { SafeEnsConfig } from './config/safe-ens-config'

// Global variables to share state
let metaMask: Dappwright
let page: Page
let context: BrowserContext
let ensName: string

// Connect wallet to ENS app Sepolia
async function connectWalletToEns(): Promise<void> {
  console.log('🔗 Connecting MetaMask to Local ENS App...')
  await page.goto('http://localhost:3000/')
  await page.waitForTimeout(3000)

  // Wait for "Connect Wallet" button and click
  const connectButton = page
    .locator(
      'button:has-text("Connect"), button:has-text("Connect Wallet"), [data-testid="connect-button"]',
    )
    .first()
  await connectButton.waitFor({ timeout: 15000 })
  await connectButton.click()
  console.log('🔘 Connect Wallet button clicked')
  await page.waitForTimeout(1000)

  // Wait for wallet modal
  const modal = page.locator('[role="dialog"], .wallet-modal')
  await modal.waitFor({ timeout: 15000 })
  console.log('💬 Wallet modal detected')

  // Wait for MetaMask option inside modal
  const metamaskOption = modal.locator('button', { hasText: 'MetaMask' }).first()
  await metamaskOption.waitFor({ timeout: 15000 })
  await metamaskOption.click()
  console.log('🦊 MetaMask option clicked, waiting for extension popup...')

  // Poll for MetaMask notification popup
  let mmPage
  let attempts = 0

  while (attempts < 20 && !mmPage) {
    mmPage = context
      .pages()
      .find((p) => p.url().includes('chrome-extension://') && p.url().includes('notification.html'))

    if (mmPage) break
    // eslint-disable-next-line no-await-in-loop
    await page.waitForTimeout(500)

    attempts += 1
  }

  if (!mmPage) {
    throw new Error('MetaMask popup not found')
  }

  await mmPage.bringToFront()

  // Optional: select first account if visible
  const accountButton = mmPage.locator('div.account-list button').first()
  if (await accountButton.isVisible({ timeout: 5000 })) {
    await accountButton.click()
    const nextButton = mmPage.locator('button:has-text("Next")').first()
    if (await nextButton.isVisible({ timeout: 3000 })) {
      await nextButton.click()
    }
  }

  // Confirm connection
  const confirmButton = mmPage
    .locator('button:has-text("Connect"), button:has-text("Confirm"), .btn-primary')
    .first()
  await confirmButton.waitFor({ timeout: 5000 })
  await confirmButton.click()
  console.log('✅ MetaMask connection confirmed')

  // Bring main page to front and wait a few seconds
  await page.bringToFront()
  await page.waitForTimeout(3000)

  // Optional: verify connection
  const stillVisible = await page
    .locator('button:has-text("Connect"), [data-testid="connect-button"]')
    .isVisible()
  if (stillVisible) {
    console.log('⚠️ Wallet may not have connected — check MetaMask popup manually')
  } else {
    console.log('✅ Wallet successfully connected on ENS site')
  }
}

// Confirm transaction helper
async function confirmTransactionWithMetaMask(
  type: 'commit' | 'register',
  name: string,
): Promise<void> {
  console.log(`🦊 Waiting for MetaMask ${type} popup for ${name}...`)

  // Listen for a new popup page to open
  const [mmPage] = await Promise.all([
    page.context().waitForEvent('page', { timeout: 15000 }), // wait up to 15s
    // Ensure we click or trigger the action that opens the popup BEFORE this function is called
  ])

  // Verify this is actually a MetaMask notification page
  if (
    !mmPage.url().includes('chrome-extension://') ||
    !mmPage.url().includes('notification.html')
  ) {
    throw new Error(`Unexpected popup detected: ${mmPage.url()}`)
  }

  await mmPage.bringToFront()

  // Wait for confirm button to appear and click it
  const confirmButton = mmPage.locator('button:has-text("Confirm")')
  await confirmButton.waitFor({ timeout: 10000 })
  await confirmButton.click()

  console.log(`✅ MetaMask ${type} confirmed`)

  await page.bringToFront()
}

// Register unowned name on Sepolia
async function performRegistrationOnSepolia(name: string): Promise<void> {
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
  await confirmTransactionWithMetaMask('commit', name)

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
  await confirmTransactionWithMetaMask('register', name)

  console.log('🎉 ENS registration completed!')
}

// Register owned name on Sepolia
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

test.describe('ENS Local App Registration', () => {
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

    // Connect wallet to ENS Local App
    await connectWalletToEns()

    // Generate a unique ENS name for tests
    ensName = `registername-${Date.now()}.eth`
  })

  test('Connect MetaMask to ENS Local App', async () => {
    await expect(
      page.locator('button:has-text("Connect"), [data-testid="connect-button"]'),
    ).toBeHidden({ timeout: 5000 })

    console.log('✅ Wallet is connected and ready')
  })

  test('Register ENS name on Sepolia', async () => {
    await performRegistrationOnSepolia(ensName)
  })

  test('Register owned ENS name on Sepolia', async () => {
    await registerOwnedName()
  })
})
