/* eslint-disable import/no-extraneous-dependencies */
import { Accounts, User } from 'playwright/fixtures/accounts'
import { Provider } from 'playwright/fixtures/provider'

import { hexEncodeName } from '@ensdomains/ensjs/utils/hexEncodedName'
import { labelhash } from '@ensdomains/ensjs/utils/labels'
import { namehash } from '@ensdomains/ensjs/utils/normalise'

import { emptyAddress } from '@app/utils/constants'

import { getContract } from '../utils/getContract'
import { Records, generateRecords } from './generateRecords'

export type LegacySubname = {
  name: string
  nameOwner: User
  label: string
  owner?: User
  resolver?: `0x${string}`
  records?: Records
  duration?: number
  type?: 'wrapped' | 'legacy'
}

type Dependencies = {
  provider: Provider
  accounts: Accounts
}

export const generateLegacySubname = async (
  { name, nameOwner, label, owner = nameOwner, resolver, records, type }: LegacySubname,
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
  } else {
    await registry.setSubnodeRecord(node, _labelhash, _owner, resolver, 0)
  }

  // Make records
  if (records && resolver) {
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

  if (type === 'wrapped') {
    const signer2 = provider.getSigner(accounts.getIndex(owner))
    const nameWrapper = await getContract('NameWrapper', { signer: signer2 })
    const registry2 = await getContract('ENSRegistry', { signer: signer2 })

    const isApproved = await registry.isApprovedForAll(
      accounts.getAddress(owner),
      nameWrapper.address,
    )

    if (!isApproved) {
      await registry2.setApprovalForAll(nameWrapper.address, true)
    }

    const _resolver = resolver || emptyAddress
    await nameWrapper.wrap(hexEncodeName(`${label}.${name}`), accounts.getAddress(owner), _resolver)
  }
}
