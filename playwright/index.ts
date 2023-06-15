/* eslint-disable import/no-extraneous-dependencies */
import { test as base } from '@playwright/test'
import { injectHeadlessWeb3Provider } from 'headless-web3-provider'

import { nameGenerator } from './fixtures/nameGenerator/index'

type Fixtures = {
  signers: string[]
  injectProvider: any
  getContract: (contract: string) => any
  nameGenerator: () => string
}

export const test = base.extend<{}, Fixtures>({
  // signers - the private keys that are to be used in the tests
  signers: [
    '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
    '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d',
    '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a',
  ],
  // injectWeb3Provider - function that injects web3 provider instance into the page
  injectProvider: async ({ signers }, use) => {
    await use(async (page, privateKeys = signers) => {
      return injectHeadlessWeb3Provider(
        page,
        privateKeys, // Private keys that you want to use in tests
        1337, // Chain ID - 31337 is common testnet id
        'http://localhost:8545', // Ethereum client's JSON-RPC URL,
        {
          debug: true,
        },
      )
    })
  },
  nameGenerator: async ({ signers }, use) => {
    use((page) => nameGenerator(page))
  },
})
