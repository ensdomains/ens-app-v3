import type { Contract } from 'ethers'
import { ethers } from 'hardhat'
import type { Address } from 'viem'

import {
  makeCommitment as generateCommitment,
  makeRegistrationTuple,
  RegistrationParameters,
} from '@ensdomains/ensjs/utils'

type ProcessedSubname = {
  label: string
  owner: Address
  expiry: number
  fuses: number
}

type ProcessedNameData = RegistrationParameters & {
  label: string
  subnames: ProcessedSubname[]
}

export const makeWrappedCommitment =
  (controller: Contract) =>
  (nonce: number) =>
  async ({ owner, name, ...rest }: ProcessedNameData, index: number) => {
    const commitment = generateCommitment({ owner, name, ...rest })

    const _controller = controller.connect(await ethers.getSigner(owner))
    const commitTx = await _controller.commit(commitment, { nonce: nonce + index })
    console.log(`Commiting commitment for ${name} (tx: ${commitTx.hash})...`)
    return 1
  }

export const makeWrappedRenew =
  (controller: Contract) => (nonce: number) => async (name: string, duration: number) => {
    const [price] = await controller.rentPrice(name, duration)
    return price
  }

export const makeWrappedRegistration =
  (controller: Contract) =>
  (nonce: number) =>
  async ({ owner, name, duration, label, ...rest }: ProcessedNameData, index: number) => {
    const [price] = await controller.rentPrice(label, duration)

    const _controller = controller.connect(await ethers.getSigner(owner))

    const registerTx = await _controller.register(
      ...makeRegistrationTuple({ owner, name, duration, ...rest }),
      {
        value: price,
        nonce: nonce + index,
      },
    )
    console.log(`Registering name ${name} (tx: ${registerTx.hash})...`)

    return 1
  }

export const makeWrappedData =
  (resolverAddress, allNamedAccts) =>
  ({ namedOwner, customDuration, fuses, name, subnames, ...rest }: Name) => {
    const secret =
      // eslint-disable-next-line no-restricted-syntax
      '0x0000000000000000000000000000000000000000000000000000000000000000' as Address
    const duration = customDuration || 31536000
    // 1659467455 is the approximate time of the transaction, this is for keeping block hashes the same
    const wrapperExpiry = 1659467455 + duration
    const owner = allNamedAccts[namedOwner]

    const processedSubnames: ProcessedSubname[] =
      subnames?.map(
        ({ label, namedOwner: subNamedOwner, fuses: subnameFuses, expiry: subnameExpiry }) => ({
          label,
          owner: allNamedAccts[subNamedOwner],
          expiry: subnameExpiry || wrapperExpiry,
          fuses: subnameFuses || 0,
        }),
      ) || []

    return {
      resolverAddress,
      secret,
      duration,
      owner,
      name,
      label: name.split('.')[0],
      subnames: processedSubnames,
      fuses: fuses || undefined,
      ...rest,
    }
  }
