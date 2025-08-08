/* eslint-disable @typescript-eslint/naming-convention */

import { expect } from '@playwright/test'
import { test } from '@root/playwright'
import { Hash } from 'viem'

import { setRecords } from '@ensdomains/ensjs/wallet'

import {
  DENTITY_ISS,
  DENTITY_VPTOKEN_ENDPOINT,
  VERIFICATION_OAUTH_BASE_URL,
  VERIFICATION_RECORD_KEY,
} from '@app/constants/verification'

import { createAccounts } from '../../../playwright/fixtures/accounts'
import { testClient } from '../../../playwright/fixtures/contracts/utils/addTestContracts'

type MakeMockVPTokenRecordKey =
  | 'com.twitter'
  | 'com.github'
  | 'com.discord'
  | 'org.telegram'
  | 'personhood'
  | 'email'
  | 'ens'

const makeMockVPToken = (
  records: Array<{ key: MakeMockVPTokenRecordKey; value?: string; name?: string }>,
) => {
  return records.map(({ key, value, name }) => ({
    type: [
      'VerifiableCredential',
      {
        'com.twitter': 'VerifiedTwitterAccount',
        'com.github': 'VerifiedGithubAccount',
        'com.discord': 'VerifiedDiscordAccount',
        'org.telegram': 'VerifiedTelegramAccount',
        personhood: 'VerifiedPersonhood',
        email: 'VerifiedEmail',
        ens: 'VerifiedENS',
      }[key],
    ],
    credentialSubject: {
      credentialIssuer: 'Dentity',
      ...(key === 'com.twitter' ? { username: value ?? '@name' } : {}),
      ...(['com.twitter', 'com.github', 'com.discord', 'org.telegram'].includes(key)
        ? { name: value ?? 'name' }
        : {}),
      ...(key === 'email' ? { verifiedEmail: value ?? 'name@email.com' } : {}),
      ...(key === 'ens'
        ? {
            ensName: name ?? 'name.eth',
            ethAddress: value ?? (createAccounts().getAddress('user') as Hash),
          }
        : {}),
    },
  }))
}

test.describe('Verified records', () => {
  test('Should show badges if records match ', async ({ page, makePageObject, makeName }) => {
    const name = await makeName({
      label: 'dentity',
      type: 'wrapped',
      owner: 'user',
      records: {
        texts: [
          {
            key: 'com.twitter',
            value: '@name',
          },
          {
            key: 'org.telegram',
            value: 'name',
          },
          {
            key: 'com.discord',
            value: 'name',
          },
          {
            key: 'com.github',
            value: 'name',
          },
          {
            key: 'email',
            value: 'name@email.com',
          },
          {
            key: VERIFICATION_RECORD_KEY,
            value: JSON.stringify([
              `${DENTITY_VPTOKEN_ENDPOINT}?name=name.eth&federated_token=federated_token`,
            ]),
          },
          {
            key: 'com.twitter',
            value: '@name',
          },
        ],
      },
    })

    const profilePage = makePageObject('ProfilePage')

    await page.route(`${DENTITY_VPTOKEN_ENDPOINT}*`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          vp_token: makeMockVPToken([
            { key: 'com.twitter' },
            { key: 'com.github' },
            { key: 'com.discord' },
            { key: 'org.telegram' },
            { key: 'personhood' },
            { key: 'email' },
            { key: 'ens', name },
          ]),
        }),
      })
    })

    await page.goto(`/${name}`)
    // await login.connect()

    await expect(page.getByTestId('profile-section-verifications')).toBeVisible()

    await profilePage.isRecordVerified('text', 'com.twitter')
    await profilePage.isRecordVerified('text', 'org.telegram')
    await profilePage.isRecordVerified('text', 'com.github')
    await profilePage.isRecordVerified('text', 'com.discord')
    await profilePage.isRecordVerified('verification', 'dentity')
    await profilePage.isPersonhoodVerified()

    await expect(profilePage.record('verification', 'dentity')).toBeVisible()
  })

  test('Should not show badges if records do not match ', async ({
    page,
    accounts,
    makePageObject,
    makeName,
  }) => {
    const name = await makeName({
      label: 'dentity',
      type: 'wrapped',
      owner: 'user',
      records: {
        texts: [
          {
            key: 'com.twitter',
            value: '@name2',
          },
          {
            key: 'org.telegram',
            value: 'name2',
          },
          {
            key: 'com.discord',
            value: 'name2',
          },
          {
            key: 'com.github',
            value: 'name2',
          },
          {
            key: VERIFICATION_RECORD_KEY,
            value: JSON.stringify([
              `${DENTITY_VPTOKEN_ENDPOINT}?name=name.eth&federated_token=federated_token`,
            ]),
          },
          {
            key: 'com.twitter',
            value: '@name2',
          },
        ],
      },
    })

    const profilePage = makePageObject('ProfilePage')

    await page.route(`${DENTITY_VPTOKEN_ENDPOINT}*`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          ens_name: name,
          eth_address: accounts.getAddress('user2'),
          vp_token: makeMockVPToken([
            { key: 'com.twitter' },
            { key: 'com.github' },
            { key: 'com.discord' },
            { key: 'org.telegram' },
            { key: 'ens', name },
          ]),
        }),
      })
    })

    await page.goto(`/${name}`)

    await expect(page.getByTestId('profile-section-verifications')).toBeVisible()

    await profilePage.isRecordVerified('text', 'com.twitter', false)
    await profilePage.isRecordVerified('text', 'org.telegram', false)
    await profilePage.isRecordVerified('text', 'com.github', false)
    await profilePage.isRecordVerified('text', 'com.discord', false)
    await profilePage.isRecordVerified('verification', 'dentity', false)
    await profilePage.isPersonhoodVerified(false)

    await expect(profilePage.record('verification', 'dentity')).toBeVisible()
    await expect(profilePage.record('verification', 'dentity')).toBeVisible()
  })

  test('Should not show badges if records match but ens credential address does not match', async ({
    page,
    accounts,
    makePageObject,
    makeName,
  }) => {
    const name = await makeName({
      label: 'dentity',
      type: 'wrapped',
      owner: 'user',
      records: {
        texts: [
          {
            key: 'com.twitter',
            value: '@name',
          },
          {
            key: 'org.telegram',
            value: 'name',
          },
          {
            key: 'com.discord',
            value: 'name',
          },
          {
            key: 'com.github',
            value: 'name',
          },
          {
            key: VERIFICATION_RECORD_KEY,
            value: JSON.stringify([
              `${DENTITY_VPTOKEN_ENDPOINT}?name=name.eth&federated_token=federated_token`,
            ]),
          },
        ],
      },
    })

    const profilePage = makePageObject('ProfilePage')

    await page.route(`${DENTITY_VPTOKEN_ENDPOINT}*`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          ens_name: name,
          eth_address: accounts.getAddress('user2'),
          vp_token: makeMockVPToken([
            { key: 'com.twitter' },
            { key: 'com.github' },
            { key: 'com.discord' },
            { key: 'org.telegram' },
            { key: 'ens', name, value: accounts.getAddress('user2') },
          ]),
        }),
      })
    })

    await page.goto(`/${name}`)

    await expect(page.getByTestId('profile-section-verifications')).toBeVisible()

    await profilePage.isRecordVerified('text', 'com.twitter', false)
    await profilePage.isRecordVerified('text', 'org.telegram', false)
    await profilePage.isRecordVerified('text', 'com.github', false)
    await profilePage.isRecordVerified('text', 'com.discord', false)
    await profilePage.isRecordVerified('verification', 'dentity', false)
    await profilePage.isPersonhoodVerified(false)

    await expect(profilePage.record('verification', 'dentity')).toBeVisible()
    await expect(profilePage.record('verification', 'dentity')).toBeVisible()
  })

  test('Should not show badges if records match but ens credential name does not match', async ({
    page,
    accounts,
    makePageObject,
    makeName,
  }) => {
    const name = await makeName({
      label: 'dentity',
      type: 'wrapped',
      owner: 'user',
      records: {
        texts: [
          {
            key: 'com.twitter',
            value: '@name',
          },
          {
            key: 'org.telegram',
            value: 'name',
          },
          {
            key: 'com.discord',
            value: 'name',
          },
          {
            key: 'com.github',
            value: 'name',
          },
          {
            key: VERIFICATION_RECORD_KEY,
            value: JSON.stringify([
              `${DENTITY_VPTOKEN_ENDPOINT}?name=name.eth&federated_token=federated_token`,
            ]),
          },
        ],
      },
    })

    const profilePage = makePageObject('ProfilePage')

    await page.route(`${DENTITY_VPTOKEN_ENDPOINT}*`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          ens_name: name,
          eth_address: accounts.getAddress('user2'),
          vp_token: makeMockVPToken([
            { key: 'com.twitter' },
            { key: 'com.github' },
            { key: 'com.discord' },
            { key: 'org.telegram' },
            { key: 'ens', name: 'differentName.eth' },
          ]),
        }),
      })
    })

    await page.goto(`/${name}`)

    await expect(page.getByTestId('profile-section-verifications')).toBeVisible()

    await profilePage.isRecordVerified('text', 'com.twitter', false)
    await profilePage.isRecordVerified('text', 'org.telegram', false)
    await profilePage.isRecordVerified('text', 'com.github', false)
    await profilePage.isRecordVerified('text', 'com.discord', false)
    await profilePage.isRecordVerified('verification', 'dentity', false)
    await profilePage.isPersonhoodVerified(false)

    await expect(profilePage.record('verification', 'dentity')).toBeVisible()
    await expect(profilePage.record('verification', 'dentity')).toBeVisible()
  })

  test('Should show error icon on verication button if VerifiedENS credential is not validated', async ({
    page,
    login,
    makePageObject,
    makeName,
  }) => {
    const name = await makeName({
      label: 'dentity',
      type: 'wrapped',
      owner: 'user',
      records: {
        texts: [
          {
            key: 'com.twitter',
            value: '@name',
          },
          {
            key: 'org.telegram',
            value: 'name',
          },
          {
            key: 'com.discord',
            value: 'name',
          },
          {
            key: 'com.github',
            value: 'name',
          },
          {
            key: 'email',
            value: 'name@email.com',
          },
          {
            key: VERIFICATION_RECORD_KEY,
            value: JSON.stringify([
              `${DENTITY_VPTOKEN_ENDPOINT}?name=name.eth&federated_token=federated_token`,
            ]),
          },
          {
            key: 'com.twitter',
            value: '@name',
          },
        ],
      },
    })

    const profilePage = makePageObject('ProfilePage')

    await page.route(`${DENTITY_VPTOKEN_ENDPOINT}*`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          vp_token: makeMockVPToken([
            { key: 'com.twitter' },
            { key: 'com.github' },
            { key: 'com.discord' },
            { key: 'org.telegram' },
            { key: 'personhood' },
            { key: 'email' },
            { key: 'ens', name: 'othername.eth' },
          ]),
        }),
      })
    })

    await page.goto(`/${name}`)
    await login.connect()

    await expect(page.getByTestId('profile-section-verifications')).toBeVisible()

    await profilePage.isRecordVerified('text', 'com.twitter', false)
    await profilePage.isRecordVerified('text', 'org.telegram', false)
    await profilePage.isRecordVerified('text', 'com.github', false)
    await profilePage.isRecordVerified('text', 'com.discord', false)
    await profilePage.isRecordVerified('verification', 'dentity', false)
    await profilePage.isPersonhoodErrored()

    await expect(profilePage.record('verification', 'dentity')).toBeVisible()
  })
})

test.describe('Verify profile', () => {
  test('Should allow manager to verify profile', async ({
    page,
    login,
    makeName,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'dentity',
      type: 'legacy',
      owner: 'user2',
      manager: 'user',
    })

    const verificationsModal = makePageObject('VerificationsModal')
    const profilePage = makePageObject('ProfilePage')

    await page.route(`${DENTITY_VPTOKEN_ENDPOINT}*`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          vp_token: makeMockVPToken([
            { key: 'personhood' },
            { key: 'com.twitter' },
            { key: 'com.github' },
            { key: 'com.discord' },
            { key: 'org.telegram' },
          ]),
        }),
      })
    })

    await profilePage.goto(name)
    await login.connect()

    await expect(profilePage.verificationsButton).toBeVisible()
    await profilePage.verificationsButton.click()

    await expect(verificationsModal.verificationOption('Dentity')).toBeVisible()
    await verificationsModal.isVerificationOptionAdded('Dentity', false)
    await verificationsModal.verificationOption('Dentity').click()

    await expect(verificationsModal.removeVerificationOption('Dentity')).toHaveCount(0)
  })

  test('Should disable verifications button if user is owner but not manager of a name', async ({
    page,
    login,
    makeName,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'dentity',
      type: 'legacy',
      owner: 'user',
      manager: 'user2',
    })

    const profilePage = makePageObject('ProfilePage')

    await page.route(`${DENTITY_VPTOKEN_ENDPOINT}*`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          vp_token: makeMockVPToken([
            { key: 'personhood' },
            { key: 'com.twitter' },
            { key: 'com.github' },
            { key: 'com.discord' },
            { key: 'org.telegram' },
          ]),
        }),
      })
    })

    await profilePage.goto(name)
    await login.connect()

    await expect(profilePage.disabledVerificationsButton).toBeVisible()
  })

  test('Should be able to delete verifications record for name', async ({
    page,
    login,
    makeName,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'dentity',
      type: 'legacy',
      owner: 'user2',
      manager: 'user',
      records: {
        texts: [
          {
            key: 'com.twitter',
            value: '@name',
          },
          {
            key: 'org.telegram',
            value: 'name',
          },
          {
            key: 'com.discord',
            value: 'name',
          },
          {
            key: 'com.github',
            value: 'name',
          },
          {
            key: VERIFICATION_RECORD_KEY,
            value: JSON.stringify([
              `${DENTITY_VPTOKEN_ENDPOINT}?name=name.eth&federated_token=federated_token`,
            ]),
          },
          {
            key: 'com.twitter',
            value: '@name',
          },
        ],
      },
    })

    const verificationsModal = makePageObject('VerificationsModal')
    const profilePage = makePageObject('ProfilePage')
    const transactionModal = makePageObject('TransactionModal')

    await page.route(`${DENTITY_VPTOKEN_ENDPOINT}*`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          vp_token: makeMockVPToken([
            { key: 'personhood' },
            { key: 'com.twitter' },
            { key: 'com.github' },
            { key: 'com.discord' },
            { key: 'org.telegram' },
            { key: 'ens', name, value: createAccounts().getAddress('user2') },
          ]),
        }),
      })
    })

    await profilePage.goto(name)
    await login.connect()

    await expect(page.getByTestId('profile-section-verifications')).toBeVisible()

    await profilePage.isRecordVerified('text', 'com.twitter')
    await profilePage.isRecordVerified('text', 'org.telegram')
    await profilePage.isRecordVerified('text', 'com.github')
    await profilePage.isRecordVerified('text', 'com.discord')
    await profilePage.isRecordVerified('verification', 'dentity')
    await profilePage.isPersonhoodVerified()

    await expect(profilePage.verificationsButton).toBeVisible()
    await profilePage.verificationsButton.click()

    await expect(verificationsModal.verificationOption('Dentity')).toBeVisible()
    await verificationsModal.isVerificationOptionAdded('Dentity')
    await verificationsModal.verificationOption('Dentity').click()

    await expect(verificationsModal.removeVerificationOption('Dentity')).toHaveCount(1)
    await verificationsModal.removeVerificationOption('Dentity').click()

    await transactionModal.autoComplete()

    await profilePage.isRecordVerified('text', 'com.twitter', false)
    await profilePage.isRecordVerified('text', 'org.telegram', false)
    await profilePage.isRecordVerified('text', 'com.github', false)
    await profilePage.isRecordVerified('text', 'com.discord', false)
    await profilePage.isRecordVerified('verification', 'dentity', false)
    await profilePage.isPersonhoodVerified(false)
  })
})

test.describe('OAuth flow', () => {
  test('Should allow manager of unwrapped name to complete adding verification record', async ({
    page,
    login,
    makeName,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'dentity',
      type: 'legacy',
      owner: 'user2',
      manager: 'user',
      records: {
        texts: [
          {
            key: 'com.twitter',
            value: '@name',
          },
          {
            key: 'org.telegram',
            value: 'name',
          },
          {
            key: 'com.discord',
            value: 'name',
          },
          {
            key: 'com.github',
            value: 'name',
          },
        ],
      },
    })

    const transactionModal = makePageObject('TransactionModal')
    const profilePage = makePageObject('ProfilePage')

    await page.route(`${VERIFICATION_OAUTH_BASE_URL}/dentity/token`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          name,
          verifiedPresentationUri: `${DENTITY_VPTOKEN_ENDPOINT}?name=${name}&federated_token=federated_token`,
        }),
      })
    })

    await page.route(`${DENTITY_VPTOKEN_ENDPOINT}*`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          vp_token: makeMockVPToken([
            { key: 'personhood' },
            { key: 'com.twitter' },
            { key: 'com.github' },
            { key: 'com.discord' },
            { key: 'org.telegram' },
            { key: 'ens', name, value: createAccounts().getAddress('user2') },
          ]),
        }),
      })
    })

    await page.goto('/')
    await login.connect()

    await page.goto(`/?iss=${DENTITY_ISS}&code=dummyCode`)

    await expect(page).toHaveURL(`/${name}`)

    await expect(transactionModal.transactionModal).toBeVisible()
    await transactionModal.autoComplete()

    await expect(page.getByTestId('profile-section-verifications')).toBeVisible()

    await expect(profilePage.record('verification', 'dentity')).toBeVisible()

    await profilePage.isRecordVerified('text', 'com.twitter')
    await profilePage.isRecordVerified('text', 'org.telegram')
    await profilePage.isRecordVerified('text', 'com.github')
    await profilePage.isRecordVerified('text', 'com.discord')
    await profilePage.isRecordVerified('verification', 'dentity')
    await profilePage.isPersonhoodVerified()
  })

  test('Should show an error message if user is owner but not manager', async ({
    page,
    login,
    makeName,
  }) => {
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
          name,
          verifiedPresentationUri: `${DENTITY_VPTOKEN_ENDPOINT}?name=${name}&federated_token=federated_token`,
        }),
      })
    })

    await page.goto(`/?iss=${DENTITY_ISS}&code=dummyCode`)
    await login.connect()

    await expect(page.getByText('Verification failed')).toBeVisible()
    await expect(
      page.getByText(
        'You must be connected as the Manager of this name to set the verification record. You can view and update the Manager under the Ownership tab.',
      ),
    ).toBeVisible()

    await login.switchTo('user2')

    // Page should redirect to the profile page
    await expect(page).toHaveURL(`/${name}`)
  })

  test('Should show an error message if user is not logged in', async ({
    page,
    login,
    makeName,
  }) => {
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
          name,
          verifiedPresentationUri: `${DENTITY_VPTOKEN_ENDPOINT}?name=${name}&federated_token=federated_token`,
        }),
      })
    })

    await page.goto(`/?iss=${DENTITY_ISS}&code=dummyCode`)

    await expect(page.getByText('Verification failed')).toBeVisible()
    await expect(
      page.getByText('You must be connected as 0x709...c79C8 to set the verification record.'),
    ).toBeVisible()

    await page.locator('.modal').getByRole('button', { name: 'Done' }).click()

    await page.route(`${VERIFICATION_OAUTH_BASE_URL}/dentity/token`, async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          error_msg: 'Unauthorized',
        }),
      })
    })

    await login.connect('user2')
    await page.reload()

    // Page should redirect to the profile page
    await expect(page).toHaveURL(`/${name}`)
  })

  test('Should redirect to profile page without showing set verification record if it already set', async ({
    page,
    login,
    makeName,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'dentity',
      type: 'legacy',
      owner: 'user',
      manager: 'user',
    })

    await setRecords(testClient, {
      name,
      texts: [
        {
          key: VERIFICATION_RECORD_KEY,
          value: JSON.stringify([
            `${DENTITY_VPTOKEN_ENDPOINT}?name=${name}&federated_token=federated_token`,
          ]),
        },
      ],
      resolverAddress: testClient.chain.contracts.legacyPublicResolver.address,
      account: createAccounts().getAddress('user') as Hash,
    })

    await page.route(`${VERIFICATION_OAUTH_BASE_URL}/dentity/token`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          name,
          verifiedPresentationUri: `${DENTITY_VPTOKEN_ENDPOINT}?name=${name}&federated_token=federated_token`,
        }),
      })
    })

    const transactionModal = makePageObject('TransactionModal')

    await page.goto(`/?iss=${DENTITY_ISS}&code=dummyCode`)
    await login.connect('user')

    await expect(page).toHaveURL(`/${name}`)
    await expect(transactionModal.transactionModal).not.toBeVisible()
  })

  test('Should show general error message if other problems occur', async ({ page, makeName }) => {
    const name = await makeName({
      label: 'dentity',
      type: 'legacy',
      owner: 'user',
      manager: 'user',
    })

    await page.route(`${VERIFICATION_OAUTH_BASE_URL}/dentity/token`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          name,
          verifiedPresentationUri: undefined,
        }),
      })
    })

    await page.goto(`/?iss=${DENTITY_ISS}&code=dummyCode`)

    await expect(page.getByText('Verification failed')).toBeVisible()
    await expect(
      page.getByText("We could't verify your account. Please return to Dentity and try again."),
    ).toBeVisible()
  })
})
