/* eslint-disable import/no-extraneous-dependencies */
import { test as base } from '@playwright/test'
import { anvil } from 'viem/chains'

import type { Web3ProviderBackend } from '@ensdomains/headless-web3-provider/backend'
import { injectHeadlessWeb3Provider } from '@ensdomains/headless-web3-provider/playwright'

import { Accounts, createAccounts } from './fixtures/accounts'
import { createContracts } from './fixtures/contracts'
import { Login } from './fixtures/login'
import { createMakeNames } from './fixtures/makeName/index.js'
import { createProvider } from './fixtures/provider'
import { createSubgraph } from './fixtures/subgraph.js'
import { createTime } from './fixtures/time.js'
import { createPageObjectMaker } from './pageObjects/index.js'
import { TestClient } from 'viem'

type Fixtures = {
  accounts: Accounts
  wallet: Web3ProviderBackend
  provider: TestClient<'anvil'>
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
    const privateKeys = accounts.getAllPrivateKeys()
    const wallet = await injectHeadlessWeb3Provider({
      page,
      privateKeys,
      chains: [{ ...anvil, id: 1337 }],
    })
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
