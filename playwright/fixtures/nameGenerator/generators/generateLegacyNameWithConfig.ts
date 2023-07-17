/* eslint-disable import/no-extraneous-dependencies */

/* eslint-disable no-await-in-loop */
import { Accounts, User } from 'playwright/fixtures/accounts'

import { namehash } from '@ensdomains/ensjs/utils/normalise'
import { RecordOptions } from '@ensdomains/ensjs/utils/recordHelpers'

import { RESOLVER_ADDRESSES } from '@app/utils/constants'

import { Provider } from '../../provider'
import { getContract } from '../utils/getContract'
import { LegacySubname, generateLegacySubname } from './generateLegacySubname'
import { generateRecords } from './generateRecords'

const DEFAULT_DURATION = 31536000
const DURATION_ADJUSTMENT = 2419200 + 7776000

export type Name = {
  label: string
  owner: User
  manager?: User
  duration?: number
  secret?: string
  resolver?: `0x${string}`
  addr?: User
  records?: RecordOptions
  subnames?: Omit<LegacySubname, 'name'>[]
}

type Dependencies = {
  provider: Provider
  accounts: Accounts
}

export const generateLegacyNameWithConfig = async (
  {
    label,
    owner,
    manager,
    duration = DEFAULT_DURATION,
    secret = '0x0000000000000000000000000000000000000000000000000000000000000000',
    resolver = RESOLVER_ADDRESSES['1337'][0] as `0x${string}`,
    addr = owner,
    records,
    subnames,
  }: Name,
  { provider, accounts }: Dependencies,
) => {
  const _owner = accounts.getAddress(owner)
  const _addr = accounts.getAddress(addr)

  // Connect contract
  const signer = provider.getSigner(accounts.getIndex(owner))
  const controller = await getContract('LegacyETHRegistrarController', { signer })
  console.log(controller.address, label, _owner, secret, resolver, _addr)
  console.log('------------------------')
  // Commit
  const commitment = await controller.makeCommitmentWithConfig(
    label,
    _owner,
    secret,
    resolver,
    _addr,
  )
  await controller.commit(commitment)

  await provider.increaseTime(60)
  await provider.mine()

  // Register
  const _duration = duration
  const price = await controller.rentPrice(label, _duration)
  await controller.registerWithConfig(label, _owner, _duration, secret, resolver, _addr, {
    value: price,
  })

  // Create records
  await generateRecords({ name: `${label}.eth`, owner, resolver, records }, { provider, accounts })

  // Create subnames
  const _subnames = (subnames || []).map((subname) => ({
    ...subname,
    name: `${label}.eth`,
    nameOwner: owner,
    resolver: subname.resolver ?? resolver,
  }))
  for (const subname of _subnames) {
    await generateLegacySubname(subname, { provider, accounts })
  }

  if (!!manager && manager !== owner) {
    const registry = await getContract('ENSRegistry', { signer })
    const node = namehash(`${label}.eth`)
    const _manager = accounts.getAddress(manager)
    await registry.setOwner(node, _manager)
  }

  await provider.mine()
}