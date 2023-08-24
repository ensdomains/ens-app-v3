import { useMemo } from 'react'
import { stringToBytes } from 'viem'
import { useQuery } from 'wagmi'

import { formatsByCoinType, formatsByName } from '@ensdomains/address-encoder'
import {
  RegistrationParameters,
  makeRegistrationTuple,
} from '@ensdomains/ensjs/utils'

import { RegistrationReducerDataItem } from '@app/components/pages/profile/[name]/registration/types'
import { useQueryKeys } from '@app/utils/cacheKeyFactory'
import { fetchTenderlyEstimate } from '@app/utils/tenderly'

import { PublicClientWithChain } from '@app/types'
import { yearsToSeconds } from '@app/utils/utils'
import { getChainContractAddress } from '@ensdomains/ensjs/contracts'
import { useAccountSafely } from '../account/useAccountSafely'
import { useGasPrice } from '../chain/useGasPrice'
import { usePrice } from '../ensjs/public/usePrice'
import { usePublicClient } from '../usePublicClient'
import useRegistrationParams from '../useRegistrationParams'

const gasLimitDictionary = {
  COMMIT: 42000n,
  RENEW: 61818n,
  REGISTER: 265428n,
}

type RequiredRegistrationParameters = Omit<RegistrationParameters, 'duration' | 'secret'>
type GasCostData = [index: number, gas: number]

const byteLengthToDataInx = (byteLength: number) =>
  BigInt(byteLength > 1 ? Math.ceil(byteLength / 32) + 1 : byteLength)

const fetchRegistrationEstimate = async (publicClient: PublicClientWithChain, {
  data,
  chainId,
}: {
  data: RequiredRegistrationParameters
  chainId: number
}) => {
  const registrationTuple = makeRegistrationTuple({
    ...data,
    resolverAddress: getChainContractAddress({ client: publicClient, contract: 'ensPublicResolver' }),
    duration: 31557600,
    secret: '0xplaceholder',
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
  }).then((v) => BigInt(v))
}

const getFallbackEstimate = ({
  gasPrice,
  gasCosts,
  data,
}: {
  gasPrice: bigint | undefined
  gasCosts: { addr: GasCostData[]; text: GasCostData[] } | undefined
  data: RequiredRegistrationParameters | undefined
}) => {
  if (!gasPrice || !gasCosts || !data) return 0n

  const { addr, text } = gasCosts
    const { reverseRecord } = data
    const {
      texts: textRecords = [],
      coins: addressRecords = [],
      clearRecords,
    } = data.records || {}

    let limit = gasLimitDictionary.REGISTER

    if (reverseRecord) {
      limit += 116396n
    }
    if (clearRecords) {
      limit += 26191n
    }
    for (const { value } of textRecords) {
      const { byteLength } = stringToBytes(value!)
      const bytesAsDataInx = byteLengthToDataInx(byteLength)
      limit += BigInt(text.find(([dataInx]) => bytesAsDataInx >= dataInx)![1])
    }
    for (const { coin, value } of addressRecords) {
      let coinTypeInstance
      if (!Number.isNaN(parseInt(coin as string))) {
        coinTypeInstance = formatsByCoinType[parseInt(coin as string)]
      } else {
        coinTypeInstance = formatsByName[(coin as string).toUpperCase()]
      }
      const encodedAddress = coinTypeInstance.decoder(value)
      const bytesAsDataInx = byteLengthToDataInx(encodedAddress.byteLength)
      limit += BigInt(addr.find(([dataInx]) => bytesAsDataInx >= dataInx)![1])
    }

    return limit * gasPrice
}

type UseEstimateFullRegistrationParameters = {
  registrationData: RegistrationReducerDataItem
  name: string
}

export const useEstimateFullRegistration = ({ registrationData, name }: UseEstimateFullRegistrationParameters) => {
  const publicClient = usePublicClient()
  const { address } = useAccountSafely()
  const { gasPrice, isLoading: gasPriceLoading } = useGasPrice()

  const queryKeys = useQueryKeys()

  const { data: price } = usePrice({ nameOrNames: name, duration: yearsToSeconds(1) })

  const { owner, fuses, records, reverseRecord } = useRegistrationParams({
    name,
    owner: address || '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    registrationData,
  })

  const requiredRegistrationParameters = {
    name,
    owner,
    fuses,
    records,
    reverseRecord,
  }

  const {
    data: gasUsed,
    isLoading: gasUsedLoading,
    isError,
  } = useQuery(
    queryKeys.getRegistrationEstimate({ data: requiredRegistrationParameters }),
    ({ queryKey: [params] }) => fetchRegistrationEstimate(publicClient, params),
    {
      enabled: !!name && !!owner && !!fuses && !!records && !!reverseRecord,
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

  const estimate = useMemo(() => {
    if (!gasUsed || !gasPrice) return undefined
    return gasPrice * gasUsed
  }, [gasUsed, gasPrice])
  const fallbackEstimate = useMemo(() => getFallbackEstimate({ gasPrice, gasCosts, data: requiredRegistrationParameters }), [gasPrice, gasCosts, requiredRegistrationParameters])

  const shouldUseFallback = isError
  const registrationGasFee = shouldUseFallback ? fallbackEstimate : estimate
  
  const estimatedGasLoading = (shouldUseFallback ? gasCostsLoading : gasUsedLoading) || gasPriceLoading
  const estimatedGasFee = useMemo(() => {
    return registrationGasFee ? registrationGasFee + gasLimitDictionary.COMMIT : undefined
  }, [registrationGasFee])

  const yearlyFee = price?.base
  const premiumFee = price?.premium
  const hasPremium = premiumFee && premiumFee > 0n
  const totalYearlyFee = yearlyFee && yearlyFee * BigInt(registrationData.years)

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