import { useMemo } from 'react'

import { RegistrationReducerDataItem } from '@app/components/pages/profile/[name]/registration/types'
import { DISCONNECTED_PLACEHOLDER_ADDRESS } from '@app/utils/constants'
import { deriveYearlyFee } from '@app/utils/utils'

import { useAccountSafely } from '../account/useAccountSafely'
import { useBlockTimestamp } from '../chain/useBlockTimestamp'
import { useContractAddress } from '../chain/useContractAddress'
import { useEstimateGasWithStateOverride } from '../chain/useEstimateGasWithStateOverride'
import { useGasPrice } from '../chain/useGasPrice'
import { usePrice } from '../ensjs/public/usePrice'
import useRegistrationParams from '../useRegistrationParams'
import { calculateTransactions } from './calculateTransactions'

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
    owner: address || DISCONNECTED_PLACEHOLDER_ADDRESS,
    registrationData,
  })

  const { data: price } = usePrice({ nameOrNames: name, duration: registrationParams.duration })

  const ethRegistrarControllerAddress = useContractAddress({
    contract: 'ensEthRegistrarController',
  })

  const legacyEthRegistrarControllerAddress = useContractAddress({
    contract: 'legacyEthRegistrarController',
  })

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

  const transactions = calculateTransactions({
    registrationParams,
    ethRegistrarControllerAddress,
    legacyEthRegistrarControllerAddress,
    fiveMinutesAgoInSeconds,
    price,
  })
  const { data, isLoading } = useEstimateGasWithStateOverride({
    transactions: transactions!,
    enabled: !!transactions,
  })

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
