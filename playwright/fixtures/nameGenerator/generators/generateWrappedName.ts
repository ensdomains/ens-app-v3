/* eslint-disable import/no-extraneous-dependencies */
import { Accounts } from 'playwright/fixtures/accounts'
import { Provider } from 'playwright/fixtures/provider'

import { PublicResolver } from '@ensdomains/ensjs/generated/PublicResolver'
import { CombinedFuseInput } from '@ensdomains/ensjs/utils/fuses'
import { RecordOptions } from '@ensdomains/ensjs/utils/recordHelpers'
import { makeCommitment, makeRegistrationData } from '@ensdomains/ensjs/utils/registerHelpers'

import { getContract } from '../utils/getContract'

export type Name = {
  label: string
  owner: `0x${string}`
  manager?: `0x${string}`
  duration?: number
  secret?: string
  resolver?: `0x${string}`
  reverseRecord?: boolean
  fuses?: CombinedFuseInput
  addr?: `0x${string}`
  records?: RecordOptions
  // subnames?: Omit<LegacySubname, 'name'>[]
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
    records,
    reverseRecord = false,
  }: Name,
  { accounts, provider }: Dependencies,
) => {
  const name = `${label}.eth`
  const resolver = getContract('PublicResolver') as PublicResolver
  const signer = provider.getSigner(accounts.getIndex(owner))
  const controller = getContract('ETHRegistrarController', { signer })
  const { commitment } = makeCommitment({
    name,
    owner,
    duration,
    secret,
    records: undefined,
    reverseRecord,
    fuses: {
      named: ['CANNOT_UNWRAP'],
    },
    resolver,
  })
  await controller.commit(commitment)

  await provider.increaseTime(60)
  await provider.mine()

  const price = await controller.rentPrice(label, duration)
  await controller.register(
    ...makeRegistrationData({
      name,
      owner,
      duration,
      secret,
      records: undefined,
      resolver,
      reverseRecord,
      fuses: {
        named: ['CANNOT_UNWRAP'],
      },
    }),
    {
      value: price[0],
    },
  )
  await provider.mine()
}
