/* eslint-disable import/no-extraneous-dependencies */
import { Accounts } from '../accounts'
import { Provider } from '../provider'
import { generateLegacyName } from './generators/generateLegacyName'
import {
  Name as LegacyNameWithConfig,
  generateLegacyNameWithConfig,
} from './generators/generateLegacyNameWithConfig'
import { generateWrappedName } from './generators/generateWrappedName'
import { waitForSubgraph } from './utils/waitForSubgraph'

type Config = {
  accounts: Accounts
  provider: Provider
}

export type BaseName = {
  name: string
  owner: `0x${string}`
  duration?: number
  secret?: string
}

export type NameWithConfig = BaseName & {
  resolver?: `0x${string}`
  addr?: `0x${string}`
}

export type WrappedName = BaseName & {
  resolver?: `0x${string}`
  records: any
  reverseRecord?: boolean
  fuses?: any
  subnames?: {
    label: string
    owner: `0x${string}`
    fuses: any
    expiry: number
  }[]
}

type Name = BaseName | NameWithConfig | WrappedName

export const nameGenerator = ({ accounts, provider }: Config) => {
  return async () => {
    const name = `helloworld${Date.now()}`
    const owner = accounts.getAddress('user2')!
    const manager = accounts.getAddress('user3')
    const addr = accounts.getAddress('user')
    const records = {
      texts: [
        { key: 'description', value: 'Hello2' },
        { key: 'url', value: 'https://twitter.com' },
        { key: 'blankrecord', value: '' },
        { key: 'email', value: 'fakeemail@fake.com' },
      ],
      coinTypes: [
        { key: '61', value: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC' },
        { key: '0', value: '0x00149010587f8364b964fcaa70687216b53bd2cbd798' },
        { key: '2', value: '0x0000000000000000000000000000000000000000' },
      ],
      contentHash: '0xe301017012204edd2984eeaf3ddf50bac238ec95c5713fb40b5e428b508fdbe55d3b9f155ffe',
    }
    const subnames = [
      {
        label: 'test',
        owner: accounts.getAddress('user3')!,
        records: {
          ...records,
        },
      },
    ]
    console.time('registerLegacyWithConfig')
    await generateWrappedName(
      { label: name, owner, manager, addr, records, subnames },
      { accounts, provider },
    )
    await waitForSubgraph(provider)()
    console.timeEnd('registerLegacyWithConfig')
    return `${name}.eth`
  }
}
