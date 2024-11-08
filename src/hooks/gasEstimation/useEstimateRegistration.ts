import { useMemo } from 'react'
import { parseEther } from 'viem'

import { makeCommitment } from '@ensdomains/ensjs/utils'

import { RegistrationReducerDataItem } from '@app/components/pages/profile/[name]/registration/types'
import { deriveYearlyFee } from '@app/utils/utils'

import { useAccountSafely } from '../account/useAccountSafely'
import { useBlockTimestamp } from '../chain/useBlockTimestamp'
import { useContractAddress } from '../chain/useContractAddress'
import { useEstimateGasWithStateOverride } from '../chain/useEstimateGasWithStateOverride'
import { useGasPrice } from '../chain/useGasPrice'
import { usePrice } from '../ensjs/public/usePrice'
import useRegistrationParams from '../useRegistrationParams'

type UseEstimateFullRegistrationParameters = {
  registrationData: RegistrationReducerDataItem
  name: string
}

export const useEstimateFullRegistration = ({
  registrationData,
  name,
}: UseEstimateFullRegistrationParameters) => {
  const { address } = useAccountSafely()
  const { data: gasPrice, isLoading: gasPriceLoading } = useGasPrice()

  const registrationParams = useRegistrationParams({
    name,
    owner: address || '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    registrationData,
  })

  const { data: price } = usePrice({ nameOrNames: name, duration: registrationParams.duration })

  const ethRegistrarControllerAddress = useContractAddress({
    contract: 'ensEthRegistrarController',
  })

  const commitment = useMemo(() => makeCommitment(registrationParams), [registrationParams])

  const { data: blockTimestamp } = useBlockTimestamp()
  // default to use block timestamp as reference
  // if no block timestamp, use local time as fallback

  const timestampReference = useMemo(
    () => (blockTimestamp ? Number(blockTimestamp) : Date.now()),
    [blockTimestamp],
  )

  const fiveMinutesAgoInSeconds = useMemo(
    () => Math.floor(timestampReference / 1000) - 60 * 5,
    [timestampReference],
  )

  const { data, isLoading } = useEstimateGasWithStateOverride({
    transactions: [
      {
        name: 'commitName',
        data: registrationParams,
      },
      {
        name: 'registerName',
        data: registrationParams,
        stateOverride: [
          {
            address: ethRegistrarControllerAddress,
            stateDiff: [
              {
                slot: 1,
                keys: [commitment],
                value: BigInt(fiveMinutesAgoInSeconds),
              },
            ],
          },
          {
            address: registrationParams.owner,
            balance: price ? (price.base + price.premium) * 2n + parseEther('10000') : undefined,
          },
        ],
      },
    ],
    enabled: !!ethRegistrarControllerAddress && !!price,
  })

  console.log('data', data, isLoading)

  const premiumFee = price?.premium
  const hasPremium = !!premiumFee && premiumFee > 0n
  const yearlyFee = price?.base
    ? deriveYearlyFee({ duration: registrationParams.duration, price })
    : undefined
  const totalDurationBasedFee = price?.base || 0n

  return {
    estimatedGasFee: data.gasCost,
    estimatedGasLoading: isLoading || gasPriceLoading,
    yearlyFee,
    totalDurationBasedFee,
    hasPremium,
    premiumFee,
    gasPrice,
    seconds: registrationData.seconds,
  }
}
