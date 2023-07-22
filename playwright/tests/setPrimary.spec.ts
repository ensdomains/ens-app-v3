import { expect } from '@playwright/test'

import { RESOLVER_ADDRESSES } from '@app/utils/constants'

import { test } from '..'

test.describe('profile', () => {
  test('should allow setting unmanaged name that has eth record set to address', async ({
    page,
    login,
    makeName,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'other-eth-record',
      type: 'legacy',
      owner: 'user2',
      manager: 'user2',
      addr: 'user',
    })

    const profilePage = makePageObject('ProfilePage')
    const transactionModal = makePageObject('TransactionModal')
    await profilePage.goto(name)

    await login.connect()

    // Assert state
    await expect(page.getByTestId('owner-profile-button-name.manager')).toHaveText(
      'manager0x709...c79C8',
    )
    await expect(page.getByTestId('owner-profile-button-name.owner')).toHaveText(
      'owner0x709...c79C8',
    )
    await expect(page.getByTestId('address-profile-button-eth')).toHaveText('0xf39...92266')

    await page.getByText('Set as primary name').click()

    // Transaction modal
    await expect(page.getByTestId('display-item-info-normal')).toHaveText(
      'Set the primary name for your address',
    )
    await expect(page.getByTestId('display-item-name-normal')).toHaveText(name)
    await expect(page.getByTestId('display-item-address-normal')).toHaveText(/0xf39...92266/)
    await transactionModal.autoComplete()

    // Assertion
    await expect(page.getByTestId('profile-title')).toHaveText(name)

    // Should show changes in setting
    await page.goto('/my/settings')

    await expect(page.getByTestId('primary-name-label')).toHaveText(name)
  })

  test('should allow setting unwrapped name that user is manager of but whose resolved address is not the same as the user', async ({
    page,
    login,
    makeName,
    makePageObject,
  }) => {
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
    await expect(page.getByTestId('address-profile-button-eth')).toHaveText('0x709...c79C8')
    await expect(page.getByTestId('owner-profile-button-name.manager')).toHaveText(
      'managerother-eth-record.eth',
    )
    await expect(page.getByTestId('owner-profile-button-name.owner')).toHaveText(
      'owner0x709...c79C8',
    )

    await page.getByText('Set as primary name').click()

    await transactionModal.autoComplete()

    // Assertion
    await expect(page.getByTestId('profile-title')).toHaveText(name)
  })

  test('should allow setting wrapped name that user is manager of but whose resolved address is not the same as the user with an owned resolver', async ({
    page,
    login,
    makeName,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'wrapped',
      type: 'wrapped',
      owner: 'user2',
      manager: 'user2',
      addr: 'user',
    })

    const profilePage = makePageObject('ProfilePage')
    const transactionModal = makePageObject('TransactionModal')
    await profilePage.goto(name)

    await login.connect()

    // Assert state
    await expect(page.getByTestId('owner-profile-button-name.manager')).toHaveText(
      'managerother-controller.eth',
    )
    await expect(page.getByTestId('address-profile-button-eth')).toHaveCount(0)

    await page.getByText('Set as primary name').click()

    await transactionModal.autoComplete()

    // Assertion
    await expect(page.getByTestId('profile-title')).toHaveText(name)
  })

  test('should skip setting eth record if user is manager of name and resolver is not authorized if eth record is set on latest resolver', async ({
    page,
    login,
    makeName,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'wrapped',
      type: 'legacy',
      owner: 'user2',
      manager: 'user2',
      addr: 'user',
      resolver: RESOLVER_ADDRESSES['1337'][2],
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
    const transactionModal = makePageObject('TransactionModal')
    await profilePage.goto(name)

    await login.connect()

    // Assert state
    await expect(page.getByTestId('owner-profile-button-name.manager')).toHaveText(
      'managersub.wrapped.eth',
    )
    await expect(page.getByTestId('address-profile-button-eth')).toHaveCount(0)

    await page.getByText('Set as primary name').click()

    await transactionModal.introButton.click()

    // Update resolver
    await transactionModal.confirm()
    await transactionModal.complete()

    // Set Primary Name modal
    await transactionModal.confirm()
    await transactionModal.complete()

    // Assertion
    await expect(page.getByTestId('profile-title')).toHaveText('legacy.wrapped.eth')
  })

  test('should skip setting primary name step if reverse registry name is already set to that name', async ({
    page,
    login,
    makeName,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'wrapped',
      type: 'wrapped',
      owner: 'user2',
      manager: 'user2',
      addr: 'user',
      resolver: RESOLVER_ADDRESSES['1337'][2],
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
    const transactionModal = makePageObject('TransactionModal')

    await profilePage.goto(name)
    await login.connect()

    await profilePage.editProfileButton.click()
    await page.getByTestId('profile-record-input-ETH-delete-button').click()
    await page.getByTestId('profile-submit-button').click()
    await transactionModal.autoComplete()

    // Assert state
    await expect(page.getByTestId('profile-title')).not.toHaveText(/legacy.wrapped.eth/)

    await page.getByText('Set as primary name').click()

    // Update ETH address
    await transactionModal.confirm()
    await transactionModal.complete()

    // Assertion
    await expect(page.getByTestId('profile-title')).toHaveText('legacy.wrapped.eth')
  })

  test('should not show set primary name button for a wrapped name that has CSR burned, is not a resolved address, and an unauthorized resolver', async ({
    page,
    login,
    wallet,
    makeName,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'wrapped',
      type: 'wrapped',
      owner: 'user2',
      manager: 'user2',
      addr: 'user2',
      resolver: RESOLVER_ADDRESSES['1337'][2],
      fuses: ['CANNOT_SET_RESOLVER'],
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
    const transactionModal = makePageObject('TransactionModal')

    await profilePage.goto(name)
    await login.connect()

    await expect(page.getByTestId('profile-action-Set as primary name')).toBeVisible()

    // Set resolver to unauthorized resolver

    // Validate that the name is in the list

    // Burn CSR fuse

    // Validate that the name is NOT in the list
    await profilePage.goto(name)
    await expect(page.getByTestId('profile-action-Set as primary name')).toHaveCount(0)
  })

  test('should allow setting primary name from name with encrypted label', async ({
    page,
    login,
    wallet,
    makeName,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'wrapped',
      type: 'wrapped',
      owner: 'user2',
      manager: 'user2',
      addr: 'user',
      resolver: RESOLVER_ADDRESSES['1337'][2],
      records: {
        coinTypes: [
          {
            key: 'ETH',
            value: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
          },
        ],
      },
      subnames: [
        {
          label: 'aaa123xyz000',
          owner: 'user',
        },
      ],
    })

    const subname = `[5b3696f8cb09e643db6c96c1742cba8d54b434a77cf1bbada1531818c42fca04].${name}`
    const profilePage = makePageObject('ProfilePage')
    const transactionModal = makePageObject('TransactionModal')

    await profilePage.goto(name)
    await login.connect()
    await page.goto('/')

    // Assert state
    await expect(page.getByTestId('owner-profile-button-name.manager')).toHaveText(
      'manager0x3C4...293BC',
    )

    await page.getByText('Set as primary name').click()
    await page
      .getByTestId(
        'unknown-label-input-0x5b3696f8cb09e643db6c96c1742cba8d54b434a77cf1bbada1531818c42fca04',
      )
      .type('aaa123xyz000')
    await page.getByTestId('unknown-labels-confirm').click()

    await page.getByTestId('transaction-dialog-intro-trailing-btn').click()

    // update eth address
    await transactionModal.confirm()
    await transactionModal.complete()

    // set primary name
    await transactionModal.confirm()
    await transactionModal.complete()

    await expect(page.getByTestId('profile-title')).toHaveText('aaa123xyz000.unknown-labels.eth')
  })
})
