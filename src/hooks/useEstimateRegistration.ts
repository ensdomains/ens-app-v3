import { BigNumber } from '@ethersproject/bignumber/lib/bignumber'
import { toUtf8Bytes } from '@ethersproject/strings/lib/utf8'
import { useMemo } from 'react'
import { useQuery } from 'wagmi'

import { formatsByCoinType, formatsByName } from '@ensdomains/address-encoder'
import {
  BaseRegistrationParams,
  makeRegistrationData,
} from '@ensdomains/ensjs/utils/registerHelpers'

import { RegistrationReducerDataItem } from '@app/components/pages/profile/[name]/registration/types'
import { useEns } from '@app/utils/EnsProvider'
import { useQueryKeys } from '@app/utils/cacheKeyFactory'
import { fetchTenderlyEstimate } from '@app/utils/tenderly'

import { useAccountSafely } from './useAccountSafely'
import { useChainId } from './useChainId'
import useGasPrice from './useGasPrice'
import { useNameDetails } from './useNameDetails'
import useRegistrationParams from './useRegistrationParams'

const gasLimitDictionary = {
  COMMIT: 42000,
  RENEW: 61818,
  REGISTER: 265428,
}

export type RegistrationProps = Omit<
  BaseRegistrationParams,
  'resolver' | 'duration' | 'secret' | 'resolverAddress'
> & {
  name: string
}
type GasCostData = [index: number, gas: number]

const byteLengthToDataInx = (byteLength: number) =>
  byteLength > 1 ? Math.ceil(byteLength / 32) + 1 : byteLength

const useEstimateRegistration = (
  gasPrice: BigNumber | undefined,
  data: RegistrationProps | undefined,
) => {
  const chainId = useChainId()
  const { ready, contracts } = useEns()
  const queryKeys = useQueryKeys()
  const {
    data: gasUsed,
    isLoading: gasUsedLoading,
    isError,
  } = useQuery(
    queryKeys.estimateRegistration(data),
    async () => {
      const resolver = await contracts?.getPublicResolver()
      if (!resolver) return null
      const registrationTuple = makeRegistrationData({
        ...data!,
        resolver,
        duration: 31557600,
        secret: 'placeholder',
      })
      return fetchTenderlyEstimate({
        type: 'registration',
        networkId: chainId,
        label: registrationTuple[0],
        owner: registrationTuple[1],
        resolver: registrationTuple[4],
        data: registrationTuple[5],
        reverseRecord: registrationTuple[6],
        ownerControlledFuses: registrationTuple[7],
      })
    },
    {
      enabled: !!data && ready,
    },
  )

  const { data: gasCosts, isLoading: gasCostsLoading } = useQuery(
    queryKeys.globalIndependent.gasCostJson,
    async () => {
      const addr = (await import('@app/assets/gas-costs/addr.json'))
        .default as unknown as GasCostData[]
      const text = (await import('@app/assets/gas-costs/text.json'))
        .default as unknown as GasCostData[]

      return { addr, text }
    },
  )

  const fallbackEstimate = useMemo(() => {
    if (!gasPrice || !gasCosts || !data) return BigNumber.from(0)

    const { addr, text } = gasCosts
    const { reverseRecord } = data
    const {
      texts: textRecords = [],
      coinTypes: addressRecords = [],
      clearRecords,
    } = data.records || {}

    let limit = gasLimitDictionary.REGISTER

    if (reverseRecord) {
      limit += 116396
    }
    if (clearRecords) {
      limit += 26191
    }
    for (const { value } of textRecords) {
      const { byteLength } = toUtf8Bytes(value)
      const bytesAsDataInx = byteLengthToDataInx(byteLength)
      limit += text.find(([dataInx]) => bytesAsDataInx >= dataInx)![1]
    }
    for (const { key, value } of addressRecords) {
      let coinTypeInstance
      if (!Number.isNaN(parseInt(key))) {
        coinTypeInstance = formatsByCoinType[parseInt(key)]
      } else {
        coinTypeInstance = formatsByName[key.toUpperCase()]
      }
      const encodedAddress = coinTypeInstance.decoder(value)
      const bytesAsDataInx = byteLengthToDataInx(encodedAddress.byteLength)
      limit += addr.find(([dataInx]) => bytesAsDataInx >= dataInx)![1]
    }

    return BigNumber.from(limit).mul(gasPrice)
  }, [gasCosts, data, gasPrice])

  const estimate = useMemo(() => {
    if (!gasUsed || !gasPrice) return undefined
    return gasPrice.mul(gasUsed)
  }, [gasUsed, gasPrice])

  return isError
    ? {
        estimate: fallbackEstimate,
        isLoading: gasCostsLoading,
      }
    : {
        estimate,
        isLoading: gasUsedLoading,
      }
}

type FullProps = {
  registrationData: RegistrationReducerDataItem
  price: ReturnType<typeof useNameDetails>['priceData']
  name: string
}

export const useEstimateFullRegistration = ({ registrationData, price, name }: FullProps) => {
  const { gasPrice, isLoading: gasPriceLoading } = useGasPrice()
  const { address } = useAccountSafely()
  const { owner, fuses, records, reverseRecord } = useRegistrationParams({
    name,
    owner: address || '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    registrationData,
  })
  const { estimate: registrationGasFee, isLoading: registrationGasLoading } =
    useEstimateRegistration(gasPrice, {
      name,
      owner,
      fuses,
      records,
      reverseRecord,
    })
  const estimatedGasLoading = gasPriceLoading || registrationGasLoading
  const estimatedGasFee = useMemo(() => {
    return registrationGasFee ? registrationGasFee.add(gasLimitDictionary.COMMIT) : undefined
  }, [registrationGasFee])

  const yearlyFee = price?.base
  const premiumFee = price?.premium
  const hasPremium = premiumFee?.gt(0)
  const totalYearlyFee = yearlyFee?.mul(registrationData.years)

  return {
    estimatedGasFee,
    estimatedGasLoading,
    yearlyFee,
    totalYearlyFee,
    hasPremium,
    premiumFee,
    gasPrice,
    years: registrationData.years,
  }
}

export default useEstimateRegistration
