/* eslint-disable import/no-extraneous-dependencies */

/* eslint-disable no-await-in-loop */
import { Accounts, User, createAccounts } from '../../accounts'
import { Contracts } from '../../contracts'

import { RecordOptions } from '@ensdomains/ensjs/utils'

// import { RESOLVER_ADDRESSES } from '@app/utils/constants' //Ask about this

import { Provider } from '../../provider'
import { generateRecords } from './generateRecords'

import {
  publicClient,
  testClient,
  waitForTransaction,
  walletClient,
} from '../../contracts/utils/addTestContracts.js'
import { setResolver } from '@ensdomains/ensjs/wallet'
import { transferName } from '@ensdomains/ensjs/wallet'
import { generateLegacySubname, LegacySubname } from './generateLegacySubname'

const DEFAULT_DURATION = 31536000
// const DEFAULT_RESOLVER = RESOLVER_ADDRESSES['1337'][2] as `0x${string}`
const DEFAULT_RESOLVER = testClient.chain.contracts.legacyPublicResolver.address 
// const VALID_RESOLVERS = RESOLVER_ADDRESSES['1337'].filter(
//   (resolver) => resolver !== '0xd7a4F6473f32aC2Af804B3686AE8F1932bC35750',
// ) //TODO SG - Remove this part after confirming 

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
    const hasValidResolver = resolver 
    // && VALID_RESOLVERS.includes(resolver)
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
      const tx = await setResolver(walletClient, {
        name: name,
        contract: 'registry',
        resolverAddress: resolver,
        account: createAccounts().getAddress(owner) as `0x${string}`,
      })
      const receipt = await waitForTransaction(tx)
    }

    if (!!manager && manager !== owner) {
      console.log('setting manager:', name, manager)
      const _manager = accounts.getAddress(manager)
      const tx = await transferName(walletClient, {
        name: name,
        newOwnerAddress: createAccounts().getAddress(manager) as `0x${string}`,
        contract: 'registry',
        account: createAccounts().getAddress(owner) as `0x${string}`,
      })
      const receipt = await waitForTransaction(tx)
    }

    await provider.mine()
  }
