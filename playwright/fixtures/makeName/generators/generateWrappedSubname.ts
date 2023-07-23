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

import { emptyAddress } from '@app/utils/constants'

import { getContract } from '../utils/getContract'
import { Records, generateRecords } from './generateRecords'

type Fuse = ParentFuses['fuse'] | ChildFuses['fuse']

export type WrappedSubname = {
  name: string
  nameOwner: User
  label: string
  owner: User
  resolver?: `0x${string}`
  records?: Records
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
    resolver = emptyAddress,
    records,
    fuses,
    duration = 31536000,
    offset = 0,
  }: WrappedSubname,
  { provider, accounts }: Dependencies,
) => {
  const _owner = accounts.getAddress(owner)
  const _fuses = makeFuseInput(fuses)
  console.log(fuses, _fuses)

  // Connect contract
  const signer = provider.getSigner(accounts.getIndex(nameOwner))
  const nameWrapper = getContract('NameWrapper', { signer })

  // Make subname
  const node = namehash(name)
  const encodedFuses = _fuses ? encodeFuses(_fuses) : 0
  const blockTimestamp = await provider.getBlockTimestamp()
  const expiry = duration + blockTimestamp

  console.log('subname expiry', expiry, duration, offset, new Date(expiry * 1000))
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
