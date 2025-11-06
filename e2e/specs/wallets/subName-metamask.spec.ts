import { expect, test } from '@playwright/test'
import dappwright from '@tenkeylabs/dappwright'
import type { Dappwright } from '@tenkeylabs/dappwright'

import { SafeEnsConfig } from './config/safe-ens-config'
import {
  closeTransactionModal,
  navigateToHome,
  openWalletAndConfirm,
  searchForName,
  waitForTransactionComplete,
} from './config/test-utilities'
import { connectWalletToEns } from './config/wallet-ens-config'

// Global variables to share state
let metaMask: Dappwright
let page: any // Using any to avoid Playwright version conflicts with dappwright
let context: any
let ensName: string

// Create subname
async function createSubName(name: string): Promise<void> {
  const walletName = 'subname-test.eth'

  console.log(`🎯 Creating a new subname for ${walletName}`)

  // Search for name
  await searchForName(page, walletName)

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

  // Open wallet and confirm transaction
  await openWalletAndConfirm(page, { type: 'subname creation' })

  // Wait for transaction to complete using event-driven approach
  await waitForTransactionComplete(page, { action: 'subname creation' })

  // Check subname is opened after transaction complete
  const nameProfileName = page.getByTestId('profile-snippet-name')
  const expectedSubname = `${ensName}.subname-test.eth`
  await expect(nameProfileName).toHaveText(expectedSubname)

  // Check parent is correct
  const parentLabel = page.getByTestId('owner-profile-button-name.parent')
  await expect(parentLabel).toBeVisible()
  await expect(parentLabel).toContainText('subname-test.eth')
}

// Delete subname
async function deleteSubName(name: string): Promise<void> {
  const walletName = 'subname-test.eth'
  const fullSubname = `${name}.subname-test.eth`

  console.log(`🎯 Deleting ${fullSubname}`)

  // Access created subname through search bar
  await searchForName(page, fullSubname)

  // Confirm subname then click delete
  const profileName = page.getByTestId('profile-snippet-name')
  const expectedSubname = `${ensName}.subname-test.eth`
  await expect(profileName).toHaveText(expectedSubname)

  const deleteSubnameButton = page.getByTestId('profile-action-Delete subname')
  await deleteSubnameButton.click()

  // Open wallet and confirm transaction
  await openWalletAndConfirm(page, { type: 'subname deletion' })

  // Wait for transaction to complete using event-driven approach
  await waitForTransactionComplete(page, { action: 'subname deletion' })

  // Close the completion modal
  await closeTransactionModal(page)

  // Check expiry has no expiry
  const expiryBox = page.getByTestId('owner-profile-button-name.expiry')
  await expect(expiryBox).toContainText('no expiry', { timeout: 15000 })

  // Enter parent name profile
  const parentSubnameTab = page.getByTestId('subnames-tab')
  await searchForName(page, walletName)
  await expect(profileName).toHaveText(walletName, { timeout: 10000 })

  // Switch to subname tab
  await parentSubnameTab.click()

  // Check deleted subname is no longer appearing
  const subnameItem = page.getByTestId(`name-item-${ensName}.subname-test.eth`)
  await expect(subnameItem).not.toBeVisible({ timeout: 15000 })

  console.log(`⚔️ ${name} has been deleted`)
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

  test('Create new ENS subname', async () => {
    await createSubName(ensName)
  })

  test('Delete created ENS subname', async () => {
    await deleteSubName(ensName)
  })
})
