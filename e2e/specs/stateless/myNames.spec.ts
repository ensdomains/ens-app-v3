import { afterEach } from 'node:test'

import { expect, Locator, Page } from '@playwright/test'
import { createAccounts } from '@root/playwright/fixtures/accounts'
import {
  testClient,
  waitForTransaction,
  walletClient,
} from '@root/playwright/fixtures/contracts/utils/addTestContracts'
import { deleteSubnameFixture } from '@root/playwright/fixtures/makeName/generators/deleteSubname'
import { WrappedSubname } from '@root/playwright/fixtures/makeName/generators/generateWrappedSubname'
import { Address } from 'viem'
import { afterAll, beforeAll } from 'vitest'

import { deleteSubname } from '@ensdomains/ensjs/wallet'

import { test } from '../../../playwright'
import { Name } from '../../../playwright/fixtures/makeName'

// Set the tests as serial so that cleaning up data will not affect other tests
test.describe.configure({ mode: 'serial' })

let tempSubnames: string[] = []
test.afterEach(async () => {
  console.log('Cleaning up temp subnames')
  for (const subname of tempSubnames) {
    console.log(`Deleting subname: ${subname}`)
    // eslint-disable-next-line no-await-in-loop
    await deleteSubname(walletClient, {
      name: subname,
      contract: 'nameWrapper',
      account: createAccounts().getAddress('user3') as Address,
    })
  }
  tempSubnames = []
})

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
  await page.pause()

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

  await page.pause()
})

/// ///

async function checkLinkText(locator: Locator, index: number, expectedText: string): Promise<void> {
  const text = await locator.nth(index).textContent()
  expect(text).toContain(expectedText)
}

async function scrollToBottom(page: Page): Promise<void> {
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
}

async function waitForNamesToLoad(page: Page, order: string): Promise<void> {
  await page.waitForResponse(async (response) => {
    const request = response.request()

    // Check if the request method is POST and the URL matches your endpoint
    if (request.method() === 'POST' && request.url().includes('/subgraphs/name')) {
      const postData = request.postData()

      // Parse the JSON payload to access the operationName
      if (postData) {
        const parsedData = JSON.parse(postData)
        return (
          parsedData.operationName === 'getNamesForAddress' &&
          parsedData.variables.orderDirection === order
        )
      }
    }

    return false
  })
}

test('Should display all expiry data', async ({ page, login, makeName }) => {
  await testClient.increaseTime({ seconds: 3 * 365 * 24 * 60 * 60 })
  await testClient.mine({ blocks: 1 })

  const temp: Name[] = Array.from({ length: 20 }).map((_, i) => ({
    label: `wrapped-${i}`,
    owner: 'user3',
    type: 'wrapped',
    duration: 3600 + i * 10,
  }))

  const names = await makeName(temp)

  await page.goto('/')
  await login.connect('user3')
  await page.goto('/my/names')

  await page.waitForSelector('[data-testid="names-list"]')

  const nameLinks = page.locator('[data-testid="names-list"] div div a')

  expect(await nameLinks.count()).toBe(20)
  for (let i = 0; i < 20; i += 1) {
    checkLinkText(nameLinks, i, names[i])
  }
})

test('Should display all expiry data (name-list > 20)', async ({ page, login, makeName }) => {
  await testClient.increaseTime({ seconds: 3 * 365 * 24 * 60 * 60 })
  await testClient.mine({ blocks: 1 })

  const temp: Name[] = Array.from({ length: 30 }).map((_, i) => ({
    label: `wrapped-${i}`,
    owner: 'user3',
    type: 'wrapped',
    duration: 3600 + i * 10,
  }))

  const names = await makeName(temp)

  await page.goto('/')
  await login.connect('user3')
  await page.goto('/my/names')

  await page.waitForSelector('[data-testid="names-list"]')

  const nameLinks = page.locator('[data-testid="names-list"] div div a')

  expect(await nameLinks.count()).toBe(20)

  for (let i = 0; i < 20; i += 1) {
    checkLinkText(nameLinks, i, names[i])
  }

  await scrollToBottom(page)
  await waitForNamesToLoad(page, 'asc')

  expect(await nameLinks.count()).toBe(30)
  for (let i = 20; i < 30; i += 1) {
    checkLinkText(nameLinks, i, names[i])
  }
})

test('Should display all expiry data (desc)', async ({ page, login, makeName }) => {
  await testClient.increaseTime({ seconds: 3 * 365 * 24 * 60 * 60 })
  await testClient.mine({ blocks: 1 })

  const temp: Name[] = Array.from({ length: 30 }).map((_, i) => ({
    label: `wrapped-${i}`,
    owner: 'user3',
    type: 'wrapped',
    duration: 3600 + i * 10,
  }))

  const names = await makeName(temp)

  await page.goto('/')
  await login.connect('user3')
  await page.goto('/my/names')

  await page.waitForSelector('[data-testid="names-list"]')

  const nameLinks = page.locator('[data-testid="names-list"] div div a')
  const descButton = page.locator('[data-testid="direction-button-desc"]')

  expect(await nameLinks.count()).toBe(20)

  for (let i = 0; i < 20; i += 1) {
    checkLinkText(nameLinks, i, names[i])
  }

  await scrollToBottom(page)
  await waitForNamesToLoad(page, 'asc')

  expect(await nameLinks.count()).toBe(30)
  for (let i = 20; i < 30; i += 1) {
    checkLinkText(nameLinks, i, names[i])
  }

  await descButton.click()
  await waitForNamesToLoad(page, 'desc')

  for (let i = 0; i < 20; i += 1) {
    checkLinkText(nameLinks, i, names[29 - i])
  }

  expect(await nameLinks.count()).toBe(20)

  await scrollToBottom(page)
  await waitForNamesToLoad(page, 'desc')

  expect(await nameLinks.count()).toBe(30)

  for (let i = 20; i < 30; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    await checkLinkText(nameLinks, i, names[29 - i])
  }
})

test('Should display all expiry data (no expiry time)', async ({ page, login, makeName }) => {
  await testClient.increaseTime({ seconds: 3 * 365 * 24 * 60 * 60 })
  await testClient.mine({ blocks: 1 })

  const temp: Omit<WrappedSubname, 'name' | 'nameOwner'>[] = Array.from({ length: 30 }).map(
    (_, i) => ({
      label: `subname-${i}`,
      owner: 'user3',
    }),
  )

  const tempNames: Name = {
    label: 'wrapped',
    type: 'wrapped',
    duration: 3600,
    subnames: [...temp],
  }

  const name = await makeName(tempNames)

  await page.goto('/')
  await login.connect('user3')
  await page.goto('/my/names')

  await page.waitForSelector('[data-testid="names-list"]')

  const nameLinks = page.locator('[data-testid="names-list"] div div a')
  const descButton = page.locator('[data-testid="direction-button-desc"]')

  await page.pause()

  tempSubnames = temp.map(({ label }) => `${label}.${name}`)

  expect(await nameLinks.count()).toBe(20)
  for (let i = 0; i < 20; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    expect(await nameLinks.nth(i).textContent()).toMatch(/subname-\d+\.wrapped/)
  }

  await scrollToBottom(page)
  await waitForNamesToLoad(page, 'asc')

  for (let i = 20; i < 30; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    expect(await nameLinks.nth(i).textContent()).toMatch(/subname-\d+\.wrapped/)
  }

  await descButton.click()

  for (let i = 0; i < 20; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    expect(await nameLinks.nth(i).textContent()).toMatch(/subname-\d+\.wrapped/)
  }
  expect(await nameLinks.count()).toBe(20)

  await scrollToBottom(page)
  await waitForNamesToLoad(page, 'desc')

  for (let i = 20; i < 30; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    expect(await nameLinks.nth(i).textContent()).toMatch(/subname-\d+\.wrapped/)
  }

  expect(await nameLinks.count()).toBe(30)

  console.log('Cleaning up temp subnames')
  for (const subname of tempSubnames) {
    console.log(`Deleting subname: ${subname}`)
    // eslint-disable-next-line no-await-in-loop
    await deleteSubname(walletClient, {
      name: subname,
      contract: 'nameWrapper',
      account: createAccounts().getAddress('user3') as Address,
    })
  }
  tempSubnames = []
  await page.pause()
})

test('Should display all expiry data (10 same expiry)', async ({ page, login, makeName }) => {
  await testClient.increaseTime({ seconds: 3 * 365 * 24 * 60 * 60 })
  await testClient.mine({ blocks: 1 })

  const temp: Name[] = Array.from({ length: 30 }).map((_, i) => ({
    label: `wrapped-${i}`,
    owner: 'user3',
    type: 'wrapped',
    duration: i < 10 ? 3600 : 3600 + i * 10,
  }))

  const names = await makeName(temp)

  await page.goto('/')
  await login.connect('user3')
  await page.goto('/my/names')

  await page.waitForSelector('[data-testid="names-list"]')

  const nameLinks = page.locator('[data-testid="names-list"] div div a')
  const descButton = page.locator('[data-testid="direction-button-desc"]')

  expect(await nameLinks.count()).toBe(20)

  for (let i = 0; i < 10; i += 1) {
    expect(page.getByText(`${names[i]}`)).toBeVisible({ timeout: 15000 })
  }
  for (let i = 10; i < 20; i += 1) {
    checkLinkText(nameLinks, i, names[i])
  }

  await scrollToBottom(page)
  await waitForNamesToLoad(page, 'asc')

  expect(await nameLinks.count()).toBe(30)
  for (let i = 20; i < 30; i += 1) {
    checkLinkText(nameLinks, i, names[i])
  }

  await descButton.click()

  for (let i = 0; i < 20; i += 1) {
    checkLinkText(nameLinks, i, names[29 - i])
  }

  expect(await nameLinks.count()).toBe(20)

  await scrollToBottom(page)
  await waitForNamesToLoad(page, 'desc')

  expect(await nameLinks.count()).toBe(30)

  for (let i = 20; i < 30; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    await expect(page.getByText(`${names[i]}`)).toBeVisible({ timeout: 15000 })
  }
})

test('Should display all expiry data (30 same expiry)', async ({ page, login, makeName }) => {
  await testClient.increaseTime({ seconds: 3 * 365 * 24 * 60 * 60 })
  await testClient.mine({ blocks: 1 })

  const temp: Name[] = Array.from({ length: 44 }).map((_, i) => ({
    label: `wrapped-${i}`,
    owner: 'user3',
    type: 'wrapped',
    duration: i < 30 ? 3600 : 3600 + i * 10,
  }))

  const names = await makeName(temp)

  await page.goto('/')
  await login.connect('user3')
  await page.goto('/my/names')

  await page.waitForSelector('[data-testid="names-list"]')

  const nameLinks = page.locator('[data-testid="names-list"] div div a')
  const descButton = page.locator('[data-testid="direction-button-desc"]')

  expect(await nameLinks.count()).toBe(20)

  for (let i = 0; i < 20; i += 1) {
    expect(page.getByText(`${names[i]}`)).toBeVisible({ timeout: 15000 })
  }

  await scrollToBottom(page)
  await waitForNamesToLoad(page, 'asc')

  expect(await nameLinks.count()).toBe(40)

  for (let i = 20; i < 30; i += 1) {
    expect(page.getByText(`${names[i]}`)).toBeVisible({ timeout: 15000 })
  }
  for (let i = 30; i < 40; i += 1) {
    checkLinkText(nameLinks, i, names[i])
  }

  await scrollToBottom(page)

  for (let i = 40; i < 44; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    await checkLinkText(nameLinks, i, names[i])
  }

  await descButton.click()
  await waitForNamesToLoad(page, 'desc')

  for (let i = 0; i <= 10; i += 1) {
    checkLinkText(nameLinks, i, names[43 - i])
  }

  expect(await nameLinks.count()).toBe(20)

  await scrollToBottom(page)
  await waitForNamesToLoad(page, 'desc')

  expect(await nameLinks.count()).toBe(40)

  await scrollToBottom(page)
  await page.waitForFunction(
    () => {
      const elements = document.querySelectorAll('[data-testid="names-list"] div div a')
      return elements.length === 44
    },
    { timeout: 15000 },
  )
  expect(await nameLinks.count()).toBe(44)

  for (let i = 20; i < 44; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    await expect(page.getByText(`${names[i]}`)).toBeVisible({ timeout: 15000 })
  }
})

test('Should display all expiry data (30 same expiry, legacy)', async ({
  page,
  login,
  makeName,
}) => {
  await testClient.increaseTime({ seconds: 3 * 365 * 24 * 60 * 60 })
  await testClient.mine({ blocks: 1 })

  const temp: Name[] = Array.from({ length: 44 }).map((_, i) => ({
    label: `legacy-${i}`,
    owner: 'user3',
    type: 'legacy',
    duration: i < 30 ? 3600 : 3600 + i * 10,
  }))

  const names = await makeName(temp)

  await page.goto('/')
  await login.connect('user3')
  await page.goto('/my/names')

  await page.waitForSelector('[data-testid="names-list"]')

  const nameLinks = page.locator('[data-testid="names-list"] div div a')
  const descButton = page.locator('[data-testid="direction-button-desc"]')

  await page.pause()

  expect(await nameLinks.count()).toBe(20)

  for (let i = 0; i < 20; i += 1) {
    expect(page.getByText(`${names[i]}`)).toBeVisible({ timeout: 15000 })
  }

  await scrollToBottom(page)
  await waitForNamesToLoad(page, 'asc')

  expect(await nameLinks.count()).toBe(40)

  for (let i = 20; i < 30; i += 1) {
    expect(page.getByText(`${names[i]}`)).toBeVisible({ timeout: 15000 })
  }
  for (let i = 30; i < 40; i += 1) {
    checkLinkText(nameLinks, i, names[i])
  }

  await scrollToBottom(page)

  for (let i = 40; i < 44; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    await checkLinkText(nameLinks, i, names[i])
  }

  await descButton.click()
  await waitForNamesToLoad(page, 'desc')

  for (let i = 0; i <= 10; i += 1) {
    checkLinkText(nameLinks, i, names[43 - i])
  }

  expect(await nameLinks.count()).toBe(20)

  await scrollToBottom(page)
  await waitForNamesToLoad(page, 'desc')

  expect(await nameLinks.count()).toBe(40)

  await scrollToBottom(page)
  await page.waitForFunction(
    () => {
      const elements = document.querySelectorAll('[data-testid="names-list"] div div a')
      return elements.length === 44
    },
    { timeout: 15000 },
  )
  expect(await nameLinks.count()).toBe(44)

  for (let i = 20; i < 44; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    await expect(page.getByText(`${names[i]}`)).toBeVisible({ timeout: 15000 })
  }
})

test('Should display all expiry data (30 same expiry, subnames)', async ({
  page,
  login,
  makeName,
}) => {
  await testClient.increaseTime({ seconds: 3 * 365 * 24 * 60 * 60 })
  await testClient.mine({ blocks: 1 })

  const temp: Omit<WrappedSubname, 'name' | 'nameOwner'>[] = Array.from({ length: 30 }).map(
    (_, i) => ({
      label: `subname-${i}`,
      owner: 'user3',
      duration: 3600 * 3600, // set to high => default to parent duration (result is same expiry date for all subnames)
      fuses: {
        parent: {
          named: ['PARENT_CANNOT_CONTROL'],
        },
      },
    }),
  )
  const temp2: Omit<WrappedSubname, 'name' | 'nameOwner'>[] = Array.from({ length: 14 }).map(
    (_, i) => ({
      label: `subname-${i}`,
      owner: 'user3',
      duration: 3600 * 24 * 30 * 3 + i,
      fuses: {
        parent: {
          named: ['PARENT_CANNOT_CONTROL'],
        },
      },
    }),
  )
  const tempNames: Name[] = [
    {
      label: 'wrapped',
      type: 'wrapped',
      duration: -3600,
      fuses: {
        named: ['CANNOT_UNWRAP'],
      },
      subnames: [...temp],
    },
    {
      label: 'wrapped-2nd',
      type: 'wrapped',
      duration: 3600 * 24 * 30 * 4,
      fuses: {
        named: ['CANNOT_UNWRAP'],
      },
      subnames: [...temp2],
    },
  ]

  const names = await makeName(tempNames)

  tempSubnames = names.flatMap((name, i) => {
    const subnames = i === 0 ? temp : temp2
    return subnames.map(({ label }) => `${label}.${name}`)
  })

  await page.goto('/')
  await login.connect('user3')
  await page.goto('/my/names')

  await page.pause()
  await page.waitForSelector('[data-testid="names-list"]')

  const nameLinks = page.locator('[data-testid="names-list"] div div a')
  const descButton = page.locator('[data-testid="direction-button-desc"]')

  // await page.pause()

  expect(await nameLinks.count()).toBe(20)

  for (let i = 0; i < 20; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    expect(await nameLinks.nth(i).textContent()).toMatch(/subname-\d+\.wrapped/)
  }

  await scrollToBottom(page)
  await waitForNamesToLoad(page, 'asc')

  expect(await nameLinks.count()).toBe(40)

  for (let i = 20; i < 30; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    expect(await nameLinks.nth(i).textContent()).toMatch(/subname-\d+\.wrapped/)
  }
  for (let i = 30; i < 40; i += 1) {
    checkLinkText(nameLinks, i, `subname-${i - 30}.wrapped-2nd`)
  }

  await scrollToBottom(page)

  for (let i = 40; i < 44; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    await checkLinkText(nameLinks, i, `subname-${i - 30}.wrapped-2nd`)
  }

  await descButton.click()
  await waitForNamesToLoad(page, 'desc')

  expect(await nameLinks.count()).toBe(20)

  for (let i = 0; i < 14; i += 1) {
    checkLinkText(nameLinks, i, `subname-${13 - i}.wrapped-2nd`)
  }

  for (let i = 14; i < 20; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    expect(await nameLinks.nth(i).textContent()).toMatch(/subname-\d+\.wrapped/)
  }

  await scrollToBottom(page)
  await waitForNamesToLoad(page, 'desc')

  expect(await nameLinks.count()).toBe(40)

  for (let i = 20; i < 40; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    expect(await nameLinks.nth(i).textContent()).toMatch(/subname-\d+\.wrapped/)
  }

  await scrollToBottom(page)
  await page.waitForFunction(
    () => {
      const elements = document.querySelectorAll('[data-testid="names-list"] div div a')
      return elements.length === 44
    },
    { timeout: 15000 },
  )
  expect(await nameLinks.count()).toBe(44)

  for (let i = 40; i < 44; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    expect(await nameLinks.nth(i).textContent()).toMatch(/subname-\d+\.wrapped/)
  }
})

test('Should display all expiry data (mix expiry/no expiry)', async ({ page, login, makeName }) => {
  await testClient.increaseTime({ seconds: 3 * 365 * 24 * 60 * 60 })
  await testClient.mine({ blocks: 1 })

  const temp: Omit<WrappedSubname, 'name' | 'nameOwner'>[] = Array.from({ length: 20 }).map(
    (_, i) => ({
      label: `subname-${i}`,
      owner: 'user3',
    }),
  )

  const temp2: Omit<WrappedSubname, 'name' | 'nameOwner'>[] = Array.from({ length: 10 }).map(
    (_, i) => ({
      label: `subname-${i}`,
      owner: 'user3',
      duration: 3600 + i,
      fuses: {
        parent: {
          named: ['PARENT_CANNOT_CONTROL'],
        },
      },
    }),
  )

  const tempNames: Name[] = [
    {
      label: 'wrapped-no-expiry',
      type: 'wrapped',
      duration: 3600,
      subnames: [...temp],
    },
    {
      label: 'wrapped-expiry',
      type: 'wrapped',
      duration: 3600,
      fuses: {
        named: ['CANNOT_UNWRAP'],
      },
      subnames: [...temp2],
    },
  ]

  await makeName(tempNames)

  await page.goto('/')
  await login.connect('user3')
  await page.goto('/my/names')

  await page.waitForSelector('[data-testid="names-list"]')

  const nameLinks = page.locator('[data-testid="names-list"] div div a')
  const descButton = page.locator('[data-testid="direction-button-desc"]')

  expect(await nameLinks.count()).toBe(20)
  await page.pause()
  for (let i = 0; i < 10; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    expect(await nameLinks.nth(i).textContent()).toMatch(/subname-\d+\.wrapped-expiry/)
  }

  await scrollToBottom(page)
  await waitForNamesToLoad(page, 'asc')

  expect(await nameLinks.count()).toBe(30)

  for (let i = 10; i < 30; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    expect(await nameLinks.nth(i).textContent()).toMatch(/subname-\d+\.wrapped-no-expiry/)
  }

  await descButton.click()
  await waitForNamesToLoad(page, 'desc')

  expect(await nameLinks.count()).toBe(20)
  for (let i = 0; i < 20; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    expect(await nameLinks.nth(i).textContent()).toMatch(/subname-\d+\.wrapped-no-expiry/)
  }

  await scrollToBottom(page)
  await waitForNamesToLoad(page, 'desc')

  expect(await nameLinks.count()).toBe(30)

  for (let i = 20; i < 30; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    expect(await nameLinks.nth(i).textContent()).toMatch(/subname-\d+\.wrapped-expiry/)
  }
})
