import { describe } from 'node:test'

import { expect } from '@playwright/test'
import { test } from '@root/playwright'

import { DENTITY_VPTOKEN_ENDPOINT, DENTITY_ISS, VERIFICATION_OAUTH_BASE_URL } from '@app/constants/verification'

describe('Validations', () => {
  test('Should allow manager of unwrapped name to complete adding verification record', async ({ page, login, accounts, makeName, makePageObject }) => {
    const name = await makeName({
      label: 'dentity',
      type: 'legacy',
      owner: 'user2',
      manager: 'user',
    })

    const transactionModal = makePageObject('TransactionModal')

    await page.route(`${VERIFICATION_OAUTH_BASE_URL}/dentity/token`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          name: name,
          address: accounts.getAddress('user2'),
          token: 'federated_token',
        }),
      })
    })

    await page.route(`${DENTITY_VPTOKEN_ENDPOINT}`, async (route) => {
      await route.fulfill({})
    })

    await page.goto(`/?iss=${DENTITY_ISS}&code=dummyCode`)
    await login.connect()

    await expect(page).toHaveURL(`/${name}`)

    await expect(transactionModal.transactionModal).toBeVisible()
    await transactionModal.autoComplete()

    await expect(page.getByTestId('profile-section-verifications')).toBeVisible()


    await page.pause()
  })

  test('Should show an error message if user is owner but not manager', async ({ page, login, accounts, makeName }) => {
    const name = await makeName({
      label: 'dentity',
      type: 'legacy',
      owner: 'user',
      manager: 'user2',
    })

    await page.route(`${VERIFICATION_OAUTH_BASE_URL}/dentity/token`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          name: name,
          address: accounts.getAddress('user'),
          token: 'federated_token',
        }),
      })
    })

    await page.goto(`/?iss=${DENTITY_ISS}&code=dummyCode`)
    await login.connect()

    await page.pause()
  })
})
