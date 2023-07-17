/* eslint-disable import/no-extraneous-dependencies */
import { Accounts, User } from 'playwright/fixtures/accounts'
import { Provider } from 'playwright/fixtures/provider'

import { labelhash } from '@ensdomains/ensjs/utils/labels'
import { namehash } from '@ensdomains/ensjs/utils/normalise'

import { getContract } from '../utils/getContract'
import { Records, generateRecords } from './generateRecords'

export type LegacySubname = {
  name: string
  nameOwner: User
  label: string
  owner: User
  resolver?: `0x${string}`
  records?: Records
  duration?: number
}

type Dependencies = {
  provider: Provider
  accounts: Accounts
}

export const generateLegacySubname = async (
  { name, nameOwner, label, owner, resolver, records }: LegacySubname,
  { provider, accounts }: Dependencies,
) => {
  const _owner = accounts.getAddress(owner)

  // Connect contract
  const signer = provider.getSigner(accounts.getIndex(nameOwner))
  const registry = await getContract('ENSRegistry', { signer })

  // Make subname
  const node = namehash(name)
  const _labelhash = labelhash(label)

  // Make subname without resolver
  if (!resolver) {
    await registry.setSubnodeOwner(node, _labelhash, _owner)
    return
  }

  // Make subname with resolver
  await registry.setSubnodeRecord(node, _labelhash, _owner, resolver, 0)

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