// eslint-disable-next-line import/no-extraneous-dependencies
import { test, TestInfo } from '@playwright/test'
import { createAccounts } from '@root/playwright/fixtures/accounts'
import { createProvider, Provider } from '@root/playwright/fixtures/provider'
import { Address } from 'viem'

const setup = test.extend<{
  provider: Provider
  testInfo: TestInfo
}>({
  // eslint-disable-next-line no-empty-pattern
  provider: async ({}, use, testInfo) => {
    const stateful = testInfo.project?.name === 'stateful'
    const provider = createProvider(stateful)
    await use(provider)
  },
  // eslint-disable-next-line no-empty-pattern
  testInfo: ({}, use, testInfo) => {
    use(testInfo)
  },
})

setup('set balances', async ({ provider, testInfo }) => {
  console.log('setting balances...')

  console.log('total:', testInfo.config.workers)

  const accountsArray: Address[] = []

  for (let i = 0; i < testInfo.config.workers; i += 1) {
    const accounts = createAccounts({ ...testInfo, parallelIndex: i })
    accountsArray.push(...accounts.accounts.map(({ address }) => address))
  }

  await Promise.all(
    accountsArray.map(async (address) =>
      provider.send('anvil_setBalance', [address, '0x21e19e0c9bab2400000']).then((res) => {
        console.log('for address:', address, 'res:', res)
      }),
    ),
  )

  await provider.mine()
})
