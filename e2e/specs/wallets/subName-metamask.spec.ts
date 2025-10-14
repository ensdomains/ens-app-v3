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
async function confirmTransactionWithMetaMask(): Promise<void> {
  console.log(`🦊 Waiting for MetaMask popup...`)

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

  console.log(`✅ MetaMask transaction confirmed`)

  await page.bringToFront()
}

// Create subname
async function createSubName(name: string): Promise<void> {
  const walletName = 'subname-test.eth'

  console.log(`🎯 Creating a new subname for ${walletName}`)

  // Search for name
  const searchInput = page.locator('input[placeholder="Search for a name"]')
  await searchInput.waitFor({ timeout: 15000 })
  await searchInput.fill(walletName)
  await searchInput.press('Enter')

  // Navigate to subname tab
  const subnameTab = page.getByTestId('subnames-tab')
  await subnameTab.waitFor({ state: 'visible', timeout: 15000 })
  await subnameTab.click()

  // Start new subname flow
  const createSubname = page.getByTestId('add-subname-action')
  await createSubname.waitFor({ state: 'visible', timeout: 15000 })
  await createSubname.click()

  // Enter subname name
  const subnameInput = page.getByTestId('add-subname-input')
  const subnameNext = page.getByTestId('create-subname-next')
  await subnameInput.waitFor()
  await subnameInput.fill(name)
  await subnameNext.click()

  // Skip profile creation
  const subnameProfileNext = page.getByTestId('create-subname-profile-next')
  await subnameProfileNext.click()

  // Start and confirm transaction
  await page.locator('text=Open Wallet').waitFor({ timeout: 10000 })
  await page.locator('text=Open Wallet').click()
  await confirmTransactionWithMetaMask()

  // Wait for transaction to complete
  await page.waitForTimeout(25000)

  // Check subname is opened after transaction complete
  const nameProfileName = page.getByTestId('profile-snippet-name')
  const expectedSubname = `${ensName}.subname-test.eth`
  await expect(nameProfileName).toHaveText(expectedSubname)

  // Enter parent name profile
  await searchInput.waitFor({ timeout: 15000 })
  await searchInput.fill(walletName)
  await searchInput.press('Enter')
  await expect(nameProfileName).toHaveText(walletName, { timeout: 10000 })

  // Switch to subname tab
  const parentSubnameTab = page.getByTestId('subnames-tab')
  await parentSubnameTab.click()

  // Check created subname is appearing
  const subnameItem = page.getByTestId(`name-item-${ensName}.subname-test.eth`)
  await expect(subnameItem).toBeVisible({ timeout: 15000 })
}

// Delete subname
async function deleteSubName(name: string): Promise<void> {
  const walletName = 'subname-test.eth'

  console.log(`🎯 Deleting ${name}.subname-test.eth`)

  // Access created subname through search bar
  const searchInput = page.locator('input[placeholder="Search for a name"]')
  await searchInput.waitFor({ timeout: 15000 })
  await searchInput.fill(`${name}.subname-test.eth`)
  await searchInput.press('Enter')

  // Confirm subname then click delete
  const profileName = page.getByTestId('profile-snippet-name')
  const expectedSubname = `${ensName}.subname-test.eth`
  await expect(profileName).toHaveText(expectedSubname)

  const deleteSubnameButton = page.getByTestId('profile-action-Delete subname')
  await deleteSubnameButton.click()

  // Start and confirm transaction
  await page.locator('text=Open Wallet').waitFor({ timeout: 10000 })
  await page.locator('text=Open Wallet').click()
  await confirmTransactionWithMetaMask()

  // Wait for transaction to complete
  await page.waitForTimeout(25000)

  // Click done to return to subname profile
  const transactionCompleteButton = page.getByTestId('transaction-modal-complete-button')
  await transactionCompleteButton.click()

  // Check expiry has no expiry
  const expiryBox = page.getByTestId('owner-profile-button-name.expiry')
  await expect(expiryBox).toContainText('no expiry', { timeout: 15000 })

  // Enter parent name profile
  const parentSubnameTab = page.getByTestId('subnames-tab')
  await searchInput.waitFor({ timeout: 15000 })
  await searchInput.fill(walletName)
  await searchInput.press('Enter')
  await expect(profileName).toHaveText(walletName, { timeout: 10000 })

  // Switch to subname tab
  await parentSubnameTab.click()

  // Check deleted subname is no longer appearing
  const subnameItem = page.getByTestId(`name-item-${ensName}.subname-test.eth`)
  await expect(subnameItem).not.toBeVisible({ timeout: 15000 })

  console.log(`⚔️ {name} has been deleted`)
}

test.describe('ENS Local App Connection', () => {
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
    ensName = `sub-${Date.now()}`
  })

  test('Connect MetaMask to ENS Local App', async () => {
    await expect(
      page.locator('button:has-text("Connect"), [data-testid="connect-button"]'),
    ).toBeHidden({ timeout: 5000 })

    console.log('✅ Wallet is connected and ready')
  })

  test('Create new ENS subname on Sepolia', async () => {
    await createSubName(ensName)
  })

  test('Delete created ENS subname on Sepolia', async () => {
    await deleteSubName(ensName)
  })
})
