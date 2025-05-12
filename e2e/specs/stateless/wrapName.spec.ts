import { expect } from '@playwright/test'
import { labelhash } from 'viem'

import { registrySetApprovalForAllSnippet } from '@ensdomains/ensjs/contracts'

import { test } from '../../../playwright'
import { createAccounts } from '../../../playwright/fixtures/accounts'
import {
  testClient,
  waitForTransaction,
  walletClient,
} from '../../../playwright/fixtures/contracts/utils/addTestContracts'

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

  await expect(morePage.pccStatus).toBeVisible()
  await expect(morePage.nameWrapperStatus).toHaveText('Wrapped')
})

test('should show wrap button on unwrapped name', async ({ login, makeName, makePageObject }) => {
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

test('should allow wrapping a subdomain', async ({ makeName, login, makePageObject }) => {
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

  const approveTx = await walletClient.writeContract({
    abi: registrySetApprovalForAllSnippet,
    address: testClient.chain.contracts.ensRegistry.address,
    functionName: 'setApprovalForAll',
    args: [testClient.chain.contracts.ensNameWrapper.address, true],
    account: createAccounts().getAddress('user') as `0x${string}`,
  })
  await waitForTransaction(approveTx)

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
  await expect(page).toHaveURL(`/${unknownLabel}.${name}?tab=more`)
})

test('should calculate needed steps without localstorage', async ({
  page,
  login,
  makeName,
  makePageObject,
}) => {
  test.slow()

  await walletClient.writeContract({
    abi: registrySetApprovalForAllSnippet,
    address: testClient.chain.contracts.ensRegistry.address,
    functionName: 'setApprovalForAll',
    args: [testClient.chain.contracts.ensNameWrapper.address, false],
    account: createAccounts().getAddress('user') as `0x${string}`,
  })
  await testClient.mine({ blocks: 1 })

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

  await morePage.wrapButton.click()
  await expect(page.getByTestId('display-item-Step 1-normal')).toContainText('Approve NameWrapper')
  await expect(page.getByTestId('display-item-Step 2-normal')).toContainText('Migrate profile')
  await expect(page.getByTestId('display-item-Step 3-normal')).toContainText('Wrap name')

  await transactionModal.introButton.click()
  await transactionModal.confirm()
  await expect(transactionModal.completeButton).toBeEnabled()

  await page.waitForTimeout(10000)

  await page.evaluate(() => window.localStorage.clear())
  await page.evaluate(() => window.sessionStorage.clear())
  await page.reload()
  await login.reconnect()

  await morePage.wrapButton.click()

  await expect(page.getByTestId('display-item-Step 1-normal')).toContainText('Migrate profile', {
    timeout: 10000,
  })
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

  await expect(page.getByTestId('namewrapper-status')).not.toContainText('Unwrapped', {
    timeout: 10000,
  })

  await profilePage.goto(subname)
  await expect(profilePage.record('text', 'description')).toHaveText('test')
})

test('Wrapped, emancipated, 2LD', async ({ login, makeName, makePageObject }) => {
  const name = await makeName({
    label: 'wrapped',
    type: 'wrapped',
    owner: 'user',
  })

  const morePage = makePageObject('MorePage')
  await morePage.goto(name)

  await login.connect()

  await expect(morePage.wrapButton).not.toBeVisible()
  await expect(morePage.unwrapButton).toBeVisible()
  await expect(morePage.nameWrapperStatus).toContainText('Wrapped')
  await expect(morePage.pccStatus).toContainText('Not parent-controllable')
  await expect(morePage.nameWrapperCheckIcon).toBeVisible()
  await expect(morePage.npcIcon).toBeVisible()
})

test('Wrapped, locked, 2LD', async ({ login, makeName, makePageObject }) => {
  const name = await makeName({
    label: 'wrapped',
    type: 'wrapped',
    owner: 'user',
    fuses: {
      named: ['CANNOT_UNWRAP'],
    },
  })

  const morePage = makePageObject('MorePage')
  await morePage.goto(name)

  await login.connect()

  await expect(morePage.wrapButton).not.toBeVisible()
  await expect(morePage.unwrapButtonDisabled).toBeVisible()
  await expect(morePage.nameWrapperStatus).toContainText('Wrapped')
  await expect(morePage.pccStatus).toContainText('Not parent-controllable')
  await expect(morePage.nameWrapperLockIcon).toBeVisible()
  await expect(morePage.npcIcon).toBeVisible()
})

test('Wrapped, not-emancipated (PCC), 3LD', async ({ login, makeName, makePageObject }) => {
  const name = await makeName({
    label: 'wrapped',
    type: 'wrapped',
    owner: 'user',
    subnames: [
      {
        label: 'test',
        owner: 'user',
      },
    ],
  })

  const morePage = makePageObject('MorePage')
  await morePage.goto(`test.${name}`)

  await login.connect()

  await expect(morePage.unwrapButton).toBeVisible()
  await expect(morePage.nameWrapperStatus).toContainText('Wrapped')
  await expect(morePage.pccStatus).toContainText('Parent-controllable')
  await expect(morePage.nameWrapperCheckIcon).toBeVisible()
  await expect(morePage.nameWrapperLockIcon).not.toBeVisible()
  await expect(morePage.pccIcon).toBeVisible()
  await expect(morePage.nameWrapperLockIcon).not.toBeVisible()
})

test('Wrapped, emancipated(NPC), 3LD', async ({ login, makeName, makePageObject }) => {
  const name = await makeName({
    label: 'wrapped',
    type: 'wrapped',
    owner: 'user',
    fuses: {
      named: ['CANNOT_UNWRAP'],
    },
    subnames: [
      {
        label: 'test',
        owner: 'user',
        fuses: {
          parent: {
            named: ['PARENT_CANNOT_CONTROL'],
          },
        },
      },
    ],
  })

  const morePage = makePageObject('MorePage')
  await morePage.goto(`test.${name}`)

  await login.connect()

  await expect(morePage.unwrapButton).toBeVisible()
  await expect(morePage.nameWrapperStatus).toContainText('Wrapped')
  await expect(morePage.pccStatus).toContainText('Not parent-controllable')
  await expect(morePage.nameWrapperCheckIcon).toBeVisible()
  await expect(morePage.npcIcon).toBeVisible()
  await expect(morePage.nameWrapperLockIcon).not.toBeVisible()
})

test('Wrapped, emancipated(NPC), Locked, 3LD', async ({ login, makeName, makePageObject }) => {
  const name = await makeName({
    label: 'wrapped',
    type: 'wrapped',
    owner: 'user',
    fuses: {
      named: ['CANNOT_UNWRAP'],
    },
    subnames: [
      {
        label: 'test',
        owner: 'user',
        fuses: {
          parent: {
            named: ['PARENT_CANNOT_CONTROL'],
          },
          child: {
            named: ['CANNOT_UNWRAP'],
          },
        },
      },
    ],
  })

  const morePage = makePageObject('MorePage')
  await morePage.goto(`test.${name}`)

  await login.connect()

  await expect(morePage.nameWrapperStatus).toContainText('Wrapped')
  await expect(morePage.pccStatus).toContainText('Not parent-controllable')
  await expect(morePage.nameWrapperLockIcon).toBeVisible()
  await expect(morePage.npcIcon).toBeVisible()
  await expect(morePage.unwrapButtonDisabled).toBeVisible()
})

test('Wrapped, emancipated(NPC), 3LD Manager', async ({ login, makeName, makePageObject }) => {
  const name = await makeName({
    label: 'wrapped',
    type: 'wrapped',
    owner: 'user2',
    fuses: {
      named: ['CANNOT_UNWRAP'],
    },
    subnames: [
      {
        label: 'test',
        owner: 'user',
        fuses: {
          parent: {
            named: ['PARENT_CANNOT_CONTROL'],
          },
        },
      },
    ],
  })

  const morePage = makePageObject('MorePage')
  const transactionModal = makePageObject('TransactionModal')
  await morePage.goto(`test.${name}`)

  await login.connect()

  await expect(morePage.unwrapButton).toBeVisible()
  await expect(morePage.nameWrapperStatus).toContainText('Wrapped')
  await expect(morePage.pccStatus).toContainText('Not parent-controllable')
  await expect(morePage.nameWrapperCheckIcon).toBeVisible()
  await expect(morePage.npcIcon).toBeVisible()
  await expect(morePage.nameWrapperLockIcon).not.toBeVisible()

  await morePage.unwrapButton.click()
  await transactionModal.autoComplete()
  await expect(morePage.wrapButton).toBeVisible()
})

test('Should not show wrap button on unwrapped name in Grace period', async ({
  login,
  makeName,
  makePageObject,
}) => {
  const name = await makeName({
    label: 'to-be-wrapped',
    type: 'legacy',
    duration: -24 * 60 * 60,
  })

  const morePage = makePageObject('MorePage')
  await morePage.goto(name)

  await login.connect()

  await expect(morePage.wrapButton).not.toBeVisible()
  await expect(morePage.wrapButton).toHaveCount(0)
})

test('should show wrap button on unwrapped subname in Grace period', async ({
  login,
  makeName,
  makePageObject,
}) => {
  const name = await makeName({
    label: 'to-be-wrapped',
    type: 'legacy',
    subnames: [
      {
        label: 'sub',
      },
    ],
    duration: -24 * 60 * 60,
  })

  const morePage = makePageObject('MorePage')
  const transactionModal = makePageObject('TransactionModal')
  await morePage.goto(`sub.${name}`)

  await login.connect()

  await expect(morePage.wrapButton).toBeVisible()
  await expect(morePage.wrapButton).toBeEnabled()

  await morePage.wrapButton.click()
  await transactionModal.autoComplete()

  await morePage.goto(`sub.${name}`)
  await expect(morePage.wrapButton).toHaveCount(0)
})

test('should not show unwrap button on wrapped name in Grace period', async ({
  login,
  makeName,
  makePageObject,
}) => {
  const name = await makeName({
    label: 'wrapped',
    type: 'wrapped',
    duration: -24 * 60 * 60,
  })

  const morePage = makePageObject('MorePage')
  await morePage.goto(name)

  await login.connect()

  await expect(morePage.unwrapButton).toHaveCount(0)
})

test('should show unwrap button on wrapped subname in Grace period', async ({
  login,
  makeName,
  makePageObject,
}) => {
  const name = await makeName({
    label: 'to-be-wrapped',
    type: 'wrapped',
    owner: 'user',
    subnames: [
      {
        label: 'sub',
        owner: 'user',
      },
    ],
    duration: -24 * 60 * 60,
  })

  const morePage = makePageObject('MorePage')
  const transactionModal = makePageObject('TransactionModal')
  await morePage.goto(`sub.${name}`)

  await login.connect()

  await expect(morePage.unwrapButton).toBeVisible()
  await expect(morePage.unwrapButton).toBeEnabled()

  await morePage.unwrapButton.click()
  await transactionModal.autoComplete()

  await morePage.goto(`sub.${name}`)
  await expect(morePage.unwrapButton).toHaveCount(0)
})

test('Wrapped, emancipated(NPC), 3LD Manager should be able to unwrap when parent is in Grace period', async ({
  login,
  makeName,
  makePageObject,
}) => {
  const name = await makeName({
    label: 'wrapped',
    type: 'wrapped',
    owner: 'user2',
    fuses: {
      named: ['CANNOT_UNWRAP'],
    },
    subnames: [
      {
        label: 'test',
        owner: 'user',
        fuses: {
          parent: {
            named: ['PARENT_CANNOT_CONTROL'],
          },
        },
      },
    ],
    duration: -24 * 60 * 60,
  })

  const morePage = makePageObject('MorePage')
  const transactionModal = makePageObject('TransactionModal')
  await morePage.goto(`test.${name}`)

  await login.connect()

  await expect(morePage.unwrapButton).toBeVisible()
  await expect(morePage.unwrapButton).toBeEnabled()
  await morePage.unwrapButton.click()
  await transactionModal.autoComplete()
  await expect(morePage.wrapButton).toBeVisible()
})
