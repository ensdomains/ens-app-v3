import { useMemo } from 'react'
import { namehash } from 'viem'
import { usePrepareContractWrite, useWalletClient } from 'wagmi'

import { publicResolverSetAddrSnippet } from '@ensdomains/ensjs/contracts'

import { useProfile } from '@app/hooks/useProfile'
import { emptyAddress } from '@app/utils/constants'

import { useBasicName } from '../useBasicName'
import { useResolverHasInterfaces } from '../useResolverHasInterfaces'

type UseResolverIsAuthorisedParameters = {
  name: string

  enabled?: boolean
}

export const useResolverIsAuthorized = ({
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

  const basicName = useBasicName({
    name,
    enabled,
  })
  const { isWrapped } = basicName

  const isDependentDataLoading = profile.isLoading || walletClient.isLoading

  const {
    data: [resolverSupportsMultiAddress] = [false],
    knownResolverData,
    isLoading: isResolverHasInterfacesLoading,
    isFetching: isResolverHasInterfacesFetching,
  } = useResolverHasInterfaces({
    interfaceNames: ['MultiCoinAddressResolver'],
    resolverAddress: resolverAddress!,
    enabled: enabled && !isDependentDataLoading && !!resolverAddress,
  })
  const {
    data: contractEstimate,
    isLoading: isContractEstimateLoading,
    isError: isContractEstimateError,
    isFetching: isContractEstimateFetching,
  } = usePrepareContractWrite({
    abi: publicResolverSetAddrSnippet,
    address: resolverAddress,
    account: walletClient.data?.account,

    functionName: 'setAddr',
    args: [namehash(name), 60n, emptyAddress],

    enabled:
      enabled &&
      !isDependentDataLoading &&
      !knownResolverData &&
      resolverSupportsMultiAddress &&
      !!resolverAddress,
  })

  const isLoading =
    isDependentDataLoading || isResolverHasInterfacesLoading || isContractEstimateLoading

  const data = useMemo(() => {
    if (isLoading) return undefined
    if (!resolverSupportsMultiAddress) return { isValid: false, isAuthorised: false }
    if (knownResolverData)
      return {
        isValid: true,
        isAuthorised: isWrapped ? knownResolverData.isNameWrapperAware : true,
      }
    return {
      isValid: true,
      isAuthorised: !isContractEstimateError && contractEstimate?.request?.gas !== undefined,
    }
  }, [
    isLoading,
    resolverSupportsMultiAddress,
    knownResolverData,
    isWrapped,
    isContractEstimateError,
    contractEstimate,
  ])

  return {
    data,
    isLoading,
    isFetching: profile.isFetching || isResolverHasInterfacesFetching || isContractEstimateFetching,
  }
}
