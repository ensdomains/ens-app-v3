/* eslint-disable import/no-extraneous-dependencies */
import { test as base } from '@playwright/test'
import { anvil, sepolia } from 'viem/chains'

import {
  injectHeadlessWeb3Provider,
  type Web3ProviderBackend,
} from '@ensdomains/headless-web3-provider'

import { Accounts, createAccounts } from './fixtures/accounts'
import { createConsoleListener } from './fixtures/consoleListener'
import { Login } from './fixtures/login'
import { createMakeNames } from './fixtures/makeName/index.js'
import { createSubgraph } from './fixtures/subgraph.js'
import { createTime } from './fixtures/time.js'
import { createPageObjectMaker } from './pageObjects/index.js'

type Fixtures = {
  accounts: Accounts
  wallet: Web3ProviderBackend
  login: InstanceType<typeof Login>
  getContract: (contract: string) => any
  makeName: ReturnType<typeof createMakeNames>
  makePageObject: ReturnType<typeof createPageObjectMaker>
  subgraph: ReturnType<typeof createSubgraph>
  time: ReturnType<typeof createTime>
  consoleListener: ReturnType<typeof createConsoleListener>
}

export const test = base.extend<Fixtures>({
  // eslint-disable-next-line no-empty-pattern
  accounts: async ({}, use, testInfo) => {
    const stateful = testInfo.project?.name === 'stateful'
    use(createAccounts(stateful))
  },
  wallet: async ({ page, accounts }, use, testInfo) => {
    const stateful = testInfo.project?.name === 'stateful'
    const chains = stateful ? [sepolia] : [{ ...anvil, id: 1337 }]
    const privateKeys = accounts.getAllPrivateKeys()
    const wallet = await injectHeadlessWeb3Provider({
      page,
      privateKeys,
      chains,
    })
    await use(wallet)
  },
  login: async ({ page, wallet, accounts }, use) => {
    const login = new Login(page, wallet, accounts)
    await use(login)
  },
  makeName: async ({ accounts, time, subgraph }, use) => {
    const makeNames = createMakeNames({ accounts, time, subgraph })
    await use(makeNames)
  },
  makePageObject: async ({ page, wallet }, use) => {
    await use(createPageObjectMaker({ page, wallet }))
  },
  subgraph: async ({}, use) => {
    const subgraph = createSubgraph()
    await use(subgraph)
  },
  time: async ({ page }, use) => {
    await use(createTime({ page }))
  },
  consoleListener: async ({ page }, use) => {
    const consoleListener = createConsoleListener({ page })
    await use(consoleListener)
    consoleListener.reset()
  },
})
