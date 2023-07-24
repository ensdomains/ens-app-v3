/* eslint-disable import/no-extraneous-dependencies */
import { Accounts, User } from 'playwright/fixtures/accounts'
import { Provider } from 'playwright/fixtures/provider'

import {
  ChildFuses,
  CombinedFuseInput,
  ParentFuses,
  encodeFuses,
} from '@ensdomains/ensjs/utils/fuses'
import { namehash } from '@ensdomains/ensjs/utils/normalise'
import { RecordOptions } from '@ensdomains/ensjs/utils/recordHelpers'

import { RESOLVER_ADDRESSES, emptyAddress } from '@app/utils/constants'

import { getContract } from '../utils/getContract'
import { generateRecords } from './generateRecords'

type Fuse = ParentFuses['fuse'] | ChildFuses['fuse']

export type WrappedSubname = {
  name: string
  nameOwner: User
  label: string
  owner: User
  resolver?: `0x${string}`
  records?: RecordOptions
  fuses?: Fuse[]
  duration?: number
  offset?: number
}

type Dependencies = {
  provider: Provider
  accounts: Accounts
}

const makeFuseInput = (fuses?: Fuse[]): CombinedFuseInput | undefined => {
  if (!fuses) return undefined
  const parentFuses = fuses.filter((f) =>
    ['PARENT_CANNOT_CONTROL', 'CAN_EXTEND_EXPRY'].includes(f),
  ) as ParentFuses['fuse'][]
  const childFuses = fuses.filter(
    (f) => !['PARENT_CANNOT_CONTROL', 'CAN_EXTEND_EXPRY'].includes(f),
  ) as ChildFuses['fuse'][]
  return {
    parent: {
      named: parentFuses,
    },
    child: {
      named: childFuses,
    },
  }
}

export const generateWrappedSubname = async (
  {
    name,
    nameOwner,
    label,
    owner,
    resolver = RESOLVER_ADDRESSES['1337'][0] as `0x${string}`,
    records,
    fuses,
    duration = 31536000,
    offset = 0,
  }: WrappedSubname,
  { provider, accounts }: Dependencies,
) => {
  const _owner = accounts.getAddress(owner)
  const _fuses = makeFuseInput(fuses)

  // Connect contract
  const signer = provider.getSigner(accounts.getIndex(nameOwner))
  const nameWrapper = getContract('NameWrapper', { signer })

  // Make subname
  const node = namehash(name)
  const encodedFuses = _fuses ? encodeFuses(_fuses) : 0
  const blockTimestamp = await provider.getBlockTimestamp()
  const expiry = duration + blockTimestamp

  console.log('resovler', resolver)
  // Make subname with resolver
  await nameWrapper.setSubnodeRecord(node, label, _owner, resolver, 0, encodedFuses, expiry)

  // Make records
  if (records) {
    await generateRecords(
      {
        name: `${label}.${name}`,
        owner,
        resolver,
        records,
      },
      {
        accounts,
        provider,
      },
    )
  }
}
