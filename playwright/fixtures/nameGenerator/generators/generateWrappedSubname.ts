/* eslint-disable import/no-extraneous-dependencies */
import { Accounts } from 'playwright/fixtures/accounts'
import { Provider } from 'playwright/fixtures/provider'

import { NameWrapper } from '@ensdomains/ensjs/generated/NameWrapper'
import { CombinedFuseInput, encodeFuses } from '@ensdomains/ensjs/utils/fuses'
import { labelhash } from '@ensdomains/ensjs/utils/labels'
import { namehash } from '@ensdomains/ensjs/utils/normalise'

import { emptyAddress } from '@app/utils/constants'
import { getContract } from '../utils/getContract'
import { Records, generateRecords } from './generateRecords'

export type WrappedSubname = {
  name: string
  nameOwner: `0x${string}`
  label: string
  owner: `0x${string}`
  resolver?: `0x${string}`
  records?: Records
  fuses?: CombinedFuseInput
  expiry?: number
}

type Dependencies = {
  provider: Provider
  accounts: Accounts
}

export const generateWrappedSubname = async (
  { name, nameOwner, label, owner, resolver = emptyAddress, records, fuses, expiry = Math.floor((Date.now() + 100000000)/ 1000) }: WrappedSubname,
  { provider, accounts }: Dependencies,
) => {
  // Connect contract
  const signer = provider.getSigner(accounts.getIndex(nameOwner))
  const nameWrapper = getContract('NameWrapper', { signer }) as NameWrapper

  // Make subname
  const node = namehash(name)
  const _labelhash = labelhash(label)
  const encodedFuses = fuses ? encodeFuses(fuses) : 0
 
  // Make subname without resolver
  if (!resolver) {
    await nameWrapper.setSubnodeRecord(node, label, owner, emptyAddress, 0, encodedFuses, expiry)
    return
  }

  console.log('make subnode', node, name, _labelhash, label, owner, resolver)
  // Make subname with resolver
  await nameWrapper.setSubnodeRecord(node, label, owner, resolver, 0, encodedFuses, expiry)



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
