import { expect } from '@playwright/test'

import { test } from '..'

test.describe('Permissions', () => {
  test('should show parent not locked warning', async ({
    page,
    wallet,
    nameGenerator,
    Login,
    PermissionsPage,
  }) => {
    const name = await nameGenerator({
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

    const permissionsPage = new PermissionsPage(page)
    await permissionsPage.goto(subname)

    const login = new Login(page, wallet)
    await login.connect()

    await page.getByTestId('banner-parent-not-locked').click()

    await expect(page).toHaveURL(`/${name}?tab=permissions`)
  })

  test('should allow owner to revoke permissions', async ({
    page,
    wallet,
    nameGenerator,
    Login,
    MorePage,
    SubnamesPage,
    PermissionsPage,
    TransactionModal,
  }) => {
    const name = await nameGenerator({
      label: 'wrapped',
      type: 'wrapped',
      owner: 'user',
    })

    const subnamesPage = new SubnamesPage(page)
    await subnamesPage.goto(name)
    const login = new Login(page, wallet)
    await login.connect()
    await expect(subnamesPage.getAddSubnameButton).toBeVisible()

    const morePage = new MorePage(page)
    await morePage.goto(name)
    await expect(morePage.getSendNameButton).toBeVisible()
    await expect(morePage.getEditResolverButton).toBeVisible()

    const permissionsPage = new PermissionsPage(page)
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

    await permissionsPage.burnChildPermissions([
      'CANNOT_UNWRAP',
      'CANNOT_CREATE_SUBDOMAIN',
      'CANNOT_TRANSFER',
      'CANNOT_SET_RESOLVER',
      'CANNOT_SET_TTL',
      'CANNOT_APPROVE',
    ])
    const transactionModal = new TransactionModal(page, wallet)
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

    await morePage.goto(name)
    await expect(morePage.getDisabledSendNameButton).toBeVisible()
    await expect(morePage.getDisabledEditResolverButton).toBeVisible()
  })

  test('should show correct buttons for managing subname (Parent owner settings)', async ({
    page,
    wallet,
    nameGenerator,
    Login,
    MorePage,
    ProfilePage,
    SubnamesPage,
  }) => {
    const name = await nameGenerator({
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

    const profilePage = new ProfilePage(page)
    await profilePage.goto(subname)

    const login = new Login(page, wallet)
    await login.connect()

    await expect(profilePage.getDeleteSubnameButton).toBeVisible()

    const subnamesPage = new SubnamesPage(page)
    await subnamesPage.goto(subname)
    await expect(subnamesPage.getAddSubnameButton).toHaveCount(0)

    const morePage = new MorePage(page)
    await morePage.goto(subname)
    await expect(morePage.getSendNameButton).toBeVisible()
    await expect(morePage.getEditResolverButton).toHaveCount(0)
  })

  test('should show correct buttons for managing subname (Name owner settings)', async ({
    page,
    wallet,
    nameGenerator,
    Login,
    MorePage,
    ProfilePage,
    SubnamesPage,
  }) => {
    const name = await nameGenerator({
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

    const profilePage = new ProfilePage(page)
    await profilePage.goto(subname)

    const login = new Login(page, wallet)
    await login.connect()

    await expect(profilePage.getDeleteSubnameButton).toBeVisible()

    const subnamesPage = new SubnamesPage(page)
    await subnamesPage.goto(subname)
    await expect(subnamesPage.getAddSubnameButton).toBeVisible()

    const morePage = new MorePage(page)
    await morePage.goto(subname)
    await expect(morePage.getSendNameButton).toBeVisible()
    await expect(morePage.getEditResolverButton).toBeVisible()
  })

  test('should allow parent owner to extend expiry', async ({
    page,
    wallet,
    nameGenerator,
    Login,
    PermissionsPage,
    TransactionModal,
  }) => {
    const name = await nameGenerator({
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

    const permissionsPage = new PermissionsPage(page)
    await permissionsPage.goto(subname)

    const login = new Login(page, wallet)
    await login.connect()

    await page.pause()
    await expect(permissionsPage.isPermissionUnburned('CAN_EXTEND_EXPIRY')).toBeTruthy()

    await permissionsPage.burnExtendExpiry()
    const transactionModal = new TransactionModal(page, wallet)
    await transactionModal.autoComplete()

    await expect(permissionsPage.isPermissionBurned('CAN_EXTEND_EXPIRY')).toBeTruthy()
    await expect(permissionsPage.getBurnExtendExpiryButton).toHaveCount(0)
  })

  test('should allow parent owner to burn pcc', async ({
    page,
    wallet,
    nameGenerator,
    Login,
    PermissionsPage,
    TransactionModal,
  }) => {
    const name = await nameGenerator({
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

    const permissionsPage = new PermissionsPage(page)
    await permissionsPage.goto(subname)

    const login = new Login(page, wallet)
    await login.connect()

    await expect(permissionsPage.isPermissionUnburned('PARENT_CANNOT_CONTROL')).toBeTruthy()

    await permissionsPage.burnPCC(['CANNOT_UNWRAP'])
    const transactionModal = new TransactionModal(page, wallet)
    await transactionModal.autoComplete()

    await expect(
      permissionsPage.arePermissionsBurned(['PARENT_CANNOT_CONTROL', 'CANNOT_UNWRAP']),
    ).toBeTruthy()
    await expect(permissionsPage.getBurnPCCButton).toHaveCount(0)
  })

  test('should allow name owner to revoke permissions', async ({
    page,
    wallet,
    nameGenerator,
    Login,
    PermissionsPage,
    TransactionModal,
  }) => {
    const name = await nameGenerator({
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
              named: [],
            },
          },
        },
      ],
    })

    const subname = `test.${name}`

    const permissionsPage = new PermissionsPage(page)
    await permissionsPage.goto(subname)

    const login = new Login(page, wallet)
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

    await permissionsPage.burnChildPermissions(childPermissions)
    const transactionModal = new TransactionModal(page, wallet)
    await transactionModal.autoComplete()

    await expect(permissionsPage.arePermissionsBurned(childPermissions)).toBeTruthy()
    await expect(permissionsPage.getBurnChildPermissionsButton).toHaveCount(0)
  })

  test('should allow name owner to revoke change fuses', async ({
    page,
    wallet,
    nameGenerator,
    Login,
    PermissionsPage,
    TransactionModal,
  }) => {
    const name = await nameGenerator({
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

    const permissionsPage = new PermissionsPage(page)
    await permissionsPage.goto(subname)

    const login = new Login(page, wallet)
    await login.connect()

    await expect(permissionsPage.isPermissionUnburned('CANNOT_BURN_FUSES')).toBeTruthy()

    await permissionsPage.burnCannotBurnFuses()
    const transactionModal = new TransactionModal(page, wallet)
    await transactionModal.autoComplete()

    await expect(permissionsPage.isPermissionBurned('CANNOT_BURN_FUSES')).toBeTruthy()
    await expect(permissionsPage.getBurnCannotBurnFusesButton).toHaveCount(0)
  })

  test('should show correct buttons for managing an emancipated subname (Parent owner settings)', async ({
    page,
    wallet,
    nameGenerator,
    Login,
    ProfilePage,
    SubnamesPage,
    MorePage,
  }) => {
    const name = await nameGenerator({
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

    const profilePage = new ProfilePage(page)
    await profilePage.goto(subname)

    const login = new Login(page, wallet)
    await login.connect()

    await expect(profilePage.getDeleteSubnameButton).toHaveCount(0)

    const subnamesPage = new SubnamesPage(page)
    await subnamesPage.goto(subname)
    await expect(subnamesPage.getAddSubnameButton).toHaveCount(0)

    const morePage = new MorePage(page)
    await morePage.goto(subname)
    await expect(morePage.getSendNameButton).toHaveCount(0)
    await expect(morePage.getEditResolverButton).toHaveCount(0)
  })

  test('should show correct buttons for managing an emancipated subname (Name owner settings)', async ({
    page,
    wallet,
    nameGenerator,
    Login,
    ProfilePage,
    SubnamesPage,
    MorePage,
  }) => {
    const name = await nameGenerator({
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

    const profilePage = new ProfilePage(page)
    await profilePage.goto(subname)

    const login = new Login(page, wallet)
    await login.connect()

    await expect(profilePage.getDeleteSubnameButton).toBeVisible()

    const subnamesPage = new SubnamesPage(page)
    await subnamesPage.goto(subname)
    await expect(subnamesPage.getAddSubnameButton).toBeVisible()

    const morePage = new MorePage(page)
    await morePage.goto(subname)
    await expect(morePage.getSendNameButton).toBeVisible()
    await expect(morePage.getEditResolverButton).toBeVisible()
  })
})
