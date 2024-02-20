import { useMemo } from 'react'
import { useWalletClient } from 'wagmi'

import { useProfile } from '@app/hooks/useProfile'
import { emptyAddress } from '@app/utils/constants'

import { useTransactionGasEstimates } from '../chain/useTransactionGasEstimates'
import { useIsWrapped } from '../useIsWrapped'
import { useResolverHasInterfaces } from '../useResolverHasInterfaces'

type UseResolverIsAuthorisedParameters = {
  name: string

  enabled?: boolean
}

export const useResolverIsAuthorised = ({
  name,
  enabled: enabled_ = true,
}: UseResolverIsAuthorisedParameters) => {
  const enabled = enabled_ && !!name

  const walletClient = useWalletClient()

  const profile = useProfile({
    name,
    enabled,
  })
  const resolverAddress = profile.data?.resolverAddress

  const {
    data: isWrapped,
    isLoading: isWrappedLoading,
    isFetching: isWrappedFetching,
    isCachedData: isWrappedCachedData,
  } = useIsWrapped({ name, enabled })

  const isDependentDataLoading = profile.isLoading || walletClient.isLoading

  const {
    data: [resolverSupportsMultiAddress] = [false],
    knownResolverData,
    isLoading: isResolverHasInterfacesLoading,
    isFetching: isResolverHasInterfacesFetching,
    isCachedData: isResolverHasInterfacesCachedData,
  } = useResolverHasInterfaces({
    interfaceNames: ['MultiCoinAddressResolver'],
    resolverAddress: resolverAddress!,
    enabled: enabled && !isDependentDataLoading && !!resolverAddress,
  })

  const {
    data: transactionGasEstimateData,
    isLoading: isEstimateLoading,
    isError: isEstimateError,
    isFetching: isEstimateFetching,
    isCachedData: isEstimateCachedData,
  } = useTransactionGasEstimates({
    transactions: [
      {
        name: 'updateProfile',
        data: {
          name,
          resolverAddress: resolverAddress!,
          records: {
            coins: [{ coin: 'eth', value: emptyAddress }],
          },
        },
      },
    ],
    enabled:
      enabled &&
      !isDependentDataLoading &&
      !knownResolverData &&
      resolverSupportsMultiAddress &&
      !!resolverAddress,
  })

  const isLoading =
    isDependentDataLoading ||
    isResolverHasInterfacesLoading ||
    isEstimateLoading ||
    isWrappedLoading

  const data = useMemo(() => {
    if (!enabled) return undefined
    if (!resolverSupportsMultiAddress) return { isValid: false, isAuthorised: false }
    if (knownResolverData)
      return {
        isValid: true,
        isAuthorised: isWrapped ? knownResolverData.isNameWrapperAware : true,
      }
    return {
      isValid: true,
      isAuthorised: !isEstimateError && transactionGasEstimateData?.reduced !== undefined,
    }
  }, [
    enabled,
    resolverSupportsMultiAddress,
    knownResolverData,
    isWrapped,
    isEstimateError,
    transactionGasEstimateData,
  ])

  return {
    data,
    isLoading,
    isFetching:
      profile.isFetching ||
      isResolverHasInterfacesFetching ||
      isEstimateFetching ||
      isWrappedFetching,
    isCachedData:
      profile.isCachedData ||
      isResolverHasInterfacesCachedData ||
      isEstimateCachedData ||
      isWrappedCachedData,
  }
}
