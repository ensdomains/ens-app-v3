/* eslint-disable import/no-extraneous-dependencies */

/* eslint-disable no-await-in-loop */

import { EncodeFusesInputObject, RecordOptions } from '@ensdomains/ensjs/utils'
import { createSubname, unwrapName } from '@ensdomains/ensjs/wallet'

import { Accounts, User } from '../../accounts'
import {
  publicClient,
  testClient,
  waitForTransaction,
  walletClient,
} from '../../contracts/utils/addTestContracts'
import { generateRecords } from './generateRecords'

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
  accounts: Accounts
}

const DEFAULT_RESOLVER = testClient.chain.contracts.ensPublicResolver.address

export const generateWrappedSubname =
  ({ accounts }: Dependencies) =>
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

    const blockTimestamp = Number((await publicClient.getBlock()).timestamp)
    const expiry = duration + blockTimestamp

    // Make subname with resolver

    const tx = await createSubname(walletClient, {
      name: `${label}.${name}`,
      contract: 'nameWrapper',
      fuses,
      owner: accounts.getAddress(owner) as `0x${string}`,
      account: accounts.getAddress(nameOwner) as `0x${string}`,
      resolverAddress: resolver,
      expiry,
    })
    await waitForTransaction(tx)

    // Make records
    if (records) {
      await generateRecords({ accounts })({
        name: `${label}.${name}`,
        owner,
        resolver,
        records,
      })
    }

    if (type === 'legacy') {
      const wrapTx = await unwrapName(walletClient, {
        name: `${label}.${name}`,
        newOwnerAddress: accounts.getAddress(owner) as `0x${string}`,
        account: accounts.getAccountForUser(owner),
      })
      await waitForTransaction(wrapTx)
    }

    const _subNames = (subnames || []).map((subName) => ({
      ...subName,
      name: `${label}.${name}`,
      nameOwner: owner,
      resolver: subName.resolver ?? DEFAULT_RESOLVER,
    }))
    for (const eachSubname of _subNames) {
      await generateWrappedSubname({ accounts })({ ...eachSubname })
    }
  }
