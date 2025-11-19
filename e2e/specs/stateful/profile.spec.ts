/* eslint-disable no-await-in-loop */
import { expect } from '@playwright/test'

import { test } from '../../../playwright/index.js'

const profiles = [
  {
    name: 'wrapmebaby.eth',
    records: [
      {
        type: 'snippet',
        key: 'name',
        value: 'wrap',
      },
      {
        type: 'snippet',
        key: 'description',
        value: 'Professional namer',
      },
      {
        type: 'snippet',
        key: 'url',
        value: 'ens.domains',
      },
      {
        type: 'snippet',
        key: 'location',
        value: 'Metaverse',
      },
      {
        type: 'account',
        key: 'com.discord',
        value: 'ens0700',
      },
      {
        type: 'account',
        key: 'com.github',
        value: 'ensdomains',
      },
      {
        type: 'account',
        key: 'com.twitter',
        value: '@ensdomains',
        fullValue: 'ensdomains',
      },
      {
        type: 'address',
        key: 'eth',
        value: '0xFc5...7acf0',
        fullValue: '0xFc5958B4B6F9a06D21E06429c8833f865577acf0',
      },
      {
        type: 'other',
        key: 'avatar',
        value: 'https://euc.li/...',
        fullValue: 'https://euc.li/holesky/wrapmebaby.eth',
      },
      {
        type: 'account',
        key: 'email',
        value: 'email@ens.domains',
      },
    ],
    owners: [
      {
        type: 'manager',
        value: '1.phantombug01.eth',
        address: '0xFc5958B4B6F9a06D21E06429c8833f865577acf0',
      },
      {
        type: 'owner',
        value: '1.phantombug01.eth',
        address: '0xFc5958B4B6F9a06D21E06429c8833f865577acf0',
      },
    ],
    expiry: 'Jun 20, 2026',
    contentHash: undefined,
  },
]

test.describe('Profile', () => {
  test('should allow user to connect', async ({ page, login }) => {
    await page.goto('/')
    await login.connect()

    await page.getByTestId('header-profile').click()
    // await expect(page.getByText('Profile')).toBeVisible()
    await page.getByTestId('header-profile').click()
    // await expect(page.getByText('Profile')).not.toBeVisible()
  })

  test('should show a warning if name is not supported', async ({ page }) => {
    await page.goto('/name.nottld/')
    await expect(page.getByText('This TLD is not supported')).toBeVisible({ timeout: 25000 })
  })

  test('should load emoji domain pages', async ({ page }) => {
    await page.goto('/%E2%9D%A4%EF%B8%8F%E2%9D%A4%EF%B8%8F%E2%9D%A4%EF%B8%8F.eth/')
    await expect(page.getByTestId('profile-snippet-name')).toContainText('❤️❤️❤️.eth', {
      timeout: 25000,
    })
  })

  test('should allow searching for emoji domain', async ({ page, login }) => {
    await page.goto('/')
    await login.connect()

    await page.getByPlaceholder('Search for a name').fill('❤️❤️❤️❤️❤️❤️.eth')
    await page.getByPlaceholder('Search for a name').press('Enter')
    await expect(page).toHaveURL('/%E2%9D%A4%E2%9D%A4%E2%9D%A4%E2%9D%A4%E2%9D%A4%E2%9D%A4.eth')
    // This await is needed so that a headless provider can make it's function calls before the page closes.
    await page.waitForTimeout(5000)
  })

  for (const profile of profiles) {
    test(`should load profile for: ${profile.name}`, async ({ page, login }) => {
      await page.goto('/')
      await login.connect()

      await page.getByPlaceholder('Search for a name').fill(profile.name)
      await page.getByPlaceholder('Search for a name').press('Enter')
      await expect(page).toHaveURL(`/${profile.name}`)
      // should show the name in the profile snippet
      await expect(page.getByTestId('profile-snippet')).toContainText(profile.name, {
        timeout: 25000,
      })

      const snippetRecords = profile.records.filter((x) => x.type === 'snippet')
      const accounts = profile.records.filter((x) => x.type === 'account')
      const addresses = profile.records.filter((x) => x.type === 'address')
      const otherRecords = profile.records.filter((x) => x.type === 'other')

      const textRecords = profile.records.filter((x) => x.type !== 'address')
      const addressRecords = profile.records.filter((x) => x.type === 'address')

      // should show profile records

      // should show all snippet records in profile snippet
      if (snippetRecords.length > 0) {
        for (const record of snippetRecords) {
          await expect(page.getByTestId(`profile-snippet-${record.key}`)).toContainText(
            record.value,
          )
        }
      }

      // should show accounts
      if (accounts.length > 0) {
        await expect(page.getByText('Accounts')).toBeVisible()
        for (const account of accounts) {
          await expect(page.getByTestId(`social-profile-button-${account.key}`)).toContainText(
            account.value,
          )
        }
      }

      // should show addresses
      if (addresses.length > 0) {
        await expect(page.getByText('Addresses')).toBeVisible()
        for (const address of addresses) {
          await expect(page.getByTestId(`address-profile-button-${address.key}`)).toContainText(
            address.value,
          )
        }
      }

      // should show other records
      if (otherRecords.length > 0) {
        await expect(page.getByText('Other Records')).toBeVisible()
        for (const other of otherRecords) {
          await expect(page.getByTestId(`other-profile-button-${other.key}`)).toContainText(
            `${other.key}${other.value}`,
          )
        }
      }

      // should show details in records tab
      await page.getByTestId('records-tab').click()

      // should show all text records, and show correct number of records
      await expect(page.getByTestId('text-amount')).toContainText(`${textRecords.length} Records`)
      if (textRecords.length > 0) {
        for (const record of textRecords) {
          await expect(page.getByTestId(`name-details-text-${record.key}`)).toContainText(
            record.fullValue || record.value,
          )
        }
      }

      // should show all address records, and show correct number of records
      await expect(page.getByTestId('address-amount')).toContainText(
        `${addressRecords.length} Records`,
      )
      if (addressRecords.length > 0) {
        for (const record of addressRecords) {
          await expect(page.getByTestId(`name-details-address-${record.key}`)).toContainText(
            record.fullValue!,
          )
        }
      }

      // should show content hash if available
      if (profile.contentHash) {
        await expect(page.getByTestId('content-hash-heading')).toHaveText('Content Hash')
        await expect(page.getByTestId('name-details-contentHash')).toContainText(
          profile.contentHash,
        )
      } else {
        await expect(page.getByTestId('content-hash-heading')).toHaveText('No Content Hash')
      }

      // should show details in more tab
      await page.getByTestId('ownership-tab').click()
      for (const owner of profile.owners) {
        await expect(
          page.getByTestId(`role-row-${owner.address}`).getByTestId(`role-tag-${owner.type}`),
        ).toBeVisible()
        await expect(page.getByTestId(`role-row-${owner.address}`)).toContainText(owner.value)
      }

      // should have view link for registration transaction
      await page.getByTestId('ownership-tab').click()
      await expect(page.getByTestId('etherscan-registration-link')).toHaveAttribute(
        'href',
        /https:\/\/sepolia\.etherscan\.io\/tx\/0x[a-fA-F0-9]{64}/,
      )

      // should show the expiry of the name if available
      if (profile.expiry) {
        await expect(page.getByTestId('expiry-panel-expiry')).toContainText(profile.expiry)
      }
    })
  }

  test('should decode an unknown label', async ({ page, login }) => {
    await page.goto('/')
    await login.connect()
    await page.goto(
      // eslint-disable-next-line no-restricted-syntax
      '/[8df9cfc425ad5e1853259e1cef0a8d1d44591fbec8e3feb6f930d9dfacd5eff2].eth/',
    )
    await expect(page.getByTestId('profile-snippet')).toContainText('wrapmebaby.eth', {
      timeout: 25000,
    })
  })

  test('should show wrapped DNS name warning', async ({ page, login }) => {
    await page.goto('/')
    await login.connect()

    await page.goto('/wrappeddnsname.com/')
    await expect(page.getByTestId('profile-snippet')).toContainText('wrappeddnsname.com')
  })
})
