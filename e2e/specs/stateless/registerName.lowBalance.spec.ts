import { expect } from '@playwright/test'
import { parseEther } from 'viem'

import { setPrimaryName } from '@ensdomains/ensjs/wallet'

import { test } from '../../../playwright'
import { createAccounts } from '../../../playwright/fixtures/accounts'
import {
  testClient,
  walletClient,
} from '../../../playwright/fixtures/contracts/utils/addTestContracts'

test.describe('Low ETH Balance Tests', () => {
  test.beforeEach(async ({ balanceManager }) => {
    // Create a snapshot before each test
    await balanceManager.createSnapshot('test-start')
  })

  test.afterEach(async ({ balanceManager }) => {
    // Revert to clean state after each test
    await balanceManager.revertSnapshot('test-start')
    // Also replenish user5's balance for other tests that might need it
    await balanceManager.setBalance('user5', parseEther('10'))
  })

  test('should show error when registering a name with insufficient ETH balance', async ({
    page,
    balanceManager,
    login,
    makePageObject,
  }) => {
    // Set user5 to have very low balance (0.0001 ETH)
    await balanceManager.setBalance('user5', BigInt(100000000000000)) // 0.0001 ETH in wei

    // Generate a unique name to register
    const name = `low-balance-test-${Date.now()}.eth`

    const homePage = makePageObject('HomePage')
    await homePage.goto()
    await login.connect('user5')

    // Search for the name
    await homePage.searchInput.fill(name)
    await page.waitForTimeout(1000)

    await page.locator(`[data-testid="search-result-name"]`, { hasText: name }).waitFor()
    await page.locator(`[data-testid="search-result-name"]`, { hasText: 'Available' }).waitFor()
    await homePage.searchInput.press('Enter')
    await expect(page.getByRole('heading', { name: `Register ${name}` })).toBeVisible()

    // Check that registration page loads
    await expect(page.getByText('Insufficient Balance', { exact: true })).toBeVisible()
  })

  test('should show error when extending a name with insufficient ETH balance', async ({
    page,
    balanceManager,
    login,
    makeName,
    makePageObject,
    subgraph,
  }) => {
    const profilePage = makePageObject('ProfilePage')

    // First create a name owned by user5 that's close to expiry
    const name = await makeName({
      label: 'low-balance-extend',
      type: 'legacy',
      owner: 'user5',
      duration: 60 * 60 * 24 * 30, // 30 days
    })

    await subgraph.sync()

    // Set user5 to have very low balance
    await balanceManager.setBalance('user5', BigInt(100000000000000)) // 0.0001 ETH

    await profilePage.goto(name)
    await login.connect('user5')

    // Wait for the page to load
    await page.waitForLoadState('networkidle')

    // Click extend button
    const extendButton = page.getByTestId('extend-button')
    await expect(extendButton).toBeVisible()
    await extendButton.click()

    // Try to confirm extension
    await page.getByTestId('extend-names-confirm').click()

    // Should show insufficient balance error
    await expect(
      page.getByText(/insufficient funds|insufficient balance|not enough eth/i),
    ).toBeVisible({ timeout: 10000 })
  })

  test('should show error when registering a premium name with insufficient ETH balance', async ({
    page,
    balanceManager,
    login,
    makeName,
  }) => {
    // First create an expired premium name that can be registered
    const premiumName = await makeName(
      {
        label: 'premium-low-balance',
        owner: 'user2',
        type: 'legacy',
        duration: -7890000 - 4 * 345600, // 3 months 4 days expired (makes it premium)
      },
      { timeOffset: 500 },
    )

    // Set user5 to have very low balance
    await balanceManager.setBalance('user5', BigInt(100000000000000)) // 0.0001 ETH

    await page.goto(`/${premiumName}`)
    await login.connect('user5')

    // Should show premium price indicator
    await expect(page.getByTestId('invoice-item-2-amount')).toBeVisible()

    await expect(page.getByText('Insufficient Balance', { exact: true })).toBeVisible()
  })

  test.only('🧨should show insufficient balance error when previous owner tries to re-register expired name with low balance', async ({
    page,
    balanceManager,
    login,
    makeName,
    subgraph,
    makePageObject,
    time,
    consoleListener,
  }) => {
    const profilePage = makePageObject('ProfilePage')
    const transactionModal = makePageObject('TransactionModal')

    consoleListener.initialize({
      regex: /\[Metrics\] Event:.*/,
    })
    const expiredName = await makeName(
      {
        label: 'expired-reregister',
        type: 'legacy',
        owner: 'user5',
        manager: 'user5',
        duration: -7890000 - 22 * 345600, // name expired and released
        records: {
          coins: [
            {
              coin: 'ETH',
              value: createAccounts().getAddress('user5') as `0x${string}`,
            },
          ],
        },
      },
      { timeOffset: 500 },
    )

    // The name was previously set as primary (but is now expired)
    await setPrimaryName(walletClient, {
      name: expiredName,
      account: createAccounts().getAddress('user5') as `0x${string}`,
    })

    await subgraph.sync()

    // Step 2: Set user5 to have very low balance
    console.log('Setting user5 balance to 0.0034 ETH')

    await balanceManager.setBalance('user5', BigInt(parseEther('0.1'))) // 0.0001 ETH

    // Step 3: Previous owner (user5) tries to re-register the now-expired premium name
    await page.goto('/')
    await login.connect('user5')
    await profilePage.goto(expiredName)

    // Check for search:select event when navigating to expired name
    // print console listener messages
    console.log(consoleListener.getMessages())

    // set primary toggle
    await page.getByTestId('primary-name-toggle').click()
    await page.getByTestId('payment-choice-ethereum').click()

    // Check for register:pricing event after payment choice selection
    console.log(consoleListener.getMessages())
    consoleListener.clearMessages()

    // Get the invoice total amount and replenish exactly that much
    const invoiceTotal = await page.getByTestId('invoice-total').textContent()
    const ethAmount = invoiceTotal?.match(/(\d+\.?\d*)\s*ETH/)?.[1]
    // const ethAmount = '0.0000000001'
    console.log(`Invoice total: ${invoiceTotal}`)
    console.log(`ETH amount: ${ethAmount}`)

    if (ethAmount) {
      // Convert ETH string to wei (e.g., "0.0035" -> 3500000000000000n)
      const weiAmount = BigInt(Math.floor(parseFloat(ethAmount) * 1e18))
      console.log(`Replenishing balance to exactly ${ethAmount} ETH (${weiAmount} wei)`)

      // Set balance to exactly the invoice amount
      await balanceManager.setBalance('user5', weiAmount)
      // check balance
      const balance = await balanceManager.getBalance(
        createAccounts().getAddress('user5') as `0x${string}`,
      )
      console.log(`Balance: ${balance}`)
    }

    const nextButton = page.getByTestId('next-button')
    await nextButton.click()
    await page.waitForLoadState('networkidle')

    // Skip profile setup if visible
    if (await page.getByTestId('profile-submit-button').isVisible()) {
      await page.getByTestId('profile-submit-button').click()
    }

    await page.getByTestId('next-button').click()
    await page.waitForLoadState('networkidle')
    await expect(page.getByText('Open Wallet')).toBeVisible()

    // Check for wallet:open event for first transaction
    console.log(consoleListener.getMessages())
    consoleListener.clearMessages()

    await transactionModal.confirm()
    await time.sync()
    await time.increaseTime({ seconds: 90 })
    // await page.waitForTimeout(5000)
    await page.getByTestId('finish-button').click()
    // await page.waitForTimeout(120000)
    await expect(page.getByText('Open Wallet')).toBeVisible()

    // Check for wallet:open event for second transaction
    console.log(consoleListener.getMessages())
    consoleListener.clearMessages()

    await transactionModal.confirm()

    // Check for transaction:register:send event after successful registration
    console.log(consoleListener.getMessages())

    await expect(page.getByText(`You are now the owner of ${expiredName}`)).toBeVisible()
  })
})
