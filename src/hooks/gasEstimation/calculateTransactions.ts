import { match } from 'ts-pattern'
import { Address, parseEther } from 'viem'

import {
  makeCommitment,
  makeLegacyCommitment,
  RegistrationParameters,
} from '@ensdomains/ensjs/utils'

import { isLegacyRegistration } from '@app/utils/registration/isLegacyRegistration'
import { makeLegacyRegistrationParams } from '@app/utils/registration/makeLegacyRegistrationParams'

import { useEstimateGasWithStateOverride } from '../chain/useEstimateGasWithStateOverride'

type ReturnType = null | Parameters<typeof useEstimateGasWithStateOverride>[0]['transactions']

export const calculateTransactions = ({
  registrationParams,
  ethRegistrarControllerAddress,
  legacyEthRegistrarControllerAddress,
  fiveMinutesAgoInSeconds,
  price,
}: {
  registrationParams?: RegistrationParameters
  ethRegistrarControllerAddress: unknown
  legacyEthRegistrarControllerAddress: unknown
  fiveMinutesAgoInSeconds: number
  price?: { base: bigint; premium: bigint }
}): ReturnType => {
  if (
    !registrationParams ||
    !ethRegistrarControllerAddress ||
    !legacyEthRegistrarControllerAddress ||
    !price
  )
    return null

  const isLegacy = isLegacyRegistration(registrationParams)

  const registrationStateOverride = match(isLegacy)
    .with(true, () => ({
      address: legacyEthRegistrarControllerAddress as Address,
      stateDiff: [
        {
          slot: 5,
          keys: [makeLegacyCommitment(makeLegacyRegistrationParams(registrationParams))],
          value: BigInt(fiveMinutesAgoInSeconds),
        },
      ],
    }))
    .with(false, () => ({
      address: ethRegistrarControllerAddress as Address,
      stateDiff: [
        {
          slot: 1,
          keys: [makeCommitment(registrationParams)],
          value: BigInt(fiveMinutesAgoInSeconds),
        },
      ],
    }))
    .exhaustive()

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
