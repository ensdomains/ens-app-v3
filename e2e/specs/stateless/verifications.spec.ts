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

const makeMockVPToken = (
  records: Array<
    'com.twitter' | 'com.github' | 'com.discord' | 'org.telegram' | 'personhood' | 'email'
  >,
) => {
  return records.map((record) => ({
    type: [
      'VerifiableCredential',
      {
        'com.twitter': 'VerifiedTwitterAccount',
        'com.github': 'VerifiedGithubAccount',
        'com.discord': 'VerifiedDiscordAccount',
        'org.telegram': 'VerifiedTelegramAccount',
        personhood: 'VerifiedPersonhood',
        email: 'VerifiedEmail',
      }[record],
    ],
    credentialSubject: {
      credentialIssuer: 'Dentity',
      ...(record === 'com.twitter' ? { username: '@name' } : {}),
      ...(['com.twitter', 'com.github', 'com.discord', 'org.telegram'].includes(record)
        ? { name: 'name' }
        : {}),
      ...(record === 'email' ? { verifiedEmail: 'name@email.com' } : {}),
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
            'com.twitter',
            'com.github',
            'com.discord',
            'org.telegram',
            'personhood',
            'email',
          ]),
        }),
      })
    })

    await page.goto(`/${name}`)
    // await login.connect()

    await page.pause()

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
          vp_token: makeMockVPToken(['com.twitter', 'com.github', 'com.discord', 'org.telegram']),
        }),
      })
    })

    await page.goto(`/${name}`)

    await page.pause()

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

  test('Should not show badges if records match but ens credential fails', async ({
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
          vp_token: makeMockVPToken(['com.twitter', 'com.github', 'com.discord', 'org.telegram']),
        }),
      })
    })

    await page.goto(`/${name}`)

    await page.pause()

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
            'personhood',
            'com.twitter',
            'com.github',
            'com.discord',
            'org.telegram',
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
            'personhood',
            'com.twitter',
            'com.github',
            'com.discord',
            'org.telegram',
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
            'personhood',
            'com.twitter',
            'com.github',
            'com.discord',
            'org.telegram',
          ]),
        }),
      })
    })

    await profilePage.goto(name)
    await login.connect()

    await page.pause()

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
    await page.pause()
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
            'personhood',
            'com.twitter',
            'com.github',
            'com.discord',
            'org.telegram',
          ]),
        }),
      })
    })

    await page.goto(`/?iss=${DENTITY_ISS}&code=dummyCode`)
    await login.connect()

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

    await page.pause()

    await expect(page.getByText('Verification failed')).toBeVisible()
    await expect(
      page.getByText(
        'You must be connected as the Manager of this name to set the verification record. You can view and update the Manager under the Ownership tab.',
      ),
    ).toBeVisible()

    await page.pause()
    await login.switchTo('user2')

    // Page should redirect to the profile page
    await expect(page).toHaveURL(`/${name}`)

    await page.pause()
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

    await page.pause()
  })

  test('Should show general error message if other problems occur', async ({
    page,
    login,
    makeName,
  }) => {
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
    await login.connect('user')

    await page.pause()

    await expect(page.getByText('Verification failed')).toBeVisible()
    await expect(
      page.getByText("We could't verify your account. Please return to Dentity and try again."),
    ).toBeVisible()
  })
})
