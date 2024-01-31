import { expect } from '@playwright/test'
import { test } from '../../../playwright'
import { createAccounts } from '../../../playwright/fixtures/accounts'
import { generateRecords } from '../../../playwright/fixtures/makeName/generators/generateRecords'
import { testClient } from '../../../playwright/fixtures/contracts/utils/addTestContracts'

import { emptyAddress } from '../../../src/utils/constants'
import { encodeAbi } from '@ensdomains/ensjs/utils'

const oldResolver = testClient.chain.contracts.legacyPublicResolver.address
const newResolver = testClient.chain.contracts.publicResolver.address

const dummyABI = 
  {
    "test":"test"
  }

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
  coins: [
    {
      coin: 'BTC',
      value: 'bc1qjqg9slurvjukfl92wp58y94480fvh4uc2pwa6n',
    },
    {
      coin: '61',
      value: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
    },
  ],
  contentHash: 'ipfs://bafybeico3uuyj3vphxpvbowchdwjlrlrh62awxscrnii7w7flu5z6fk77y',
}

const makeRecords = async () => {
  return {
    ...DEFAULT_RECORDS,
    abi: await encodeAbi({ encodeAs: 'json', data: dummyABI }),
  }
}

test.describe('profile', () => {
  test('should display profile records', async ({ page, login, makeName, makePageObject }) => {
    const name = await makeName({
      label: 'profile',
      type: 'legacy',
      records: await makeRecords(),
    })

    const profilePage = makePageObject('ProfilePage')

    await profilePage.goto(name)
    await login.connect()
    
    await page.pause()
    await expect(profilePage.record('text', 'description')).toHaveText('Hello2')
    await expect(profilePage.record('text', 'url')).toHaveText('twitter.com')
    await expect(profilePage.record('address', 'btc')).toHaveText('bc1qj...pwa6n')
    await expect(profilePage.record('address', 'etcLegacy')).toHaveText(
      'etcLegacy0x3C4...293BC',
    )
    await expect(profilePage.record('text', 'email')).toHaveText('fakeemail@fake.com')
    await expect(profilePage.contentHash()).toContainText('ipfs://bafybeic...')
  })
})

test.describe('unwrapped', () => {
  test.describe('migration', () => {
    test('should force a name on the old registry to go to update registry', async ({
      page,
      login,
      makePageObject,
    }) => {
      await page.goto('/legacy.test')

      await login.connect('user2')

      const profilePage = makePageObject('ProfilePage')
      await profilePage.editProfileButton.click()

      await expect(page.getByText('Registry out of date')).toBeVisible()
      await expect(page.getByTestId('warning-overlay-next-button')).toHaveAttribute(
        'href',
        `https://legacy.ens.domains/name/legacy.test`,
      )
    })

    test('should force a name without a resolver to update their resolver', async ({
      login,
      makeName,
      makePageObject,
    }) => {
      const name = await makeName({
        label: 'unwrapped',
        type: 'legacy',
        owner: 'user',
        // resolver: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
        subnames: [
          {
            label: 'test',
            owner: 'user',
            resolver: emptyAddress,
          },
        ],
      })
      const subname = `test.${name}`

      const profilePage = makePageObject('ProfilePage')
      const transactionModal = makePageObject('TransactionModal')
      const morePage = makePageObject('MorePage')

      await profilePage.goto(subname)
      await login.connect()

      await profilePage.editProfileButton.click()
      await expect(profilePage.profileEditor.locator('text=No resolver set')).toBeVisible()

      await profilePage.profileEditor.getByTestId('warning-overlay-next-button').click()
      await transactionModal.autoComplete()

      await morePage.goto(subname)

      await morePage.resolver.click()
      await expect(morePage.resolver.getByText(newResolver)).toBeVisible()
    })

    test('should check if a name has been migrated, but whose resolver has not been migrated', async ({
      login,
      contracts,
      makeName,
      makePageObject,
    }) => {
      const name = await makeName({
        label: 'unwrapped',
        type: 'legacy',
        owner: 'user',
        resolver: oldResolver,
        records: await makeRecords(),
      })

      // Add records to latest resolver
      await generateRecords({ contracts })({
        name,
        owner: 'user',
        resolver: newResolver,
        records: await makeRecords(),
      })

      const morePage = makePageObject('MorePage')
      const profilePage = makePageObject('ProfilePage')
      const transactionModal = makePageObject('TransactionModal')

      await morePage.goto(name)
      await login.connect()

      await expect(morePage.resolver.getByText(oldResolver)).toBeVisible()

      await profilePage.goto(name)
      await profilePage.editProfileButton.click()
      await profilePage.profileEditor.getByTestId('warning-overlay-next-button').click()
      await expect(
        profilePage.profileEditor.getByText('Profile records on new resolver'),
      ).toBeVisible()
      await profilePage.profileEditor.getByTestId('warning-overlay-next-button').click()

      await transactionModal.autoComplete()

      await morePage.goto(name)
      await expect(morePage.resolver.getByText(newResolver)).toBeVisible()
    })

    test('should be able to migrate unwrapped to new resolver', async ({
      page,
      makeName,
      login,
      makePageObject,
    }) => {
      test.slow()
      const name = await makeName({
        label: 'unwrapped',
        type: 'legacy',
        resolver: oldResolver,
        records: await makeRecords(),
      })

      const profilePage = makePageObject('ProfilePage')
      const morePage = makePageObject('MorePage')
      const transactionModal = makePageObject('TransactionModal')

      await morePage.goto(name)
      await login.connect()
      await page.pause()
      await expect(morePage.resolver.getByText(oldResolver)).toBeVisible()

      await profilePage.goto(name)
      await expect(profilePage.record('text', 'description')).toHaveText('Hello2')
      await expect(profilePage.record('text', 'url')).toHaveText('twitter.com')
      await expect(profilePage.record('address', 'eth')).toHaveText('0xf39...92266')
      await expect(profilePage.record('address', 'btc')).toHaveText('bc1qj...pwa6n')
      await expect(profilePage.record('address', 'etcLegacy')).toHaveText(
        'etcLegacy0x3C4...293BC',
      )
      await expect(profilePage.record('text', 'email')).toHaveText('fakeemail@fake.com')
      await expect(profilePage.contentHash()).toContainText('ipfs://bafybeic...')

      await profilePage.editProfileButton.click()
      await profilePage.profileEditor.getByTestId('warning-overlay-next-button').click()
      await expect(profilePage.profileEditor.getByText('Transfer current profile')).toBeVisible()

      await profilePage.profileEditor.getByTestId('warning-overlay-next-button').click()
      await transactionModal.autoComplete()

      await morePage.goto(name)
      await expect(morePage.resolver.getByText(newResolver)).toBeVisible()

      await profilePage.goto(name)
      await expect(profilePage.record('text', 'description')).toHaveText('Hello2')
      await expect(profilePage.record('text', 'url')).toHaveText('twitter.com')
      await expect(profilePage.record('address', 'eth')).toHaveText('0xf39...92266')
      await expect(profilePage.record('address', 'btc')).toHaveText('bc1qj...pwa6n')
      await expect(profilePage.record('address', 'etcLegacy')).toHaveText(
        'etcLegacy0x3C4...293BC',
      )
      await expect(profilePage.record('text', 'email')).toHaveText('fakeemail@fake.com')
    })
  })

  test.describe('update', () => {
    test('should be able to update profile without migration', async ({
      login,
      makeName,
      makePageObject,
    }) => {
      test.slow()
      const name = await makeName({
        label: 'unwrapped',
        type: 'legacy',
        resolver: oldResolver,
        records: await makeRecords(),
      })

      const morePage = makePageObject('MorePage')
      const profilePage = makePageObject('ProfilePage')
      const transactionModal = makePageObject('TransactionModal')

      await morePage.goto(name)
      await login.connect()

      await expect(morePage.resolver.getByText(oldResolver)).toBeVisible()

      await profilePage.goto(name)
      await expect(profilePage.record('text', 'description')).toHaveText('Hello2')
      await expect(profilePage.record('text', 'url')).toHaveText('twitter.com')
      await expect(profilePage.record('address', 'eth')).toHaveText('0xf39...92266')
      await expect(profilePage.record('address', 'btc')).toHaveText('bc1qj...pwa6n')
      await expect(profilePage.record('address', 'etcLegacy')).toHaveText(
        'etcLegacy0x3C4...293BC',
      )
      await expect(profilePage.record('text', 'email')).toHaveText('fakeemail@fake.com')

      await profilePage.editProfileButton.click()

      await profilePage.profileEditor.getByTestId('warning-overlay-skip-button').click()

      await profilePage.profileEditorAddInputs(['com.twitter'])

      await profilePage.profileEditorInput('eth').fill('0x70997970C51812dc3A010C7d01b50e0d17dc79C8')
      await profilePage.profileEditorInput('description').fill('new name')
      await profilePage.profileEditorInput('com.twitter').fill('ensdomains')
      await profilePage.profileEditor.getByTestId('profile-submit-button').click()

      await transactionModal.autoComplete()

      await morePage.goto(name)
      await expect(morePage.resolver).toHaveText(oldResolver)

      await profilePage.goto(name)
      await expect(profilePage.record('text', 'com.twitter')).toHaveText('@ensdomains')
      await expect(profilePage.record('text', 'description')).toHaveText('new name')
      await expect(profilePage.record('text', 'url')).toHaveText('twitter.com')
      await expect(profilePage.record('address', 'eth')).toHaveText('0x709...c79C8')
      await expect(profilePage.record('address', 'btc')).toHaveText('bc1qj...pwa6n')
      await expect(profilePage.record('address', 'etcLegacy')).toHaveText(
        'etcLegacy0x3C4...293BC',
      )
      await expect(profilePage.record('text', 'email')).toHaveText('fakeemail@fake.com')
    })
  })
})

test.describe('wrapped', () => {
  test.describe('migration', () => {
    test('should be able to migrate wrapped name to new resolver', async ({
      login,
      makeName,
      makePageObject,
    }) => {
      const name = await makeName({
        label: 'wrapped',
        type: 'wrapped',
        resolver: oldResolver,
      })

      const morePage = makePageObject('MorePage')
      const profilePage = makePageObject('ProfilePage')
      const transactionModal = makePageObject('TransactionModal')

      await morePage.goto(name)
      await login.connect()

      await expect(morePage.resolver).toHaveText(oldResolver)

      await profilePage.goto(name)
      await profilePage.editProfileButton.click()

      await expect(profilePage.profileEditor.getByText('Resolver incompatible')).toBeVisible()
      await profilePage.profileEditor.getByTestId('warning-overlay-next-button').click()

      await transactionModal.autoComplete()

      await morePage.goto(name)
      await expect(morePage.resolver).toHaveText(newResolver)
    })
  })

  test.describe('update', () => {
    test('should be able to update account', async ({ page, login, makeName, makePageObject }) => {
      const name = await makeName({
        label: 'wrapped',
        type: 'wrapped',
        owner: 'user',
      })

      const profilePage = makePageObject('ProfilePage')
      const transactionModal = makePageObject('TransactionModal')

      await profilePage.goto(name)
      await login.connect()

      await profilePage.editProfileButton.click()

      await profilePage.profileEditorAddInputs(['name', 'abi'])
      await profilePage.profileEditorInput('name').fill('Test Name')
      await profilePage.profileEditorInput('abi').fill('[{"test":"test"}]')
      await profilePage.profileEditor.getByTestId('profile-submit-button').click()

      await transactionModal.autoComplete()

      await expect(profilePage.record('text', 'nickname')).toHaveText('Test Name')
      await page.getByTestId('records-tab').click()

      await expect(page.getByTestId('name-details-abi')).toHaveText('[{"test":"test"}]')
    })
  })
})

test.describe('subgraph errors', () => {
  test('should disable edit profile button when there is a subgraph error', async ({
    page,
    makeName,
    makePageObject,
    login,
  }) => {
    const name = await makeName({
      label: 'unwrapped',
      type: 'legacy',
    })

    const profilePage = makePageObject('ProfilePage')

    await profilePage.goto(name)
    await login.connect()

    await expect(profilePage.editProfileButton).toBeVisible()

    await page.goto('/my/settings')
    await page.getByTestId('subgraph-network-error').click()

    await profilePage.goto(name)
    await expect(page.getByTestId('disabled-profile-action-Edit profile')).toBeVisible()
  })
})
