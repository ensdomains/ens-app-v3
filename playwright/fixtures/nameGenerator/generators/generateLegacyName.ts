/* eslint-disable import/no-extraneous-dependencies */

/* eslint-disable no-await-in-loop */
import { Accounts, User } from 'playwright/fixtures/accounts'

import { namehash } from '@ensdomains/ensjs/utils/normalise'

import { Provider } from '../../provider'
import { getContract } from '../utils/getContract'
import { LegacySubname, generateLegacySubname } from './generateLegacySubname'

const DEFAULT_DURATION = 31536000
const DURATION_ADJUSTMENT = 2419200 + 7776000

export type Name = {
  label: string
  owner: User
  manager?: User
  duration?: number
  secret?: string
  subnames?: Omit<LegacySubname, 'name' | 'nameOwner'>[]
}

type Dependencies = {
  provider: Provider
  accounts: Accounts
}

export const generateLegacyName = async (
  {
    label,
    owner,
    manager,
    duration = DEFAULT_DURATION,
    secret = '0x0000000000000000000000000000000000000000000000000000000000000000',
    subnames,
  }: Name,
  { provider, accounts }: Dependencies,
) => {
  const _owner = accounts.getAddress(owner)

  // Connect contract
  const signer = provider.getSigner(accounts.getIndex(owner))
  const controller = await getContract('LegacyETHRegistrarController', { signer })

  // Commit
  const commitment = await controller.makeCommitment(label, _owner, secret)
  await controller.commit(commitment)

  await provider.increaseTime(60)
  await provider.mine()

  // Register
  const _duration = duration + DURATION_ADJUSTMENT
  const price = await controller.rentPrice(label, _duration)
  await controller.register(label, _owner, _duration, secret, {
    value: price,
  })

  // Create subnames
  const _subnames = (subnames || []).map((subname) => ({
    ...subname,
    name: `${label}.eth`,
    nameOwner: owner,
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
