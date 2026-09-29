import { expect } from '@playwright/test'
import { getAddress } from 'viem'

import { test } from '../../../playwright'
import { deploySpoofCompositeResolver } from '../../../playwright/fixtures/contracts/deploySpoofCompositeResolver'
import { testClient } from '../../../playwright/fixtures/contracts/utils/addTestContracts'

const publicResolver = testClient.chain.contracts.ensPublicResolver.address

test('should not treat an untrusted composite resolver as the latest resolver', async ({
  page,
  accounts,
  makeName,
  login,
  makePageObject,
}) => {
  const spoof = await deploySpoofCompositeResolver({
    accounts,
    officialResolver: publicResolver,
  })
  const name = await makeName({
    label: 'untrusted-composite',
    type: 'legacy',
    resolver: spoof,
  })

  const morePage = makePageObject('MorePage')
  await morePage.goto(name)
  await login.connect()

  await expect(morePage.editResolverButton).toBeVisible({ timeout: 30000 })

  // The registry resolver is the spoof. Honouring its ICompositeResolver
  // self-report would replace this with the Public Resolver and disable the
  // latest-resolver repair.
  await expect(morePage.resolver).toHaveText(getAddress(spoof), { timeout: 30000 })
  await expect(morePage.resolver).not.toHaveText(getAddress(publicResolver))

  await morePage.editResolverButton.click()
  await expect(page.getByTestId('latest-resolver-radio')).toBeEnabled()
  await expect(page.getByTestId('latest-resolver-radio')).toBeChecked()
  await expect(page.getByTestId('custom-resolver-radio')).not.toBeChecked()
})
