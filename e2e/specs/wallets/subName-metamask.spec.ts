import { BrowserContext, expect, Page, test } from '@playwright/test'
import dappwright from '@tenkeylabs/dappwright'
import type { Dappwright } from '@tenkeylabs/dappwright'

import { SafeEnsConfig } from './config/safe-ens-config'
import { confirmTransactionWithMetaMask, connectWalletToEns } from './config/wallet-ens-config'

// Global variables to share state
let metaMask: Dappwright
let page: Page
let context: BrowserContext
let ensName: string

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
  await confirmTransactionWithMetaMask(page)

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
  await confirmTransactionWithMetaMask(page)

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

test.describe('ENS Subname Checks', () => {
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
    ensName = `sub-${Date.now()}`
  })

  test('Connect MetaMask to ENS localhost', async () => {
    await expect(
      page.locator('button:has-text("Connect"), [data-testid="connect-button"]'),
    ).toBeHidden({ timeout: 5000 })

    console.log('✅ Wallet is connected and ready')
  })

  test('Create new ENS subname', async () => {
    await createSubName(ensName)
  })

  test('Delete created ENS subname', async () => {
    await deleteSubName(ensName)
  })
})
