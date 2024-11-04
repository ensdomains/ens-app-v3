/* eslint-disable import/no-extraneous-dependencies */

/* eslint-disable no-await-in-loop */

import { Address, encodeFunctionData, Hash } from 'viem'

import { RecordOptions } from '@ensdomains/ensjs/utils'
import { setResolver, transferName } from '@ensdomains/ensjs/wallet'

import { Accounts, User } from '../../accounts.js'
import {
  publicClient,
  testClient,
  waitForTransaction,
  walletClient,
} from '../../contracts/utils/addTestContracts.js'
import { legacyEthRegistrarControllerAbi } from '../constants/abis.js'
import { getLegacyRentPrice } from '../utils/getLegacyRentPrice.js'
import { generateLegacySubname, LegacySubname } from './generateLegacySubname.js'
import { generateRecords } from './generateRecords.js'

const LEGACY_RESOLVER = testClient.chain.contracts.legacyPublicResolver.address as Address
const PUBLIC_RESOLVER = testClient.chain.contracts.publicResolver.address as Address
const DEFAULT_DURATION = 31536000
const DEFAULT_RESOLVER = testClient.chain.contracts.legacyPublicResolver.address as Address

export type LegacyName = {
  label: string
  type: 'legacy'
  owner?: User
  manager?: User
  duration?: number
  secret?: Hash
  resolver?: `0x${string}`
  addr?: User
  records?: RecordOptions
  subnames?: Omit<LegacySubname, 'name' | 'nameOwner'>[]
}

type Dependencies = {
  accounts: Accounts
}

export const isLegacyName = (name: LegacyName): name is LegacyName => name.type === 'legacy'

const nameWithDefaults = (name: LegacyName) => ({
  ...name,
  duration: name.duration ?? DEFAULT_DURATION,
  secret: name.secret ?? '0x0000000000000000000000000000000000000000000000000000000000000000',
  resolver: name.resolver ?? DEFAULT_RESOLVER,
  owner: name.owner ?? 'user',
  manager: name.manager ?? name.owner ?? 'user',
  addr: name.addr ?? name.owner ?? 'user',
})

export const makeLegacyWithConfigNameGenerator = ({ accounts }: Dependencies) => ({
  commit: async (nameConfig: LegacyName) => {
    const { label, addr, owner, resolver, secret } = nameWithDefaults(nameConfig)
    const name = `${label}.eth`

    console.log('making commitment:', name)

    const ownerAddress = accounts.getAddress(owner)
    const addrAddress = accounts.getAddress(addr)

    // Registration will fail if resolver is not valid. If an invalid resolver is entered
    // we will set the resolver after the name has been registered.
    const hasValidResolver = [LEGACY_RESOLVER, PUBLIC_RESOLVER].includes(resolver)
    const _resolver = hasValidResolver ? resolver : DEFAULT_RESOLVER

    const { data: commitment } = await publicClient.call({
      to: walletClient.chain.contracts.legacyRegistrarController.address,
      data: encodeFunctionData({
        abi: legacyEthRegistrarControllerAbi,
        functionName: 'makeCommitmentWithConfig',
        args: [label, ownerAddress, secret, _resolver, addrAddress],
      }),
    })

    const preparedTransaction = await walletClient.prepareTransactionRequest({
      to: walletClient.chain.contracts.legacyRegistrarController.address,
      data: encodeFunctionData({
        abi: legacyEthRegistrarControllerAbi,
        functionName: 'commit',
        args: [commitment],
      }),
      gas: 1000000n,
      account: accounts.getAccountForUser(owner),
    })

    return walletClient.sendTransaction(preparedTransaction)
  },
  register: async (nameConfig: LegacyName) => {
    const { label, addr, owner, duration, resolver, secret } = nameWithDefaults(nameConfig)
    const name = `${label}.eth`
    console.log('register legacy name:', name)

    const ownerAddress = accounts.getAddress(owner)
    const addrAddress = accounts.getAddress(addr)

    // Registration will fail if resolver is not valid. If an invalid resolver is entered
    // we will set the resolver after the name has been registered.
    const hasValidResolver = [LEGACY_RESOLVER, PUBLIC_RESOLVER].includes(resolver)
    const _resolver = hasValidResolver ? resolver : DEFAULT_RESOLVER

    const price = await getLegacyRentPrice({ label, duration })

    const prepared = await walletClient.prepareTransactionRequest({
      to: walletClient.chain.contracts.legacyRegistrarController.address,
      data: encodeFunctionData({
        abi: legacyEthRegistrarControllerAbi,
        functionName: 'registerWithConfig',
        args: [label, ownerAddress, duration, secret, _resolver, addrAddress],
      }),
      gas: 1000000n,
      account: accounts.getAccountForUser(owner),
      value: price,
    })

    return walletClient.sendTransaction(prepared)
  },
  configure: async (nameConfig: LegacyName) => {
    const { label, owner, resolver, manager, records, subnames = [] } = nameWithDefaults(nameConfig)
    const name = `${label}.eth`
    const hasValidResolver = [LEGACY_RESOLVER, PUBLIC_RESOLVER].includes(resolver)
    const _resolver = hasValidResolver ? resolver : DEFAULT_RESOLVER

    // Create records
    if (records)
      await generateRecords({ accounts })({ name: `${label}.eth`, owner, resolver, records })

    // Create subnames
    for (const subname of subnames) {
      await generateLegacySubname({ accounts })({
        ...subname,
        name,
        nameOwner: owner,
        resolver: subname.resolver ?? _resolver,
      })
    }

    // Set resolver if not valid
    if (!hasValidResolver && resolver) {
      console.log('setting resolver:', name, resolver)
      const tx = await setResolver(walletClient, {
        name,
        contract: 'registry',
        resolverAddress: resolver,
        account: accounts.getAddress(owner) as `0x${string}`,
      })
      await waitForTransaction(tx)
    }

    if (!!manager && manager !== owner) {
      console.log('setting manager:', name, manager)
      const tx = await transferName(walletClient, {
        name,
        newOwnerAddress: accounts.getAddress(manager) as `0x${string}`,
        contract: 'registry',
        account: accounts.getAccountForUser(owner),
      })
      await waitForTransaction(tx)
    }
  },
})
