/* eslint-disable import/no-extraneous-dependencies */
import { resolve } from 'node:path'

import { test as base } from '@playwright/test'
import dotenv from 'dotenv'
import { match } from 'ts-pattern'
import { anvil, mainnet, sepolia } from 'viem/chains'

import {
  injectHeadlessWeb3Provider,
  type Web3ProviderBackend,
} from '@ensdomains/headless-web3-provider'

import { Accounts, createAccounts, User } from './fixtures/accounts'
import { createConsoleListener } from './fixtures/consoleListener'
import { Login } from './fixtures/login'
import { createMakeNames } from './fixtures/makeName/index.js'
import {
  clearAllPrimaryNames,
  getPrimaryNameState,
  GetPrimaryNameStateResult,
  PrimaryNameState,
  setPrimaryNameState,
} from './fixtures/primaryName'
import { createSubgraph } from './fixtures/subgraph.js'
import { createTime } from './fixtures/time.js'
import { createPageObjectMaker } from './pageObjects/index.js'

dotenv.config({
  path: resolve(__dirname, '../../../../.env'),
  override: true,
})

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
  primaryName: {
    setState: (params: { user: User; state: PrimaryNameState }) => Promise<void>
    getState: (user: User) => Promise<GetPrimaryNameStateResult>
    clearAll: (user: User) => Promise<void>
  }
}

const getChainById = (chain: string) => {
  return match(chain)
    .with('sepolia', () => sepolia)
    .with('mainnet', () => mainnet)
    .otherwise(() => sepolia)
}

export const test = base.extend<Fixtures>({
  // eslint-disable-next-line no-empty-pattern
  accounts: async ({}, use, testInfo) => {
    const stateful = testInfo.project?.name === 'stateful'
    use(createAccounts(stateful))
  },
  wallet: async ({ page, accounts }, use, testInfo) => {
    const stateful = testInfo.project?.name === 'stateful'
    const chains = stateful
      ? [getChainById(process.env.CHAIN || 'sepolia')]
      : [{ ...anvil, id: 1337 }]
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
  primaryName: async ({ accounts }, use) => {
    await use({
      setState: (params) => setPrimaryNameState(accounts, params),
      getState: (user) => getPrimaryNameState(accounts, user),
      clearAll: (user) => clearAllPrimaryNames(accounts, user),
    })
  },
})
