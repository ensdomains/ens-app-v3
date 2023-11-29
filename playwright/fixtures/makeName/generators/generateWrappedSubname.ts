/* eslint-disable import/no-extraneous-dependencies */

/* eslint-disable no-await-in-loop */
import { Accounts, User, createAccounts } from '../../accounts'
import { Contracts } from '../../contracts'
import { Provider } from '../../provider'
import { EncodeFusesInputObject, RecordOptions } from '@ensdomains/ensjs/utils'
import { publicClient, testClient, waitForTransaction, walletClient } from '../../contracts/utils/addTestContracts'
// import { NAMEWRAPPER_AWARE_RESOLVERS, RESOLVER_ADDRESSES } from '@app/utils/constants' //TODO (SG) - Ask about this

import { generateRecords } from './generateRecords'
import { createSubname, unwrapName, wrapName } from '@ensdomains/ensjs/wallet'

// type Fuse = ParentFuses['fuse'] | ChildFuses['fuse']

export type WrappedSubname = {
  name: string
  nameOwner: User
  label: string
  owner: User
  resolver?: `0x${string}`
  records?: RecordOptions
  fuses?: EncodeFusesInputObject
  duration?: number
  type?: 'wrapped' | 'legacy'
  subnames?: Omit<WrappedSubname, 'name' | 'nameOwner '>[]
}

type Dependencies = {
  provider: Provider
  accounts: Accounts
  contracts: Contracts
}
// const DEFAULT_RESOLVER = NAMEWRAPPER_AWARE_RESOLVERS['1337'][0] as `0x${string}` //TODO (SG) - Ask about this
const DEFAULT_RESOLVER = testClient.chain.contracts.ensPublicResolver.address // TODO (SG) Not sure what resolver to use here

export const generateWrappedSubname =
  ({ provider, accounts, contracts }: Dependencies) =>
  async ({
    name,
    nameOwner,
    label,
    owner,
    resolver = DEFAULT_RESOLVER,
    records,
    fuses,
    duration = 31536000,
    subnames,
    type,
  }: WrappedSubname) => {
    const subname = `${label}.${name}`
    console.log('generating wrapped subname:', subname)

    const _owner = accounts.getAddress(owner)
    const blockTimestamp = await provider.getBlockTimestamp()
    const expiry = duration + blockTimestamp

    // Make subname with resolver

    const tx = await createSubname(walletClient, {
        name: `${label}.${name}`,
        contract: 'nameWrapper',
        fuses: fuses,
        owner: createAccounts().getAddress(owner) as `0x${string}`,
        account: createAccounts().getAddress(nameOwner) as `0x${string}`,
        resolverAddress: resolver,
      })
      const receipt = await waitForTransaction(tx)

    // Make records
    if (records) {
      await generateRecords({ contracts })({
        name: `${label}.${name}`,
        owner,
        resolver,
        records,
      })
    }

    if (type === 'legacy') {
    const tx = await unwrapName(walletClient, {
        name: `${label}.${name}`,
        newOwnerAddress: createAccounts().getAddress(owner) as `0x${string}`,
        account: createAccounts().getAddress(nameOwner) as `0x${string}`,
      })
      expect(tx).toBeTruthy()
      const receipt = await waitForTransaction(tx)
      expect(receipt.status).toBe('success')
    }

    const _subNames = (subnames || []).map((subName) => ({
      ...subName,
      name: `${label}.${name}`,
      nameOwner: owner,
      resolver: subName.resolver ?? DEFAULT_RESOLVER,
    }))
    for (const eachSubname of _subNames) {
      await generateWrappedSubname({ accounts, provider, contracts })({ ...eachSubname })
    }
  }