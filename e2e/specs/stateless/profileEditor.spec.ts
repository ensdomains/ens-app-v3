/* eslint-disable no-restricted-syntax */

import { expect } from '@playwright/test'
import dotenv from 'dotenv'
import { Address } from 'viem'

import { encodeAbi, RecordOptions } from '@ensdomains/ensjs/utils'

import { test } from '../../../playwright'
import { createAccounts } from '../../../playwright/fixtures/accounts'
import { testClient } from '../../../playwright/fixtures/contracts/utils/addTestContracts'
import { generateRecords } from '../../../playwright/fixtures/makeName/generators/generateRecords'
import { emptyAddress } from '../../../src/utils/constants'

dotenv.config({ path: '.env.local' })

const oldResolver = testClient.chain.contracts.legacyPublicResolver.address
const newResolver = testClient.chain.contracts.publicResolver.address
const ownedResolverAddress =
  JSON.parse(process.env.NEXT_PUBLIC_DEPLOYMENT_ADDRESSES || '{}')?.OwnedResolver || ''
const invalidResolverAddress =
  JSON.parse(process.env.NEXT_PUBLIC_DEPLOYMENT_ADDRESSES || '{}')?.NameWrapper || ''
const noMulticallResolverAddress =
  JSON.parse(process.env.NEXT_PUBLIC_DEPLOYMENT_ADDRESSES || '{}')?.NoMulticallResolverAddress || ''
const oldestResolverAddress =
  JSON.parse(process.env.NEXT_PUBLIC_DEPLOYMENT_ADDRESSES || '{}')?.OldesResolver || ''
const noTextResolverAddress =
  JSON.parse(process.env.NEXT_PUBLIC_DEPLOYMENT_ADDRESSES || '{}')?.NoTextResolver || ''

const dummyABI = {
  test: 'test',
}

const DEFAULT_RECORDS: RecordOptions = {
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
    {
      coin: 'eth',
      value: createAccounts().getAddress('user'),
    },
  ],
  contentHash: 'ipfs://bafybeico3uuyj3vphxpvbowchdwjlrlrh62awxscrnii7w7flu5z6fk77y',
  abi: undefined,
}

const makeRecords = async (overwrites: RecordOptions = {}): Promise<RecordOptions> => {
  const texts = [...DEFAULT_RECORDS.texts!, ...(overwrites.texts || [])].reduce<
    RecordOptions['texts']
  >((acc, curr) => {
    if (acc!.find(({ key }) => key === curr.key))
      return acc!.map((record) => (record.key === curr.key ? curr : record))
    return [...acc!, curr]
  }, [])
  const coins = [...DEFAULT_RECORDS.coins!, ...(overwrites.coins || [])].reduce<
    RecordOptions['coins']
  >((acc, curr) => {
    if (acc!.find(({ coin }) => coin === curr.coin))
      return acc!.map((record) => (record.coin === curr.coin ? curr : record))
    return [...acc!, curr]
  }, [])
  const contentHash = overwrites.contentHash || DEFAULT_RECORDS.contentHash
  const abi = overwrites.abi || (await encodeAbi({ encodeAs: 'json', data: dummyABI }))
  return {
    texts,
    coins,
    contentHash,
    abi,
  }
}

test.describe('profile', () => {
  test('should display profile records', async ({ login, makeName, makePageObject }) => {
    const name = await makeName({
      label: 'profile',
      type: 'legacy',
      records: await makeRecords(),
    })

    const profilePage = makePageObject('ProfilePage')

    await profilePage.goto(name)
    await login.connect()

    await expect(profilePage.record('text', 'description')).toHaveText('Hello2')
    await expect(profilePage.record('text', 'url')).toHaveText('twitter.com')
    await expect(profilePage.record('address', 'btc')).toHaveText('bc1qj...pwa6n')
    await expect(profilePage.record('address', 'etcLegacy')).toHaveText('etcLegacy0x3C4...293BC')
    await expect(profilePage.record('text', 'email')).toHaveText('fakeemail@fake.com')
    await expect(profilePage.contentHash()).toContainText('ipfs://bafybeic...')
  })

  test('should redirect to profile tab if tab specified in query string does not exist', async ({
    page,
    login,
    makeName,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'profile',
      type: 'legacy',
      records: await makeRecords(),
    })

    const profilePage = makePageObject('ProfilePage')

    await profilePage.goto(name)
    await login.connect()

    await page.goto(`/${name}?tab=customTab`)

    await expect(page).toHaveURL(`/${name}`)

    await expect(profilePage.record('text', 'description')).toHaveText('Hello2')
    await expect(profilePage.record('text', 'url')).toHaveText('twitter.com')
    await expect(profilePage.record('address', 'btc')).toHaveText('bc1qj...pwa6n')
    await expect(profilePage.record('address', 'etcLegacy')).toHaveText('etcLegacy0x3C4...293BC')
    await expect(profilePage.record('text', 'email')).toHaveText('fakeemail@fake.com')
    await expect(profilePage.contentHash()).toContainText('ipfs://bafybeic...')
  })
})

test.describe('migrations', () => {
  test('should force a name on the old registry to go to update registry', async ({
    page,
    login,
    makePageObject,
  }) => {
    await page.goto('/legacy.test')

    await login.connect('user2')

    const profilePage = makePageObject('ProfilePage')
    await profilePage.editProfileButton.click()

    await page.pause()
    await expect(page.getByText('Registry out of date')).toBeVisible()
    await expect(page.getByTestId('warning-overlay-next-button')).toHaveAttribute(
      'href',
      `https://legacy.ens.domains/name/legacy.test`,
    )
  })

  test('should force a name without a resolver to update their resolver', async ({
    page,
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
    await page.pause()
    await expect(profilePage.profileEditor.locator('text=No resolver set')).toBeVisible()

    await profilePage.profileEditor.getByTestId('warning-overlay-next-button').click()
    await transactionModal.autoComplete()

    await morePage.goto(subname)

    await morePage.resolver.click()
    await expect(morePage.resolver.getByText(newResolver)).toBeVisible()
  })

  test('should force a name with an unauthorised resolver to update their resolver', async ({
    login,
    page,
    makeName,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'unwrapped',
      type: 'legacy',
      owner: 'user2',
      resolver: ownedResolverAddress as Address,
      records: await makeRecords(),
    })

    const morePage = makePageObject('MorePage')
    const profilePage = makePageObject('ProfilePage')
    const transactionModal = makePageObject('TransactionModal')

    await morePage.goto(name)
    await login.connect('user2')

    await expect(morePage.resolver.getByText(ownedResolverAddress)).toBeVisible()

    await profilePage.goto(name)
    await profilePage.editProfileButton.click()
    await page.pause()
    await expect(profilePage.profileEditor.getByText('Unauthorised resolver')).toBeVisible()
    await profilePage.profileEditor.getByTestId('warning-overlay-next-button').click()

    await transactionModal.autoComplete()

    await morePage.goto(name)
    await expect(morePage.resolver.getByText(newResolver)).toBeVisible()
  })

  test('should force a name with an invalid resolver to update their resolver', async ({
    login,
    page,
    makeName,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'unwrapped',
      type: 'legacy',
      owner: 'user',
      resolver: invalidResolverAddress as Address,
      records: await makeRecords(),
    })

    const morePage = makePageObject('MorePage')
    const profilePage = makePageObject('ProfilePage')
    const transactionModal = makePageObject('TransactionModal')

    await morePage.goto(name)
    await login.connect()

    await expect(morePage.resolver.getByText(invalidResolverAddress)).toBeVisible()

    await profilePage.goto(name)
    await profilePage.editProfileButton.click()
    await page.pause()
    await expect(profilePage.profileEditor.getByText('Unauthorised resolver')).toBeVisible()
    await profilePage.profileEditor.getByTestId('warning-overlay-next-button').click()

    await transactionModal.autoComplete()

    await morePage.goto(name)
    await expect(morePage.resolver.getByText(newResolver)).toBeVisible()
  })

  test('should force a wrapped name with a resolver that is not name wrapper aware to migrate update their resolver', async ({
    login,
    page,
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
    await page.pause()

    await expect(profilePage.profileEditor.getByText('Resolver incompatible')).toBeVisible()
    await profilePage.profileEditor.getByTestId('warning-overlay-next-button').click()

    await transactionModal.autoComplete()

    await morePage.goto(name)
    await expect(morePage.resolver).toHaveText(newResolver)
  })

  test('should be able to update to latest resolver when profile has been migrated on current and latest resolver', async ({
    page,
    login,
    accounts,
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
    await generateRecords({ accounts })({
      name,
      owner: 'user',
      resolver: newResolver,
      records: await makeRecords(),
    })

    const morePage = makePageObject('MorePage')
    const recordsPage = makePageObject('RecordsPage')
    const profilePage = makePageObject('ProfilePage')
    const transactionModal = makePageObject('TransactionModal')

    await morePage.goto(name)
    await login.connect()

    await expect(morePage.resolver.getByText(oldResolver)).toBeVisible()

    await profilePage.goto(name)
    await profilePage.editProfileButton.click()
    await profilePage.profileEditor.getByTestId('warning-overlay-next-button').click()
    await expect(
      profilePage.profileEditor.getByText(
        'You can keep your current profile on the new resolver, or reset it and remove all profile records.',
      ),
    ).toBeVisible()
    await expect(page.getByTestId('detailed-switch').getByRole('checkbox')).toBeChecked()
    await profilePage.profileEditor.getByTestId('warning-overlay-next-button').click()

    await transactionModal.autoComplete()

    await morePage.goto(name)
    await expect(morePage.resolver.getByText(newResolver)).toBeVisible()

    await recordsPage.goto(name)

    await expect(recordsPage.getRecordValue('text', 'email')).toHaveText('fakeemail@fake.com')
    await expect(recordsPage.getRecordValue('text', 'description')).toHaveText('Hello2')
    await expect(recordsPage.getRecordValue('text', 'url')).toHaveText('https://twitter.com')
    await expect(recordsPage.getRecordValue('address', 'eth')).toHaveText(
      '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    )
    await expect(recordsPage.getRecordValue('address', 'btc')).toHaveText(
      'bc1qjqg9slurvjukfl92wp58y94480fvh4uc2pwa6n',
    )
    await expect(recordsPage.getRecordValue('address', 'etcLegacy')).toHaveText(
      '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
    )
    await expect(recordsPage.getRecordValue('contentHash')).toHaveText(
      'ipfs://bafybeico3uuyj3vphxpvbowchdwjlrlrh62awxscrnii7w7flu5z6fk77y',
    )
    await expect(recordsPage.getRecordValue('abi')).toHaveText('{"test":"test"}')
  })

  test('should be able to reset the latest resolver when profile has been migrated on current and latest resolver', async ({
    page,
    login,
    accounts,
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
    await generateRecords({ accounts })({
      name,
      owner: 'user',
      resolver: newResolver,
      records: await makeRecords(),
    })

    const morePage = makePageObject('MorePage')
    const recordsPage = makePageObject('RecordsPage')
    const profilePage = makePageObject('ProfilePage')
    const transactionModal = makePageObject('TransactionModal')

    await morePage.goto(name)
    await login.connect()

    await expect(morePage.resolver.getByText(oldResolver)).toBeVisible()

    await profilePage.goto(name)
    await profilePage.editProfileButton.click()
    await profilePage.profileEditor.getByTestId('warning-overlay-next-button').click()
    await expect(
      profilePage.profileEditor.getByText(
        'You can keep your current profile on the new resolver, or reset it and remove all profile records.',
      ),
    ).toBeVisible()
    await page.getByTestId('detailed-switch').getByRole('checkbox').uncheck()
    await expect(page.getByTestId('detailed-switch').getByRole('checkbox')).not.toBeChecked()
    await profilePage.profileEditor.getByTestId('warning-overlay-next-button').click()

    await expect(profilePage.profileEditor.getByText('Reset profile')).toBeVisible()
    await profilePage.profileEditor.getByTestId('warning-overlay-next-button').click()

    await transactionModal.autoComplete()

    await morePage.goto(name)
    await expect(morePage.resolver.getByText(newResolver)).toBeVisible()

    await recordsPage.goto(name)

    await expect(page.getByTestId('text-amount')).toHaveText('0 Records')
    await expect(page.getByTestId('address-amount')).toHaveText('0 Records')
    await expect(page.getByText('No Content Hash')).toBeVisible()
    await expect(page.getByText('No ABI')).toBeVisible()
  })

  test('should be able to choose to migrate to the latest profile when the current and latest resolver are not in sync', async ({
    page,
    login,
    accounts,
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
    await generateRecords({ accounts })({
      name,
      owner: 'user',
      resolver: newResolver,
      records: await makeRecords({
        texts: [{ key: 'description', value: 'New profile' }],
        coins: [{ coin: 'eth', value: createAccounts().getAddress('user2') }],
        contentHash: 'bzz://d1de9994b4d039f6548d191eb26786769f580809256b4685ef316805265ea162',
        abi: await encodeAbi({ encodeAs: 'cbor', data: { test2: 'test2' } }),
      }),
    })

    const morePage = makePageObject('MorePage')
    const recordsPage = makePageObject('RecordsPage')
    const profilePage = makePageObject('ProfilePage')
    const transactionModal = makePageObject('TransactionModal')

    await morePage.goto(name)
    await login.connect()

    await expect(morePage.resolver.getByText(oldResolver)).toBeVisible()

    await profilePage.goto(name)
    await profilePage.editProfileButton.click()
    await expect(page.getByText('Resolver out of sync')).toBeVisible()
    await profilePage.profileEditor.getByTestId('warning-overlay-next-button').click()

    await expect(page.getByTestId('migrate-profile-selector-latest')).toBeChecked()
    await profilePage.profileEditor.getByTestId('warning-overlay-next-button').click()

    await transactionModal.autoComplete()

    await morePage.goto(name)
    await expect(morePage.resolver.getByText(newResolver)).toBeVisible()

    await recordsPage.goto(name)

    await expect(recordsPage.getRecordValue('text', 'email')).toHaveText('fakeemail@fake.com')
    await expect(recordsPage.getRecordValue('text', 'description')).toHaveText('New profile')
    await expect(recordsPage.getRecordValue('text', 'url')).toHaveText('https://twitter.com')
    await expect(recordsPage.getRecordValue('address', 'eth')).toHaveText(
      createAccounts().getAddress('user2'),
    )
    await expect(recordsPage.getRecordValue('address', 'btc')).toHaveText(
      'bc1qjqg9slurvjukfl92wp58y94480fvh4uc2pwa6n',
    )
    await expect(recordsPage.getRecordValue('address', 'etcLegacy')).toHaveText(
      '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
    )
    await expect(recordsPage.getRecordValue('contentHash')).toHaveText(
      'bzz://d1de9994b4d039f6548d191eb26786769f580809256b4685ef316805265ea162',
    )
    await expect(recordsPage.getRecordValue('abi')).toHaveText('{"test2":"test2"}')
  })

  test('should be able migrate the current profile when the current and latest resolver are not in sync', async ({
    page,
    login,
    accounts,
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
    await generateRecords({ accounts })({
      name,
      owner: 'user',
      resolver: newResolver,
      records: await makeRecords({
        texts: [{ key: 'description', value: 'New profile' }],
        coins: [{ coin: 'eth', value: createAccounts().getAddress('user2') }],
        contentHash: 'bzz://d1de9994b4d039f6548d191eb26786769f580809256b4685ef316805265ea162',
        abi: await encodeAbi({ encodeAs: 'cbor', data: { test2: 'test2' } }),
      }),
    })

    const morePage = makePageObject('MorePage')
    const recordsPage = makePageObject('RecordsPage')
    const profilePage = makePageObject('ProfilePage')
    const transactionModal = makePageObject('TransactionModal')

    await morePage.goto(name)
    await login.connect()

    await expect(morePage.resolver.getByText(oldResolver)).toBeVisible()

    await profilePage.goto(name)
    await profilePage.editProfileButton.click()
    await expect(page.getByText('Resolver out of sync')).toBeVisible()
    await profilePage.profileEditor.getByTestId('warning-overlay-next-button').click()

    await page.getByTestId('migrate-profile-selector-current').check()
    await expect(page.getByTestId('migrate-profile-selector-current')).toBeChecked()
    await profilePage.profileEditor.getByTestId('warning-overlay-next-button').click()

    await expect(page.getByText('Migrate profile')).toBeVisible()
    await profilePage.profileEditor.getByTestId('warning-overlay-next-button').click()

    await transactionModal.autoComplete()

    await morePage.goto(name)
    await expect(morePage.resolver.getByText(newResolver)).toBeVisible()

    await recordsPage.goto(name)

    await expect(page.getByTestId('text-amount')).toHaveText('3 Records')
    await expect(recordsPage.getRecordValue('text', 'email')).toHaveText('fakeemail@fake.com')
    await expect(recordsPage.getRecordValue('text', 'description')).toHaveText('Hello2')
    await expect(recordsPage.getRecordValue('text', 'url')).toHaveText('https://twitter.com')
    await expect(page.getByTestId('address-amount')).toHaveText('3 Records')
    await expect(recordsPage.getRecordValue('address', 'eth')).toHaveText(
      createAccounts().getAddress('user'),
    )
    await expect(recordsPage.getRecordValue('address', 'btc')).toHaveText(
      'bc1qjqg9slurvjukfl92wp58y94480fvh4uc2pwa6n',
    )
    await expect(recordsPage.getRecordValue('address', 'etcLegacy')).toHaveText(
      '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
    )
    await expect(recordsPage.getRecordValue('contentHash')).toHaveText(DEFAULT_RECORDS.contentHash!)
    await expect(recordsPage.getRecordValue('abi')).toHaveText('{"test":"test"}')
  })

  test('should be able to reset the profile when the current and latest resolver are not in sync', async ({
    page,
    login,
    accounts,
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
    await generateRecords({ accounts })({
      name,
      owner: 'user',
      resolver: newResolver,
      records: await makeRecords({
        texts: [{ key: 'description', value: 'New profile' }],
        coins: [{ coin: 'eth', value: createAccounts().getAddress('user2') }],
        contentHash: 'bzz://d1de9994b4d039f6548d191eb26786769f580809256b4685ef316805265ea162',
        abi: await encodeAbi({ encodeAs: 'cbor', data: { test2: 'test2' } }),
      }),
    })

    const morePage = makePageObject('MorePage')
    const recordsPage = makePageObject('RecordsPage')
    const profilePage = makePageObject('ProfilePage')
    const transactionModal = makePageObject('TransactionModal')

    await morePage.goto(name)
    await login.connect()

    await expect(morePage.resolver.getByText(oldResolver)).toBeVisible()

    await profilePage.goto(name)
    await profilePage.editProfileButton.click()
    await expect(page.getByText('Resolver out of sync')).toBeVisible()
    await profilePage.profileEditor.getByTestId('warning-overlay-next-button').click()

    await page.getByTestId('migrate-profile-selector-reset').check()
    await expect(page.getByTestId('migrate-profile-selector-reset')).toBeChecked()
    await profilePage.profileEditor.getByTestId('warning-overlay-next-button').click()

    await expect(page.getByText('Reset profile')).toBeVisible()
    await profilePage.profileEditor.getByTestId('warning-overlay-next-button').click()

    await transactionModal.autoComplete()

    await morePage.goto(name)
    await expect(morePage.resolver.getByText(newResolver)).toBeVisible()

    await recordsPage.goto(name)

    await expect(page.getByTestId('text-amount')).toHaveText('0 Records')
    await expect(page.getByTestId('address-amount')).toHaveText('0 Records')
    await expect(page.getByText('No Content Hash')).toBeVisible()
    await expect(page.getByText('No ABI')).toBeVisible()
  })

  test('old resolver', async ({ page, login, accounts, makeName, makePageObject }) => {
    const name = await makeName({
      label: 'unwrapped',
      type: 'legacy',
      owner: 'user',
      resolver: noTextResolverAddress,
      records: await makeRecords(),
    })

    // Add records to latest resolver
    await generateRecords({ accounts })({
      name,
      owner: 'user',
      resolver: newResolver,
      records: await makeRecords({
        texts: [{ key: 'description', value: 'New profile' }],
        coins: [{ coin: 'eth', value: createAccounts().getAddress('user2') }],
        contentHash: 'bzz://d1de9994b4d039f6548d191eb26786769f580809256b4685ef316805265ea162',
        abi: await encodeAbi({ encodeAs: 'cbor', data: { test2: 'test2' } }),
      }),
    })

    const morePage = makePageObject('MorePage')
    const recordsPage = makePageObject('RecordsPage')
    const profilePage = makePageObject('ProfilePage')
    const transactionModal = makePageObject('TransactionModal')

    await morePage.goto(name)
    await login.connect()

    // await expect(morePage.resolver.getByText(oldResolver)).toBeVisible()

    await profilePage.goto(name)
    await profilePage.editProfileButton.click()
    await page.pause()

    await expect(page.getByText('Resolver out of sync')).toBeVisible()
    await profilePage.profileEditor.getByTestId('warning-overlay-next-button').click()

    await page.getByTestId('migrate-profile-selector-reset').check()
    await expect(page.getByTestId('migrate-profile-selector-reset')).toBeChecked()
    await profilePage.profileEditor.getByTestId('warning-overlay-next-button').click()

    await expect(page.getByText('Reset profile')).toBeVisible()
    await profilePage.profileEditor.getByTestId('warning-overlay-next-button').click()

    await transactionModal.autoComplete()

    await morePage.goto(name)
    await expect(morePage.resolver.getByText(newResolver)).toBeVisible()

    await recordsPage.goto(name)

    await expect(page.getByTestId('text-amount')).toHaveText('0 Records')
    await expect(page.getByTestId('address-amount')).toHaveText('0 Records')
    await expect(page.getByText('No Content Hash')).toBeVisible()
    await expect(page.getByText('No ABI')).toBeVisible()
  })
})

test.describe('unwrapped', () => {
  test('should be able to add/update profile records without migration', async ({
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
    const recordsPage = makePageObject('RecordsPage')
    const transactionModal = makePageObject('TransactionModal')

    await morePage.goto(name)
    await login.connect()

    await expect(morePage.resolver.getByText(oldResolver)).toBeVisible()

    await profilePage.goto(name)
    await expect(profilePage.record('text', 'description')).toHaveText('Hello2')
    await expect(profilePage.record('text', 'url')).toHaveText('twitter.com')
    await expect(profilePage.record('address', 'eth')).toHaveText('0xf39...92266')
    await expect(profilePage.record('address', 'btc')).toHaveText('bc1qj...pwa6n')
    await expect(profilePage.record('address', 'etcLegacy')).toHaveText('etcLegacy0x3C4...293BC')
    await expect(profilePage.record('text', 'email')).toHaveText('fakeemail@fake.com')

    await profilePage.editProfileButton.click()

    await profilePage.profileEditor.getByTestId('warning-overlay-skip-button').click()

    // Update records
    await profilePage.profileEditorInput('eth').fill(createAccounts().getAddress('user2'))
    await profilePage.profileEditorInput('description').fill('new name')

    // Add records
    await profilePage.profileEditorAddInputs(['location', 'bnb'])
    await profilePage.profileEditorInput('location').fill('L1 chain')
    await profilePage.profileEditorInput('bnb').fill('bnb1g5p04snezgpky203fq6da9qyjsy2k9kzr5yuhl')

    await profilePage.profileEditor.getByTestId('profile-submit-button').click()

    await transactionModal.autoComplete()

    await morePage.goto(name)
    await expect(morePage.resolver).toHaveText(oldResolver)

    await recordsPage.goto(name)
    await expect(recordsPage.getRecordValue('text', 'location')).toHaveText('L1 chain')
    await expect(recordsPage.getRecordValue('text', 'description')).toHaveText('new name')
    await expect(recordsPage.getRecordValue('text', 'url')).toHaveText('https://twitter.com')
    await expect(recordsPage.getRecordValue('address', 'eth')).toHaveText(
      createAccounts().getAddress('user2'),
    )
    await expect(recordsPage.getRecordValue('address', 'bnb')).toHaveText(
      'bnb1g5p04snezgpky203fq6da9qyjsy2k9kzr5yuhl',
    )
    await expect(recordsPage.getRecordValue('text', 'email')).toHaveText('fakeemail@fake.com')
  })

  test('should be able to delete profile records without migration', async ({
    page,
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
    const recordsPage = makePageObject('RecordsPage')
    const transactionModal = makePageObject('TransactionModal')

    await morePage.goto(name)
    await login.connect()

    await expect(morePage.resolver.getByText(oldResolver)).toBeVisible()

    await profilePage.goto(name)
    await expect(profilePage.record('text', 'description')).toHaveText('Hello2')
    await expect(profilePage.record('text', 'url')).toHaveText('twitter.com')
    await expect(profilePage.record('address', 'eth')).toHaveText('0xf39...92266')
    await expect(profilePage.record('address', 'btc')).toHaveText('bc1qj...pwa6n')
    await expect(profilePage.record('address', 'etcLegacy')).toHaveText('etcLegacy0x3C4...293BC')
    await expect(profilePage.record('text', 'email')).toHaveText('fakeemail@fake.com')

    await profilePage.editProfileButton.click()

    await profilePage.profileEditor.getByTestId('warning-overlay-skip-button').click()

    // Delete records
    await profilePage.profileEditorClearButton('description').click()
    await profilePage.profileEditorClearButton('url').click()
    await profilePage.profileEditorClearButton('email').click()
    await profilePage.profileEditorInput('eth').fill('')
    await expect(await profilePage.profileEditorInput('eth')).toHaveAttribute(
      'placeholder',
      '0xb8c2C2...',
    )
    await profilePage.profileEditorClearButton('eth').click()
    await profilePage.profileEditorInput('btc').fill('')
    await expect(await profilePage.profileEditorInput('btc')).toHaveAttribute(
      'placeholder',
      '3FZbgi29...',
    )
    await profilePage.profileEditorClearButton('btc').click()
    await profilePage.profileEditorInput('etcLegacy').fill('')
    await expect(await profilePage.profileEditorInput('etcLegacy')).toHaveAttribute(
      'placeholder',
      'Add address here',
    )
    await profilePage.profileEditorClearButton('etcLegacy').click()
    await profilePage.profileEditorClearButton('ipfs').click()
    await profilePage.profileEditorClearButton('abi').click()

    await profilePage.profileEditor.getByTestId('profile-submit-button').click()

    await transactionModal.autoComplete()

    await morePage.goto(name)
    await expect(morePage.resolver).toHaveText(oldResolver)

    await recordsPage.goto(name)
    await expect(page.getByTestId('text-amount')).toHaveText('0 Records')
    await expect(page.getByTestId('address-amount')).toHaveText('0 Records')
    await expect(page.getByText('No Content Hash')).toBeVisible()
    await expect(page.getByText('No ABI')).toBeVisible()
  })
})

test.describe('wrapped', () => {
  test('should be able to add/update profile records without migration', async ({
    login,
    makeName,
    makePageObject,
  }) => {
    test.slow()
    const name = await makeName({
      label: 'wrapped',
      type: 'wrapped',
      records: await makeRecords(),
    })

    const profilePage = makePageObject('ProfilePage')
    const recordsPage = makePageObject('RecordsPage')
    const transactionModal = makePageObject('TransactionModal')

    await profilePage.goto(name)
    await login.connect()

    await expect(profilePage.record('text', 'description')).toHaveText('Hello2')
    await expect(profilePage.record('text', 'url')).toHaveText('twitter.com')
    await expect(profilePage.record('address', 'eth')).toHaveText('0xf39...92266')
    await expect(profilePage.record('address', 'btc')).toHaveText('bc1qj...pwa6n')
    await expect(profilePage.record('address', 'etcLegacy')).toHaveText('etcLegacy0x3C4...293BC')
    await expect(profilePage.record('text', 'email')).toHaveText('fakeemail@fake.com')

    await profilePage.editProfileButton.click()

    // Update records
    await profilePage.profileEditorInput('eth').fill(createAccounts().getAddress('user2'))
    await profilePage.profileEditorInput('description').fill('new name')

    // Add records
    await profilePage.profileEditorAddInputs(['location', 'bnb'])
    await profilePage.profileEditorInput('location').fill('L1 chain')
    await profilePage.profileEditorInput('bnb').fill('bnb1g5p04snezgpky203fq6da9qyjsy2k9kzr5yuhl')

    await profilePage.profileEditor.getByTestId('profile-submit-button').click()

    await transactionModal.autoComplete()

    await recordsPage.goto(name)
    await expect(recordsPage.getRecordValue('text', 'location')).toHaveText('L1 chain')
    await expect(recordsPage.getRecordValue('text', 'description')).toHaveText('new name')
    await expect(recordsPage.getRecordValue('text', 'url')).toHaveText('https://twitter.com')
    await expect(recordsPage.getRecordValue('address', 'eth')).toHaveText(
      createAccounts().getAddress('user2'),
    )
    await expect(recordsPage.getRecordValue('address', 'bnb')).toHaveText(
      'bnb1g5p04snezgpky203fq6da9qyjsy2k9kzr5yuhl',
    )
    await expect(recordsPage.getRecordValue('text', 'email')).toHaveText('fakeemail@fake.com')
  })

  test('should be able to delete profile records without migration', async ({
    page,
    login,
    makeName,
    makePageObject,
  }) => {
    test.slow()
    const name = await makeName({
      label: 'wrapped',
      type: 'wrapped',
      records: await makeRecords(),
    })

    const profilePage = makePageObject('ProfilePage')
    const recordsPage = makePageObject('RecordsPage')
    const transactionModal = makePageObject('TransactionModal')

    await profilePage.goto(name)
    await login.connect()

    await expect(profilePage.record('text', 'description')).toHaveText('Hello2')
    await expect(profilePage.record('text', 'url')).toHaveText('twitter.com')
    await expect(profilePage.record('address', 'eth')).toHaveText('0xf39...92266')
    await expect(profilePage.record('address', 'btc')).toHaveText('bc1qj...pwa6n')
    await expect(profilePage.record('address', 'etcLegacy')).toHaveText('etcLegacy0x3C4...293BC')
    await expect(profilePage.record('text', 'email')).toHaveText('fakeemail@fake.com')

    await profilePage.editProfileButton.click()

    // Delete records
    await profilePage.profileEditorClearButton('description').click()
    await profilePage.profileEditorClearButton('url').click()
    await profilePage.profileEditorClearButton('email').click()
    await profilePage.profileEditorInput('eth').fill('')
    await expect(await profilePage.profileEditorInput('eth')).toHaveAttribute(
      'placeholder',
      '0xb8c2C2...',
    )
    await profilePage.profileEditorClearButton('eth').click()
    await profilePage.profileEditorInput('btc').fill('')
    await expect(await profilePage.profileEditorInput('btc')).toHaveAttribute(
      'placeholder',
      '3FZbgi29...',
    )
    await profilePage.profileEditorClearButton('btc').click()
    await profilePage.profileEditorInput('etcLegacy').fill('')
    await expect(await profilePage.profileEditorInput('etcLegacy')).toHaveAttribute(
      'placeholder',
      'Add address here',
    )
    await profilePage.profileEditorClearButton('etcLegacy').click()
    await profilePage.profileEditorClearButton('ipfs').click()
    await profilePage.profileEditorClearButton('abi').click()

    await profilePage.profileEditor.getByTestId('profile-submit-button').click()

    await transactionModal.autoComplete()

    await recordsPage.goto(name)
    await expect(page.getByTestId('text-amount')).toHaveText('0 Records')
    await expect(page.getByTestId('address-amount')).toHaveText('0 Records')
    await expect(page.getByText('No Content Hash')).toBeVisible()
    await expect(page.getByText('No ABI')).toBeVisible()
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
    await page.getByTestId('subgraph-network-error').check()

    await profilePage.goto(name)
    await expect(page.getByTestId('disabled-profile-action-Edit profile')).toBeVisible()

    await page.goto('/my/settings')
    await page.getByTestId('subgraph-network-error').uncheck()
  })
})

test('Should show edit profile button if user is manager', async ({
  login,
  makeName,
  makePageObject,
}) => {
  const name = await makeName({
    label: 'unwrapped',
    type: 'legacy',
    owner: 'user2',
    manager: 'user',
  })

  const profilePage = makePageObject('ProfilePage')

  await profilePage.goto(name)
  await login.connect()

  await expect(profilePage.editProfileButton).toBeVisible()
})

test('Should show disabled edit profile button if user is owner but not manager', async ({
  page,
  login,
  makeName,
  makePageObject,
}) => {
  const name = await makeName({
    label: 'unwrapped',
    type: 'legacy',
    owner: 'user',
    manager: 'user2',
  })

  const profilePage = makePageObject('ProfilePage')

  await profilePage.goto(name)
  await login.connect()

  await expect(page.getByTestId('disabled-profile-action-Edit profile')).toBeVisible()
})

test('Should show disabled edit profile button if name is wrapped but use for edit resolver is burned and resolver is unauthorised', async ({
  page,
  login,
  makeName,
  makePageObject,
}) => {
  const name = await makeName({
    label: 'wrapped',
    type: 'wrapped',
    owner: 'user',
  })

  const UNAUTHORISED_RESOLVER = '0xd7a4F6473f32aC2Af804B3686AE8F1932bC35750'
  const profilePage = makePageObject('ProfilePage')
  const morePage = makePageObject('MorePage')
  const permissionsPage = makePageObject('PermissionsPage')
  const transactionModal = makePageObject('TransactionModal')

  await profilePage.goto(name)
  await login.connect()

  // Set resolver to unauthorized resolver
  await morePage.goto(name)
  await morePage.editResolverButton.click()
  await page.getByTestId('custom-resolver-radio').check()
  await page.getByTestId('dogfood').fill(UNAUTHORISED_RESOLVER)
  await page.getByTestId('update-button').click()
  await transactionModal.autoComplete()

  // Burn CSR fuse
  await permissionsPage.goto(name)
  await permissionsPage.burnChildPermissions(['CANNOT_UNWRAP', 'CANNOT_SET_RESOLVER'], name)
  await transactionModal.autoComplete()

  // Validate that the edit profile button is disabled
  await profilePage.goto(name)

  await expect(page.getByTestId('disabled-profile-action-Edit profile')).toBeVisible()
})
