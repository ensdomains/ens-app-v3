import { expect } from '@playwright/test'

import { setPrimaryName } from '@ensdomains/ensjs/wallet'

import { test } from '../../../playwright'
import { createAccounts } from '../../../playwright/fixtures/accounts'
import {
  waitForTransaction,
  walletClient,
} from '../../../playwright/fixtures/contracts/utils/addTestContracts'

const INVALID_RESOLVER = '0x0000000000000000000000000000000000000001'

test.describe('Address page error handling', () => {
  test('should load address page without crashing when primary name has invalid resolver', async ({
    page,
    login,
    makeName,
    makePageObject,
  }) => {
    test.slow()

    // Create a name for the user
    const name = await makeName({
      label: 'error-test-name',
      type: 'legacy',
      owner: 'user',
      manager: 'user',
      addr: 'user',
    })

    const morePage = makePageObject('MorePage')
    const profilePage = makePageObject('ProfilePage')
    const transactionModal = makePageObject('TransactionModal')

    // Navigate to the name and set an invalid resolver using the UI
    await morePage.goto(name)
    await login.connect()

    await morePage.editResolverButton.click()
    await page.getByTestId('custom-resolver-radio').check()
    await page.getByTestId('dogfood').fill(INVALID_RESOLVER)
    await page.getByTestId('update-button').click()
    await transactionModal.autoComplete()

    // Set this as primary name
    await profilePage.goto(name)
    await page.getByText('Set as primary name').click()
    await transactionModal.autoComplete()

    const userAddress = createAccounts().getAddress('user') as `0x${string}`

    // Navigate to the address page
    const addressUrl = `/${userAddress}`
    await page.goto(addressUrl)

    // Wait for the page to stabilize
    await page.waitForLoadState('networkidle')

    // Verify the page loads successfully (doesn't crash)
    // The fix should catch the ContractFunctionExecutionError and return null
    // so the page should show either the profile or no profile gracefully
    const hasProfile = await page.getByTestId('profile-snippet').isVisible().catch(() => false)
    const hasNoProfile = await page.getByTestId('no-profile-snippet').isVisible().catch(() => false)

    // One of these should be visible - the page should load without crashing
    expect(hasProfile || hasNoProfile).toBeTruthy()

    // Verify the names list still loads (error in primary name doesn't break other functionality)
    await expect(page.getByTestId('names-list')).toBeVisible({ timeout: 15000 })
  })

  test('should handle address with no names gracefully', async ({
    page,
    login,
  }) => {
    test.slow()

    // Use user3 which typically has no names
    const user3Address = createAccounts().getAddress('user3') as `0x${string}`

    // Navigate to the address page
    const addressUrl = `/${user3Address}`
    await page.goto(addressUrl)
    await login.connect()

    // Wait for the page to load
    await page.waitForLoadState('networkidle')

    // Verify the page loads successfully
    await expect(page.getByTestId('no-profile-snippet')).toBeVisible({ timeout: 30000 })

    // Verify the "No primary name set" message is shown
    await expect(page.getByText('No primary name set')).toBeVisible()

    // Verify the "No names owned" or similar message
    await expect(page.getByTestId('names-list')).toBeVisible({ timeout: 15000 })
  })

  test('should retry on non-ContractFunctionExecutionError and not return null early', async ({
    page,
    login,
    makeName,
  }) => {
    test.slow()

    // Create a valid name with proper resolver
    const name = await makeName({
      label: 'retry-test-name',
      type: 'legacy',
      owner: 'user',
      manager: 'user',
      addr: 'user',
    })

    // Set it as primary name
    const userAddress = createAccounts().getAddress('user') as `0x${string}`
    const tx = await setPrimaryName(walletClient, {
      name,
      account: userAddress,
    })
    await waitForTransaction(tx)

    let requestCount = 0
    const maxFailures = 2 // Fail first 2 attempts, then succeed

    // Intercept RPC requests to the local blockchain
    await page.route('**/*', async (route) => {
      const request = route.request()
      const url = request.url()

      // Only intercept requests to the RPC endpoint
      if (url.includes(':8545') || url.includes('localhost:8545')) {
        try {
          const postData = request.postDataJSON()

          // Log for debugging
          if (postData?.method === 'eth_call') {
            const data = postData?.params?.[0]?.data

            // Check if this is a call to UniversalResolver's 'resolve' function
            // Function selector for resolve(bytes,bytes): 0x82ad56cb
            // This is what getName() uses to get the primary name
            if (data && data.startsWith('0x82ad56cb')) {
              requestCount++

              if (requestCount <= maxFailures) {
                // Simulate a network error (not a contract execution error)
                // This should cause the query to throw and retry, not return null
                await route.abort('failed')
                return
              }
            }
          }
        } catch (e) {
          // If we can't parse the request, just continue
        }
      }

      // Allow other requests to proceed normally
      await route.continue()
    })

    // Navigate to the address page
    await page.goto(`/${userAddress}`)
    await login.connect()

    // Wait for the page to eventually load after retries
    await page.waitForLoadState('networkidle')

    // After retries, the request should succeed and show the profile
    // This verifies that non-ContractFunctionExecutionErrors are thrown (allowing retries)
    // rather than caught and returned as null
    await expect(page.getByTestId('profile-snippet')).toBeVisible({ timeout: 45000 })
    await expect(page.getByTestId('profile-snippet-name')).toContainText(name)

    // Verify that multiple requests were made (indicating retries occurred)
    // Should be > maxFailures (2) since we aborted the first 2 attempts
    expect(requestCount).toBeGreaterThan(maxFailures)
  })

  test('should recover when navigating from errored address to valid address', async ({
    page,
    login,
    makeName,
    makePageObject,
  }) => {
    test.slow()

    // Create a name with invalid resolver for user
    const errorName = await makeName({
      label: 'error-name',
      type: 'legacy',
      owner: 'user',
      manager: 'user',
      addr: 'user',
    })

    const morePage = makePageObject('MorePage')
    const profilePage = makePageObject('ProfilePage')
    const transactionModal = makePageObject('TransactionModal')

    // Set invalid resolver using UI
    await morePage.goto(errorName)
    await login.connect()

    await morePage.editResolverButton.click()
    await page.getByTestId('custom-resolver-radio').check()
    await page.getByTestId('dogfood').fill(INVALID_RESOLVER)
    await page.getByTestId('update-button').click()
    await transactionModal.autoComplete()

    // Set as primary name
    await profilePage.goto(errorName)
    await page.getByText('Set as primary name').click()
    await transactionModal.autoComplete()

    // Create a valid name for user2
    const validName = await makeName({
      label: 'valid-name',
      type: 'legacy',
      owner: 'user2',
      manager: 'user2',
      addr: 'user2',
    })

    // Set valid name as primary for user2
    const tx = await setPrimaryName(walletClient, {
      name: validName,
      account: createAccounts().getAddress('user2') as `0x${string}`,
    })
    await waitForTransaction(tx)

    // First navigate to the address with error
    const userAddress = createAccounts().getAddress('user') as `0x${string}`
    await page.goto(`/${userAddress}`)
    await page.waitForLoadState('networkidle')

    // Should handle error gracefully (not crash)
    const hasProfile = await page.getByTestId('profile-snippet').isVisible().catch(() => false)
    const hasNoProfile = await page.getByTestId('no-profile-snippet').isVisible().catch(() => false)
    expect(hasProfile || hasNoProfile).toBeTruthy()

    // Now navigate to valid address
    const user2Address = createAccounts().getAddress('user2') as `0x${string}`
    await page.goto(`/${user2Address}`)
    await page.waitForLoadState('networkidle')

    // Should successfully show the profile
    await expect(page.getByTestId('profile-snippet')).toBeVisible({ timeout: 30000 })
    await expect(page.getByTestId('profile-snippet-name')).toContainText(validName)
  })

  test.afterEach(async () => {
    // Clean up: reset primary names after each test
    await setPrimaryName(walletClient, {
      name: '',
      account: createAccounts().getAddress('user') as `0x${string}`,
    }).catch(() => {
      // Ignore errors during cleanup
    })

    await setPrimaryName(walletClient, {
      name: '',
      account: createAccounts().getAddress('user2') as `0x${string}`,
    }).catch(() => {
      // Ignore errors during cleanup
    })
  })
})
