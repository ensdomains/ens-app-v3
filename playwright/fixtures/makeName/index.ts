/* eslint-disable import/no-extraneous-dependencies */
import { Accounts } from '../accounts'
import { Contracts } from '../contracts'
import { Provider } from '../provider'
import { Subgraph } from '../subgraph'
import { Time } from '../time'
import { Name as LegacyName, generateLegacyName } from './generators/generateLegacyName'
import {
  Name as LegacyNameWithConfig,
  generateLegacyNameWithConfig,
} from './generators/generateLegacyNameWithConfig'
import { Name as WrappedName, generateWrappedName } from './generators/generateWrappedName'
import { adjustName } from './utils/adjustName'
import { getTimeOffset } from './utils/getTimeOffset'

type Dependencies = {
  accounts: Accounts
  provider: Provider
  time: Time
  contracts: Contracts
  subgraph: Subgraph
}

export type BaseName = LegacyName | LegacyNameWithConfig | WrappedName

export type Name = BaseName & {
  type: 'wrapped' | 'legacy' | 'legacy-register'
}

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
    const _names = adjustName(names, offset)

    const _timeOffset = timeOffset ?? 0
    const _syncSubgraph = syncSubgraph ?? true

    /* eslint-disable no-await-in-loop */
    for (const { type, ...name } of _names) {
      if (type === 'wrapped') {
        const wrappedName = { ...name, offset } as WrappedName
        await generateWrappedName({ accounts, provider, contracts })(wrappedName)
      } else if (type === 'legacy') {
        const legacyName = name as LegacyNameWithConfig
        await generateLegacyNameWithConfig({ accounts, provider, contracts })(legacyName)
      } else if (type === 'legacy-register') {
        const legacyName = name as LegacyName
        await generateLegacyName({ accounts, provider, contracts })(legacyName)
      }
    }
    /* eslint-enable no-await-in-loop */

    if (offset > 0) {
      console.warn('You are increasing the block timestamp. Do not run this test in parallel mode.')
      await provider.increaseTime(offset)
      await provider.mine()
    }

    if (_syncSubgraph) await subgraph.sync()

    await time.sync(_timeOffset)

    const ethNames = _names.map((name) => `${name.label}.eth`)
    if (ethNames.length === 1) return ethNames[0] as string
    return ethNames
  }
  return makeNames
}
