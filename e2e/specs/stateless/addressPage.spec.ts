import { expect } from '@playwright/test'
import type { Page } from '@playwright/test'

import { setPrimaryName } from '@ensdomains/ensjs/wallet'

import { test } from '../../../playwright'
import { createAccounts } from '../../../playwright/fixtures/accounts'
import {
  waitForTransaction,
  walletClient,
} from '../../../playwright/fixtures/contracts/utils/addTestContracts'
import type { Login } from '../../../playwright/fixtures/login'

// Constants
const INVALID_RESOLVER = '0x0000000000000000000000000000000000000001'
const UNIVERSAL_RESOLVER_RESOLVE_SELECTOR = '0x82ad56cb' // resolve(bytes,bytes)
const NAMES_LIST_TIMEOUT = 15000
const RETRY_TIMEOUT = 45000

// Helper to get user address consistently
const getUserAddress = () => createAccounts().getAddress('user') as `0x${string}`

// Helper to set primary name and wait for transaction
async function setPrimaryNameAndWait(name: string, userAddress: `0x${string}`) {
  const tx = await setPrimaryName(walletClient, {
    name,
    account: userAddress,
  })
  await waitForTransaction(tx)
}

// Helper to create a name owned by user
async function createUserName(makeName: any, label: string) {
  return makeName({
    label,
    type: 'legacy',
    owner: 'user',
    manager: 'user',
    addr: 'user',
  })
}

// Helper to set an invalid resolver that triggers ContractFunctionExecutionError
async function setInvalidResolver(
  page: Page,
  name: string,
  login: InstanceType<typeof Login>,
  makePageObject: any,
) {
  const morePage = makePageObject('MorePage')
  const transactionModal = makePageObject('TransactionModal')

  await morePage.goto(name)
  await login.connect()

  await morePage.editResolverButton.click()
  await page.getByTestId('custom-resolver-radio').check()
  await page.getByTestId('dogfood').fill(INVALID_RESOLVER)
  await page.getByTestId('update-button').click()
  await transactionModal.autoComplete()
}

// Helper to assert address page loaded gracefully (doesn't crash)
async function assertAddressPageLoaded(page: Page) {
  await page.waitForLoadState('networkidle')

  const hasProfile = await page
    .getByTestId('profile-snippet')
    .isVisible()
    .catch(() => false)
  const hasNoProfile = await page
    .getByTestId('no-profile-snippet')
    .isVisible()
    .catch(() => false)

  expect(hasProfile || hasNoProfile).toBeTruthy()
}

// Helper to intercept and fail RPC calls to test retry logic
async function setupRPCInterception(page: Page, maxFailures: number): Promise<() => number> {
  let requestCount = 0

  await page.route('**/*', async (route) => {
    const request = route.request()
    const url = request.url()

    if (url.includes(':8545') || url.includes('localhost:8545')) {
      try {
        const postData = request.postDataJSON()

        if (postData?.method === 'eth_call') {
          const data = postData?.params?.[0]?.data

          if (data && data.startsWith(UNIVERSAL_RESOLVER_RESOLVE_SELECTOR)) {
            requestCount += 1

            if (requestCount <= maxFailures) {
              // Simulate network error (not ContractFunctionExecutionError)
              await route.abort('failed')
              return
            }
          }
        }
      } catch (e) {
        // If we can't parse the request, continue normally
      }
    }

    await route.continue()
  })

  return () => requestCount
}

test.describe('Address page error handling', () => {
  // Tests for usePrimaryName.ts fix that catches ContractFunctionExecutionError
  // and returns null (graceful failure) while still throwing other errors for retry

  test('should load address page without crashing when getName throws ContractFunctionExecutionError', async ({
    page,
    login,
    makeName,
    makePageObject,
  }) => {
    test.slow()

    // SETUP: Create name with invalid resolver + set as primary name
    const name = await createUserName(makeName, 'error-test-name')
    await setInvalidResolver(page, name, login, makePageObject)

    const profilePage = makePageObject('ProfilePage')
    const transactionModal = makePageObject('TransactionModal')
    await profilePage.goto(name)
    await page.getByText('Set as primary name').click()
    await transactionModal.autoComplete()

    // ACTION: Navigate to address page (triggers getName with invalid resolver)
    const userAddress = getUserAddress()
    await page.goto(`/${userAddress}`)

    // ASSERT: Page loads gracefully without crashing
    await assertAddressPageLoaded(page)

    // ASSERT: Other functionality still works (names list loads)
    await expect(page.getByTestId('names-list')).toBeVisible({ timeout: NAMES_LIST_TIMEOUT })
  })

  test('should retry on non-ContractFunctionExecutionError and not return null early', async ({
    page,
    login,
    makeName,
  }) => {
    test.slow()

    // SETUP: Create valid name and set as primary name
    const name = await createUserName(makeName, 'retry-test-name')
    const userAddress = getUserAddress()
    await setPrimaryNameAndWait(name, userAddress)

    // SETUP: Intercept RPC calls to simulate network failures
    const maxFailures = 2
    const getRequestCount = await setupRPCInterception(page, maxFailures)

    // ACTION: Navigate to address page (triggers getName with simulated failures)
    await page.goto(`/${userAddress}`)
    await login.connect()

    // ASSERT: Page eventually loads after retries
    await page.waitForLoadState('networkidle')
    await expect(page.getByTestId('profile-snippet')).toBeVisible({ timeout: RETRY_TIMEOUT })
    await expect(page.getByTestId('profile-snippet-name')).toContainText(name)

    // ASSERT: Retries occurred (proves non-ContractFunctionExecutionError thrown, not caught)
    const requestCount = getRequestCount()
    expect(requestCount).toBeGreaterThan(maxFailures)
    expect(requestCount).toBeGreaterThanOrEqual(3) // At least 2 failures + 1 success
  })

  test('should display no-profile-snippet when no primary name set with invalid resolver', async ({
    page,
    login,
    makeName,
    makePageObject,
  }) => {
    test.slow()

    // SETUP: Create name with invalid resolver (triggers ContractFunctionExecutionError)
    // Deliberately NOT setting as primary name to test no-primary-name scenario
    const name = await createUserName(makeName, 'no-primary-invalid-resolver')
    await setInvalidResolver(page, name, login, makePageObject)

    // ACTION: Navigate to address page
    const userAddress = getUserAddress()
    await page.goto(`/${userAddress}`)

    // ASSERT: Page loads gracefully showing no-profile-snippet (not profile-snippet)
    await expect(page.getByTestId('no-profile-snippet')).toBeVisible()

    // ASSERT: Names list loads despite invalid resolver on owned name
    await expect(page.getByTestId('names-list')).toBeVisible({ timeout: NAMES_LIST_TIMEOUT })
  })

  test.afterEach(async () => {
    // Clean up: reset primary name after each test
    await setPrimaryName(walletClient, {
      name: '',
      account: getUserAddress(),
    }).catch(() => {
      // Ignore errors during cleanup
    })
  })
})
