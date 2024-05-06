import { expect } from '@playwright/test'

import { test } from '../../../playwright'

test.describe('Permissions', () => {
  test('should show parent not locked warning', async ({
    page,
    login,
    makeName,
    makePageObject,
  }) => {
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

    const subname = `test.${name}`

    const permissionsPage = makePageObject('PermissionsPage')
    await permissionsPage.goto(subname)

    await login.connect()

    await page.getByTestId('banner-parent-not-locked').click()

    await expect(page).toHaveURL(`/${name}?tab=permissions`)
  })

  test('should allow owner to revoke permissions', async ({ makeName, login, makePageObject }) => {
    test.slow()

    const name = await makeName({
      label: 'wrapped',
      type: 'wrapped',
      owner: 'user',
    })

    const ownershipPage = makePageObject('OwnershipPage')
    const subnamesPage = makePageObject('SubnamesPage')
    await subnamesPage.goto(name)

    await login.connect()
    await expect(subnamesPage.getAddSubnameButton).toBeVisible()

    await ownershipPage.goto(name)
    await expect(ownershipPage.sendNameButton).toBeVisible()

    const morePage = makePageObject('MorePage')
    await morePage.goto(name)
    await expect(morePage.editResolverButton).toBeVisible()

    const permissionsPage = makePageObject('PermissionsPage')
    await permissionsPage.goto(name)
    // TODO: get owner can change permissions

    await expect(
      permissionsPage.arePermissionsUnburned([
        'CANNOT_UNWRAP',
        'CANNOT_CREATE_SUBDOMAIN',
        'CANNOT_TRANSFER',
        'CANNOT_SET_RESOLVER',
        'CANNOT_SET_TTL',
        'CANNOT_APPROVE',
      ]),
    ).toBeTruthy()

    await permissionsPage.burnChildPermissions(
      [
        'CANNOT_UNWRAP',
        'CANNOT_CREATE_SUBDOMAIN',
        'CANNOT_TRANSFER',
        'CANNOT_SET_RESOLVER',
        'CANNOT_SET_TTL',
        'CANNOT_APPROVE',
      ],
      name,
    )
    const transactionModal = makePageObject('TransactionModal')
    await transactionModal.autoComplete()

    await permissionsPage.arePermissionsBurned([
      'CANNOT_UNWRAP',
      'CANNOT_CREATE_SUBDOMAIN',
      'CANNOT_TRANSFER',
      'CANNOT_SET_RESOLVER',
      'CANNOT_SET_TTL',
      'CANNOT_APPROVE',
    ])

    await subnamesPage.goto(name)
    await expect(subnamesPage.getDisabledAddSubnameButton).toBeVisible()

    await ownershipPage.goto(name)
    await expect(ownershipPage.disabledSendNameButton).toBeVisible()

    await morePage.goto(name)
    await expect(morePage.disabledEditResolverButton).toBeVisible()
  })

  test('should show correct buttons for managing subname (Parent owner settings)', async ({
    makeName,
    login,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'wrapped',
      type: 'wrapped',
      owner: 'user',
      subnames: [
        {
          label: 'test',
          owner: 'user2',
        },
      ],
    })

    const subname = `test.${name}`
    const ownershipPage = makePageObject('OwnershipPage')
    const profilePage = makePageObject('ProfilePage')
    await profilePage.goto(subname)

    await login.connect()

    await expect(profilePage.deleteSubnameButton).toBeVisible()

    const subnamesPage = makePageObject('SubnamesPage')
    await subnamesPage.goto(subname)
    await expect(subnamesPage.getAddSubnameButton).toHaveCount(0)

    const morePage = makePageObject('MorePage')
    await morePage.goto(subname)
    await expect(morePage.editResolverButton).toHaveCount(0)

    ownershipPage.goto(subname)
    await expect(ownershipPage.sendNameButton).toBeVisible()
  })

  test('should show correct buttons for managing subname (Name owner settings)', async ({
    login,
    makeName,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'wrapped',
      type: 'wrapped',
      owner: 'user2',
      subnames: [
        {
          label: 'test',
          owner: 'user',
        },
      ],
    })

    const subname = `test.${name}`

    const ownershipPage = makePageObject('OwnershipPage')
    const profilePage = makePageObject('ProfilePage')
    await profilePage.goto(subname)

    await login.connect()

    await expect(profilePage.deleteSubnameButton).toBeVisible()

    const subnamesPage = makePageObject('SubnamesPage')
    await subnamesPage.goto(subname)
    await expect(subnamesPage.getAddSubnameButton).toBeVisible()

    const morePage = makePageObject('MorePage')
    await morePage.goto(subname)
    await expect(morePage.editResolverButton).toBeVisible()

    await ownershipPage.goto(subname)
    await expect(ownershipPage.sendNameButton).toBeVisible()
  })

  test('should allow parent owner to extend expiry', async ({
    login,
    makeName,
    makePageObject,
  }) => {
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
          owner: 'user2',
        },
      ],
    })

    const subname = `test.${name}`

    const permissionsPage = makePageObject('PermissionsPage')
    await permissionsPage.goto(subname)

    await login.connect()

    await expect(permissionsPage.isPermissionUnburned('CAN_EXTEND_EXPIRY')).toBeTruthy()

    await permissionsPage.burnExtendExpiry(name)
    const transactionModal = makePageObject('TransactionModal')
    await transactionModal.autoComplete()

    await expect(permissionsPage.isPermissionBurned('CAN_EXTEND_EXPIRY')).toBeTruthy()
    await expect(permissionsPage.getBurnExtendExpiryButton).toHaveCount(0)
  })

  test('should allow parent owner to burn pcc', async ({ makeName, login, makePageObject }) => {
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
          owner: 'user2',
        },
      ],
    })

    const subname = `test.${name}`

    const permissionsPage = makePageObject('PermissionsPage')
    await permissionsPage.goto(subname)

    await login.connect()

    await expect(permissionsPage.isPermissionUnburned('PARENT_CANNOT_CONTROL')).toBeTruthy()

    await permissionsPage.burnPCC(['CANNOT_UNWRAP'], subname)
    const transactionModal = makePageObject('TransactionModal')
    await transactionModal.autoComplete()

    await expect(
      permissionsPage.arePermissionsBurned(['PARENT_CANNOT_CONTROL', 'CANNOT_UNWRAP']),
    ).toBeTruthy()
    await expect(permissionsPage.getBurnPCCButton).toHaveCount(0)
  })

  test('should allow name owner to revoke permissions', async ({
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
    })

    const subname = `test.${name}`

    const permissionsPage = makePageObject('PermissionsPage')
    await permissionsPage.goto(subname)

    await login.connect()

    const childPermissions: any[] = [
      'CANNOT_UNWRAP',
      'CANNOT_CREATE_SUBDOMAIN',
      'CANNOT_TRANSFER',
      'CANNOT_SET_RESOLVER',
      'CANNOT_APPROVE',
      'CANNOT_SET_TTL',
    ]

    await expect(permissionsPage.arePermissionsUnburned(childPermissions)).toBeTruthy()
    await permissionsPage.burnChildPermissions(childPermissions, subname)
    const transactionModal = makePageObject('TransactionModal')
    await transactionModal.autoComplete()

    await expect(permissionsPage.arePermissionsBurned(childPermissions)).toBeTruthy()
    await expect(permissionsPage.getBurnChildPermissionsButton).toHaveCount(0)
  })

  test('should allow name owner to revoke change fuses', async ({
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
            child: {
              named: ['CANNOT_UNWRAP'],
            },
          },
        },
      ],
    })

    const subname = `test.${name}`

    const permissionsPage = makePageObject('PermissionsPage')
    await permissionsPage.goto(subname)

    await login.connect()

    await expect(permissionsPage.isPermissionUnburned('CANNOT_BURN_FUSES')).toBeTruthy()

    await permissionsPage.burnCannotBurnFuses(subname)
    const transactionModal = makePageObject('TransactionModal')
    await transactionModal.autoComplete()

    await expect(permissionsPage.isPermissionBurned('CANNOT_BURN_FUSES')).toBeTruthy()
    await expect(permissionsPage.getBurnCannotBurnFusesButton).toHaveCount(0)
  })

  test('should show correct buttons for managing an emancipated subname (Parent owner settings)', async ({
    login,
    makeName,
    makePageObject,
  }) => {
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
          owner: 'user2',
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

    const subname = `test.${name}`

    const profilePage = makePageObject('ProfilePage')
    await profilePage.goto(subname)

    await login.connect()

    await expect(profilePage.deleteSubnameButton).toHaveCount(0)

    const subnamesPage = makePageObject('SubnamesPage')
    await subnamesPage.goto(subname)
    await expect(subnamesPage.getAddSubnameButton).toHaveCount(0)

    const morePage = makePageObject('MorePage')
    await morePage.goto(subname)
    await expect(morePage.getSendNameButton).toHaveCount(0)
    await expect(morePage.editResolverButton).toHaveCount(0)
  })

  test('should show correct buttons for managing an emancipated subname (Name owner settings)', async ({
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
            child: {
              named: ['CANNOT_UNWRAP'],
            },
          },
        },
      ],
    })

    const subname = `test.${name}`

    const profilePage = makePageObject('ProfilePage')
    const subnamesPage = makePageObject('SubnamesPage')
    const morePage = makePageObject('MorePage')

    await profilePage.goto(subname)
    await login.connect()

    await expect(profilePage.deleteSubnameButton).toBeVisible()

    await subnamesPage.goto(subname)
    await expect(subnamesPage.getAddSubnameButton).toBeVisible()

    await morePage.goto(subname)
    await expect(morePage.editResolverButton).toBeVisible()
  })
})
