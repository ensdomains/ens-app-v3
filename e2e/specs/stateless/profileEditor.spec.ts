/* eslint-disable no-restricted-syntax */

import { expect, type Page } from '@playwright/test'
import dotenv from 'dotenv'
import { type Address } from 'viem'

import { encodeAbi, RecordOptions } from '@ensdomains/ensjs/utils'
import { wrapName } from '@ensdomains/ensjs/wallet'

import { test } from '../../../playwright'
import { createAccounts } from '../../../playwright/fixtures/accounts'
import {
  testClient,
  waitForTransaction,
  walletClient,
} from '../../../playwright/fixtures/contracts/utils/addTestContracts'
import { generateRecords } from '../../../playwright/fixtures/makeName/generators/generateRecords'
import { emptyAddress } from '../../../src/utils/constants'

dotenv.config({ path: '.env.local' })

const legacyResolver = testClient.chain.contracts.legacyPublicResolver.address
const latestResolver = testClient.chain.contracts.ensPublicResolver.address

const contractAddresses = JSON.parse(process.env.NEXT_PUBLIC_DEPLOYMENT_ADDRESSES || '{}')
const ownedResolverAddress = contractAddresses.OwnedResolver || ''
const invalidResolverAddress = contractAddresses.NameWrapper || ''
const outdatedResolver = contractAddresses.OutdatedResolver || ''
const customLegacyResolver = contractAddresses.CustomLegacyResolver || ''
const customOutdatedResolver = contractAddresses.CustomOutdatedResolver || ''
const customNameWrapperAwareResolver = contractAddresses.CustomNameWrapperAwareResolver || ''

const dummyABI = {
  test: 'test',
}

// A 1x1 transparent PNG. The manual avatar/header inputs now run an async
// image-validity check (FET-2440), so fixtures must be URLs that actually load
// as an image; a data URL does so deterministically without a network request.
const VALID_IMAGE_DATA_URL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='

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

test.describe('timezone', () => {
  // Pin the viewer's zone so the rendered offset is deterministic and DST-free:
  // Asia/Kolkata is +05:30 year-round and Asia/Tokyo is +09:00, so the profile
  // (Tokyo) always reads as +03:30 ahead of the viewer (Kolkata).
  test.use({ timezoneId: 'Asia/Kolkata' })

  test('should add, save, display and clear a timezone record via the picker', async ({
    login,
    makeName,
    makePageObject,
  }) => {
    test.slow()
    const name = await makeName({
      label: 'timezone',
      type: 'legacy',
      resolver: legacyResolver,
    })

    const profilePage = makePageObject('ProfilePage')
    const recordsPage = makePageObject('RecordsPage')
    const transactionModal = makePageObject('TransactionModal')

    await profilePage.goto(name)
    await login.connect()

    await profilePage.editProfileButton.click()

    await test.step('selects a timezone from the searchable picker', async () => {
      await profilePage.profileEditorAddInputs(['timezone'])
      const picker = profilePage.profileEditor.getByTestId('profile-record-input-timezone')
      await expect(picker).toBeVisible()
      // The picker is a searchable IANA Select, not a free-text input. The search
      // input only mounts once the dropdown is open, so open it before typing.
      await picker.getByTestId('select-container').getByRole('button').click()
      await picker.getByTestId('select-input').fill('Tokyo')
      await profilePage.profileEditor.getByTestId('select-option-Asia/Tokyo').click()
      await profilePage.profileEditor.getByTestId('profile-submit-button').click()
      await transactionModal.autoComplete()
    })

    await test.step('writes a single timezone text record', async () => {
      await recordsPage.goto(name)
      await expect(recordsPage.getRecordValue('text', 'timezone')).toHaveText('Asia/Tokyo')
    })

    await test.step('shows a viewer-relative offset in the profile header', async () => {
      await profilePage.goto(name)
      await expect(profilePage.record('text', 'timezone')).toContainText('Asia/Tokyo (+03:30)')
    })

    await test.step('clearing the timezone deletes the record', async () => {
      await profilePage.editProfileButton.click()
      await profilePage.profileEditorClearButton('timezone').click()
      await profilePage.profileEditor.getByTestId('profile-submit-button').click()
      await transactionModal.autoComplete()

      await recordsPage.goto(name)
      await expect(recordsPage.getRecordButton('text', 'timezone')).toHaveCount(0)
    })
  })
})

test.describe('legacy resolver', () => {
  test('should be able to add/update profile records without migration', async ({
    page,
    login,
    makeName,
    makePageObject,
  }) => {
    test.slow()
    const name = await makeName({
      label: 'unwrapped',
      type: 'legacy',
      resolver: legacyResolver,
      records: await makeRecords(),
    })

    const avatarUrl = VALID_IMAGE_DATA_URL
    const headerUrl = VALID_IMAGE_DATA_URL

    const morePage = makePageObject('MorePage')
    const profilePage = makePageObject('ProfilePage')
    const recordsPage = makePageObject('RecordsPage')
    const transactionModal = makePageObject('TransactionModal')

    await morePage.goto(name)
    await login.connect()

    await expect(morePage.resolver.getByText(legacyResolver)).toBeVisible()

    await profilePage.goto(name)
    await expect(profilePage.record('text', 'description')).toHaveText('Hello2')
    await expect(profilePage.record('text', 'url')).toHaveText('twitter.com')
    await expect(profilePage.record('address', 'eth')).toHaveText('0xf39...92266')
    await expect(profilePage.record('address', 'btc')).toHaveText('bc1qj...pwa6n')
    await expect(profilePage.record('address', 'etcLegacy')).toHaveText('etcLegacy0x3C4...293BC')
    await expect(profilePage.record('text', 'email')).toHaveText('fakeemail@fake.com')

    await profilePage.editProfileButton.click()

    // await profilePage.profileEditor.getByTestId('warning-overlay-skip-button').click()

    // Add avatar
    await page.getByTestId('avatar-button').getByRole('button', { name: 'Add avatar' }).click()
    await page.getByTestId('avatar-button').getByRole('button', { name: 'Enter Manually' }).click()
    await page.getByTestId('avatar-uri-input').fill(avatarUrl)
    await page.getByRole('button', { name: 'Confirm' }).click()
    await expect(page.getByTestId('avatar-uri-display')).toBeVisible({ timeout: 20000 })

    // Add header
    await page.getByTestId('header-button').getByRole('button', { name: 'Add header' }).click()
    await expect(
      page.getByTestId('header-button').getByRole('button', { name: 'Enter Manually' }),
    ).toBeVisible({ timeout: 10000 })
    await page.getByTestId('header-button').getByRole('button', { name: 'Enter Manually' }).click()
    await page.getByTestId('header-manual-input').fill(headerUrl)
    await page.getByRole('button', { name: 'Save' }).click()
    await expect(page.getByTestId('header-uri-display')).toBeVisible({ timeout: 20000 })

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
    await expect(morePage.resolver).toHaveText(legacyResolver)

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
    await expect(recordsPage.getRecordValue('text', 'avatar')).toHaveText(avatarUrl)
    await expect(recordsPage.getRecordValue('text', 'header')).toHaveText(headerUrl)

    await profilePage.goto(name)
    await expect(profilePage.record('text', 'avatar')).toContainText('data:image/png')
    await expect(profilePage.record('text', 'header')).toContainText('data:image/png')
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
      resolver: legacyResolver,
      records: await makeRecords(),
    })

    const morePage = makePageObject('MorePage')
    const profilePage = makePageObject('ProfilePage')
    const recordsPage = makePageObject('RecordsPage')
    const transactionModal = makePageObject('TransactionModal')

    await morePage.goto(name)
    await login.connect()

    await expect(morePage.resolver.getByText(legacyResolver)).toBeVisible()

    await profilePage.goto(name)

    await expect(profilePage.record('text', 'description')).toHaveText('Hello2')
    await expect(profilePage.record('text', 'url')).toHaveText('twitter.com')
    await expect(profilePage.record('address', 'eth')).toHaveText('0xf39...92266')
    await expect(profilePage.record('address', 'btc')).toHaveText('bc1qj...pwa6n')
    await expect(profilePage.record('address', 'etcLegacy')).toHaveText('etcLegacy0x3C4...293BC')
    await expect(profilePage.record('text', 'email')).toHaveText('fakeemail@fake.com')

    await profilePage.editProfileButton.click()

    // await profilePage.profileEditor.getByTestId('warning-overlay-skip-button').click()

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
    await expect(morePage.resolver).toHaveText(legacyResolver)

    await recordsPage.goto(name)
    await expect(page.getByTestId('text-amount')).toHaveText('0 Records')
    await expect(page.getByTestId('address-amount')).toHaveText('0 Records')
    await expect(page.getByText('No Content Hash')).toBeVisible()
    await expect(page.getByText('No ABI')).toBeVisible()
  })
})

test.describe('custom legacy resolver', () => {
  test('should be able to add/update profile records without migration', async ({
    page,
    login,
    makeName,
    makePageObject,
  }) => {
    test.slow()
    const name = await makeName({
      label: 'custom-legacy-resolver',
      type: 'legacy',
      resolver: customLegacyResolver,
      records: await makeRecords(),
    })

    const avatarUrl = VALID_IMAGE_DATA_URL
    const headerUrl = VALID_IMAGE_DATA_URL

    const morePage = makePageObject('MorePage')
    const profilePage = makePageObject('ProfilePage')
    const recordsPage = makePageObject('RecordsPage')
    const transactionModal = makePageObject('TransactionModal')

    await morePage.goto(name)
    await login.connect()

    await expect(morePage.resolver.getByText(customLegacyResolver)).toBeVisible()

    await profilePage.goto(name)
    await expect(profilePage.record('text', 'description')).toHaveText('Hello2')
    await expect(profilePage.record('text', 'url')).toHaveText('twitter.com')
    await expect(profilePage.record('address', 'eth')).toHaveText('0xf39...92266')
    await expect(profilePage.record('address', 'btc')).toHaveText('bc1qj...pwa6n')
    await expect(profilePage.record('address', 'etcLegacy')).toHaveText('etcLegacy0x3C4...293BC')
    await expect(profilePage.record('text', 'email')).toHaveText('fakeemail@fake.com')

    await profilePage.editProfileButton.click()

    // await profilePage.profileEditor.getByTestId('warning-overlay-skip-button').click()

    // Add avatar
    await page.getByTestId('avatar-button').getByRole('button', { name: 'Add avatar' }).click()
    await page.getByTestId('avatar-button').getByRole('button', { name: 'Enter Manually' }).click()
    await page.getByTestId('avatar-uri-input').fill(avatarUrl)
    await page.getByRole('button', { name: 'Confirm' }).click()
    await expect(page.getByTestId('avatar-uri-display')).toBeVisible({ timeout: 20000 })

    // Add header
    await page.getByTestId('header-button').getByRole('button', { name: 'Add header' }).click()
    await expect(
      page.getByTestId('header-button').getByRole('button', { name: 'Enter Manually' }),
    ).toBeVisible({ timeout: 10000 })
    await page.getByTestId('header-button').getByRole('button', { name: 'Enter Manually' }).click()
    await page.getByTestId('header-manual-input').fill(headerUrl)
    await page.getByRole('button', { name: 'Save' }).click()
    await expect(page.getByTestId('header-uri-display')).toBeVisible({ timeout: 20000 })

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
    await expect(morePage.resolver).toHaveText(customLegacyResolver)

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
    await expect(recordsPage.getRecordValue('text', 'avatar')).toHaveText(avatarUrl)
    await expect(recordsPage.getRecordValue('text', 'header')).toHaveText(headerUrl)

    await profilePage.goto(name)
    await expect(profilePage.record('text', 'avatar')).toContainText('data:image/png')
    await expect(profilePage.record('text', 'header')).toContainText('data:image/png')
  })

  test('should be able to delete profile records without migration', async ({
    page,
    login,
    makeName,
    makePageObject,
  }) => {
    test.slow()
    const name = await makeName({
      label: 'custom-legacy-resolver',
      type: 'legacy',
      resolver: customLegacyResolver,
      records: await makeRecords(),
    })

    const morePage = makePageObject('MorePage')
    const profilePage = makePageObject('ProfilePage')
    const recordsPage = makePageObject('RecordsPage')
    const transactionModal = makePageObject('TransactionModal')

    await morePage.goto(name)
    await login.connect()

    await expect(morePage.resolver.getByText(customLegacyResolver)).toBeVisible()

    await profilePage.goto(name)

    await expect(profilePage.record('text', 'description')).toHaveText('Hello2')
    await expect(profilePage.record('text', 'url')).toHaveText('twitter.com')
    await expect(profilePage.record('address', 'eth')).toHaveText('0xf39...92266')
    await expect(profilePage.record('address', 'btc')).toHaveText('bc1qj...pwa6n')
    await expect(profilePage.record('address', 'etcLegacy')).toHaveText('etcLegacy0x3C4...293BC')
    await expect(profilePage.record('text', 'email')).toHaveText('fakeemail@fake.com')

    await profilePage.editProfileButton.click()

    // await profilePage.profileEditor.getByTestId('warning-overlay-skip-button').click()

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
    await expect(morePage.resolver).toHaveText(customLegacyResolver)

    await recordsPage.goto(name)
    await expect(page.getByTestId('text-amount')).toHaveText('0 Records')
    await expect(page.getByTestId('address-amount')).toHaveText('0 Records')
    await expect(page.getByText('No Content Hash')).toBeVisible()
    await expect(page.getByText('No ABI')).toBeVisible()
  })
})

test.describe('namewrapper aware resolver', () => {
  test('should be able to add/update profile records without migration', async ({
    login,
    makeName,
    makePageObject,
  }) => {
    test.slow()
    const name = await makeName({
      label: 'namewrapper-aware-resolver',
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
      label: 'namewrapper-aware-resolver',
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

test.describe('custom namewrapper aware resolver', () => {
  test('should be able to add/update profile records without migration', async ({
    login,
    makeName,
    makePageObject,
  }) => {
    test.slow()
    const name = await makeName({
      label: 'custom-namewrapper-aware-resolver',
      type: 'wrapped',
      records: await makeRecords(),
      resolver: customNameWrapperAwareResolver,
    })

    const profilePage = makePageObject('ProfilePage')
    const recordsPage = makePageObject('RecordsPage')
    const transactionModal = makePageObject('TransactionModal')
    const morePage = makePageObject('MorePage')

    await morePage.goto(name)
    await expect(morePage.resolver.getByText(customNameWrapperAwareResolver)).toBeVisible()

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
      label: 'custom-namewrapper-aware-resolver',
      type: 'wrapped',
      records: await makeRecords(),
      resolver: customNameWrapperAwareResolver,
    })

    const profilePage = makePageObject('ProfilePage')
    const recordsPage = makePageObject('RecordsPage')
    const transactionModal = makePageObject('TransactionModal')
    const morePage = makePageObject('MorePage')

    await morePage.goto(name)
    await expect(morePage.resolver.getByText(customNameWrapperAwareResolver)).toBeVisible()

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

test.describe('outdated resolver', () => {
  test('should force a name with an outdated resolver to upgrade', async ({
    login,
    makeName,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'outdated-resolver',
      type: 'legacy',
      owner: 'user',
      resolver: outdatedResolver,
    })

    const profilePage = makePageObject('ProfilePage')
    const transactionModal = makePageObject('TransactionModal')
    const morePage = makePageObject('MorePage')

    await profilePage.goto(name)
    await login.connect()

    await profilePage.editProfileButton.click()
    await expect(profilePage.profileEditor.locator('text=Resolver out of date')).toBeVisible()

    await profilePage.profileEditor.getByTestId('warning-overlay-next-button').click()
    await transactionModal.autoComplete()

    await morePage.goto(name)

    await morePage.resolver.click()
    await expect(morePage.resolver.getByText(latestResolver)).toBeVisible()
  })

  test('should be able to choose latest resolver if there is a profile on the latest resolver', async ({
    page,
    login,
    makeName,
    accounts,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'outdated-resolver',
      type: 'legacy',
      owner: 'user',
      resolver: outdatedResolver,
      records: await makeRecords(),
    })

    await generateRecords({ accounts })({
      name,
      owner: 'user',
      resolver: latestResolver,
      records: await makeRecords(),
    })

    const profilePage = makePageObject('ProfilePage')
    const transactionModal = makePageObject('TransactionModal')
    const morePage = makePageObject('MorePage')
    const recordsPage = makePageObject('RecordsPage')
    await profilePage.goto(name)
    await login.connect()

    await profilePage.editProfileButton.click()
    await expect(profilePage.profileEditor.locator('text=Resolver out of date')).toBeVisible()
    await profilePage.profileEditor.getByTestId('warning-overlay-next-button').click()

    await test.step('Switch to latest resolver', async () => {
      await expect(page.getByTestId('migrate-profile-selector-latest')).toBeChecked()
      await expect(page.getByTestId('migrate-profile-selector-reset')).toBeVisible()
      await expect(page.getByTestId('migrate-profile-selector-current')).not.toBeVisible()
      await profilePage.profileEditor.getByTestId('warning-overlay-next-button').click()
    })

    await transactionModal.autoComplete()

    await morePage.goto(name)

    await morePage.resolver.click()
    await expect(morePage.resolver.getByText(latestResolver)).toBeVisible()

    await recordsPage.goto(name)
    await expect(recordsPage.getRecordValue('text', 'email')).toHaveText('fakeemail@fake.com')
    await expect(recordsPage.getRecordValue('text', 'url')).toHaveText('https://twitter.com')
    await expect(recordsPage.getRecordValue('text', 'description')).toHaveText('Hello2')
    await expect(recordsPage.getRecordValue('address', 'eth')).toHaveText(
      createAccounts().getAddress('user'),
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

  test('should be able to reset latest resolver on migration', async ({
    page,
    login,
    makeName,
    accounts,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'outdated-resolver',
      type: 'legacy',
      owner: 'user',
      resolver: outdatedResolver,
      records: await makeRecords(),
    })

    await generateRecords({ accounts })({
      name,
      owner: 'user',
      resolver: latestResolver,
      records: await makeRecords(),
    })

    const profilePage = makePageObject('ProfilePage')
    const transactionModal = makePageObject('TransactionModal')
    const morePage = makePageObject('MorePage')
    const recordsPage = makePageObject('RecordsPage')
    await profilePage.goto(name)
    await login.connect()

    await profilePage.editProfileButton.click()
    await expect(profilePage.profileEditor.locator('text=Resolver out of date')).toBeVisible()
    await profilePage.profileEditor.getByTestId('warning-overlay-next-button').click()

    await test.step('Switch to latest resolver', async () => {
      await page.getByTestId('migrate-profile-selector-reset').click()
      await expect(page.getByTestId('migrate-profile-selector-latest')).not.toBeChecked()
      await expect(page.getByTestId('migrate-profile-selector-reset')).toBeChecked()
      await expect(page.getByTestId('migrate-profile-selector-current')).not.toBeVisible()
      await profilePage.profileEditor.getByTestId('warning-overlay-next-button').click()
      await expect(page.getByText('Reset profile')).toBeVisible()
      await page.getByTestId('warning-overlay-next-button').click()
    })

    await transactionModal.autoComplete()

    await morePage.goto(name)

    await morePage.resolver.click()
    await expect(morePage.resolver.getByText(latestResolver)).toBeVisible()

    await recordsPage.goto(name)
    await expect(recordsPage.getRecordButton('text', 'email')).not.toBeVisible()
    await expect(recordsPage.getRecordButton('text', 'url')).not.toBeVisible()
    await expect(recordsPage.getRecordButton('text', 'description')).not.toBeVisible()
    await expect(recordsPage.getRecordButton('address', 'eth')).not.toBeVisible()
    await expect(recordsPage.getRecordButton('address', 'btc')).not.toBeVisible()
    await expect(recordsPage.getRecordButton('address', 'etcLegacy')).not.toBeVisible()
    await expect(recordsPage.getRecordButton('contentHash')).not.toBeVisible()
    await expect(recordsPage.getRecordButton('abi')).not.toBeVisible()
  })
})

test.describe('custom outdated resolver', () => {
  // Manager app will mark this as an authorised resolver because it will fail the isAuthorised check.  Technically a bug since it not accurately descriptive,
  // but low priority since it is a very niche case.
  test('should force a name with an outdated resolver to upgrade', async ({
    login,
    makeName,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'custom-outdated-resolver',
      type: 'legacy',
      owner: 'user',
      resolver: customOutdatedResolver,
    })

    const profilePage = makePageObject('ProfilePage')
    const transactionModal = makePageObject('TransactionModal')
    const morePage = makePageObject('MorePage')

    await profilePage.goto(name)
    await login.connect()

    await profilePage.editProfileButton.click()
    await expect(profilePage.profileEditor.locator('text=Unauthorised resolver')).toBeVisible()

    await profilePage.profileEditor.getByTestId('warning-overlay-next-button').click()
    await transactionModal.autoComplete()

    await morePage.goto(name)

    await morePage.resolver.click()
    await expect(morePage.resolver.getByText(latestResolver)).toBeVisible()
  })
})

test.describe('legacy registryy', () => {
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
})

test.describe('no resolver', () => {
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
    await expect(morePage.resolver.getByText(latestResolver)).toBeVisible()
  })
})

test.describe('unauthorised resolver', () => {
  test('should force a name with an unauthorised resolver to update their resolver', async ({
    login,
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
    await expect(profilePage.profileEditor.getByText('Unauthorised resolver')).toBeVisible()
    await profilePage.profileEditor.getByTestId('warning-overlay-next-button').click()

    await transactionModal.autoComplete()

    await morePage.goto(name)
    await expect(morePage.resolver.getByText(latestResolver)).toBeVisible()
  })
})

test.describe('invalid resolver', () => {
  test('should force a name with an invalid resolver to update their resolver', async ({
    login,
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
    await expect(profilePage.profileEditor.getByText('Unauthorised resolver')).toBeVisible()
    await profilePage.profileEditor.getByTestId('warning-overlay-next-button').click()

    await transactionModal.autoComplete()

    await morePage.goto(name)
    await expect(morePage.resolver.getByText(latestResolver)).toBeVisible()
  })
})

test.describe('wrapped name with legacy resolver', () => {
  test('should force a wrapped name (with no profile) with a resolver that is not name wrapper aware to migrate update their resolver', async ({
    login,
    makeName,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'wrapped',
      type: 'wrapped',
      resolver: legacyResolver,
    })

    const morePage = makePageObject('MorePage')
    const profilePage = makePageObject('ProfilePage')
    const transactionModal = makePageObject('TransactionModal')

    await morePage.goto(name)
    await login.connect()

    await expect(morePage.resolver).toHaveText(legacyResolver)

    await profilePage.goto(name)
    await profilePage.editProfileButton.click()

    await expect(profilePage.profileEditor.getByText('Resolver incompatible')).toBeVisible()
    await profilePage.profileEditor.getByTestId('warning-overlay-next-button').click()

    await transactionModal.autoComplete()

    await morePage.goto(name)
    await expect(morePage.resolver).toHaveText(latestResolver)
  })

  test('should force a wrapped name (with a profile on latest resolver) with a resolver that is not name wrapper aware to migrate update their resolver', async ({
    login,
    page,
    makeName,
    makePageObject,
    accounts,
  }) => {
    const name = await makeName({
      label: 'wrapped',
      type: 'wrapped',
      resolver: legacyResolver,
    })

    // Add records to latest resolver
    await generateRecords({ accounts })({
      name,
      owner: 'user',
      resolver: latestResolver,
      records: await makeRecords(),
    })

    const morePage = makePageObject('MorePage')
    const profilePage = makePageObject('ProfilePage')
    const recordsPage = makePageObject('RecordsPage')
    const transactionModal = makePageObject('TransactionModal')

    await morePage.goto(name)
    await login.connect()

    await expect(morePage.resolver).toHaveText(legacyResolver)

    await profilePage.goto(name)
    await profilePage.editProfileButton.click()

    await expect(profilePage.profileEditor.getByText('Resolver incompatible')).toBeVisible()
    await profilePage.profileEditor.getByTestId('warning-overlay-next-button').click()

    await test.step('Migrate profile', async () => {
      await expect(page.getByTestId('migrate-profile-selector-latest')).toBeChecked()
      await expect(page.getByTestId('migrate-profile-selector-reset')).toBeVisible()
      await expect(page.getByTestId('migrate-profile-selector-current')).not.toBeVisible()
      await profilePage.profileEditor.getByTestId('warning-overlay-next-button').click()
    })

    await transactionModal.autoComplete()

    await morePage.goto(name)
    await expect(morePage.resolver).toHaveText(latestResolver)

    await recordsPage.goto(name)
    await expect(recordsPage.getRecordValue('text', 'email')).toHaveText('fakeemail@fake.com')
    await expect(recordsPage.getRecordValue('text', 'url')).toHaveText('https://twitter.com')
    await expect(recordsPage.getRecordValue('text', 'description')).toHaveText('Hello2')
    await expect(recordsPage.getRecordValue('address', 'eth')).toHaveText(
      createAccounts().getAddress('user'),
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

  test('should be able to reset their profile during migration for a wrapped name with a profile on latest resolver', async ({
    login,
    page,
    makeName,
    makePageObject,
    accounts,
  }) => {
    const name = await makeName({
      label: 'wrapped',
      type: 'wrapped',
      resolver: legacyResolver,
    })

    // Add records to latest resolver
    await generateRecords({ accounts })({
      name,
      owner: 'user',
      resolver: latestResolver,
      records: await makeRecords(),
    })

    const morePage = makePageObject('MorePage')
    const profilePage = makePageObject('ProfilePage')
    const recordsPage = makePageObject('RecordsPage')
    const transactionModal = makePageObject('TransactionModal')

    await morePage.goto(name)
    await login.connect()

    await expect(morePage.resolver).toHaveText(legacyResolver)

    await profilePage.goto(name)
    await profilePage.editProfileButton.click()

    await expect(profilePage.profileEditor.getByText('Resolver incompatible')).toBeVisible()
    await profilePage.profileEditor.getByTestId('warning-overlay-next-button').click()

    await test.step('Migrate profile', async () => {
      await page.getByTestId('migrate-profile-selector-reset').check()
      await expect(page.getByTestId('migrate-profile-selector-latest')).not.toBeChecked()
      await expect(page.getByTestId('migrate-profile-selector-reset')).toBeChecked()
      await expect(page.getByTestId('migrate-profile-selector-current')).not.toBeVisible()
      await profilePage.profileEditor.getByTestId('warning-overlay-next-button').click()
      await expect(page.getByText('Reset profile')).toBeVisible()
      await profilePage.profileEditor.getByTestId('warning-overlay-next-button').click()
    })

    await transactionModal.autoComplete()

    await morePage.goto(name)
    await expect(morePage.resolver).toHaveText(latestResolver)

    await recordsPage.goto(name)
    await expect(recordsPage.getRecordButton('text', 'email')).toHaveCount(0)
    await expect(recordsPage.getRecordButton('text', 'url')).toHaveCount(0)
    await expect(recordsPage.getRecordButton('text', 'description')).toHaveCount(0)
    await expect(recordsPage.getRecordButton('address', 'eth')).toHaveCount(0)
    await expect(recordsPage.getRecordButton('address', 'btc')).toHaveCount(0)
    await expect(recordsPage.getRecordButton('address', 'etcLegacy')).toHaveCount(0)
    await expect(recordsPage.getRecordButton('contentHash')).toHaveCount(0)
    await expect(recordsPage.getRecordButton('abi')).toHaveCount(0)
  })

  test('should be able to transfer profile when only current resolver has a profile', async ({
    login,
    page,
    makeName,
    makePageObject,
    accounts,
  }) => {
    const name = await makeName({
      label: 'wrapped',
      type: 'legacy',
      records: await makeRecords(),
    })

    const wrapTx = await wrapName(walletClient, {
      name,
      newOwnerAddress: accounts.getAddress('user') as `0x${string}`,
      account: accounts.getAddress('user') as `0x${string}`,
    })
    await waitForTransaction(wrapTx)

    const morePage = makePageObject('MorePage')
    const profilePage = makePageObject('ProfilePage')
    const transactionModal = makePageObject('TransactionModal')
    const recordsPage = makePageObject('RecordsPage')

    await morePage.goto(name)
    await login.connect()

    await morePage.editResolverButton.click()
    await page.getByTestId('custom-resolver-radio').check()
    await page.getByTestId('dogfood').fill(legacyResolver)
    await page.getByTestId('update-button').click()
    await transactionModal.autoComplete()

    await expect(morePage.resolver).toHaveText(legacyResolver)

    await profilePage.goto(name)
    await profilePage.editProfileButton.click()

    await expect(profilePage.profileEditor.getByText('Resolver incompatible')).toBeVisible()
    await profilePage.profileEditor.getByTestId('warning-overlay-next-button').click()

    await test.step('Migrate profile', async () => {
      await expect(
        page.getByText(
          'You can transfer your current profile to the new resolver before updating your resolver.',
        ),
      ).toBeVisible()
      await page.getByTestId('detailed-switch').getByRole('checkbox').check()
      await page.getByTestId('warning-overlay-next-button').click()
    })

    await transactionModal.autoComplete()

    await morePage.goto(name)
    await expect(morePage.resolver).toHaveText(latestResolver)

    await recordsPage.goto(name)
    await expect(recordsPage.getRecordValue('text', 'email')).toHaveText('fakeemail@fake.com')
    await expect(recordsPage.getRecordValue('text', 'url')).toHaveText('https://twitter.com')
    await expect(recordsPage.getRecordValue('text', 'description')).toHaveText('Hello2')
    await expect(recordsPage.getRecordValue('address', 'eth')).toHaveText(
      createAccounts().getAddress('user'),
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

  test('should be able to update resolver when only current resolver has a profile', async ({
    login,
    page,
    accounts,
    makeName,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'wrapped',
      type: 'legacy',
      records: await makeRecords(),
    })

    const wrapTx = await wrapName(walletClient, {
      name,
      newOwnerAddress: accounts.getAddress('user') as `0x${string}`,
      account: accounts.getAddress('user') as `0x${string}`,
    })
    await waitForTransaction(wrapTx)

    const morePage = makePageObject('MorePage')
    const profilePage = makePageObject('ProfilePage')
    const transactionModal = makePageObject('TransactionModal')
    const recordsPage = makePageObject('RecordsPage')

    await morePage.goto(name)
    await login.connect()

    await morePage.editResolverButton.click()
    await page.getByTestId('custom-resolver-radio').check()
    await page.getByTestId('dogfood').fill(legacyResolver)
    await page.getByTestId('update-button').click()
    await transactionModal.autoComplete()

    await expect(morePage.resolver).toHaveText(legacyResolver)

    await profilePage.goto(name)
    await profilePage.editProfileButton.click()

    await expect(profilePage.profileEditor.getByText('Resolver incompatible')).toBeVisible()
    await profilePage.profileEditor.getByTestId('warning-overlay-next-button').click()

    await test.step('update resolver', async () => {
      await expect(
        page.getByText(
          'You can transfer your current profile to the new resolver before updating your resolver.',
        ),
      ).toBeVisible()
      await page.getByTestId('detailed-switch').getByRole('checkbox').uncheck()
      await page.getByTestId('warning-overlay-next-button').click()
    })

    await transactionModal.autoComplete()

    await morePage.goto(name)
    await expect(morePage.resolver).toHaveText(latestResolver)

    await recordsPage.goto(name)
    await expect(recordsPage.getRecordButton('text', 'email')).toHaveCount(0)
    await expect(recordsPage.getRecordButton('text', 'url')).toHaveCount(0)
    await expect(recordsPage.getRecordButton('text', 'description')).toHaveCount(0)
    await expect(recordsPage.getRecordButton('address', 'eth')).toHaveCount(0)
    await expect(recordsPage.getRecordButton('address', 'btc')).toHaveCount(0)
    await expect(recordsPage.getRecordButton('address', 'etcLegacy')).toHaveCount(0)
    await expect(recordsPage.getRecordButton('contentHash')).toHaveCount(0)
    await expect(recordsPage.getRecordButton('abi')).toHaveCount(0)
  })

  test('should be able to only update resolver if records on current and latest resolver are equal', async ({
    login,
    page,
    makeName,
    makePageObject,
    accounts,
  }) => {
    const name = await makeName({
      label: 'wrapped',
      type: 'legacy',
      records: await makeRecords(),
    })

    const wrapTx = await wrapName(walletClient, {
      name,
      newOwnerAddress: accounts.getAddress('user') as `0x${string}`,
      account: accounts.getAddress('user') as `0x${string}`,
    })
    await waitForTransaction(wrapTx)

    await generateRecords({ accounts })({
      name,
      owner: 'user',
      resolver: latestResolver,
      records: await makeRecords(),
    })

    const morePage = makePageObject('MorePage')
    const profilePage = makePageObject('ProfilePage')
    const transactionModal = makePageObject('TransactionModal')
    const recordsPage = makePageObject('RecordsPage')

    await morePage.goto(name)
    await login.connect()

    await morePage.editResolverButton.click()
    await page.getByTestId('custom-resolver-radio').check()
    await page.getByTestId('dogfood').fill(legacyResolver)
    await page.getByTestId('update-button').click()
    await transactionModal.autoComplete()

    await expect(morePage.resolver).toHaveText(legacyResolver)

    await profilePage.goto(name)
    await profilePage.editProfileButton.click()

    await expect(profilePage.profileEditor.getByText('Resolver incompatible')).toBeVisible()
    await profilePage.profileEditor.getByTestId('warning-overlay-next-button').click()

    await test.step('Migrate profile', async () => {
      await expect(
        page.getByText(
          'You can keep your current profile on the new resolver, or reset it and remove all profile records.',
        ),
      ).toBeVisible()
      await page.getByTestId('detailed-switch').getByRole('checkbox').check()
      await profilePage.profileEditor.getByTestId('warning-overlay-next-button').click()
    })

    await transactionModal.autoComplete()

    await morePage.goto(name)
    await expect(morePage.resolver).toHaveText(latestResolver)

    await recordsPage.goto(name)
    await expect(recordsPage.getRecordValue('text', 'email')).toHaveText('fakeemail@fake.com')
    await expect(recordsPage.getRecordValue('text', 'url')).toHaveText('https://twitter.com')
    await expect(recordsPage.getRecordValue('text', 'description')).toHaveText('Hello2')
    await expect(recordsPage.getRecordValue('address', 'eth')).toHaveText(
      createAccounts().getAddress('user'),
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

  test('should be able to reset resolver if records on current and latest resolver are equal', async ({
    login,
    page,
    makeName,
    makePageObject,
    accounts,
  }) => {
    const name = await makeName({
      label: 'wrapped',
      type: 'legacy',
      records: await makeRecords(),
    })

    const wrapTx = await wrapName(walletClient, {
      name,
      newOwnerAddress: accounts.getAddress('user') as `0x${string}`,
      account: accounts.getAddress('user') as `0x${string}`,
    })
    await waitForTransaction(wrapTx)

    await generateRecords({ accounts })({
      name,
      owner: 'user',
      resolver: latestResolver,
      records: await makeRecords(),
    })

    const morePage = makePageObject('MorePage')
    const profilePage = makePageObject('ProfilePage')
    const transactionModal = makePageObject('TransactionModal')
    const recordsPage = makePageObject('RecordsPage')

    await morePage.goto(name)
    await login.connect()

    await morePage.editResolverButton.click()
    await page.getByTestId('custom-resolver-radio').check()
    await page.getByTestId('dogfood').fill(legacyResolver)
    await page.getByTestId('update-button').click()
    await transactionModal.autoComplete()

    await expect(morePage.resolver).toHaveText(legacyResolver)

    await profilePage.goto(name)
    await profilePage.editProfileButton.click()

    await expect(profilePage.profileEditor.getByText('Resolver incompatible')).toBeVisible()
    await profilePage.profileEditor.getByTestId('warning-overlay-next-button').click()

    await test.step('Migrate profile', async () => {
      await expect(
        page.getByText(
          'You can keep your current profile on the new resolver, or reset it and remove all profile records.',
        ),
      ).toBeVisible()
      await page.getByTestId('detailed-switch').getByRole('checkbox').uncheck()
      await profilePage.profileEditor.getByTestId('warning-overlay-next-button').click()
    })

    await transactionModal.autoComplete()

    await morePage.goto(name)
    await expect(morePage.resolver).toHaveText(latestResolver)

    await recordsPage.goto(name)
    await expect(recordsPage.getRecordButton('text', 'email')).toHaveCount(0)
    await expect(recordsPage.getRecordButton('text', 'url')).toHaveCount(0)
    await expect(recordsPage.getRecordButton('text', 'description')).toHaveCount(0)
    await expect(recordsPage.getRecordButton('address', 'eth')).toHaveCount(0)
    await expect(recordsPage.getRecordButton('address', 'btc')).toHaveCount(0)
    await expect(recordsPage.getRecordButton('address', 'etcLegacy')).toHaveCount(0)
    await expect(recordsPage.getRecordButton('contentHash')).toHaveCount(0)
    await expect(recordsPage.getRecordButton('abi')).toHaveCount(0)
  })

  test('should be able to migrate current profile if records on current and latest resolver are NOT equal', async ({
    login,
    page,
    makeName,
    makePageObject,
    accounts,
  }) => {
    const name = await makeName({
      label: 'wrapped',
      type: 'legacy',
      records: await makeRecords(),
    })

    const wrapTx = await wrapName(walletClient, {
      name,
      newOwnerAddress: accounts.getAddress('user') as `0x${string}`,
      account: accounts.getAddress('user') as `0x${string}`,
    })
    await waitForTransaction(wrapTx)

    await generateRecords({ accounts })({
      name,
      owner: 'user',
      resolver: latestResolver,
      records: await makeRecords({
        texts: [
          {
            key: 'description',
            value: 'Do not set me as resolver',
          },
        ],
      }),
    })

    const morePage = makePageObject('MorePage')
    const profilePage = makePageObject('ProfilePage')
    const transactionModal = makePageObject('TransactionModal')
    const recordsPage = makePageObject('RecordsPage')

    await morePage.goto(name)
    await login.connect()

    await morePage.editResolverButton.click()
    await page.getByTestId('custom-resolver-radio').check()
    await page.getByTestId('dogfood').fill(legacyResolver)
    await page.getByTestId('update-button').click()
    await transactionModal.autoComplete()

    await expect(morePage.resolver).toHaveText(legacyResolver)

    await profilePage.goto(name)
    await profilePage.editProfileButton.click()

    await expect(profilePage.profileEditor.getByText('Resolver incompatible')).toBeVisible()
    await profilePage.profileEditor.getByTestId('warning-overlay-next-button').click()

    await test.step('Migrate profile', async () => {
      await page.getByTestId('migrate-profile-selector-current').check()
      await expect(page.getByTestId('migrate-profile-selector-latest')).not.toBeChecked()
      await expect(page.getByTestId('migrate-profile-selector-reset')).not.toBeChecked()
      await expect(page.getByTestId('migrate-profile-selector-current')).toBeChecked()
      await profilePage.profileEditor.getByTestId('warning-overlay-next-button').click()
      await expect(page.getByText('Migrate profile')).toBeVisible()
      await profilePage.profileEditor.getByTestId('warning-overlay-next-button').click()
    })

    await transactionModal.autoComplete()

    await morePage.goto(name)
    await expect(morePage.resolver).toHaveText(latestResolver)

    await recordsPage.goto(name)
    await expect(recordsPage.getRecordValue('text', 'email')).toHaveText('fakeemail@fake.com')
    await expect(recordsPage.getRecordValue('text', 'url')).toHaveText('https://twitter.com')
    await expect(recordsPage.getRecordValue('text', 'description')).toHaveText('Hello2')
    await expect(recordsPage.getRecordValue('address', 'eth')).toHaveText(
      createAccounts().getAddress('user'),
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

  test('should be able to update resolver if records on current and latest resolver are NOT equal', async ({
    login,
    page,
    makeName,
    makePageObject,
    accounts,
  }) => {
    const name = await makeName({
      label: 'wrapped',
      type: 'legacy',
      records: await makeRecords({
        texts: [
          {
            key: 'description',
            value: 'Do not set me as resolver',
          },
        ],
      }),
    })

    const wrapTx = await wrapName(walletClient, {
      name,
      newOwnerAddress: accounts.getAddress('user') as `0x${string}`,
      account: accounts.getAddress('user') as `0x${string}`,
    })
    await waitForTransaction(wrapTx)

    await generateRecords({ accounts })({
      name,
      owner: 'user',
      resolver: latestResolver,
      records: await makeRecords(),
    })

    const morePage = makePageObject('MorePage')
    const profilePage = makePageObject('ProfilePage')
    const transactionModal = makePageObject('TransactionModal')
    const recordsPage = makePageObject('RecordsPage')

    await morePage.goto(name)
    await login.connect()

    await morePage.editResolverButton.click()
    await page.getByTestId('custom-resolver-radio').check()
    await page.getByTestId('dogfood').fill(legacyResolver)
    await page.getByTestId('update-button').click()
    await transactionModal.autoComplete()

    await expect(morePage.resolver).toHaveText(legacyResolver)

    await profilePage.goto(name)
    await profilePage.editProfileButton.click()

    await expect(profilePage.profileEditor.getByText('Resolver incompatible')).toBeVisible()
    await profilePage.profileEditor.getByTestId('warning-overlay-next-button').click()

    await test.step('Migrate profile', async () => {
      await page.getByTestId('migrate-profile-selector-latest').check()
      await expect(page.getByTestId('migrate-profile-selector-latest')).toBeChecked()
      await expect(page.getByTestId('migrate-profile-selector-reset')).not.toBeChecked()
      await expect(page.getByTestId('migrate-profile-selector-current')).not.toBeChecked()
      await profilePage.profileEditor.getByTestId('warning-overlay-next-button').click()
    })

    await transactionModal.autoComplete()

    await morePage.goto(name)
    await expect(morePage.resolver).toHaveText(latestResolver)

    await recordsPage.goto(name)
    await expect(recordsPage.getRecordValue('text', 'email')).toHaveText('fakeemail@fake.com')
    await expect(recordsPage.getRecordValue('text', 'url')).toHaveText('https://twitter.com')
    await expect(recordsPage.getRecordValue('text', 'description')).toHaveText('Hello2')
    await expect(recordsPage.getRecordValue('address', 'eth')).toHaveText(
      createAccounts().getAddress('user'),
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

  test('should be able to reset profile if records on current and latest resolver are NOT equal', async ({
    login,
    page,
    makeName,
    makePageObject,
    accounts,
  }) => {
    const name = await makeName({
      label: 'wrapped',
      type: 'legacy',
      records: await makeRecords({
        texts: [
          {
            key: 'description',
            value: 'Do not set me as resolver',
          },
        ],
      }),
    })

    const wrapTx = await wrapName(walletClient, {
      name,
      newOwnerAddress: accounts.getAddress('user') as `0x${string}`,
      account: accounts.getAddress('user') as `0x${string}`,
    })
    await waitForTransaction(wrapTx)

    await generateRecords({ accounts })({
      name,
      owner: 'user',
      resolver: latestResolver,
      records: await makeRecords(),
    })

    const morePage = makePageObject('MorePage')
    const profilePage = makePageObject('ProfilePage')
    const transactionModal = makePageObject('TransactionModal')
    const recordsPage = makePageObject('RecordsPage')

    await morePage.goto(name)
    await login.connect()

    await morePage.editResolverButton.click()
    await page.getByTestId('custom-resolver-radio').check()
    await page.getByTestId('dogfood').fill(legacyResolver)
    await page.getByTestId('update-button').click()
    await transactionModal.autoComplete()

    await expect(morePage.resolver).toHaveText(legacyResolver)

    await profilePage.goto(name)
    await profilePage.editProfileButton.click()

    await expect(profilePage.profileEditor.getByText('Resolver incompatible')).toBeVisible()
    await profilePage.profileEditor.getByTestId('warning-overlay-next-button').click()

    await test.step('Migrate profile', async () => {
      await page.getByTestId('migrate-profile-selector-reset').check()
      await expect(page.getByTestId('migrate-profile-selector-latest')).not.toBeChecked()
      await expect(page.getByTestId('migrate-profile-selector-reset')).toBeChecked()
      await expect(page.getByTestId('migrate-profile-selector-current')).not.toBeChecked()
      await profilePage.profileEditor.getByTestId('warning-overlay-next-button').click()
      await expect(page.getByText('Reset profile')).toBeVisible()
      await profilePage.profileEditor.getByTestId('warning-overlay-next-button').click()
    })

    await transactionModal.autoComplete()

    await morePage.goto(name)
    await expect(morePage.resolver).toHaveText(latestResolver)

    await recordsPage.goto(name)
    await expect(recordsPage.getRecordButton('text', 'email')).toHaveCount(0)
    await expect(recordsPage.getRecordButton('text', 'url')).toHaveCount(0)
    await expect(recordsPage.getRecordButton('text', 'description')).toHaveCount(0)
    await expect(recordsPage.getRecordButton('address', 'eth')).toHaveCount(0)
    await expect(recordsPage.getRecordButton('address', 'btc')).toHaveCount(0)
    await expect(recordsPage.getRecordButton('address', 'etcLegacy')).toHaveCount(0)
    await expect(recordsPage.getRecordButton('contentHash')).toHaveCount(0)
    await expect(recordsPage.getRecordButton('abi')).toHaveCount(0)
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

test.describe('edit profile button states', () => {
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
})

test.describe('manual image url validation', () => {
  const NON_IMAGE_URL = 'data:text/html,<h1>not-an-image</h1>'
  const NOT_AN_IMAGE_ERROR = 'This URL does not return an image'

  // Robustly open the manual-entry dialog from an avatar/header dropdown. The
  // profile editor re-renders periodically, which can detach the dropdown menu
  // or reset the dialog mid-interaction; retrying the open (and only re-clicking
  // the trigger when the menu is actually closed, to avoid toggling it shut)
  // absorbs that without weakening any assertion.
  const openManualEntry = async (
    page: Page,
    buttonTestId: string,
    addLabel: string,
    inputTestId: string,
  ) => {
    const dropdown = page.getByTestId(buttonTestId)
    const enterManually = dropdown.getByRole('button', { name: 'Enter Manually' })
    await expect(async () => {
      if (!(await enterManually.isVisible())) {
        await dropdown.getByRole('button', { name: addLabel }).click()
      }
      await expect(enterManually).toBeVisible({ timeout: 2000 })
      await enterManually.click()
      await expect(page.getByTestId(inputTestId)).toBeVisible({ timeout: 2000 })
    }).toPass({ timeout: 30000 })
  }

  test('avatar: shows an inline error and disables Confirm for a non-image URL, then accepts a valid image URL', async ({
    page,
    login,
    makeName,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'manual-avatar-validation',
      type: 'legacy',
      records: { texts: [{ key: 'description', value: 'manual avatar test' }] },
    })

    const profilePage = makePageObject('ProfilePage')

    await profilePage.goto(name)
    await login.connect()

    // Ensure profile data is loaded (warms the query cache) so the editor renders
    // stably and a late re-render does not detach the dropdown menu below.
    await expect(profilePage.record('text', 'description')).toHaveText('manual avatar test')

    // Make CSS transitions instant so the dropdown menu opens stably; its 0.35s
    // bouncy entrance transition otherwise races with re-renders and
    // intermittently detaches the menu item before Playwright can click it. Only
    // transitions are flattened (they jump to their final state), not keyframe
    // animations, so reveal-on-mount elements such as the inline error still show.
    await page.addStyleTag({
      content:
        '*, *::before, *::after { transition-duration: 0s !important; transition-delay: 0s !important; }',
    })

    await profilePage.editProfileButton.click()
    await expect(page.getByTestId('profile-submit-button')).toBeVisible()

    await openManualEntry(page, 'avatar-button', 'Add avatar', 'avatar-uri-input')

    const confirmButton = page.getByRole('button', { name: 'Confirm' })
    const input = page.getByTestId('avatar-uri-input')
    const errorText = page.getByText(NOT_AN_IMAGE_ERROR)

    // Non-image URL: passes format validation but does not return an image. The
    // error appears after the debounce, without clicking Confirm. Re-filling
    // inside expect(...).toPass guards against the editor occasionally
    // re-rendering and resetting the dialog while the async check is in flight.
    await expect(async () => {
      await input.fill(NON_IMAGE_URL)
      await expect(errorText).toBeVisible({ timeout: 2000 })
      await expect(confirmButton).toBeDisabled()
    }).toPass({ timeout: 30000 })

    // Valid image URL: the error clears and the avatar can be saved.
    await expect(async () => {
      await input.fill(VALID_IMAGE_DATA_URL)
      await expect(errorText).toBeHidden({ timeout: 2000 })
      await expect(confirmButton).toBeEnabled()
      await confirmButton.click()
      await expect(page.getByTestId('avatar-uri-display')).toBeVisible({ timeout: 3000 })
    }).toPass({ timeout: 30000 })
  })

  test('header: shows an inline error and disables Save for a non-image URL, then accepts a valid image URL', async ({
    page,
    login,
    makeName,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'manual-header-validation',
      type: 'legacy',
      records: { texts: [{ key: 'description', value: 'manual header test' }] },
    })

    const profilePage = makePageObject('ProfilePage')

    await profilePage.goto(name)
    await login.connect()

    // Ensure profile data is loaded (warms the query cache) so the editor renders
    // stably and a late re-render does not detach the dropdown menu below.
    await expect(profilePage.record('text', 'description')).toHaveText('manual header test')

    // Make CSS transitions instant so the dropdown menu opens stably; its 0.35s
    // bouncy entrance transition otherwise races with re-renders and
    // intermittently detaches the menu item before Playwright can click it. Only
    // transitions are flattened (they jump to their final state), not keyframe
    // animations, so reveal-on-mount elements such as the inline error still show.
    await page.addStyleTag({
      content:
        '*, *::before, *::after { transition-duration: 0s !important; transition-delay: 0s !important; }',
    })

    await profilePage.editProfileButton.click()
    await expect(page.getByTestId('profile-submit-button')).toBeVisible()

    await openManualEntry(page, 'header-button', 'Add header', 'header-manual-input')

    const saveButton = page.getByRole('button', { name: 'Save' })
    const input = page.getByTestId('header-manual-input')
    const errorText = page.getByText(NOT_AN_IMAGE_ERROR)

    // Non-image URL: passes format validation but does not return an image. The
    // error appears after the debounce, without clicking Save. Re-filling inside
    // expect(...).toPass guards against the editor occasionally re-rendering and
    // resetting the dialog while the async check is in flight.
    await expect(async () => {
      await input.fill(NON_IMAGE_URL)
      await expect(errorText).toBeVisible({ timeout: 2000 })
      await expect(saveButton).toBeDisabled()
    }).toPass({ timeout: 30000 })

    // Valid image URL: the error clears and the header can be saved.
    await expect(async () => {
      await input.fill(VALID_IMAGE_DATA_URL)
      await expect(errorText).toBeHidden({ timeout: 2000 })
      await expect(saveButton).toBeEnabled()
      await saveButton.click()
      await expect(page.getByTestId('header-uri-display')).toBeVisible({ timeout: 3000 })
    }).toPass({ timeout: 30000 })
  })
})
