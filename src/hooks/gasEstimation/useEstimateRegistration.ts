import { useMemo } from 'react'
import { parseEther } from 'viem'

import { makeCommitment } from '@ensdomains/ensjs/utils'

import { RegistrationReducerDataItem } from '@app/components/pages/profile/[name]/registration/types'

import { useAccountSafely } from '../account/useAccountSafely'
import { useContractAddress } from '../chain/useContractAddress'
import { useEstimateGasWithStateOverride } from '../chain/useEstimateGasWithStateOverride'
import { useGasPrice } from '../chain/useGasPrice'
import { usePrice } from '../ensjs/public/usePrice'
import useRegistrationParams from '../useRegistrationParams'

// const gasLimitDictionary = {
//   COMMIT: 42000n,
//   RENEW: 61818n,
//   REGISTER: 265428n,
// }

type UseEstimateFullRegistrationParameters = {
  registrationData: RegistrationReducerDataItem
  name: string
}

export const useEstimateFullRegistration = ({
  registrationData,
  name,
}: UseEstimateFullRegistrationParameters) => {
  const { address } = useAccountSafely()
  const { gasPrice, isLoading: gasPriceLoading } = useGasPrice()

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

  const fiveMinutesAgoInSeconds = useMemo(() => Math.floor((Date.now() - 1000 * 60 * 5) / 1000), [])

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
            balance: price ? price.base + price.premium + parseEther('10') : undefined,
          },
        ],
      },
    ],
    enabled: !!ethRegistrarControllerAddress && !!price,
  })

  const yearlyFee = price?.base
  const premiumFee = price?.premium
  const hasPremium = !!premiumFee && premiumFee > 0n
  const totalYearlyFee = yearlyFee ? yearlyFee * BigInt(registrationData.years) : 0n

  return {
    estimatedGasFee: data.gasCost,
    estimatedGasLoading: isLoading || gasPriceLoading,
    yearlyFee,
    totalYearlyFee,
    hasPremium,
    premiumFee,
    gasPrice,
    years: registrationData.years,
  }
}
