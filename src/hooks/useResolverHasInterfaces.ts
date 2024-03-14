import { useMemo } from 'react'
import type { Address } from 'viem'
import { useChainId } from 'wagmi'

import { GetSupportedInterfacesReturnType } from '@ensdomains/ensjs/public'

import { getKnownResolverData } from '@app/constants/resolverAddressData'
import { RESOLVER_INTERFACE_IDS, ResolverInterfaceName } from '@app/constants/resolverInterfaceIds'

import { useSupportedInterfaces } from './ensjs/public/useSupportedInterfaces'

type UseResolverHasInterfacesParameters<TInterfaceNames extends readonly ResolverInterfaceName[]> =
  {
    interfaceNames: TInterfaceNames
    resolverAddress: Address

    enabled?: boolean
  }

const getResolverInterfaceErrors = <
  TInterfaceName extends string,
  const TInterfaceNames extends readonly TInterfaceName[],
>({
  interfaceNames,
  hasInterfaces,
}: {
  interfaceNames: TInterfaceNames
  hasInterfaces: boolean[] | undefined
}) => {
  if (!hasInterfaces) return []
  return interfaceNames.reduce(
    (prev, curr, i) => {
      const hasInterface = hasInterfaces[i]
      if (!hasInterface) return [...prev, `Address does not support ${curr} interface`] as const
      return prev
    },
    [] as readonly `Address does not support ${TInterfaceName} interface`[],
  )
}

type GetInterfaceIds<TInterfaceNames extends readonly ResolverInterfaceName[]> = {
  -readonly [K in keyof TInterfaceNames]: (typeof RESOLVER_INTERFACE_IDS)[TInterfaceNames[K]]
}

type ArrayToUnion<T extends readonly unknown[]> = T[number]

export const useResolverHasInterfaces = <
  const TInterfaceNames extends readonly ResolverInterfaceName[],
  TInterfaceIds extends GetInterfaceIds<TInterfaceNames>,
>({
  enabled: enabled_ = true,
  interfaceNames,
  resolverAddress,
}: UseResolverHasInterfacesParameters<TInterfaceNames>) => {
  const chainId = useChainId()

  const interfaceIds = useMemo(
    () => interfaceNames.map((name) => RESOLVER_INTERFACE_IDS[name]) as TInterfaceIds,
    [interfaceNames],
  )

  const knownResolverData = useMemo(
    () => getKnownResolverData({ chainId, resolverAddress }),
    [chainId, resolverAddress],
  )

  const enabled = enabled_ && !!resolverAddress && interfaceNames.length > 0 && !knownResolverData

  const {
    data: data_,
    isLoading,
    isFetching,
    status,
    isCachedData,
  } = useSupportedInterfaces<GetInterfaceIds<TInterfaceNames>>({
    address: resolverAddress,
    interfaces: interfaceIds,
    enabled,
  })

  const data = useMemo(() => {
    if (!knownResolverData) return data_
    return interfaceIds.map((interfaceId) =>
      knownResolverData.supportedInterfaces.includes(interfaceId),
    ) as GetSupportedInterfacesReturnType<TInterfaceIds>
  }, [knownResolverData, data_, interfaceIds])

  const errors = getResolverInterfaceErrors<ArrayToUnion<TInterfaceNames>, TInterfaceNames>({
    interfaceNames,
    hasInterfaces: data,
  })

  return {
    data,
    knownResolverData,
    isLoading,
    isFetching,
    status,
    isCachedData,
    errors: errors.length > 0 ? errors : undefined,
  }
}
