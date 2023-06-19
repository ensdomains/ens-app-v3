/* eslint-disable import/no-extraneous-dependencies */
import { Page, test as base } from '@playwright/test'
import { Web3ProviderBackend, injectHeadlessWeb3Provider } from 'headless-web3-provider'

import { Accounts, createAccounts } from './fixtures/accounts'
import { nameGenerator } from './fixtures/nameGenerator/index'
import { Provider, createProvider } from './fixtures/provider'

type Fixtures = {
  accounts: Accounts
  wallet: Web3ProviderBackend
  provider: Provider
  getContract: (contract: string) => any
  nameGenerator: () => Promise<string>
}

export const test = base.extend<Fixtures>({
  // signers - the private keys that are to be used in the tests
  accounts: createAccounts(),
  wallet: async ({ page, accounts }, use) => {
    const privateKeys = accounts.getAllPrivateKeys()
    const wallet = await injectHeadlessWeb3Provider(
      page,
      privateKeys,
      1337,
      'http://localhost:8545',
    )
    await use(wallet)
  },
  provider: async ({}, use) => {
    const provider = createProvider()
    await use(provider)
  },
  nameGenerator: async ({ accounts, provider }, use) => {
    const _nameGenerator = nameGenerator({ accounts, provider })
    await use(_nameGenerator)
  },
})
