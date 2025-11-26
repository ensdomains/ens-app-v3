import type { BrowserContext, Page } from '@playwright/test'

// Connect wallet to ENS localhost
export async function connectWalletToEns(page: Page, context: BrowserContext): Promise<void> {
  console.log('💻 Connecting MetaMask to Sepolia Localhost ENS...')
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
  console.log('⬇️ Connect Wallet button clicked')
  await page.waitForTimeout(1000)

  // Wait for wallet modal
  const modal = page.locator('[role="dialog"], .wallet-modal')
  await modal.waitFor({ timeout: 15000 })
  console.log('🔎 Wallet modal detected')

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
    throw new Error('❌ MetaMask popup not found')
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
    console.log('❔ Wallet may not have connected, check MetaMask popup manually')
  } else {
    console.log('🎉 Wallet successfully connected on ENS site')
  }
}

// Confirm transactions with Metamask
export async function confirmTransactionWithMetaMask(
  page: Page,
  type?: string,
  name?: string,
): Promise<void> {
  const logMessage = type && name ? `${type} for ${name}` : 'transaction'
  console.log(`🦊 Waiting for MetaMask ${logMessage} popup...`)

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
    throw new Error(`❔ Unexpected popup detected: ${mmPage.url()}`)
  }

  await mmPage.bringToFront()

  // Wait for confirm button to appear and click it
  const confirmButton = mmPage.locator('button:has-text("Confirm")')
  await confirmButton.waitFor({ timeout: 10000 })
  await confirmButton.click()

  console.log(`✅ MetaMask ${type || 'transaction'} confirmed`)

  await page.bringToFront()
}
