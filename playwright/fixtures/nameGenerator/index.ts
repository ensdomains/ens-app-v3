/* eslint-disable import/no-extraneous-dependencies */
import { Page } from '@playwright/test'

import { Accounts, User } from '../accounts'
import { Provider } from '../provider'
import { Name as LegacyName, generateLegacyName } from './generators/generateLegacyName'
import {
  Name as LegacyNameWithConfig,
  generateLegacyNameWithConfig,
} from './generators/generateLegacyNameWithConfig'
import { Name as WrappedName, generateWrappedName } from './generators/generateWrappedName'
import { getDurationAdjustedName } from './utils/getDurationAdjustedName'
import { waitForSubgraph } from './utils/waitForSubgraph'

type Config = {
  accounts: Accounts
  provider: Provider
  page: Page
}

export type Name = (LegacyName | LegacyNameWithConfig | WrappedName) & {
  type: 'wrapped' | 'legacy' | 'legacy-register'
}

export const nameGenerator = ({ accounts, provider, page }: Config) => {
  return async ({ type, ...name }: Name) => {
    console.log('name', name)
    const durationAdjustedName = await getDurationAdjustedName({ name, page })
    console.log('adjusted name', durationAdjustedName)
    const uniqueLabel = `${name.label}-${Date.now()}`
    const _name = {
      ...durationAdjustedName,
      label: uniqueLabel,
    }
    console.time('registerLegacyWithConfig')

    // await provider.send('evm_setTime', [Math.floor(Date.now() / 1000 + 30000000)])

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
    await provider.setAutomine(true)
    return `${uniqueLabel}.eth`
  }
}
