/* eslint-disable import/no-extraneous-dependencies */

/* eslint-disable no-await-in-loop */

import { RecordOptions } from '@ensdomains/ensjs/utils'
import { setResolver, transferName } from '@ensdomains/ensjs/wallet'

import { Accounts, createAccounts, User } from '../../accounts'
import { Contracts } from '../../contracts'
import {
  testClient,
  waitForTransaction,
  walletClient,
} from '../../contracts/utils/addTestContracts.js'
import { generateLegacySubname, LegacySubname } from './generateLegacySubname'
import { generateRecords } from './generateRecords'
import { Address, TestClient } from 'viem'

const LEGACY_RESOLVER = testClient.chain.contracts.legacyPublicResolver.address as Address
const PUBLIC_RESOLVER = testClient.chain.contracts.publicResolver.address as Address
const DEFAULT_DURATION = 31536000
const DEFAULT_RESOLVER = testClient.chain.contracts.legacyPublicResolver.address as Address

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
  provider: TestClient<'anvil'>
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
    const hasValidResolver = [LEGACY_RESOLVER, PUBLIC_RESOLVER].includes(resolver)
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

    await provider.increaseTime({seconds:120})
    await provider.mine({blocks:1})

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
    await generateRecords()({ name: `${label}.eth`, owner, resolver, records })

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
        name,
        contract: 'registry',
        resolverAddress: resolver,
        account: createAccounts().getAddress(owner) as `0x${string}`,
      })
      await waitForTransaction(tx)
    }

    if (!!manager && manager !== owner) {
      console.log('setting manager:', name, manager)
      const tx = await transferName(walletClient, {
        name,
        newOwnerAddress: createAccounts().getAddress(manager) as `0x${string}`,
        contract: 'registry',
        account: createAccounts().getAddress(owner) as `0x${string}`,
      })
      await waitForTransaction(tx)
    }

    await provider.mine({blocks:1})
  }
