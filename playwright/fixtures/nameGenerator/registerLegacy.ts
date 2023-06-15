/* eslint-disable import/no-extraneous-dependencies */
import { ethers } from 'ethers'

import { RESOLVER_ADDRESSES } from '@app/utils/constants'

import { getContract } from './getContract'

type Options = {
  registrant: string
  secret?: string
  resolver?: string
  duration?: number
}

export const registerLegacy = async (label: string, options: Options) => {
  const {
    registrant = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    secret = '0x0000000000000000000000000000000000000000000000000000000000000000',
    resolver = RESOLVER_ADDRESSES['1337'][0],
    duration = 31536000,
  } = options

  const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545')
  const signer = provider.getSigner(0)
  const controller = await getContract('LegacyETHRegistrarController', signer)
  const commitment = await controller.makeCommitmentWithConfig(
    label,
    registrant,
    secret,
    resolver,
    registrant,
  )
  await controller.commit(commitment)

  provider.send('evm_increaseTime', [60])
  provider.send('evm_mine', [])

  const price = await controller.rentPrice(label, duration)
  await controller.registerWithConfig(label, registrant, duration, secret, resolver, registrant, {
    value: price,
  })
}
