import { expect } from '@playwright/test'
import { test } from '@root/playwright'

import { labelhash } from '@ensdomains/ensjs/utils/labels'

import { RESOLVER_ADDRESSES } from '@app/utils/constants'

const UNAUTHORISED_RESOLVER = RESOLVER_ADDRESSES['1337'][1] as `0x${string}`

test.afterAll(async ({ contracts }) => {
  const reverseRegistrar = await contracts.get('ReverseRegistrar', { signer: 'user' })
  await reverseRegistrar.setName('')
})

test.describe('profile', () => {
  test('should allow setting unmanaged name that has eth record set to address', async ({
    page,
    login,
    contracts,
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

    const reverseRegistrar = await contracts.get('ReverseRegistrar', { signer: 'user' })
    await reverseRegistrar.setName('')

    const profilePage = makePageObject('ProfilePage')
    const transactionModal = makePageObject('TransactionModal')
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

    // Should show changes in setting
    await page.goto('/my/settings')

    await expect(page.getByTestId('primary-name-label')).toHaveText(name, { timeout: 15000 })
  })

  test('should allow setting unwrapped name that user is manager of but whose resolved address is not the same as the user', async ({
    page,
    login,
    contracts,
    accounts,
    makeName,
    makePageObject,
  }) => {
    test.slow()

    const reverseRegistrar = await contracts.get('ReverseRegistrar', { signer: 'user' })
    await reverseRegistrar.setName('')

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
    contracts,
    accounts,
    makeName,
    makePageObject,
  }) => {
    test.slow()

    const reverseRegistrar = await contracts.get('ReverseRegistrar', { signer: 'user' })
    await reverseRegistrar.setName('')

    const name = await makeName({
      label: 'wrapped',
      type: 'wrapped',
      owner: 'user2',
      subnames: [
        {
          label: 'test',
          owner: 'user',
          type: 'wrapped',
          resolver: RESOLVER_ADDRESSES['1337'][1] as `0x${string}`,
        },
      ],
    })
    const subname = `test.${name}`

    const profilePage = makePageObject('ProfilePage')
    const morePage = makePageObject('MorePage')
    const transactionModal = makePageObject('TransactionModal')

    await morePage.goto(subname)
    await login.connect()
    await expect(morePage.resolver).toContainText(RESOLVER_ADDRESSES['1337'][1])

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
    contracts,
    accounts,
    makeName,
    makePageObject,
  }) => {
    test.slow()

    const reverseRegistrar = await contracts.get('ReverseRegistrar', { signer: 'user' })
    await reverseRegistrar.setName('')

    const name = await makeName({
      label: 'wrapped',
      type: 'wrapped',
      owner: 'user2',
      subnames: [
        {
          label: 'test',
          owner: 'user',
          records: {
            coinTypes: [
              {
                key: 'ETH',
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

    await expect(morePage.resolver).toContainText(UNAUTHORISED_RESOLVER, { timeout: 15000 })

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
    contracts,
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

    const reverseRegistrar = await contracts.get('ReverseRegistrar', { signer: 'user' })
    await reverseRegistrar.setName(subname)

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
    await expect(page.getByTestId('profile-title')).toContainText(subname, { timeout: 15000 })
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
        coinTypes: [
          {
            key: 'ETH',
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
    await permissionsPage.burnChildPermissions(['CANNOT_UNWRAP', 'CANNOT_SET_RESOLVER'])
    await transactionModal.autoComplete()

    // Validate that the name is NOT in the list
    await profilePage.goto(name)
    await expect(page.getByTestId('profile-action-Set as primary name')).toHaveCount(0)
  })

  test('should allow setting primary name from name with encrypted label', async ({
    page,
    login,
    contracts,
    accounts,
    makeName,
    makePageObject,
  }) => {
    test.slow()

    const reverseRegistrar = await contracts.get('ReverseRegistrar', { signer: 'user' })
    await reverseRegistrar.setName('')

    const label = `unknown-label-${Date.now()}`
    const _labelhash = labelhash(label)

    const name = await makeName({
      label: 'wrapped',
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
})
