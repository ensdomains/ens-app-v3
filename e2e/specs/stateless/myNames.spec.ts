import { expect } from '@playwright/test'
import { createAccounts } from '@root/playwright/fixtures/accounts'
import {
  testClient,
  walletClient,
} from '@root/playwright/fixtures/contracts/utils/addTestContracts'
import { Address, labelhash } from 'viem'

import { deleteSubname } from '@ensdomains/ensjs/wallet'

import { test } from '../../../playwright'
import { Name } from '../../../playwright/fixtures/makeName'

test('myNames', async ({ page, login, makeName }) => {
  await testClient.increaseTime({ seconds: 3 * 365 * 24 * 60 * 60 })
  await testClient.mine({ blocks: 1 })

  const nameConfig: Name[] = Array.from({ length: 20 }).map((_, i) => ({
    label: `name${i}`,
    type: 'legacy',
    owner: 'user2',
  }))

  const names = await makeName(nameConfig)

  await page.goto('/')
  await login.connect('user2')

  await page.goto('/my/names')

  const timestamps = await Promise.all(
    names.map(async (name) => {
      return page
        .getByTestId(`name-item-${name}`)
        .getByTestId('short-expiry')
        .getAttribute('data-timestamp')
    }),
  )

  expect(timestamps.every((timestamp) => timestamp === timestamps[0])).toBe(true)
})

test.describe.serial('myNames', () => {
  test.beforeAll(async ({ subgraph }) => {
    // Move time to the future to force previous names to expire
    await testClient.increaseTime({ seconds: 2 * 365 * 24 * 60 * 60 })
    await testClient.mine({ blocks: 1 })
    await subgraph.sync()
  })

  let subnamesToDelete: string[] = []
  let allNames: string[] = []

  test.afterAll(async () => {
    console.log('cleaning up subnames')
    const account = createAccounts().getAddress('user4') as Address
    for (const subname of subnamesToDelete) {
      const contract = subname.includes('wrapped') ? 'nameWrapper' : 'registry'
      console.log('deleting subname:', subname, 'on', contract)
      // eslint-disable-next-line no-await-in-loop
      await deleteSubname(walletClient, {
        name: subname,
        account,
        contract,
      })
    }
  })

  const makeSubnamesConfig = (type: 'legacy' | 'wrapped') =>
    Array.from(
      { length: 10 },
      (_, i) =>
        ({
          label: `sub${i}`,
          owner: 'user4',
          type,
          ...(type === 'wrapped'
            ? {
                fuses: {
                  parent: {
                    named: ['PARENT_CANNOT_CONTROL'],
                  },
                },
              }
            : {}),
        }) as any,
    )

  test('should display all names for expiry date ASC', async ({ page, login, makeName }) => {
    const earlierName = await makeName({
      label: 'earlier-wrapped',
      type: 'wrapped',
      owner: 'user4',
      fuses: {
        named: ['CANNOT_UNWRAP'],
      },
      subnames: makeSubnamesConfig('wrapped'),
    })
    const concurrentNames = await makeName([
      {
        label: `concurrent-legacy`,
        type: 'legacy',
        owner: 'user4',
        subnames: makeSubnamesConfig('legacy'),
      } as Name,
      {
        label: `concurrent-wrapped`,
        type: 'wrapped',
        owner: 'user4',
        fuses: {
          named: ['CANNOT_UNWRAP'],
        },
        subnames: makeSubnamesConfig('wrapped'),
      },
    ])
    const laterName = await makeName({
      label: 'later-legacy-name',
      type: 'legacy',
      owner: 'user4',
      subnames: makeSubnamesConfig('legacy'),
    })

    subnamesToDelete = [earlierName, ...concurrentNames, laterName].flatMap((name) =>
      Array.from({ length: 10 }, (_, i) => `sub${i}.${name}`),
    )
    allNames = [earlierName, ...concurrentNames, laterName, ...subnamesToDelete]

    await page.goto('/')
    await login.connect('user4')
    await page.goto('/my/names')

    await expect(page.getByTestId('names-list')).toBeVisible({ timeout: 10000 })

    await page.evaluate(async () => {
      let previousScrollHeight = 0
      let { scrollHeight } = document.body
      do {
        window.scrollTo(0, scrollHeight)
        // eslint-disable-next-line no-await-in-loop
        await new Promise((resolve) => {
          setTimeout(resolve, 1000)
        })
        previousScrollHeight = scrollHeight
        scrollHeight = document.body.scrollHeight
      } while (previousScrollHeight !== scrollHeight)
    })

    for (const name of allNames) {
      const decryptedLocator = page.getByTestId(`name-item-${name}`)
      const nameParts = name.split('.')
      const label = nameParts.shift()!
      const labelHash = `[${labelhash(label).replace('0x', '')}]`
      const encryptedLocator = page.getByTestId(`name-item-${[labelHash, ...nameParts].join('.')}`)
      // eslint-disable-next-line no-await-in-loop
      await expect(decryptedLocator.or(encryptedLocator)).toBeVisible()
    }
  })

  test('should display all names for expiry date DESC', async ({ page, login }) => {
    await page.goto('/')
    await login.connect('user4')
    await page.goto('/my/names')

    await expect(page.getByTestId('names-list')).toBeVisible({ timeout: 10000 })

    await page.getByTestId('sort-desc').click()
    await page.waitForTimeout(1000)

    await page.evaluate(async () => {
      let previousScrollHeight = 0
      let { scrollHeight } = document.body
      do {
        window.scrollTo(0, scrollHeight)
        // eslint-disable-next-line no-await-in-loop
        await new Promise((resolve) => {
          setTimeout(resolve, 1000)
        })
        previousScrollHeight = scrollHeight
        scrollHeight = document.body.scrollHeight
      } while (previousScrollHeight !== scrollHeight)
    })

    for (const name of allNames) {
      const decryptedLocator = page.getByTestId(`name-item-${name}`)
      const nameParts = name.split('.')
      const label = nameParts.shift()!
      const labelHash = `[${labelhash(label).replace('0x', '')}]`
      const encryptedLocator = page.getByTestId(`name-item-${[labelHash, ...nameParts].join('.')}`)
      // eslint-disable-next-line no-await-in-loop
      await expect(decryptedLocator.or(encryptedLocator)).toBeVisible()
    }
  })

  test('should display all names for createdAt ASC', async ({ page, login }) => {
    await page.goto('/')
    await login.connect('user4')
    await page.goto('/my/names')

    await expect(page.getByTestId('names-list')).toBeVisible({ timeout: 10000 })

    await page.getByTestId('select-container').getByRole('button').click()
    await page.getByTestId('select-option-createdAt').click()
    await page.waitForTimeout(1000)

    await page.evaluate(async () => {
      let previousScrollHeight = 0
      let { scrollHeight } = document.body
      do {
        window.scrollTo(0, scrollHeight)
        // eslint-disable-next-line no-await-in-loop
        await new Promise((resolve) => {
          setTimeout(resolve, 1000)
        })
        previousScrollHeight = scrollHeight
        scrollHeight = document.body.scrollHeight
      } while (previousScrollHeight !== scrollHeight)
    })

    for (const name of allNames) {
      const decryptedLocator = page.getByTestId(`name-item-${name}`)
      const nameParts = name.split('.')
      const label = nameParts.shift()!
      const labelHash = `[${labelhash(label).replace('0x', '')}]`
      const encryptedLocator = page.getByTestId(`name-item-${[labelHash, ...nameParts].join('.')}`)
      // eslint-disable-next-line no-await-in-loop
      await expect(decryptedLocator.or(encryptedLocator)).toBeVisible()
    }
  })

  test('should display all names for createdAt DESC', async ({ page, login }) => {
    await page.goto('/')
    await login.connect('user4')
    await page.goto('/my/names')

    await expect(page.getByTestId('names-list')).toBeVisible({ timeout: 10000 })

    await page.getByTestId('select-container').getByRole('button').click()
    await page.getByTestId('select-option-createdAt').click()
    await page.getByTestId('sort-desc').click()
    await page.waitForTimeout(1000)

    await page.evaluate(async () => {
      let previousScrollHeight = 0
      let { scrollHeight } = document.body
      do {
        window.scrollTo(0, scrollHeight)
        // eslint-disable-next-line no-await-in-loop
        await new Promise((resolve) => {
          setTimeout(resolve, 1000)
        })
        previousScrollHeight = scrollHeight
        scrollHeight = document.body.scrollHeight
      } while (previousScrollHeight !== scrollHeight)
    })

    for (const name of allNames) {
      const decryptedLocator = page.getByTestId(`name-item-${name}`)
      const nameParts = name.split('.')
      const label = nameParts.shift()!
      const labelHash = `[${labelhash(label).replace('0x', '')}]`
      const encryptedLocator = page.getByTestId(`name-item-${[labelHash, ...nameParts].join('.')}`)
      // eslint-disable-next-line no-await-in-loop
      await expect(decryptedLocator.or(encryptedLocator)).toBeVisible()
    }
  })
})
