/* eslint-disable import/no-extraneous-dependencies */
import { Accounts, User } from 'playwright/fixtures/accounts'
import { Provider } from 'playwright/fixtures/provider'

import { CombinedFuseInput, encodeFuses } from '@ensdomains/ensjs/utils/fuses'
import { namehash } from '@ensdomains/ensjs/utils/normalise'

import { emptyAddress } from '@app/utils/constants'

import { getContract } from '../utils/getContract'
import { Records, generateRecords } from './generateRecords'

export type WrappedSubname = {
  name: string
  nameOwner: User
  label: string
  owner: User
  resolver?: `0x${string}`
  records?: Records
  fuses?: CombinedFuseInput
  duration?: number
}

type Dependencies = {
  provider: Provider
  accounts: Accounts
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
  }: WrappedSubname,
  { provider, accounts }: Dependencies,
) => {
  const _owner = accounts.getAddress(owner)

  // Connect contract
  const signer = provider.getSigner(accounts.getIndex(nameOwner))
  const nameWrapper = getContract('NameWrapper', { signer })

  // Make subname
  const node = namehash(name)
  const encodedFuses = fuses ? encodeFuses(fuses) : 0
  const expiry = duration + Math.floor(Date.now() / 1000)

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
