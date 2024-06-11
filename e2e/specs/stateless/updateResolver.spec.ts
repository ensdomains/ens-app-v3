import { expect } from '@playwright/test'

import { test } from '../../../playwright'
import { testClient } from '../../../playwright/fixtures/contracts/utils/addTestContracts'

// const newResolver = '0x0E801D84Fa97b50751Dbf25036d067dCf18858bF'
// const oldResolver = '0x84eA74d481Ee0A5332c457a4d796187F6Ba67fEB'

const oldResolver = testClient.chain.contracts.legacyPublicResolver.address
const newResolver = testClient.chain.contracts.publicResolver.address

test.describe('Happy', () => {
  test.describe('When profile is updated to latest resolver', () => {
    test('should disable the latest resolver button, have custom resolver checked, and allow user to change resolver address', async ({
      page,
      makeName,
      login,
      makePageObject,
    }) => {
      const name = await makeName({
        label: 'wrapped',
        type: 'wrapped',
      })

      const morePage = makePageObject('MorePage')
      const transactionModal = makePageObject('TransactionModal')

      await morePage.goto(name)
      await login.connect()

      await morePage.editResolverButton.click()

      // check that etherscan link is correct
      await expect(page.getByTestId('latest-resolver-etherscan')).toHaveAttribute(
        'href',
        `https://localhost.etherscan.io/address/${newResolver}`,
      )

      await expect(page.getByTestId('latest-resolver-radio')).toBeDisabled()
      await expect(page.getByTestId('custom-resolver-radio')).toBeEnabled()
      await page.getByTestId('dogfood').type(oldResolver)
      await page.getByTestId('update-button').click()
      await transactionModal.autoComplete()
      await expect(morePage.resolver).toHaveText(oldResolver)
    })
  })

  test.describe('When profile is not updated to latest resolver', () => {
    test('should allow user to update if they have chosen to use the latest resolver', async ({
      page,
      makeName,
      login,
      makePageObject,
    }) => {
      const name = await makeName({
        label: 'wrapped',
        type: 'wrapped',
        resolver: oldResolver,
      })

      const morePage = makePageObject('MorePage')
      const transactionModal = makePageObject('TransactionModal')

      await morePage.goto(name)
      await login.connect()

      await morePage.editResolverButton.click()
      await page.getByTestId('update-button').click()
      await transactionModal.autoComplete()
      await expect(morePage.resolver).toHaveText(newResolver)
    })
  })
})

test.describe('Unhappy', () => {
  test('should not allow user to update if they enter an invalid address', async ({
    page,
    makeName,
    login,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'wrapped',
      type: 'wrapped',
    })

    const morePage = makePageObject('MorePage')

    await morePage.goto(name)

    await login.connect()

    await morePage.editResolverButton.click()
    await page.waitForTimeout(1000) // Sometimes the test will fail because modal hooks have not fully processed
    await page.getByTestId('custom-resolver-radio').click()
    await page.getByTestId('dogfood').type('0xInvalid')
    await expect(page.getByTestId('update-button')).toBeDisabled()
  })
})

test.describe('subgraph errors', () => {
  test('should disable edit resolver button for wrapped name if there is a subgraph indexing error', async ({
    page,
    makeName,
    login,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'wrapped',
      type: 'wrapped',
    })

    const morePage = makePageObject('MorePage')

    await page.goto('/')
    await login.connect()

    await page.goto('/my/settings')
    await page.getByTestId('subgraph-network-error').check()

    await morePage.goto(name)
    await expect(morePage.editResolverButton).toHaveCount(0)
  })

  test('should disable edit resolver button for unwrapped name if there is a subgraph indexing error', async ({
    page,
    makeName,
    login,
    makePageObject,
  }) => {
    const name = await makeName({
      label: 'unwrapped',
      type: 'legacy',
    })

    const morePage = makePageObject('MorePage')

    await page.goto('/')
    await login.connect()

    await page.goto('/my/settings')
    await page.getByTestId('subgraph-network-error').check()

    await morePage.goto(name)
    await expect(morePage.editResolverButton).toHaveCount(0)

    await page.goto('/my/settings')
    await page.getByTestId('subgraph-network-error').uncheck()
  })
})
