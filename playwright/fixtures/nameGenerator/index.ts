/* eslint-disable import/no-extraneous-dependencies */
import { Accounts, User } from '../accounts'
import { Provider } from '../provider'
import { Name as LegacyName, generateLegacyName } from './generators/generateLegacyName'
import {
  Name as LegacyNameWithConfig,
  generateLegacyNameWithConfig,
} from './generators/generateLegacyNameWithConfig'
import { Name as WrappedName, generateWrappedName } from './generators/generateWrappedName'
import { waitForSubgraph } from './utils/waitForSubgraph'

type Config = {
  accounts: Accounts
  provider: Provider
}

export type Name = (LegacyName | LegacyNameWithConfig | WrappedName) & {
  type: 'wrapped' | 'legacy' | 'legacy-register'
}

export const nameGenerator = ({ accounts, provider }: Config) => {
  return async ({ type, ...name }: Name) => {
    const uniqueLabel = `${name.label}-${Date.now()}`
    const _name = {
      ...name,
      label: uniqueLabel,
    }
    console.time('registerLegacyWithConfig')
    if (type === 'wrapped') {
      const wrappedName = _name as WrappedName
      await generateWrappedName(wrappedName, { accounts, provider })
    } else if (type === 'legacy') {
      const legacyName = _name as LegacyNameWithConfig
      await generateLegacyNameWithConfig(legacyName, { accounts, provider })
    } else if (type === 'legacy-register') {
      const legacyName = _name as LegacyName
      await generateLegacyName(legacyName, { accounts, provider })
    }
    console.timeLog('registerLegacyWithConfig')
    await provider.mine()
    await waitForSubgraph(provider)()
    console.timeEnd('registerLegacyWithConfig')
    return `${uniqueLabel}.eth`
  }
}
