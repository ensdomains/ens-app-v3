import { expect } from '@playwright/test'

import { test } from '../../../playwright'

/*
 * SNRC happy flow: register a `.testing` 2LD through the UI end-to-end and reach
 * the completion screen.
 *
 * Notes specific to SNRC (vs upstream registerName.spec.ts):
 * - TLD is `.testing` (free, gas-only) — no `.eth` price assertions.
 * - Registration is NFT-gated; the default headless `user` account is mnemonic
 *   account #0, which `scripts/deploy-local.mjs` grants the SMPXNFT gate token,
 *   so the gate passes with no extra setup.
 * - No subgraph and no `makeName` seeding — we register straight through the UI.
 * - Unique label per run (shared Hardhat session).
 *
 * NOTE: do not use transactionModal.autoComplete here — the app auto-closes the
 * modal on completion and Playwright would hang waiting for the complete button.
 */
test('SNRC: register a .testing name end-to-end', async ({
  page,
  login,
  time,
  makePageObject,
}) => {
  const name = `foobar-${Date.now().toString(36)}.testing`

  const homePage = makePageObject('HomePage')
  const transactionModal = makePageObject('TransactionModal')

  await time.sync()
  await homePage.goto()
  await login.connect()

  await test.step('search the name and open the registration page', async () => {
    await homePage.searchInput.fill(name)
    await page.locator(`[data-testid="search-result-name"]`, { hasText: name }).waitFor()
    await page.locator(`[data-testid="search-result-name"]`, { hasText: 'Available' }).waitFor()
    await homePage.searchInput.press('Enter')
    // First visit to the /[name]/register route triggers a Next dev compile, so
    // give the heading a generous timeout.
    await expect(page.getByRole('heading', { name: `Register ${name}` })).toBeVisible({
      timeout: 90000,
    })
  })

  await test.step('pricing step -> profile editor', async () => {
    // .testing is free + NFT-gated, so the pricing step renders no payment choice
    // or primary-name toggle (showPaymentChoice is false for the testing TLD).
    // Just advance once Next enables — the gate is satisfied (account #0 holds
    // the SimpleX NFT).
    const nextButton = page.getByTestId('next-button')
    await expect(nextButton).toBeEnabled({ timeout: 30000 })
    await nextButton.click()
  })

  await test.step('skip profile records', async () => {
    await expect(page.getByTestId('profile-submit-button')).toBeVisible()
    await page.getByTestId('profile-submit-button').click()
  })

  await test.step('info step -> open the commit transaction', async () => {
    await expect(page.getByTestId('next-button')).toHaveText('Begin')
    await page.getByTestId('next-button').click()
    await expect(transactionModal.transactionModal).toBeVisible({ timeout: 30000 })
    await transactionModal.closeButton.click()
  })

  await test.step('confirm the commit transaction', async () => {
    await page.getByTestId('start-timer-button').click()
    await expect(page.getByText('Open Wallet')).toBeVisible()
    await transactionModal.confirm()
  })

  await test.step('wait out the commit countdown', async () => {
    await time.sync()
    await expect(page.getByTestId('countdown-circle')).toBeVisible()
    // minCommitmentAge is 60s and the UI gates on `commitTimestamp + 60000 <
    // Date.now()` (strict), so advance past 60s (90s) to clear both the UI
    // boundary and the on-chain reveal window (max 24h, so well within).
    await time.increaseTime({ seconds: 90 })
    await expect(page.getByTestId('countdown-complete-check')).toBeVisible({ timeout: 30000 })
    await expect(page.getByTestId('finish-button')).toBeEnabled({ timeout: 30000 })
  })

  await test.step('confirm the registration transaction', async () => {
    await page.getByTestId('finish-button').click()
    await expect(page.getByText('Open Wallet')).toBeVisible()
    await transactionModal.confirm()
  })

  await test.step('completion screen confirms ownership', async () => {
    await expect(page.getByText(`You are now the owner of ${name}`)).toBeVisible({ timeout: 60000 })
  })
})
