import type { BrowserContext, Page } from '@playwright/test'

/**
 * Waits for a transaction to complete by checking for the completion modal.
 * Uses event-driven waiting instead of arbitrary timeouts.
 */
export async function waitForTransactionComplete(
  page: Page,
  options: { timeout?: number; action?: string } = {},
): Promise<void> {
  const { timeout = 60000, action = 'transaction' } = options

  console.log(`⏳ Waiting for ${action} to complete...`)

  try {
    // Wait for the transaction complete button to appear
    await page
      .getByTestId('transaction-modal-complete-button')
      .waitFor({ state: 'visible', timeout })

    console.log(`✅ ${action} completed successfully`)
  } catch (error) {
    console.error(`❌ ${action} did not complete within ${timeout}ms`)
    throw error
  }
}

/**
 * Waits for MetaMask popup window to appear and returns the page object.
 * Uses Playwright's event system instead of manual polling.
 */
export async function waitForMetaMaskPopup(
  context: BrowserContext,
  options: { timeout?: number } = {},
): Promise<Page> {
  const { timeout = 15000 } = options

  console.log('🦊 Waiting for MetaMask popup...')

  try {
    const mmPage = await context.waitForEvent('page', {
      predicate: (page) =>
        page.url().includes('chrome-extension://') && page.url().includes('notification.html'),
      timeout,
    })

    await mmPage.waitForLoadState('domcontentloaded')
    console.log('✅ MetaMask popup detected')

    return mmPage
  } catch (error) {
    console.error(`❌ MetaMask popup did not appear within ${timeout}ms`)
    throw error
  }
}

/**
 * Confirms a transaction in MetaMask using event-driven waiting.
 */
export async function confirmMetaMaskTransaction(
  page: Page,
  options: { type?: string; name?: string; timeout?: number } = {},
): Promise<void> {
  const { type = 'transaction', name, timeout = 15000 } = options
  const logMessage = name ? `${type} for ${name}` : type

  console.log(`🔐 Confirming ${logMessage} in MetaMask...`)

  try {
    // Wait for MetaMask popup to appear
    const mmPage = await waitForMetaMaskPopup(page.context(), { timeout })
    await mmPage.bringToFront()

    // Wait for and click confirm button
    const confirmButton = mmPage.locator('button:has-text("Confirm")')
    await confirmButton.waitFor({ state: 'visible', timeout: 10000 })
    await confirmButton.click()

    console.log(`✅ ${logMessage} confirmed in MetaMask`)

    // Bring original page back to front
    await page.bringToFront()
  } catch (error) {
    console.error(`❌ Failed to confirm ${logMessage}:`, error)
    throw error
  }
}

/**
 * Opens the wallet modal and confirms the transaction.
 * Waits for the "Open Wallet" button to be ready before clicking.
 */
export async function openWalletAndConfirm(
  page: Page,
  options: { type?: string; name?: string } = {},
): Promise<void> {
  const { type, name } = options

  // Wait for Open Wallet button to be visible and enabled
  const openWalletButton = page.locator('text=Open Wallet')
  await openWalletButton.waitFor({ state: 'visible', timeout: 10000 })
  await openWalletButton.click()

  // Confirm in MetaMask
  await confirmMetaMaskTransaction(page, { type, name })
}

/**
 * Waits for an element to be visible with better error messages.
 */
export async function waitForElement(
  page: Page,
  selector: string,
  options: { timeout?: number; state?: 'visible' | 'attached' | 'hidden' } = {},
): Promise<void> {
  const { timeout = 15000, state = 'visible' } = options

  try {
    await page.locator(selector).waitFor({ state, timeout })
  } catch (error) {
    console.error(`❌ Element not found: ${selector} (state: ${state}, timeout: ${timeout}ms)`)
    throw error
  }
}

/**
 * Searches for an ENS name using the search input.
 * Waits for the input to be ready before filling.
 */
export async function searchForName(page: Page, name: string): Promise<void> {
  console.log(`🔍 Searching for ${name}`)

  const searchInput = page.locator('input[placeholder="Search for a name"]')

  // Wait for search input to be ready
  await searchInput.waitFor({ state: 'visible', timeout: 15000 })

  // Fill and submit
  await searchInput.fill(name)
  await searchInput.press('Enter')

  console.log(`✅ Search submitted for ${name}`)
}

/**
 * Waits for the page to be in a stable state after navigation or action.
 * Uses multiple strategies to ensure page is ready.
 */
export async function waitForPageReady(
  page: Page,
  options: { timeout?: number } = {},
): Promise<void> {
  const { timeout = 15000 } = options

  try {
    // Wait for DOM to be ready
    await page.waitForLoadState('domcontentloaded', { timeout })

    // Wait for network to be idle (no more than 2 network connections for 500ms)
    await page.waitForLoadState('networkidle', { timeout }).catch(() => {
      // Network idle might timeout if there are long-polling connections
      // This is acceptable, so we just log and continue
      console.log('⚠️ Network idle timeout (continuing anyway)')
    })
  } catch (error) {
    console.error(`❌ Page failed to reach ready state within ${timeout}ms`)
    throw error
  }
}

/**
 * Navigates to the home page and waits for it to be ready.
 */
export async function navigateToHome(page: Page): Promise<void> {
  console.log('🏠 Navigating to home page')
  await page.goto('http://localhost:3000/')
  await waitForPageReady(page)
  console.log('✅ Home page ready')
}

/**
 * Closes the transaction modal after completion.
 */
export async function closeTransactionModal(page: Page): Promise<void> {
  const completeButton = page.getByTestId('transaction-modal-complete-button')
  await completeButton.waitFor({ state: 'visible', timeout: 5000 })
  await completeButton.click()
  console.log('✅ Transaction modal closed')
}

/**
 * Polls for a condition to be true, with exponential backoff.
 * Use this ONLY when event-driven waiting is not possible (e.g., checking blockchain state).
 */
export async function pollForCondition<T>(
  checkFn: () => Promise<T>,
  options: {
    timeout?: number
    interval?: number
    maxInterval?: number
    description?: string
  } = {},
): Promise<T> {
  const {
    timeout = 30000,
    interval = 1000,
    maxInterval = 5000,
    description = 'condition',
  } = options

  const startTime = Date.now()
  let currentInterval = interval
  let lastError: Error | undefined

  while (Date.now() - startTime < timeout) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const result = await checkFn()
      if (result) {
        console.log(`✅ ${description} satisfied`)
        return result
      }
    } catch (error) {
      lastError = error as Error
    }

    // Exponential backoff
    // eslint-disable-next-line
    await new Promise((resolve) => setTimeout(resolve, currentInterval))
    currentInterval = Math.min(currentInterval * 1.5, maxInterval)
  }

  console.error(`❌ ${description} not satisfied within ${timeout}ms`)
  throw lastError || new Error(`Timeout waiting for ${description}`)
}
