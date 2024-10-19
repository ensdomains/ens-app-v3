import type { Contract } from 'ethers'
import { ethers } from 'hardhat'

import {
  makeCommitment as generateCommitment,
  makeRegistrationTuple,
} from '@ensdomains/ensjs/utils'

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
