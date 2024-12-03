import { expect } from '@playwright/test'
import { labelhash } from 'viem'

import { getResolver } from '@ensdomains/ensjs/public'
import { setPrimaryName } from '@ensdomains/ensjs/wallet'

import { test } from '../../../playwright'
import { createAccounts } from '../../../playwright/fixtures/accounts'
import {
  waitForTransaction,
  walletClient,
} from '../../../playwright/fixtures/contracts/utils/addTestContracts'

const UNAUTHORISED_RESOLVER = '0xd7a4F6473f32aC2Af804B3686AE8F1932bC35750'

test.afterAll(async () => {
  await setPrimaryName(walletClient, {
    name: '',
    account: createAccounts().getAddress('user') as `0x${string}`,
  })
})

test.describe('profile', () => {
  test('should allow setting unmanaged name that has eth record set to address', async ({
    page,
    login,
    accounts,
    makeName,
    makePageObject,
  }) => {
    test.slow()

    const name = await makeName({
      label: 'other-eth-record',
      type: 'legacy',
      owner: 'user2',
      manager: 'user2',
      addr: 'user',
    })

    const anotherName = await makeName({
      label: 'another-primary-name',
      type: 'legacy',
      owner: 'user',
      manager: 'user',
      addr: 'user',
    })

    await setPrimaryName(walletClient, {
      name: '',
      account: createAccounts().getAddress('user') as `0x${string}`,
    })

    const profilePage = makePageObject('ProfilePage')
    const transactionModal = makePageObject('TransactionModal')
    const settingsPage = makePageObject('SettingsPage')
    const selectPrimaryNameModal = makePageObject('SelectPrimaryNameModal')
    await profilePage.goto(name)

    await login.connect()

    // Assert state
    await expect(page.getByTestId('owner-profile-button-name.manager')).toContainText(
      accounts.getAddress('user2', 5),
    )
    await expect(page.getByTestId('owner-profile-button-name.owner')).toContainText(
      accounts.getAddress('user2', 5),
    )
    await expect(page.getByTestId('address-profile-button-eth')).toContainText(
      accounts.getAddress('user', 5),
    )

    await page.getByText('Set as primary name').click()
    // Transaction modal
    await expect(page.getByTestId('display-item-info-normal')).toContainText(
      'Set the primary name for your address',
    )
    await expect(page.getByTestId('display-item-name-normal')).toContainText(name)
    await expect(page.getByTestId('display-item-address-normal')).toContainText(/0xf39...92266/)
    await transactionModal.autoComplete()

    // Assertion
    await expect(page.getByTestId('profile-title')).toHaveText(name)

    await settingsPage.goto()
    await expect(settingsPage.getPrimaryNameLabel()).toHaveText(name, { timeout: 15000 })
    await settingsPage.changePrimaryNameButton.click()
    await selectPrimaryNameModal.waitForPageLoad()
    const nameWithoutSuffix = name.slice(0, -4)
    await selectPrimaryNameModal.searchInput.click()
    await selectPrimaryNameModal.searchInput.fill(nameWithoutSuffix)
    await selectPrimaryNameModal.searchInput.press('Enter')
    await selectPrimaryNameModal.waitForPageLoad()
    await expect(page.getByText('No names found')).toBeVisible({ timeout: 30000 })
    const otherNameWithoutSuffix = anotherName.slice(0, -4)
    await selectPrimaryNameModal.searchInput.fill(otherNameWithoutSuffix)
    await selectPrimaryNameModal.searchInput.press('Enter')
    await selectPrimaryNameModal.waitForPageLoad()
    await expect(
      await selectPrimaryNameModal.getPrimaryNameItem(otherNameWithoutSuffix),
    ).toBeVisible()
  })

  test('should allow setting unwrapped name that user is manager of but whose resolved address is not the same as the user', async ({
    page,
    login,
    accounts,
    makeName,
    makePageObject,
  }) => {
    test.slow()

    await setPrimaryName(walletClient, {
      name: '',
      account: createAccounts().getAddress('user') as `0x${string}`,
    })

    const name = await makeName({
      label: 'other-eth-record',
      type: 'legacy',
      owner: 'user2',
      manager: 'user',
      addr: 'user2',
    })

    const profilePage = makePageObject('ProfilePage')
    const transactionModal = makePageObject('TransactionModal')
    await profilePage.goto(name)

    await login.connect()

    // Assert state
    await expect(page.getByTestId('address-profile-button-eth')).toContainText(
      accounts.getAddress('user2', 5),
    )
    await expect(page.getByTestId('owner-profile-button-name.manager')).toContainText(
      accounts.getAddress('user', 5),
    )
    await expect(page.getByTestId('owner-profile-button-name.owner')).toContainText(
      accounts.getAddress('user2', 5),
    )

    await page.getByText('Set as primary name').click()

    await transactionModal.autoComplete()

    // Assertion
    await expect(page.getByTestId('profile-title')).toHaveText(name, { timeout: 15000 })
  })

  test('should allow setting wrapped name that user is manager of but whose resolved address is not the same as the user with an owned resolver', async ({
    page,
    login,
    accounts,
    makeName,
    makePageObject,
  }) => {
    test.slow()

    await setPrimaryName(walletClient, {
      name: '',
      account: createAccounts().getAddress('user') as `0x${string}`,
    })

    const name = await makeName({
      label: 'wrapped',
      type: 'wrapped',
      owner: 'user2',
      subnames: [
        {
          label: 'test',
          owner: 'user',
          type: 'wrapped',
          resolver: UNAUTHORISED_RESOLVER, // RESOLVER_ADDRESSES['1337'][1] as `0x${string}`,
        },
      ],
    })
    const subname = `test.${name}`

    const test2 = await getResolver(walletClient, { name: subname })
    console.log('test', test2)

    const profilePage = makePageObject('ProfilePage')
    const morePage = makePageObject('MorePage')
    const transactionModal = makePageObject('TransactionModal')

    await morePage.goto(subname)
    await login.connect()

    await expect(morePage.resolver).toContainText(UNAUTHORISED_RESOLVER)

    await profilePage.goto(subname)
    await expect(page.getByTestId('owner-profile-button-name.manager')).toContainText(
      accounts.getAddress('user', 5),
    )
    await expect(page.getByTestId('address-profile-button-eth')).toHaveCount(0)

    await page.getByText('Set as primary name').click()
    await expect(page.getByTestId('display-item-Step 1-normal')).toBeVisible()
    await expect(page.getByTestId('display-item-Step 2-normal')).toBeVisible()
    await expect(page.getByTestId('display-item-Step 3-normal')).toBeVisible()

    await transactionModal.autoComplete()

    // Assertion
    await expect(page.getByTestId('profile-title')).toHaveText(subname, { timeout: 15000 })
  })

  test('should skip setting eth record if user is manager of name and resolver is not authorized if eth record is set on latest resolver', async ({
    page,
    login,
    accounts,
    makeName,
    makePageObject,
  }) => {
    test.slow()

    await setPrimaryName(walletClient, {
      name: '',
      account: createAccounts().getAddress('user') as `0x${string}`,
    })

    const name = await makeName({
      label: 'wrapped',
      type: 'wrapped',
      owner: 'user2',
      subnames: [
        {
          label: 'test',
          owner: 'user',
          records: {
            coins: [
              {
                coin: 'eth',
                value: accounts.getAddress('user'),
              },
            ],
          },
        },
      ],
    })
    const subname = `test.${name}`

    const profilePage = makePageObject('ProfilePage')
    const morePage = makePageObject('MorePage')
    const transactionModal = makePageObject('TransactionModal')

    // Assert state
    await morePage.goto(subname)
    await login.connect()

    // Setting unauthorised resovler must be done after name creation so that eth records
    // for the name can be set.
    await morePage.editResolverButton.click()
    await page.getByTestId('custom-resolver-radio').check()
    await page.getByTestId('dogfood').fill(UNAUTHORISED_RESOLVER)
    await page.getByTestId('update-button').click()
    await transactionModal.autoComplete()

    await expect(morePage.resolver).toContainText(UNAUTHORISED_RESOLVER, { timeout: 30000 })

    await profilePage.goto(subname)
    await expect(page.getByTestId('owner-profile-button-name.manager')).toContainText(
      accounts.getAddress('user', 5),
    )
    await expect(page.getByTestId('address-profile-button-eth')).toHaveCount(0)

    await page.getByText('Set as primary name').click()
    await expect(page.getByTestId('display-item-Step 1-normal')).toBeVisible()
    await expect(page.getByTestId('display-item-Step 2-normal')).toBeVisible()
    await expect(page.getByTestId('display-item-Step 3-normal')).not.toBeVisible()

    await transactionModal.introButton.click()

    // Update resolver
    await transactionModal.confirm()
    await transactionModal.complete()

    // Set Primary Name modal
    await transactionModal.confirm()
    await transactionModal.complete()

    // Assertion
    await expect(page.getByTestId('profile-title')).toHaveText(subname, { timeout: 15000 })
  })

  test('should skip setting primary name step if reverse registry name is already set to that name', async ({
    page,
    login,
    makeName,
    makePageObject,
  }) => {
    test.slow()

    const name = await makeName({
      label: 'wrapped',
      type: 'wrapped',
      owner: 'user2',
      subnames: [
        {
          label: 'test',
          owner: 'user',
          resolver: UNAUTHORISED_RESOLVER,
        },
      ],
    })
    const subname = `test.${name}`

    const tx = await setPrimaryName(walletClient, {
      name: subname,
      account: createAccounts().getAddress('user') as `0x${string}`,
    })
    await waitForTransaction(tx)

    const profilePage = makePageObject('ProfilePage')
    const transactionModal = makePageObject('TransactionModal')

    await profilePage.goto(subname)
    await login.connect()

    // Assert state
    await expect(page.getByTestId('profile-title')).not.toContainText(subname)

    await page.getByText('Set as primary name').click()

    await expect(page.getByTestId('display-item-Step 1-normal')).toBeVisible()
    await expect(
      page.getByTestId('transaction-modal-inner').getByText('Set primary name'),
    ).toHaveCount(0)
    await transactionModal.autoComplete()

    // Assertion
    await expect(page.getByTestId('profile-title')).toContainText(subname, { timeout: 30000 })
  })

  test('should not show set primary name button for a wrapped name that has CSR burned, is not a resolved address, and an unauthorized resolver', async ({
    page,
    login,
    makeName,
    makePageObject,
  }) => {
    test.slow()

    const name = await makeName({
      label: 'wrapped',
      type: 'wrapped',
      owner: 'user',
      records: {
        coins: [
          {
            coin: 'eth',
            value: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
          },
        ],
      },
    })

    const profilePage = makePageObject('ProfilePage')
    const morePage = makePageObject('MorePage')
    const permissionsPage = makePageObject('PermissionsPage')
    const transactionModal = makePageObject('TransactionModal')

    await profilePage.goto(name)
    await login.connect()

    await expect(page.getByTestId('profile-action-Set as primary name')).toBeVisible()

    // Set resolver to unauthorized resolver
    await morePage.goto(name)
    await morePage.editResolverButton.click()
    await page.getByTestId('custom-resolver-radio').check()
    await page.getByTestId('dogfood').fill(UNAUTHORISED_RESOLVER)
    await page.getByTestId('update-button').click()
    await transactionModal.autoComplete()

    // Validate that the name is in the list
    await profilePage.goto(name)
    await expect(page.getByTestId('profile-action-Set as primary name')).toBeVisible()

    // Burn CSR fuse
    await permissionsPage.goto(name)
    await permissionsPage.burnChildPermissions(['CANNOT_UNWRAP', 'CANNOT_SET_RESOLVER'], name)
    await transactionModal.autoComplete()

    // Validate that the name is NOT in the list
    await profilePage.goto(name)
    await expect(page.getByTestId('profile-action-Set as primary name')).toHaveCount(0)
  })

  test('should allow setting primary name from name with encrypted label', async ({
    page,
    login,
    accounts,
    makeName,
    makePageObject,
  }) => {
    test.slow()

    const tx = await setPrimaryName(walletClient, {
      name: '',
      account: createAccounts().getAddress('user') as `0x${string}`,
    })
    await waitForTransaction(tx)
    console.log('tx', tx)

    const label = `unknown-label-${Date.now()}`
    const _labelhash = labelhash(label)

    const name = await makeName({
      label: 'legacy',
      type: 'legacy',
      owner: 'user',
      subnames: [
        {
          label,
          owner: 'user',
        },
      ],
    })

    const subname = `[${_labelhash.slice(2)}].${name}`

    const profilePage = makePageObject('ProfilePage')
    const transactionModal = makePageObject('TransactionModal')

    await profilePage.goto(subname)
    await login.connect()

    // Assert state
    await expect(page.getByTestId('owner-profile-button-name.manager')).toContainText(
      accounts.getAddress('user', 5),
    )

    await page.getByText('Set as primary name').click()
    await page.getByTestId(`unknown-label-input-${_labelhash}`).type(label)
    await page.getByTestId('unknown-labels-confirm').click()

    await expect(page.getByTestId('display-item-Step 1-normal')).toBeVisible()
    await expect(page.getByTestId('display-item-Step 2-normal')).toBeVisible()
    await expect(page.getByTestId('display-item-Step 3-normal')).not.toBeVisible()
    await transactionModal.autoComplete()

    await expect(page.getByTestId('profile-title')).toContainText(`${label}.${name}`, {
      timeout: 15000,
    })
  })

  test('should not allow owner but not manager to set primary name for unwrapped name', async ({
    page,
    login,
    accounts,
    makeName,
    makePageObject,
  }) => {
    test.slow()

    const tx = await setPrimaryName(walletClient, {
      name: '',
      account: createAccounts().getAddress('user') as `0x${string}`,
    })
    await waitForTransaction(tx)

    const name = await makeName({
      label: 'legacy',
      type: 'legacy',
      owner: 'user',
      manager: 'user2',
      records: {
        coins: [
          {
            coin: 'eth',
            value: accounts.getAddress('user2'),
          },
        ],
      },
    })

    const profilePage = makePageObject('ProfilePage')

    await profilePage.goto(name)
    await login.connect()

    await expect(page.getByTestId('profile-action-Set as primary name')).toHaveCount(0)

    // Assert state
    await expect(page.getByTestId('owner-profile-button-name.manager')).toContainText(
      accounts.getAddress('user2', 5),
    )
  })
})
