/* eslint-disable import/no-extraneous-dependencies */

/* eslint-disable no-await-in-loop */
import { Accounts, User } from 'playwright/fixtures/accounts'
import { Contracts } from 'playwright/fixtures/contracts'

import { hexEncodeName } from '@ensdomains/ensjs/utils/hexEncodedName'
import { labelhash } from '@ensdomains/ensjs/utils/labels'
import { namehash } from '@ensdomains/ensjs/utils/normalise'
import { RecordOptions } from '@ensdomains/ensjs/utils/recordHelpers'

import { RESOLVER_ADDRESSES, emptyAddress } from '@app/utils/constants'

import { generateRecords } from './generateRecords'

export type LegacySubname = {
  name: string
  nameOwner: User
  label: string
  owner?: User
  resolver?: `0x${string}`
  records?: RecordOptions
  duration?: number
  type?: 'wrapped' | 'legacy'
  subnames?: Omit<LegacySubname, 'name' | 'nameOwner'>[]
}

type Dependencies = {
  accounts: Accounts
  contracts: Contracts
}
const DEFAULT_RESOLVER = RESOLVER_ADDRESSES['1337'][2] as `0x${string}`
export const generateLegacySubname =
  ({ accounts, contracts }: Dependencies) =>
  async ({
    name,
    nameOwner,
    label,
    owner = nameOwner,
    resolver,
    records,
    type,
    subnames,
  }: LegacySubname) => {
    const subname = `${label}.${name}`
    console.log('generating legacy subname:', subname)

    const _owner = accounts.getAddress(owner)
    const registry = contracts.get('ENSRegistry', { signer: nameOwner })
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
      await generateRecords({ contracts })({
        name: subname,
        owner,
        resolver,
        records,
      })
    }

    if (type === 'wrapped') {
      const nameWrapper = contracts.get('NameWrapper', { signer: owner })
      const registry2 = contracts.get('ENSRegistry', { signer: owner })

      const isApproved = await registry.isApprovedForAll(
        accounts.getAddress(owner),
        nameWrapper.address,
      )

      if (!isApproved) {
        console.log(`approving nameWrapper for user`, owner)
        await registry2.setApprovalForAll(nameWrapper.address, true)
      }

      console.log(`wrapping legacy subname:`, subname)
      const _resolver = resolver || emptyAddress
      await nameWrapper.wrap(
        hexEncodeName(`${label}.${name}`),
        accounts.getAddress(owner),
        _resolver,
      )
    }

    // Create subnames
    const _subnames = (subnames || []).map((_subname) => ({
      ..._subname,
      name: `${label}.${name}`,
      nameOwner: owner,
      resolver: _subname.resolver ?? DEFAULT_RESOLVER,
    }))
    for (const eachSubname of _subnames) {
      await generateLegacySubname({ accounts, contracts })(eachSubname)
    }
  }
