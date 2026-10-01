import { expect } from '@playwright/test'
import { getAddress } from 'viem'

import { test } from '../../../playwright'
import {
  deploymentAddresses,
  testClient,
} from '../../../playwright/fixtures/contracts/utils/addTestContracts'

const publicResolver = testClient.chain.contracts.ensPublicResolver.address
const spoofCompositeResolver = deploymentAddresses.SpoofCompositeResolver

test('should not treat an untrusted composite resolver as the latest resolver', async ({
  page,
  makeName,
  login,
  makePageObject,
}) => {
  const name = await makeName({
    label: 'untrusted-composite',
    type: 'legacy',
    resolver: spoofCompositeResolver,
  })

  const morePage = makePageObject('MorePage')
  await morePage.goto(name)
  await login.connect()

  await expect(morePage.editResolverButton).toBeVisible({ timeout: 30000 })

  // The registry resolver is the spoof. Honouring its ICompositeResolver
  // self-report would replace this with the Public Resolver and disable the
  // latest-resolver repair.
  await expect(morePage.resolver).toHaveText(getAddress(spoofCompositeResolver), { timeout: 30000 })
  await expect(morePage.resolver).not.toHaveText(getAddress(publicResolver))

  await morePage.editResolverButton.click()
  await expect(page.getByTestId('latest-resolver-radio')).toBeEnabled()
  await expect(page.getByTestId('latest-resolver-radio')).toBeChecked()
  await expect(page.getByTestId('custom-resolver-radio')).not.toBeChecked()
})
