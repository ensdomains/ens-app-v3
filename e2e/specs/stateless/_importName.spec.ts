import { expect } from '@playwright/test'

import { test } from '../../../playwright'

// When testing locally, reducers will be run twice because of strict mode
const strictModeEventCount = process.env.CI ? 1 : 2

test('should allow claim (owned by user)', async ({
  page,
  login,
  accounts,
  makePageObject,
  consoleListener,
}) => {
  console.log(strictModeEventCount)
  const name = 'swagabc.xyz'
  await consoleListener.initialize({
    regex: /\[Metrics\] Event:.*?/,
  })

  const homePage = makePageObject('HomePage')
  const importPage = makePageObject('ImportPage')
  const transactionModal = makePageObject('TransactionModal')

  await homePage.goto()
  await login.connect()

  // should redirect to registration page
  await homePage.searchInput.fill(name)
  await page.locator(`[data-testid="search-result-name"]`, { hasText: name }).waitFor()
  await page.locator(`[data-testid="search-result-name"]`, { hasText: 'Not Imported' }).waitFor()
  await homePage.searchInput.press('Enter')

  await test.step('should fire DNS import tracking event: search:select', async () => {
    await expect(consoleListener.getMessages(/search:select/)).toHaveLength(1)

    await expect(consoleListener.getMessages().toString()).toContain('search:select')
    consoleListener.clearMessages()
  })

  await expect(importPage.heading).toHaveText(`Claim ${name}`)

  // no type should be checked yet
  await expect(importPage.offchainRadio).not.toBeChecked()
  await expect(importPage.onchainRadio).not.toBeChecked()
  await expect(importPage.nextButton).toBeDisabled()

  await importPage.onchainRadio.click()

  // option selection should enable next
  await expect(importPage.nextButton).toBeEnabled({ timeout: 15000 })
  await importPage.nextButton.click()

  // should jump straight to transaction step
  await expect(importPage.heading).toHaveText('Claim your domain')

  await test.step('should fire DNS import tracking event: import:select_type', async () => {
    await expect(consoleListener.getMessages(/import:select_type/)).toHaveLength(
      strictModeEventCount,
    )

    await expect(consoleListener.getMessages().toString()).toMatch(
      new RegExp(`import:select_type.*?${name}`),
    )
    consoleListener.clearMessages()
  })

  // should show cost value above 0
  await expect(importPage.getCost()).resolves.toBeGreaterThan(0)

  await expect(importPage.nextButton).toHaveText('Claim')
  await expect(importPage.nextButton).toBeEnabled({ timeout: 15000 })

  await importPage.nextButton.click()

  // should be two steps: approve and claim
  await expect(transactionModal.getStepCount()).resolves.toEqual(2)

  await transactionModal.confirm()

  await test.step('should fire DNS import tracking event: wallet:open', async () => {
    await expect(consoleListener.getMessages(/wallet:open/)).toHaveLength(1)
    await expect(consoleListener.getMessages().toString()).toContain('wallet:open')
  })

  await transactionModal.complete()

  await test.step('should fire DNS import tracking event: transaction:import:send', async () => {
    await expect(consoleListener.getMessages(/transaction:import:send/)).toHaveLength(1)

    await expect(consoleListener.getMessages().toString()).toContain('transaction:import:send')
    consoleListener.clearMessages()
  })

  // should save transaction status on refresh
  await page.reload()
  await expect(importPage.heading).toHaveText('Claim your domain')
  await expect(importPage.nextButton).toBeEnabled({ timeout: 15000 })

  // should allow finalising
  await importPage.nextButton.click()

  // transaction modal should still have 2 steps
  await expect(transactionModal.getStepCount()).resolves.toEqual(2)

  await expect(page.getByText('Open Wallet')).toBeVisible()
  await transactionModal.confirm()

  await test.step('should fire DNS import tracking event: wallet:open', async () => {
    await expect(consoleListener.getMessages(/wallet:open/)).toHaveLength(1)
    await expect(consoleListener.getMessages().toString()).toContain('wallet:open')
    consoleListener.clearMessages()
  })

  // should show complete step
  await expect(page.getByText('Congratulations!')).toBeVisible()
  await expect(page.getByText(`You are now the owner of ${name}`)).toBeVisible()

  await page.getByTestId('view-name').click()
  await expect(page.getByTestId('address-profile-button-eth')).toHaveText(
    accounts.getAddress('user', 5),
  )
})

test('should allow import (not owned by user)', async ({
  page,
  login,
  makePageObject,
  consoleListener,
}) => {
  const name = 'taytems.xyz'

  await consoleListener.initialize({
    regex: /\[Metrics\] Event:.*?/,
  })

  const homePage = makePageObject('HomePage')
  const importPage = makePageObject('ImportPage')
  const transactionModal = makePageObject('TransactionModal')

  await homePage.goto()
  await login.connect()

  // should redirect to registration page
  await homePage.searchInput.fill(name)
  await page.locator(`[data-testid="search-result-name"]`, { hasText: name }).waitFor()
  await page.locator(`[data-testid="search-result-name"]`, { hasText: 'Not Imported' }).waitFor()
  await homePage.searchInput.press('Enter')

  await test.step('should fire DNS import tracking event: search:select', async () => {
    await expect(consoleListener.getMessages(/search:select/)).toHaveLength(1)

    await expect(consoleListener.getMessages().toString()).toMatch(
      new RegExp(`search:select.*?${name}`),
    )
    consoleListener.clearMessages()
  })

  await expect(importPage.heading).toHaveText(`Claim ${name}`)

  // no type should be checked yet
  await expect(importPage.offchainRadio).not.toBeChecked()
  await expect(importPage.onchainRadio).not.toBeChecked()
  await expect(importPage.nextButton).toBeDisabled()

  await importPage.onchainRadio.click()

  // option selection should enable next
  await expect(importPage.nextButton).toBeEnabled({ timeout: 15000 })
  await importPage.nextButton.click()

  await test.step('should fire DNS import tracking event: import:select_type', async () => {
    await expect(consoleListener.getMessages(/import:select_type/)).toHaveLength(
      strictModeEventCount,
    )

    await expect(consoleListener.getMessages().toString()).toMatch(
      new RegExp(`import:select_type.*?${name}`),
    )
    consoleListener.clearMessages()
  })

  // should show verify ownership step with error message
  await expect(importPage.heading).toHaveText('Verify Ownership')
  await expect(
    page.getByText(
      'The record found does not match your connected address. You can still import this name, but you will not have ownership of it.',
    ),
  ).toBeVisible()
  await expect(importPage.nextButton).toHaveText('Import without ownership')
  await expect(importPage.nextButton).toHaveCSS('background-color', 'rgb(198, 48, 27)')

  await importPage.nextButton.click()

  await test.step('should fire DNS import tracking event: import:onchain_verify', async () => {
    await expect(consoleListener.getMessages(/import:onchain_verify/)).toHaveLength(
      strictModeEventCount,
    )

    await expect(consoleListener.getMessages().toString()).toContain('import:onchain_verify')
    consoleListener.clearMessages()
  })

  // should go to transaction step
  await expect(importPage.heading).toHaveText('Import this domain')

  // should show cost value above 0
  await expect(importPage.getCost()).resolves.toBeGreaterThan(0)

  await expect(importPage.nextButton).toHaveText('Import')
  await expect(importPage.nextButton).toBeEnabled({ timeout: 15000 })

  await importPage.nextButton.click()

  await transactionModal.attemptStep()

  // should show complete step
  await expect(page.getByText('Congratulations!')).toBeVisible()
  await expect(page.getByText(`${name} has been imported`)).toBeVisible()

  await page.getByTestId('view-name').click({ delay: 1000 })
  await page.waitForURL(`/${name}`)
})
