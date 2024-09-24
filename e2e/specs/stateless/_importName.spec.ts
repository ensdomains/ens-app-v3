import { expect } from '@playwright/test'

import { test } from '../../../playwright'
import { trackConsoleEvents } from '../../../playwright/fixtures/consoleListener'

const chain = 'localhost'
const validEventTypes = [
  'search_selected_dns',
  'import_type_selected_dns',
  'verify_ownership_started_dns',
  'claim_domain_started_dns',
  'commit_wallet_opened_dns',
  'register_started_dns',
  'register_wallet_opened_dns',
]

const validEthRegistrationEventRegex = new RegExp(`"type":"(${validEventTypes.join('|')})"`)

test('should allow claim (owned by user)', async ({ page, login, accounts, makePageObject }) => {
  const name = 'swagabc.xyz'
  const consoleEvents = trackConsoleEvents(page, validEthRegistrationEventRegex)

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

  await test.step('should fire DNS tracking event: search_selected_dns', async () => {
    await expect(consoleEvents).toHaveLength(1)

    await expect(consoleEvents[0]).toContain(
      JSON.stringify({ type: 'search_selected_dns', chain, props: { name, referrer: null } }),
    )
    consoleEvents.length = 0
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

  await test.step('should fire DNS tracking event: import_type_selected_dns', async () => {
    await expect(consoleEvents).toHaveLength(1)

    await expect(consoleEvents[0]).toContain(
      JSON.stringify({
        type: 'import_type_selected_dns',
        chain,
        props: { name, importType: 'onchain', referrer: null },
      }),
    )
    consoleEvents.length = 0
  })

  // should show cost value above 0
  await expect(importPage.getCost()).resolves.toBeGreaterThan(0)

  await expect(importPage.nextButton).toHaveText('Claim')
  await expect(importPage.nextButton).toBeEnabled({ timeout: 15000 })

  await importPage.nextButton.click()

  await test.step('should fire DNS tracking event: claim_domain_started_dns', async () => {
    await expect(consoleEvents).toHaveLength(1)

    await expect(consoleEvents[0]).toContain(
      JSON.stringify({ type: 'claim_domain_started_dns', chain, props: { referrer: null } }),
    )
    consoleEvents.length = 0
  })

  // should be two steps: approve and claim
  await expect(transactionModal.getStepCount()).resolves.toEqual(2)

  await transactionModal.confirm()

  await test.step('should fire DNS tracking event: commit_wallet_opened_dns', async () => {
    await expect(consoleEvents).toHaveLength(1)

    await expect(consoleEvents[0]).toContain(
      JSON.stringify({ type: 'commit_wallet_opened_dns', chain, props: { referrer: null } }),
    )
    consoleEvents.length = 0
  })

  await transactionModal.complete()

  // should save transaction status on refresh
  await page.reload()
  await expect(importPage.heading).toHaveText('Claim your domain')
  await expect(importPage.nextButton).toBeEnabled({ timeout: 15000 })

  await test.step('should fire DNS tracking event: import_type_selected_dns', async () => {
    await expect(consoleEvents).toHaveLength(1)

    await expect(consoleEvents[0]).toContain(
      JSON.stringify({
        type: 'import_type_selected_dns',
        chain,
        props: { name, importType: 'onchain', referrer: null },
      }),
    )
    consoleEvents.length = 0
  })

  // should allow finalising
  await importPage.nextButton.click()

  await test.step('should fire DNS tracking event: register_started_dns', async () => {
    await expect(consoleEvents).toHaveLength(1)

    await expect(consoleEvents[0]).toContain(
      JSON.stringify({ type: 'register_started_dns', chain, props: { referrer: null } }),
    )
    consoleEvents.length = 0
  })

  // transaction modal should still have 2 steps
  await expect(transactionModal.getStepCount()).resolves.toEqual(2)

  await expect(page.getByText('Open Wallet')).toBeVisible()
  await transactionModal.confirm()

  await test.step('should fire DNS tracking event: register_wallet_opened_dns', async () => {
    await expect(consoleEvents).toHaveLength(1)

    await expect(consoleEvents[0]).toContain(
      JSON.stringify({ type: 'register_wallet_opened_dns', chain, props: { referrer: null } }),
    )
    consoleEvents.length = 0
  })

  // should show complete step
  await expect(page.getByText('Congratulations!')).toBeVisible()
  await expect(page.getByText(`You are now the owner of ${name}`)).toBeVisible()

  await page.getByTestId('view-name').click()
  await expect(page.getByTestId('address-profile-button-eth')).toHaveText(
    accounts.getAddress('user', 5),
  )
})

test('should allow import (not owned by user)', async ({ page, login, makePageObject }) => {
  const name = 'taytems.xyz'
  const consoleEvents = trackConsoleEvents(page, validEthRegistrationEventRegex)

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

  await page.pause()

  await test.step('should fire DNS tracking event: search_selected_dns', async () => {
    await expect(consoleEvents).toHaveLength(1)

    await expect(consoleEvents[0]).toContain(
      JSON.stringify({ type: 'search_selected_dns', chain, props: { name, referrer: null } }),
    )
    consoleEvents.length = 0
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

  await test.step('should fire DNS tracking event: import_type_selected_dns', async () => {
    await expect(consoleEvents).toHaveLength(1)

    await expect(consoleEvents[0]).toContain(
      JSON.stringify({
        type: 'import_type_selected_dns',
        chain,
        props: { name, importType: 'onchain', referrer: null },
      }),
    )
    consoleEvents.length = 0
  })

  // should show verify ownership step with error message
  await expect(importPage.heading).toHaveText('Verify Ownership')
  await expect(
    page.getByText(
      'The record found does not match your connected address. You can still import this name, but you will not have ownership of it.',
    ),
  ).toBeVisible()
  await expect(importPage.nextButton).toHaveText('Import without ownership')
  await expect(importPage.nextButton).toHaveCSS('background-color', 'rgb(197, 47, 27)')

  await importPage.nextButton.click()

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
