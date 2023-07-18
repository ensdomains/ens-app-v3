import { expect } from '@playwright/test'
import { generateRecords } from 'playwright/fixtures/nameGenerator/generators/generateRecords'

import { emptyAddress } from '@app/utils/constants'

import { test } from '..'

const oldResolver = '0x84eA74d481Ee0A5332c457a4d796187F6Ba67fEB'
const newResolver = '0x0E801D84Fa97b50751Dbf25036d067dCf18858bF'
// This not an actual resovler but a dummy address that has been inserted to the second to last known resolver
// to test the situation where unwrapped do not show a warning when editing profile.
const dummyRersolver = '0xd7a4F6473f32aC2Af804B3686AE8F1932bC35750'

const DEFAULT_RECORDS = {
  texts: [
    {
      key: 'description',
      value: 'Hello2',
    },
    {
      key: 'url',
      value: 'https://twitter.com',
    },
    {
      key: 'email',
      value: 'fakeemail@fake.com',
    },
  ],
  coinTypes: [
    {
      key: 'BTC',
      value: 'bc1qjqg9slurvjukfl92wp58y94480fvh4uc2pwa6n',
    },
    {
      key: '61',
      value: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
    },
  ],
}

test.describe('unwrapped', () => {
  test.describe('migration', () => {
    test('should force a name on the old registry to go to update registry', async ({
      page,
      accounts,
      wallet,
      login,
      ProfilePage,
    }) => {
      await page.goto('/legacy.test')

      await login.connect('user2')
      await page.pause()

      const profilePage = new ProfilePage(page)
      await profilePage.editProfileButton.click()

      await expect(page.locator('text=Registry out of date')).toBeVisible()
      await expect(page.getByTestId('profile-editor')).toHaveCount(0)
    })

    test('should force a name without a resolver to update their resolver', async ({
      page,
      wallet,
      accounts,
      nameGenerator,
      login,
      ProfilePage,
      TransactionModal,
      MorePage,
    }) => {
      const name = await nameGenerator({
        label: 'unwrapped',
        type: 'legacy',
        owner: 'user',
        resolver: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
        subnames: [
          {
            label: 'test',
            owner: 'user',
            resolver: emptyAddress,
          },
        ],
      })
      const subname = `test.${name}`

      const profilePage = new ProfilePage(page)
      await profilePage.goto(subname)

      await login.connect()

      await profilePage.editProfileButton.click()
      await expect(profilePage.profileEditor.locator('text=No resolver set')).toBeVisible()

      await profilePage.profileEditor.getByTestId('warning-overlay-next-button').click()
      const transactionModal = new TransactionModal(page, wallet)
      await transactionModal.autoComplete()

      const morePage = new MorePage(page)
      await morePage.goto(subname)

      await morePage.resolver.click()
      expect(morePage.resolver.getByText(newResolver)).toBeVisible()
    })

    test('should check if a name has been migrated, but whose resolver has not been migrated', async ({
      page,
      wallet,
      accounts,
      nameGenerator,
      provider,
      login,
      ProfilePage,
      TransactionModal,
      MorePage,
    }) => {
      const name = await nameGenerator({
        label: 'unwrapped',
        type: 'legacy',
        owner: 'user',
        resolver: oldResolver,
        records: DEFAULT_RECORDS,
      })

      console.log('here')
      // Migrate to
      await generateRecords(
        { name, owner: 'user', resolver: newResolver, records: DEFAULT_RECORDS },
        { provider, accounts },
      )

      const morePage = new MorePage(page)
      await morePage.goto(name)
      expect(morePage.resolver.getByText(oldResolver)).toBeVisible()

      await login.connect()

      const profilePage = new ProfilePage(page)
      await profilePage.goto(name)

      await profilePage.editProfileButton.click()
      await profilePage.profileEditor.getByTestId('warning-overlay-next-button').click()
      await expect(
        profilePage.profileEditor.getByText('Profile records on new resolver'),
      ).toBeVisible()

      await profilePage.profileEditor.getByTestId('warning-overlay-next-button').click()
      const transactionModal = new TransactionModal(page, wallet)
      await transactionModal.autoComplete()

      await morePage.goto(name)

      await morePage.resolver.click()
      expect(morePage.resolver.getByText(newResolver)).toBeVisible()
    })

    test('should be able to migrate unwrapped to new resolver', async ({
      page,
      wallet,
      accounts,
      nameGenerator,
      login,
      ProfilePage,
      TransactionModal,
      MorePage,
    }) => {
      const name = await nameGenerator({
        label: 'unwrapped',
        type: 'legacy',
        owner: 'user',
        resolver: oldResolver,
        records: DEFAULT_RECORDS,
      })

      const morePage = new MorePage(page)
      await morePage.goto(name)
      await expect(morePage.resolver.getByText(oldResolver)).toBeVisible()

      await login.connect()

      const profilePage = new ProfilePage(page)
      await profilePage.goto(name)

      await expect(profilePage.record('text', 'description')).toHaveText('Hello2')
      await expect(profilePage.record('text', 'url')).toHaveText('twitter.com')
      await expect(profilePage.record('address', 'eth')).toHaveText('0xf39...92266')
      await expect(profilePage.record('address', 'btc')).toHaveText('bc1qj...pwa6n')
      await expect(profilePage.record('address', 'ETC_LEGACY')).toHaveText(
        'ETC_LEGACY0x3C4...293BC',
      )
      await expect(profilePage.record('text', 'email')).toHaveText('emailfakeemail@fake....')

      await profilePage.editProfileButton.click()
      await profilePage.profileEditor.getByTestId('warning-overlay-next-button').click()
      await expect(profilePage.profileEditor.getByText('Transfer current profile')).toBeVisible()

      await profilePage.profileEditor.getByTestId('warning-overlay-next-button').click()
      // await page.pause()
      const transactionModal = new TransactionModal(page, wallet)
      await transactionModal.autoComplete()

      await morePage.goto(name)
      await expect(morePage.resolver.getByText(newResolver)).toBeVisible()

      await profilePage.goto(name)
      await expect(profilePage.record('text', 'description')).toHaveText('Hello2')
      await expect(profilePage.record('text', 'url')).toHaveText('twitter.com')
      await expect(profilePage.record('address', 'eth')).toHaveText('0xf39...92266')
      await expect(profilePage.record('address', 'btc')).toHaveText('bc1qj...pwa6n')
      await expect(profilePage.record('address', 'ETC_LEGACY')).toHaveText(
        'ETC_LEGACY0x3C4...293BC',
      )
      await expect(profilePage.record('text', 'email')).toHaveText('emailfakeemail@fake....')
    })
  })

  test.describe('update', () => {
    test('should be able to update profile without migration', async ({
      nameGenerator,
      wallet,
      accounts,
      login,
      MorePage,
      ProfilePage,
      TransactionModal,
      page,
    }) => {
      const name = await nameGenerator({
        label: 'unwrapped',
        type: 'legacy',
        resolver: oldResolver,
        records: DEFAULT_RECORDS,
      })
      const morePage = new MorePage(page)
      await morePage.goto(name)
      await expect(morePage.resolver.getByText(oldResolver)).toBeVisible()

      await login.connect()

      const profilePage = new ProfilePage(page)
      await profilePage.goto(name)

      await expect(profilePage.record('text', 'description')).toHaveText('Hello2')
      await expect(profilePage.record('text', 'url')).toHaveText('twitter.com')
      await expect(profilePage.record('address', 'eth')).toHaveText('0xf39...92266')
      await expect(profilePage.record('address', 'btc')).toHaveText('bc1qj...pwa6n')
      await expect(profilePage.record('address', 'ETC_LEGACY')).toHaveText(
        'ETC_LEGACY0x3C4...293BC',
      )
      await expect(profilePage.record('text', 'email')).toHaveText('emailfakeemail@fake....')

      await profilePage.editProfileButton.click()

      await profilePage.profileEditor.getByTestId('warning-overlay-skip-button').click()

      await profilePage.profileEditorAddInputs(['com.twitter'])

      await profilePage.profileEditorInput('ETH').fill('0x70997970C51812dc3A010C7d01b50e0d17dc79C8')
      await profilePage.profileEditorInput('description').fill('new name')
      await profilePage.profileEditorInput('com.twitter').fill('ensdomains')
      await profilePage.profileEditor.getByTestId('profile-submit-button').click()

      const transactionModal = new TransactionModal(page, wallet)
      await transactionModal.autoComplete()

      await morePage.goto(name)
      await expect(morePage.resolver).toHaveText(oldResolver)

      await profilePage.goto(name)
      await expect(profilePage.record('text', 'com.twitter')).toHaveText('@ensdomains')
      await expect(profilePage.record('text', 'description')).toHaveText('new name')
      await expect(profilePage.record('text', 'url')).toHaveText('twitter.com')
      await expect(profilePage.record('address', 'eth')).toHaveText('0x709...c79C8')
      await expect(profilePage.record('address', 'btc')).toHaveText('bc1qj...pwa6n')
      await expect(profilePage.record('address', 'ETC_LEGACY')).toHaveText(
        'ETC_LEGACY0x3C4...293BC',
      )
      await expect(profilePage.record('text', 'email')).toHaveText('emailfakeemail@fake....')
    })
  })
})

test.describe('wrapped', () => {
  test.describe('migration', () => {
    test('should be able to migrate wrapped name to new resolver', async ({
      page,
      nameGenerator,
      wallet,
      accounts,
      MorePage,
      ProfilePage,
      TransactionModal,
      login,
    }) => {
      const name = await nameGenerator({
        label: 'wrapped',
        type: 'wrapped',
        resolver: oldResolver,
      })

      const morePage = new MorePage(page)
      await morePage.goto(name)

      await login.connect()

      await expect(morePage.resolver).toHaveText(oldResolver)

      const profilePage = new ProfilePage(page)
      await profilePage.goto(name)
      await profilePage.editProfileButton.click()

      await expect(profilePage.profileEditor.getByText('Resolver incompatible')).toBeVisible()
      await profilePage.profileEditor.getByTestId('warning-overlay-next-button').click()

      const transactionModal = new TransactionModal(page, wallet)
      await transactionModal.autoComplete()

      await morePage.goto(name)
      await expect(morePage.resolver).toHaveText(newResolver)
    })
  })

  test.describe('update', () => {
    test('should be able to update account', async ({
      page,
      wallet,
      nameGenerator,
      login,
      ProfilePage,
      TransactionModal,
    }) => {
      const name = await nameGenerator({
        label: 'wrapped',
        type: 'wrapped',
        owner: 'user',
      })

      const profilePage = new ProfilePage(page)
      await profilePage.goto(name)

      await login.connect()

      await profilePage.editProfileButton.click()

      await profilePage.profileEditorAddInputs(['name', 'abi'])
      await profilePage.profileEditorInput('name').fill('Test Name')
      await profilePage.profileEditorInput('abi').fill('[{"test":"test"}]')
      await profilePage.profileEditor.getByTestId('profile-submit-button').click()

      const transactionModal = new TransactionModal(page, wallet)
      await transactionModal.autoComplete()

      await page.pause()

      await expect(profilePage.record('text', 'nickname')).toHaveText('Test Name')
      await page.getByTestId('records-tab').click()

      await expect(page.getByTestId('name-details-text')).toHaveText('[{"test":"test"}]')
    })
  })
})

test.describe('resolver status', () => {
  test('should not show warning when editing unwrapped name with second to last resolver', async ({
    page,
    login,
    nameGenerator,
    ProfilePage,
    MorePage,
  }) => {
    const name = await nameGenerator({
      label: 'unwrapped',
      type: 'legacy',
      resolver: dummyRersolver,
    })

    const morePage = new MorePage(page)
    await morePage.goto(name)

    await page.pause()
  })
})
