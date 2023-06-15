/* eslint-disable import/no-extraneous-dependencies */
import { ethers } from 'ethers'

import { PublicResolver } from '@ensdomains/ensjs/generated/PublicResolver'
import { CombinedFuseInput } from '@ensdomains/ensjs/utils/fuses'
import { RecordOptions } from '@ensdomains/ensjs/utils/recordHelpers'
import { makeCommitment, makeRegistrationData } from '@ensdomains/ensjs/utils/registerHelpers'

import { getContract } from './getContract'

type Options = {
  owner: string
  secret?: string
  resolver?: string
  duration?: number
  records?: RecordOptions
  reverseRecord?: boolean
  fuses: CombinedFuseInput['child']
}

export const registerWrapped = async (label: string, options: Options) => {
  const {
    owner,
    duration = 31536000,
    records,
    reverseRecord,
    fuses,
    secret = '0x0000000000000000000000000000000000000000000000000000000000000000',
  } = options

  const name = `${label}.eth`
  const resolver = getContract('PublicResolver') as PublicResolver
  const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545')
  const signer = provider.getSigner(0)
  const controller = getContract('ETHRegistrarController', signer)
  const { commitment } = makeCommitment({
    name,
    owner,
    duration,
    secret,
    records,
    reverseRecord,
    fuses,
    resolver,
  })
  await controller.commit(commitment)

  const price = await controller.rentPrice(label, duration)
  await controller.register(
    ...makeRegistrationData({
      owner,
      name,
      duration,
      secret,
      resolver,
    }),
    {
      value: price,
    },
  )
}
