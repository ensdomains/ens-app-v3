import { BigNumber } from '@ethersproject/bignumber/lib/bignumber'
import { toUtf8Bytes } from '@ethersproject/strings/lib/utf8'
import { useMemo } from 'react'
import { useFeeData, useQuery } from 'wagmi'

import { formatsByCoinType, formatsByName } from '@ensdomains/address-encoder'

import { RegistrationData } from '@app/components/pages/profile/[name]/registration/types'
import { emptyAddress } from '@app/utils/constants'

import useEstimateTransactionCost from './useEstimateTransactionCost'
import { useNameDetails } from './useNameDetails'

type RecordItem = { key: string; value: string }
type RegistrationProps = {
  reverseRecord: boolean
  hasResolverSet: boolean
  textRecords: RecordItem[]
  addressRecords: RecordItem[]
  clearRecords: boolean
}
type GasCostData = [index: number, gas: number]

const BASE_LIMIT = 240664

const byteLengthToDataInx = (byteLength: number) =>
  byteLength > 1 ? Math.ceil(byteLength / 32) + 1 : byteLength

const useEstimateRegistration = (data: RegistrationProps | undefined) => {
  const { data: feeData, isLoading: feeDataLoading } = useFeeData()
  const { data: gasCosts, isLoading: gasCostsLoading } = useQuery(['gas-costs'], async () => {
    const addr = (await import('@app/assets/gas-costs/addr.json'))
      .default as unknown as GasCostData[]
    const text = (await import('@app/assets/gas-costs/text.json'))
      .default as unknown as GasCostData[]

    return { addr, text }
  })

  const estimate = useMemo(() => {
    if (!feeData || !gasCosts || !data) return BigNumber.from(0)

    const { addr, text } = gasCosts
    const { reverseRecord, hasResolverSet, textRecords, addressRecords, clearRecords } = data

    let limit = BASE_LIMIT

    if (hasResolverSet) {
      limit += 24764
    }
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

    return BigNumber.from(limit).mul(feeData.maxFeePerGas!)
  }, [gasCosts, data, feeData])

  return { estimate, isLoading: feeDataLoading || gasCostsLoading }
}

type FullProps = {
  registration: Omit<RegistrationData, 'secret' | 'started'>
  price: ReturnType<typeof useNameDetails>['priceData']
}

export const useEstimateFullRegistration = ({
  registration: { reverseRecord, records, resolver, years },
  price,
}: FullProps) => {
  const { data: estimatedCommitData, isLoading: commitGasLoading } =
    useEstimateTransactionCost('COMMIT')
  const { transactionFee: commitGasFee, gasPrice } = estimatedCommitData || {}
  const { estimate: registrationGasFee, isLoading: registrationGasLoading } =
    useEstimateRegistration({
      reverseRecord,
      addressRecords: records.coinTypes || [],
      textRecords: records.texts || [],
      hasResolverSet: resolver !== emptyAddress,
      clearRecords: !!records.clearRecords,
    })
  const estimatedGasLoading = commitGasLoading || registrationGasLoading
  const estimatedGasFee = useMemo(() => {
    return commitGasFee && registrationGasFee ? commitGasFee.add(registrationGasFee) : undefined
  }, [commitGasFee, registrationGasFee])

  const yearlyFee = price?.base
  const premiumFee = price?.premium
  const hasPremium = premiumFee?.gt(0)
  const totalYearlyFee = yearlyFee?.mul(years)

  return {
    estimatedGasFee,
    estimatedGasLoading,
    yearlyFee,
    totalYearlyFee,
    hasPremium,
    premiumFee,
    gasPrice,
    years,
  }
}

export default useEstimateRegistration
