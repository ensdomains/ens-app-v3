/* eslint-disable import/no-extraneous-dependencies */
import { Accounts } from '../accounts'
import { Provider } from '../provider'
import { Time } from '../time'
import { Name as LegacyName, generateLegacyName } from './generators/generateLegacyName'
import {
  Name as LegacyNameWithConfig,
  generateLegacyNameWithConfig,
} from './generators/generateLegacyNameWithConfig'
import { Name as WrappedName, generateWrappedName } from './generators/generateWrappedName'
import { adjustName } from './utils/adjustName'
import { getTimeOffset } from './utils/getTimeOffset'
import { waitForSubgraph } from './utils/waitForSubgraph'

type Dependencies = {
  accounts: Accounts
  provider: Provider
  time: Time
}

export type BaseName = LegacyName | LegacyNameWithConfig | WrappedName

export type Name = BaseName & {
  type: 'wrapped' | 'legacy' | 'legacy-register'
}

type Options = {
  timeOffset?: number
  syncSubgraph?: boolean
}

export function createMakeNames({ accounts, provider, time }: Dependencies) {
  async function makeNames(name: Name, options?: Options): Promise<string>
  async function makeNames(names: Name[], options?: Options): Promise<string[]>
  async function makeNames(
    nameOrNames: Name | Name[],
    options: Options = {},
  ): Promise<string | string[]> {
    const names: Name[] = Array.isArray(nameOrNames) ? nameOrNames : [nameOrNames]
    const offset = await getTimeOffset({ names })
    const _names = adjustName(names, offset)

    for (const { type, ...name } of _names) {
      console.log(name)
      console.log('start block', await provider.getBlockNumber())
      if (type === 'wrapped') {
        console.log('registering wrapped name')
        const wrappedName = { ...name, offset } as WrappedName
        // eslint-disable-next-line no-await-in-loop
        await generateWrappedName(wrappedName, { accounts, provider })
      } else if (type === 'legacy') {
        console.log('registering legacy names')
        const legacyName = name as LegacyNameWithConfig
        // eslint-disable-next-line no-await-in-loop
        await generateLegacyNameWithConfig(legacyName, { accounts, provider })
      } else if (type === 'legacy-register') {
        const legacyName = name as LegacyName
        // eslint-disable-next-line no-await-in-loop
        await generateLegacyName(legacyName, { accounts, provider })
      }
      console.log('end block', await provider.getBlockNumber())
      await provider.mine()
    }

    if (offset > 0) {
      console.warn(
        'You are increasing the block timestamp. Do not run this test in parrellel mode.',
      )
      await provider.increaseTime(offset)
      await provider.mine()
    }

    if (options.syncSubgraph ?? true) await waitForSubgraph(provider)()

    await time.sync(options.timeOffset ?? 0, false)

    const ethNames = _names.map((name) => `${name.label}.eth`)
    if (ethNames.length === 1) return ethNames[0] as string
    return ethNames
  }
  return makeNames
}
