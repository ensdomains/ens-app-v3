import { useMemo } from 'react'
import { namehash } from 'viem'
import { usePrepareContractWrite, useWalletClient } from 'wagmi'

import { publicResolverSetAddrSnippet } from '@ensdomains/ensjs/contracts'

import { useProfile } from '@app/hooks/useProfile'
import { emptyAddress } from '@app/utils/constants'

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
  } = useIsWrapped({ name, enabled })

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
    data: preparedContractWrite,
    isLoading: isPreparedContractWriteLoading,
    isError: isPreparedContractWriteError,
    isFetching: isPreparedContractWriteFetching,
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
    isDependentDataLoading ||
    isResolverHasInterfacesLoading ||
    isPreparedContractWriteLoading ||
    isWrappedLoading

  const data = useMemo(() => {
    if (!enabled || isLoading) return undefined
    if (!resolverSupportsMultiAddress) return { isValid: false, isAuthorised: false }
    if (knownResolverData)
      return {
        isValid: true,
        isAuthorised: isWrapped ? knownResolverData.isNameWrapperAware : true,
      }
    return {
      isValid: true,
      isAuthorised: !isPreparedContractWriteError && preparedContractWrite?.request !== undefined,
    }
  }, [
    enabled,
    isLoading,
    resolverSupportsMultiAddress,
    knownResolverData,
    isWrapped,
    isPreparedContractWriteError,
    preparedContractWrite,
  ])

  return {
    data,
    isLoading,
    isFetching:
      profile.isFetching ||
      isResolverHasInterfacesFetching ||
      isPreparedContractWriteFetching ||
      isWrappedFetching,
  }
}
