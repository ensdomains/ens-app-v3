/* eslint-disable import/no-extraneous-dependencies */
import { test as base } from '@playwright/test'
import { Web3ProviderBackend, injectHeadlessWeb3Provider } from 'headless-web3-provider'

import { Accounts, createAccounts } from './fixtures/accounts'
import { Login } from './fixtures/login'
import { Name, nameGenerator } from './fixtures/nameGenerator/index'
import { Provider, createProvider } from './fixtures/provider'
import { SubnamesPage } from './pageObjects/subnamePage'
import { TransactionModal } from './pageObjects/transactionModal'

type Fixtures = {
  accounts: Accounts
  wallet: Web3ProviderBackend
  provider: Provider
  Login: typeof Login
  getContract: (contract: string) => any
  nameGenerator: (name: Name) => Promise<string>
}

type PageObjects = {
  SubnamesPage: typeof SubnamesPage
  TransactionModal: typeof TransactionModal
}

export const test = base.extend<Fixtures & PageObjects>({
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
  Login: ({}, use) => use(Login),
  nameGenerator: async ({ accounts, provider }, use) => {
    const _nameGenerator = nameGenerator({ accounts, provider })
    await use(_nameGenerator)
  },
  SubnamesPage: ({}, use) => use(SubnamesPage),
  TransactionModal: ({}, use) => use(TransactionModal),
})
