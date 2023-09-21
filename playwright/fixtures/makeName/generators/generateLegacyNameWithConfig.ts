/* eslint-disable import/no-extraneous-dependencies */

/* eslint-disable no-await-in-loop */
import { Accounts, User } from 'playwright/fixtures/accounts'
import { Contracts } from 'playwright/fixtures/contracts'

import { namehash } from '@ensdomains/ensjs/utils/normalise'
import { RecordOptions } from '@ensdomains/ensjs/utils/recordHelpers'

import { RESOLVER_ADDRESSES } from '@app/utils/constants'

import { Provider } from '../../provider'
import { LegacySubname, generateLegacySubname } from './generateLegacySubname'
import { generateRecords } from './generateRecords'

const DEFAULT_DURATION = 31536000
const DEFAULT_RESOLVER = RESOLVER_ADDRESSES['1337'][2] as `0x${string}`
const VALID_RESOLVERS = RESOLVER_ADDRESSES['1337'].filter(
  (resolver) => resolver !== '0xd7a4F6473f32aC2Af804B3686AE8F1932bC35750',
)

export type Name = {
  label: string
  owner?: User
  manager?: User
  duration?: number
  secret?: string
  resolver?: `0x${string}`
  addr?: User
  records?: RecordOptions
  subnames?: Omit<LegacySubname, 'name'>[]
}

type Dependencies = {
  provider: Provider
  accounts: Accounts
  contracts: Contracts
}

export const generateLegacyNameWithConfig =
  ({ provider, accounts, contracts }: Dependencies) =>
  async ({
    label,
    owner = 'user',
    manager,
    duration = DEFAULT_DURATION,
    // eslint-disable-next-line no-restricted-syntax
    secret = '0x0000000000000000000000000000000000000000000000000000000000000000',
    resolver = DEFAULT_RESOLVER,
    addr = owner,
    records,
    subnames,
  }: Name) => {
    const name = `${label}.eth`
    console.log('generating legacy name:', name)

    const _owner = accounts.getAddress(owner)
    const _addr = accounts.getAddress(addr)

    // Registration will fail if resolver is not valid. If an invalid resolver is entered
    // we will set the resolver after the name has been registered.
    const hasValidResolver = resolver && VALID_RESOLVERS.includes(resolver)
    const _resolver = hasValidResolver ? resolver : DEFAULT_RESOLVER

    console.log('making commitment:', name)
    const controller = contracts.get('LegacyETHRegistrarController', { signer: owner })
    const commitment = await controller.makeCommitmentWithConfig(
      label,
      _owner,
      secret,
      _resolver,
      _addr,
    )
    const commitTx = await controller.commit(commitment)
    await commitTx.wait()

    await provider.increaseTime(120)
    await provider.mine()

    console.log('registering name:', name)
    const price = await controller.rentPrice(label, duration)
    const registrationTx = await controller.registerWithConfig(
      label,
      _owner,
      duration,
      secret,
      _resolver,
      _addr,
      {
        value: price,
      },
    )
    await registrationTx.wait()

    // Create records
    await generateRecords({ contracts })({ name: `${label}.eth`, owner, resolver, records })

    // Create subnames
    const _subnames = (subnames || []).map((subname) => ({
      ...subname,
      name: `${label}.eth`,
      nameOwner: owner,
      resolver: subname.resolver ?? _resolver,
    }))
    for (const subname of _subnames) {
      await generateLegacySubname({ accounts, contracts })(subname)
    }

    if (!hasValidResolver && resolver) {
      console.log('setting resolver:', name, resolver)
      const registry = contracts.get('ENSRegistry', { signer: owner })
      const node = namehash(`${label}.eth`)
      await registry.setResolver(node, resolver)
    }

    if (!!manager && manager !== owner) {
      console.log('setting manager:', name, manager)
      const registry = contracts.get('ENSRegistry', { signer: owner })
      const node = namehash(`${label}.eth`)
      const _manager = accounts.getAddress(manager)
      await registry.setOwner(node, _manager)
    }

    await provider.mine()
  }
