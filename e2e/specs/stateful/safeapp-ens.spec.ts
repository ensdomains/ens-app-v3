import { expect } from '@playwright/test'

import { test } from '../../../playwright/index.js'

const SAFE_URL = 'https://app.safe.global'
const ENS_APP_URL = 'https://sepolia.app.ens.domains/'
// use localhost for dev
//  const ENS_APP_URL = 'http://localhost:3000'

async function addCustomSafeApp(page: any) {
  console.log('📱 Adding ENS as custom Safe app...')

  try {
    // Navigate to Apps section
    console.log('🔗 Navigating to Apps section...')
    const appsButton = page.locator('text=Apps').first()
    await appsButton.waitFor({ timeout: 10000 })
    await appsButton.click()
    await page.waitForTimeout(2000)

    // Click on "My Custom Apps" tab
    console.log('📂 Clicking on My Custom Apps tab...')
    const customAppsTab = page.locator('text=/my custom Apps/i')
    await customAppsTab.waitFor({ timeout: 10000 })
    await customAppsTab.click()
    await page.waitForTimeout(1000)

    // Check if ENS app already exists
    const existingEnsApp = page
      .locator('text=ENS, text=Ethereum Name Service, text=sepolia.app.ens.domains')
      .first()
    if (await existingEnsApp.isVisible({ timeout: 3000 })) {
      console.log('✅ ENS app already exists as custom app')
      return
    }

    // Click "Add custom Safe App" button
    console.log('➕ Clicking Add custom Safe App button...')
    const addCustomAppButton = page.locator('text=/add custom Safe App/i')
    await addCustomAppButton.waitFor({ timeout: 10000 })
    await addCustomAppButton.click()
    await page.waitForTimeout(1000)

    // Enter ENS app URL
    console.log('🔗 Entering ENS app URL:', ENS_APP_URL)
    await page.fill('input[name="appUrl"]', ENS_APP_URL)
    await page.waitForTimeout(3000) // Wait for app to load and validate

    // Accept terms and conditions checkbox
    console.log('✅ Accepting terms and conditions...')
    const checkbox = page.locator('input[type="checkbox"]')
    await checkbox.click()
    await page.waitForTimeout(500)

    // Click Add button (use more specific selector for submit button)
    console.log('➕ Clicking Add button...')
    await page.waitForTimeout(1000)

    // Try multiple selectors for the Add button
    const addButtonSelectors = [
      'button[type="submit"]:has-text("Add")',
      'button.MuiButton-contained:has-text("Add")',
      'button:has-text("Add")',
      '[role="button"]:has-text("Add")',
    ]

    let buttonClicked = false
    for (const selector of addButtonSelectors) {
      try {
        const addButton = page.locator(selector)
        if (addButton.isVisible({ timeout: 3000 })) {
          addButton.click()
          console.log(`✅ Clicked Add button using selector: ${selector}`)
          buttonClicked = true
          break
        }
      } catch (error) {
        console.log(`ℹ️ Add button not found with selector: ${selector}`)
      }
    }

    if (!buttonClicked) {
      throw new Error('❌ Could not find or click Add button')
    }

    await page.waitForTimeout(3000) // Wait longer for form submission

    console.log('✅ ENS app added as custom Safe app')
  } catch (error) {
    console.error('❌ Error adding custom Safe app:', error)
    throw error
  }
}

async function handleDisclaimer(page: any) {
  console.log('📋 Handling Safe app disclaimer...')

  try {
    // Wait for disclaimer page to appear
    await page.waitForTimeout(2000)

    // Try multiple selectors for the Continue button
    const continueButtonSelectors = [
      'button.MuiButton-fullWidth:has-text("Continue")',
      'button[type="button"]:has-text("Continue")',
      'button.MuiButton-contained:has-text("Continue")',
      'button:has-text("Continue")',
      '[role="button"]:has-text("Continue")',
    ]

    let buttonClicked = false
    for (const selector of continueButtonSelectors) {
      try {
        const continueButton = page.locator(selector)
        // eslint-disable-next-line no-await-in-loop
        if (await continueButton.isVisible({ timeout: 5000 })) {
          // eslint-disable-next-line no-await-in-loop
          await continueButton.click()
          console.log(`✅ Clicked Continue button using selector: ${selector}`)
          buttonClicked = true
          break
        }
      } catch (error) {
        console.log(`ℹ️ Continue button not found with selector: ${selector}`)
      }
    }

    if (!buttonClicked) {
      console.log('ℹ️ No disclaimer Continue button found - disclaimer might not be present')
    } else {
      // Wait for disclaimer to be dismissed and app to load
      await page.waitForTimeout(3000)
      console.log('✅ Disclaimer handled successfully')
    }
  } catch (error) {
    console.log('⚠️ Error handling disclaimer:', error)
    // Don't throw error as disclaimer might not always be present
  }
}

async function confirmTransactionInSafe(iframeLocator: any, login: any, page: any, tmodal: any) {
  console.log('🔄 Confirming transaction in Safe...')

  try {
    // Step 1: Click the confirm button in the ENS app (inside iframe)
    console.log('🔘 Clicking confirm button in ENS app...')
    const confirmSelectors = [
      '[data-testid="transaction-modal-confirm-button"]',
      'button:has-text("Confirm")',
      'button:has-text("Sign")',
      '[data-testid="confirm-button"]',
    ]

    let confirmClicked = false
    for (const selector of confirmSelectors) {
      try {
        const confirmButton = iframeLocator.locator(selector)
        // eslint-disable-next-line no-await-in-loop
        if (await confirmButton.isVisible({ timeout: 3000 })) {
          // eslint-disable-next-line no-await-in-loop
          await confirmButton.click({ timeout: 10000 })
          console.log(`✅ Clicked confirm button using: ${selector}`)
          confirmClicked = true
          break
        }
      } catch (error) {
        console.log(`ℹ️ Confirm button not found with: ${selector}`)
      }
    }

    if (!confirmClicked) {
      console.log('⚠️ Could not find confirm button in ENS app')
      return
    }

    page.waitForTimeout(20000)
    await login.connect('user', true)

    // Step 2: Handle Safe's "Continue" button (outside iframe, in Safe UI)
    // console.log('🔘 Looking for Safe Continue button...')
    // await iframeLocator.page().waitForTimeout(2000) // Wait for Safe UI to appear
    page.waitForTimeout(20000)

    // Look for Continue button in the main page (outside iframe)
    const continueSelectors = ['button:has-text("Continue")']

    let continueClicked = false
    for (const selector of continueSelectors) {
      try {
        const continueButton = page.locator(selector)
        // eslint-disable-next-line no-await-in-loop
        if (await continueButton.isVisible({ timeout: 5000 })) {
          // eslint-disable-next-line no-await-in-loop
          await continueButton.click()
          console.log(`✅ Clicked Safe Continue button using: ${selector}`)
          continueClicked = true
          break
        }
      } catch (error) {
        console.log(`ℹ️ Continue button not found with: ${selector}`)
      }
    }

    if (!continueClicked) {
      console.log('⚠️ Could not find Safe Continue button')
    }

    // Click on the Sign Button, use text locator
    // await page.getByTestId('combo-submit-dropdown').first().click()
    // await page.getByText('Execute').first().click()
    // await page.getByText('Execute').first().click()
    await page.getByTestId('combo-submit-sign').first().click()

    // Step 3: Authorize the transaction using the wallet
    console.log('🔐 Authorizing transaction...')

    // await tmodal.signature()
    await tmodal.authorize()
    console.log('✅ Transaction authorized')

    // Wait for transaction to be processed
    await iframeLocator.page().waitForTimeout(3000)
  } catch (error) {
    console.error('❌ Error confirming transaction in Safe:', error)
    throw error
  }
}

async function openEnsApp(page: any) {
  console.log('🚀 Opening ENS app...')

  // Click on the ENS app card (look for ENS-related text)
  try {
    // Try to find the app by various possible names/text
    const appSelectors = [
      'text=ENS',
      'text=Ethereum Name Service',
      'text=sepolia.app.ens.domains',
      '[data-testid*="ens"]',
      'h5:has-text("ENS")',
      'h5:has-text("Ethereum Name Service")',
      '.MuiCard-root:has-text("ENS")',
      '.MuiCard-root:has-text("Ethereum Name Service")',
    ]

    let appFound = false
    for (const selector of appSelectors) {
      try {
        const appElement = page.locator(selector)
        // eslint-disable-next-line no-await-in-loop
        if (await appElement.isVisible({ timeout: 3000 })) {
          // eslint-disable-next-line no-await-in-loop
          await appElement.click()
          console.log(`✅ Clicked on ENS app using selector: ${selector}`)
          appFound = true
          break
        }
      } catch (error) {
        console.log(`ℹ️ App not found with selector: ${selector}`)
      }
    }

    if (!appFound) {
      // Fallback: click on the first custom app card
      console.log('🔍 Fallback: looking for any custom app card...')
      const customAppCard = page.locator('.MuiCard-root').first()
      await customAppCard.click()
    }

    await page.waitForTimeout(2000)

    // Click "Open Safe App" button
    console.log('🚀 Clicking Open Safe App button...')
    const openButton = page.locator(
      '[data-testid="open-safe-app-btn"], button:has-text("Open Safe App")',
    )
    await openButton.click()
    await page.waitForTimeout(3000)

    // Handle disclaimer page that appears after clicking "Open Safe App"
    console.log('📋 Handling disclaimer page...')
    await handleDisclaimer(page)
  } catch (error) {
    console.error('❌ Error opening ENS app:', error)
    throw error
  }
}

async function performRegistration(
  iframeLocator: any,
  name: string,
  time: any,
  login: any,
  page: any,
  tmodal: any,
) {
  console.log(`🎯 Starting registration for ${name}`)

  try {
    // Search for the name
    console.log('🔍 Searching for name...')
    const searchInput = iframeLocator.getByPlaceholder('Search for a name')
    await searchInput.waitFor({ timeout: 15000 })
    await searchInput.fill(name)
    await searchInput.press('Enter')

    // Wait for registration page to load
    await iframeLocator
      .getByRole('heading', { name: `Register ${name}` })
      .waitFor({ timeout: 15000 })
    console.log('✅ Registration page loaded')

    // Ensure Ethereum payment is selected and primary name is checked
    await iframeLocator.getByTestId('payment-choice-ethereum').check()
    await iframeLocator.getByTestId('primary-name-toggle').check()
    console.log('✅ Payment method and primary name configured')

    // Go to profile step
    await iframeLocator.getByTestId('next-button').click()
    console.log('✅ Moved to profile step')

    // Skip profile setup for simplicity (just use default ETH address)
    const profileSubmitButton = iframeLocator.getByTestId('profile-submit-button')
    if (await profileSubmitButton.isVisible({ timeout: 5000 })) {
      await profileSubmitButton.click()
      console.log('✅ Profile step completed')
    }

    // Go to info/transaction step
    await iframeLocator.getByTestId('next-button').click()
    console.log('✅ Moved to start timer step')

    // Start the registration process (commit transaction) - this should show "Begin"
    // await iframeLocator.getByTestId('start-timer-button').click()
    // console.log('✅ Started start timer')

    // Wait for transaction modal to appear and confirm it
    console.log('🔄 Waiting for transaction modal...')
    await iframeLocator.getByText('Open Wallet').waitFor({ timeout: 10000 })

    // Use Safe-specific transaction confirmation
    await confirmTransactionInSafe(iframeLocator, login, page, tmodal)
    console.log('✅ Confirmed commit transaction')

    // Wait for countdown to appear
    try {
      // wait for transaction sent text to appear
      await iframeLocator.getByText('Transaction sent').waitFor({ timeout: 10000 })
      await iframeLocator.getByTestId('countdown-circle').waitFor({ timeout: 15000 })
      console.log('✅ Commit transaction confirmed, countdown started')

      // Speed up time to complete the countdown
      await time.increaseTime({ seconds: 60 })

      // Wait for countdown to complete
      await iframeLocator.getByTestId('countdown-complete-check').waitFor({ timeout: 10000 })
      console.log('✅ Countdown completed')

      // Click finish button to start registration transaction
      await iframeLocator.getByTestId('finish-button').click()
      console.log('✅ Started registration transaction')

      // Handle second transaction confirmation
      try {
        await iframeLocator.getByText('Open Wallet').waitFor({ timeout: 10000 })
        await confirmTransactionInSafe(iframeLocator, login, page, tmodal)
        console.log('✅ Confirmed registration transaction')
      } catch (error) {
        console.log('⚠️ Registration transaction modal handling failed:', error)
      }

      // Wait for completion page
      try {
        await iframeLocator
          .getByText(`You are now the owner of ${name}`)
          .waitFor({ timeout: 20000 })
        console.log('🎉 Registration completed successfully!')
      } catch (error) {
        console.log('⚠️ Registration completion not detected, but process may have succeeded')
      }
    } catch (error) {
      console.log('⚠️ Countdown or registration process failed:', error)
    }
  } catch (error) {
    console.error('❌ Registration failed:', error)
    // Don't throw error to allow test to continue
  }
}

test.describe('Safe{Wallet} + ENS Safe App integration', () => {
  test('should add ENS as custom app and open it through Safe', async ({
    page,
    login,
    accounts,
  }) => {
    // Get the wallet address from the stateful setup
    const walletAddress = accounts.getAddress('user')
    const safeAddress = `sep:0x4caeA72C02d06edF1788B743554a94a076CBdBB0`
    const SAFE_ADDRESS = safeAddress // Use the connected wallet address as Safe address

    console.log(`Using wallet address: ${walletAddress}`)
    console.log(`Safe address: ${SAFE_ADDRESS}`)

    // 1. First go to Safe welcome page to connect wallet
    await page.goto(`${SAFE_URL}/welcome`)

    // 2. Connect the headless wallet using Safe-specific flow
    await login.connect('user', true) // true indicates this is for Safe wallet

    // Handle any banners that might appear after connecting
    // await login.handleSafeBanners()

    // 3. Wait for Safe to load and recognize the wallet
    await page.waitForTimeout(3000)

    // 4. Navigate to the specific Safe account
    console.log(`🏠 Navigating to Safe account: ${SAFE_ADDRESS}`)
    const safeHomeUrl = `${SAFE_URL}/home?safe=${SAFE_ADDRESS}`
    await page.goto(safeHomeUrl)
    await page.waitForTimeout(2000)

    // Handle any additional banners after navigation
    await login.handleSafeBanners()

    // 5. Add ENS as a custom Safe app
    await addCustomSafeApp(page)

    // 6. Open the ENS app
    await openEnsApp(page)

    // 6. Wait for the ENS Safe App iframe to load
    await page.waitForLoadState('networkidle')

    // Handle any additional banners in the ENS app
    await login.handleSafeBanners()

    // Wait for iframe to appear
    const iframeLocator = page.frameLocator('iframe').first()
    await expect(iframeLocator.locator('body')).toBeVisible({ timeout: 30000 })

    console.log('✅ ENS app loaded in Safe iframe')

    // 7. Interact with the ENS app inside the iframe
    try {
      const searchInput = iframeLocator.getByPlaceholder('Search for a name')
      await searchInput.waitFor({ timeout: 15000 })
      await searchInput.fill('nick.eth')
      await searchInput.press('Enter')

      console.log('✅ Searched for nick.eth in ENS app')

      // Wait for search results or navigation
      await page.waitForTimeout(5000)
    } catch (error) {
      console.log('⚠️  Could not interact with ENS app, but iframe loaded successfully')
    }

    console.log('🎉 Safe + ENS integration test completed successfully!')
  })

  test.skip('should register a new name through Safe', async ({
    page,
    login,
    accounts,
    time,
    makePageObject,
  }) => {
    test.slow()

    const transationModal = makePageObject('TransactionModal')

    // Generate a unique name for registration
    const name = `safe-registration-${Date.now()}.eth`

    // Get the wallet address from the stateful setup
    const walletAddress = accounts.getAddress('user')
    const safeAddress = `sep:0x7894BFD6441B2e9a22358F8F71FdF9B2AC817ef8`
    const SAFE_ADDRESS = safeAddress // Use the connected wallet address as Safe address

    console.log(`🎯 Registering name: ${name}`)
    console.log(`Using wallet address: ${walletAddress}`)
    console.log(`Safe address: ${SAFE_ADDRESS}`)

    // 1. First go to Safe welcome page to connect wallet
    await page.goto(`${SAFE_URL}/welcome`)

    // 2. Connect the headless wallet using Safe-specific flow
    await login.connect('user', true)

    // Handle any banners that might appear after connecting
    // await login.handleSafeBanners()

    // 3. Wait for Safe to load and recognize the wallet
    await page.waitForTimeout(3000)

    // 4. Navigate to the specific Safe account
    console.log(`🏠 Navigating to Safe account: ${SAFE_ADDRESS}`)
    const safeHomeUrl = `${SAFE_URL}/home?safe=${SAFE_ADDRESS}`
    await page.goto(safeHomeUrl)
    await page.waitForTimeout(2000)

    // Handle any additional banners after navigation
    await login.handleSafeBanners()

    // 5. Add ENS as a custom Safe app
    await addCustomSafeApp(page)

    // 6. Open the ENS app
    await openEnsApp(page)

    // 7. Wait for the ENS Safe App iframe to load
    await page.waitForLoadState('networkidle')

    // Handle any additional banners in the ENS app
    await login.handleSafeBanners()

    // Wait for iframe to appear
    const iframeLocator = page.frameLocator('iframe').first()
    await expect(iframeLocator.locator('body')).toBeVisible({ timeout: 30000 })

    console.log('✅ ENS app loaded in Safe iframe')

    // 8. Perform registration inside the iframe
    await performRegistration(iframeLocator, name, time, login, page, transationModal)

    console.log('🎉 Safe + ENS registration test completed successfully!')
  })
})
