/* eslint-disable import/no-extraneous-dependencies */
import { test as base } from '@playwright/test'
import { Web3ProviderBackend, injectHeadlessWeb3Provider } from 'headless-web3-provider'

import { Accounts, createAccounts } from './fixtures/accounts'
import { createContracts } from './fixtures/contracts'
import { Login } from './fixtures/login'
import { createMakeNames } from './fixtures/makeName/index'
import { Provider, createProvider } from './fixtures/provider'
import { createSubgraph } from './fixtures/subgraph'
import { createTime } from './fixtures/time'
import { createPageObjectMaker } from './pageObjects'

type Fixtures = {
  accounts: Accounts
  wallet: Web3ProviderBackend
  provider: Provider
  login: InstanceType<typeof Login>
  getContract: (contract: string) => any
  makeName: ReturnType<typeof createMakeNames>
  makePageObject: ReturnType<typeof createPageObjectMaker>
  subgraph: ReturnType<typeof createSubgraph>
  time: ReturnType<typeof createTime>
  contracts: ReturnType<typeof createContracts>
}

export const test = base.extend<Fixtures>({
  // eslint-disable-next-line no-empty-pattern
  accounts: async ({}, use, testInfo) => {
    const stateful = testInfo.project?.name === 'stateful'
    use(createAccounts(stateful))
  },
  contracts: async ({ accounts, provider }, use) => {
    await use(createContracts({ accounts, provider }))
  },
  wallet: async ({ page, accounts, provider }, use) => {
    const chainId = provider.network?.chainId || 1337
    const chainRpcUrl = provider.connection?.url || 'http://localhost:8545'
    const privateKeys = accounts.getAllPrivateKeys()
    const wallet = await injectHeadlessWeb3Provider(page, privateKeys, chainId, chainRpcUrl)
    await use(wallet)
  },
  // eslint-disable-next-line no-empty-pattern
  provider: async ({}, use, testInfo) => {
    const stateful = testInfo.project?.name === 'stateful'
    const provider = createProvider(stateful)
    await use(provider)
  },
  login: async ({ page, wallet, accounts }, use) => {
    const login = new Login(page, wallet, accounts)
    await use(login)
  },
  makeName: async ({ accounts, provider, time, contracts, subgraph }, use) => {
    const makeNames = createMakeNames({ accounts, provider, time, contracts, subgraph })
    await use(makeNames)
  },
  makePageObject: async ({ page, wallet }, use) => {
    await use(createPageObjectMaker({ page, wallet }))
  },
  subgraph: async ({ provider }, use) => {
    const subgraph = createSubgraph({ provider })
    await use(subgraph)
  },
  time: async ({ provider, page }, use) => {
    await use(createTime({ provider, page }))
  },
})
