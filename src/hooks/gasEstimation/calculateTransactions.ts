import { Address, parseEther } from 'viem'

import { makeCommitment, RegistrationParameters } from '@ensdomains/ensjs/utils'

import { useEstimateGasWithStateOverride } from '../chain/useEstimateGasWithStateOverride'

type ReturnType = null | Parameters<typeof useEstimateGasWithStateOverride>[0]['transactions']

export const calculateTransactions = ({
  registrationParams,
  ethRegistrarControllerAddress,
  fiveMinutesAgoInSeconds,
  price,
}: {
  registrationParams?: RegistrationParameters
  ethRegistrarControllerAddress: unknown
  fiveMinutesAgoInSeconds: number
  price?: { base: bigint; premium: bigint }
}): ReturnType => {
  if (!registrationParams || !ethRegistrarControllerAddress || !price) return null

  const registrationStateOverride = {
    address: ethRegistrarControllerAddress as Address,
    stateDiff: [
      {
        slot: 1,
        keys: [makeCommitment(registrationParams)],
        value: BigInt(fiveMinutesAgoInSeconds),
      },
    ],
  }

  return [
    {
      name: 'commitName',
      data: registrationParams,
    },
    {
      name: 'registerName',
      data: registrationParams,
      stateOverride: [
        registrationStateOverride,
        {
          address: registrationParams.owner,
          balance: price ? (price.base + price.premium) * 2n + parseEther('1000000') : undefined,
        },
      ],
    },
  ] as const
}
