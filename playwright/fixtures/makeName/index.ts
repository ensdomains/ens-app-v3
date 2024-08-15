/* eslint-disable import/no-extraneous-dependencies */
import { Accounts } from '../accounts.js'
import { Contracts } from '../contracts/index.js'
import {
  testClient,
  waitForTransaction,
} from '../contracts/utils/addTestContracts'
import { Provider } from '../provider.js'
import { Subgraph } from '../subgraph.js'
import { Time } from '../time.js'
import { makeLegacyNameGenerator, isLegacyName, LegacyName as LegacyName } from './generators/legacyNameGenerator.js'
import {
  LegacyName as LegacyNameWithConfig,
  makeLegacyWithConfigNameGenerator,
} from './generators/legacyWithConfigNameGenerator.js'
import {
  isWrappendName,
  makeWrappedNameGenerator,
  WrappedName,
} from './generators/wrappedNameGenerator.js'
import { adjustName } from './utils/adjustName.js'
import { getTimeOffset } from './utils/getTimeOffset.js'

type Dependencies = {
  accounts: Accounts
  provider: Provider
  time: Time
  contracts: Contracts
  subgraph: Subgraph
}

export type Name = LegacyName | LegacyNameWithConfig | WrappedName

type Options = {
  timeOffset?: number
  syncSubgraph?: boolean
}

export function createMakeNames({ accounts, provider, time, contracts, subgraph }: Dependencies) {
  async function makeNames(name: Name, options?: Options): Promise<string>
  async function makeNames(names: Name[], options?: Options): Promise<string[]>
  async function makeNames(
    nameOrNames: Name | Name[],
    { timeOffset, syncSubgraph }: Options = {},
  ): Promise<string | string[]> {
    const names: Name[] = Array.isArray(nameOrNames) ? nameOrNames : [nameOrNames]
    const offset = await getTimeOffset({ names })
    const adjustedNames = adjustName(names, offset)

    const _timeOffset = timeOffset ?? 0
    const _syncSubgraph = syncSubgraph ?? true

    // Create generators
    const wrappedNameGenerator = makeWrappedNameGenerator({ accounts, provider, contracts })
    const legacyNameGenerator = makeLegacyWithConfigNameGenerator({ provider, accounts, contracts })
    const legacyRegisterNameGenerator = makeLegacyNameGenerator({ provider, accounts, contracts })

    // Set automine to false put all transactions on the same block
    await provider.setAutomine(false)

    // Clear out any pending transactions
    await testClient.mine({ blocks: 1 })

    const commitTxs = await Promise.all(
      adjustedNames.map((name) => {
        if (isWrappendName(name)) {
          return wrappedNameGenerator.commit(name)
        } else if (isLegacyName(name)) {
          return legacyRegisterNameGenerator.commit(name)
        } else {
          return legacyNameGenerator.commit(name)
        }
      }),
    )
    await testClient.mine({ blocks: 1 })
    await Promise.all(commitTxs.map((tx) => waitForTransaction(tx)))

    await testClient.increaseTime({ seconds: 120 }) // I use 120 because sometimes with anvil you need to wait a bit longer when registering multiple names at once
    await testClient.mine({ blocks: 1 })

    const registerTxs = await Promise.all(
      adjustedNames.map((name) => {
        if (isWrappendName(name)) {
          return wrappedNameGenerator.register(name)
        } else if (isLegacyName(name)) {
          return legacyRegisterNameGenerator.register(name)
        } else {
          return legacyNameGenerator.register(name)
        }
      }),
    )
    await testClient.mine({ blocks: 1 })
    await Promise.all(registerTxs.map((tx) => waitForTransaction(tx)))

    await testClient.setAutomine(true)

    // Finish setting up names
    await Promise.all(adjustedNames.map((name) => {
      if (isWrappendName(name)) {
        return wrappedNameGenerator.configure(name)
      } else if (isLegacyName(name)) {
        return legacyRegisterNameGenerator.configure(name)
      } else {
        return legacyNameGenerator.configure(name)
      }
    }))

    if (offset > 0) {
      console.warn('You are increasing the block timestamp. Do not run this test in parallel mode.')
      await provider.increaseTime(offset)
      await provider.mine()
    }

    if (_syncSubgraph) await subgraph.sync()

    await time.sync(_timeOffset)

    const ethNames = adjustedNames.map((name) => `${name.label}.eth`)
    if (ethNames.length === 1) return ethNames[0] as string
    return ethNames
  }
  return makeNames
}
