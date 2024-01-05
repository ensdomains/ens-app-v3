import { expect } from '@playwright/test'
import { test } from '@root/playwright'

import { labelhash } from '@ensdomains/ensjs/utils/labels'

test('should not show wrap button if the connected wallet is not the registrant', async ({
  login,
  makeName,
  makePageObject,
}) => {
  const name = await makeName({
    label: 'other-registrant',
    type: 'legacy',
    owner: 'user2',
  })

  const morePage = makePageObject('MorePage')
  await morePage.goto(name)

  await login.connect()

  await expect(morePage.wrapButton).toHaveCount(0)
})

test('should not show wrap notification if the name is already wrapped', async ({
  page,
  login,
  makeName,
  makePageObject,
}) => {
  const name = await makeName({
    label: 'wrapped',
    type: 'wrapped',
  })

  const morePage = makePageObject('MorePage')
  await morePage.goto(name)

  await login.connect()

  await page.waitForTimeout(3000)
  await expect(morePage.wrapButton).not.toBeVisible()
})

test('should show wrap notification on unwrapped name', async ({
  login,
  makeName,
  makePageObject,
}) => {
  const name = await makeName({
    label: 'to-be-wrapped',
    type: 'legacy',
  })

  const morePage = makePageObject('MorePage')
  await morePage.goto(name)

  await login.connect()

  await expect(morePage.wrapButton).toBeVisible()
})

test('should show resume state if wrap steps are incomplete', async ({
  page,
  login,
  makeName,
  makePageObject,
}) => {
  const name = await makeName({
    label: 'resume-and-wrap',
    type: 'legacy',
    records: {
      texts: [{ key: 'test', value: 'test' }],
    },
  })

  const morePage = makePageObject('MorePage')
  const transactionModal = makePageObject('TransactionModal')

  await morePage.goto(name)

  await login.connect()

  await morePage.wrapButton.click()

  await transactionModal.introButton.click()
  await transactionModal.confirm()
  await transactionModal.complete()

  await page.getByTestId('toast-close-icon').click()
  await transactionModal.closeButton.click()

  // should open to correctly resumed state
  await morePage.wrapButton.click()
  await expect(page.getByTestId('display-item-Step 1-fade')).toBeVisible()
  await expect(transactionModal.introButton).toHaveText(/Resume/)

  // should allow resuming the steps
  await transactionModal.introButton.click()
  await transactionModal.autoComplete()

  // should remove the notification once the resumed steps are complete
  await expect(page.getByTestId('transaction-modal-inner')).toHaveCount(0)
  await expect(morePage.wrapButton).toHaveCount(0)
})

test('should wrap name', async ({ makeName, login, makePageObject }) => {
  const name = await makeName({
    label: 'to-be-wrapped',
    type: 'legacy',
  })

  const morePage = makePageObject('MorePage')
  const transactionModal = makePageObject('TransactionModal')

  await morePage.goto(name)
  await login.connect()

  // should migrate the profile
  await morePage.wrapButton.click()
  await transactionModal.autoComplete()

  await morePage.goto(name)
  await expect(morePage.wrapButton).toHaveCount(0)
})

test('should allow wrapping a subdomain', async ({
  provider,
  contracts,
  makeName,
  login,
  makePageObject,
}) => {
  const name = await makeName({
    label: 'unwrapped-with-wrapped-subnames',
    type: 'legacy',
    subnames: [
      {
        label: 'sub',
      },
    ],
  })
  const subname = `sub.${name}`

  const registry = await contracts.get('ENSRegistry', { signer: 'user' })
  const nameWrapper = await contracts.get('NameWrapper')
  await registry.setApprovalForAll(nameWrapper.address, false)
  await provider.mine()

  const morePage = makePageObject('MorePage')
  const transactionModal = makePageObject('TransactionModal')

  await morePage.goto(subname)
  await login.connect()

  // should approve name wrapper for address
  await morePage.wrapButton.click()

  await transactionModal.autoComplete()

  // should remove the notification once the name is wrapped
  await expect(morePage.unwrapButton).toBeVisible({ timeout: 15000 })
})

test('should allow wrapping a name with an unknown label', async ({
  page,
  login,
  makeName,
  makePageObject,
}) => {
  const unknownLabel = `testing123-${Date.now()}`

  const name = await makeName({
    label: 'unknown-labels',
    type: 'legacy',
    subnames: [
      {
        label: unknownLabel,
        owner: 'user',
      },
    ],
  })

  const unknownLabelhash = labelhash(unknownLabel)
  const unknownEncodedLabel = `[${unknownLabelhash.slice(2)}]`
  const subname = `${unknownEncodedLabel}.${name}`

  const morePage = makePageObject('MorePage')
  const transactionModal = makePageObject('TransactionModal')

  await morePage.goto(subname)
  await login.connect()

  await morePage.wrapButton.click()

  const input = page.getByTestId(`unknown-label-input-${unknownLabelhash}`)

  // fail to confirm with invalid label
  await input.fill('failure')
  await expect(page.getByText('Label is incorrect')).toBeVisible()
  await expect(page.getByTestId('unknown-labels-confirm')).toBeDisabled()

  await input.fill(unknownLabel)
  await page.getByTestId('unknown-labels-confirm').click()

  await transactionModal.autoComplete()

  await expect(morePage.wrapButton).toHaveCount(0)

  // should direct to the known label page
  await expect(page).toHaveURL(`/${unknownLabel}.${name}`)
})

test('should calculate needed steps without localstorage', async ({
  page,
  contracts,
  login,
  makeName,
  makePageObject,
}) => {
  test.slow()

  // Reset name wrapper approval
  const registry = contracts.get('ENSRegistry', { signer: 'user' })
  const nameWrapper = contracts.get('NameWrapper')

  const txn = await registry.setApprovalForAll(nameWrapper.address, false)
  await txn.wait()

  const name = await makeName({
    label: 'unwrapped',
    type: 'legacy',
    subnames: [
      {
        label: 'sub',
        records: {
          texts: [{ key: 'description', value: 'test' }],
        },
      },
    ],
  })
  const subname = `sub.${name}`

  const morePage = makePageObject('MorePage')
  const transactionModal = makePageObject('TransactionModal')
  const profilePage = makePageObject('ProfilePage')

  await morePage.goto(subname)
  await login.connect()

  await expect(page.getByTestId('name-details-text-wrapper')).toContainText('unwrapped')

  await morePage.wrapButton.click()

  await expect(page.getByTestId('display-item-Step 1-normal')).toContainText('Approve NameWrapper')
  await expect(page.getByTestId('display-item-Step 2-normal')).toContainText('Migrate profile')
  await expect(page.getByTestId('display-item-Step 3-normal')).toContainText('Wrap name')

  await transactionModal.introButton.click()
  await transactionModal.confirm()
  await expect(transactionModal.completeButton).toBeEnabled()

  await page.evaluate(() => localStorage.clear())
  await page.reload()
  await login.reconnect()

  await morePage.wrapButton.click()

  await expect(page.getByTestId('display-item-Step 1-normal')).toContainText('Migrate profile')
  await expect(page.getByTestId('display-item-Step 2-normal')).toContainText('Wrap name')

  await transactionModal.introButton.click()
  await transactionModal.confirm()
  await expect(transactionModal.completeButton).toBeEnabled()

  await page.evaluate(() => localStorage.clear())
  await page.reload()
  await login.reconnect()

  await morePage.wrapButton.click()

  await transactionModal.introButton.click()
  await transactionModal.confirm()
  await transactionModal.complete()
  await expect(page.getByTestId('name-details-text-wrapper')).not.toContainText('unwrapped')

  await profilePage.goto(subname)
  await expect(profilePage.record('text', 'description')).toHaveText('test')
})
