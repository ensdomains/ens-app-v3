/* eslint-disable import/no-extraneous-dependencies */

/* eslint-disable no-await-in-loop */
import { Accounts, User } from 'playwright/fixtures/accounts'
import { Provider } from 'playwright/fixtures/provider'

import { PublicResolver } from '@ensdomains/ensjs/generated/PublicResolver'
import { CombinedFuseInput } from '@ensdomains/ensjs/utils/fuses'
import { RecordOptions } from '@ensdomains/ensjs/utils/recordHelpers'
import { makeCommitment, makeRegistrationData } from '@ensdomains/ensjs/utils/registerHelpers'

import { getContract } from '../utils/getContract'
import { WrappedSubname, generateWrappedSubname } from './generateWrappedSubname'

export type Name = {
  label: string
  owner: User
  duration?: number
  secret?: string
  resolver?: `0x${string}`
  reverseRecord?: boolean
  fuses?: CombinedFuseInput['child']
  addr?: `0x${string}`
  records?: RecordOptions
  subnames?: Omit<WrappedSubname, 'name' | 'nameOwner'>[]
}

type Dependencies = {
  accounts: Accounts
  provider: Provider
}

export const generateWrappedName = async (
  {
    label,
    owner,
    duration = 31536000,
    secret = '0x0000000000000000000000000000000000000000000000000000000000000000',
    resolver,
    reverseRecord = false,
    fuses,
    records,
    subnames,
  }: Name,
  { accounts, provider }: Dependencies,
) => {
  const _owner = accounts.getAddress(owner)
  const name = `${label}.eth`
  const _resolver = getContract('PublicResolver', { address: resolver }) as PublicResolver
  const signer = provider.getSigner(accounts.getIndex(owner))
  const controller = getContract('ETHRegistrarController', { signer })

  // Commit
  const { commitment } = makeCommitment({
    name,
    owner: _owner,
    duration,
    secret,
    records,
    reverseRecord,
    fuses,
    resolver: _resolver,
  })
  await controller.commit(commitment)

  await provider.increaseTime(60)
  await provider.mine()

  // Register
  const price = await controller.rentPrice(label, duration)
  await controller.register(
    ...makeRegistrationData({
      name,
      owner: _owner,
      duration,
      secret,
      records,
      resolver: _resolver,
      reverseRecord,
      fuses,
    }),
    {
      value: price[0],
    },
  )

  // Create subnames
  const _subnames = (subnames || []).map((subname) => ({
    ...subname,
    name: `${label}.eth`,
    nameOwner: owner,
    resolver: undefined,
  }))
  for (const subname of _subnames) {
    await generateWrappedSubname(subname, { accounts, provider })
  }

  await provider.mine()
}
