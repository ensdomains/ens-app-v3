import { useMemo } from 'react'
import type { Address } from 'viem'
import { useChainId } from 'wagmi'

import { GetSupportedInterfacesReturnType } from '@ensdomains/ensjs/public'

import { getKnownResolverData } from '@app/constants/resolverAddressData'
import { RESOLVER_INTERFACE_IDS, ResolverInterfaceName } from '@app/constants/resolverInterfaceIds'
import { useEffectiveResolverAddress } from '@app/hooks/resolver/useEffectiveResolverAddress'

import { useSupportedInterfaces } from './ensjs/public/useSupportedInterfaces'

type UseResolverHasInterfacesParameters<TInterfaceNames extends readonly ResolverInterfaceName[]> =
  {
    interfaceNames: TInterfaceNames
    resolverAddress: Address
    /**
     * Pass the name whenever `resolverAddress` is a NAME'S resolver (from the
     * registry, subgraph or profile): the interfaces are then checked on the
     * name's effective resolver, resolving the ENSv2 abstraction layer. Omit
     * it ONLY when the address is a literal candidate to validate as-is
     * (e.g. a user-typed resolver in the resolver editor).
     */
    name?: string

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
  name,
  resolverAddress,
}: UseResolverHasInterfacesParameters<TInterfaceNames>) => {
  const chainId = useChainId()

  const effectiveResolver = useEffectiveResolverAddress({
    name: name ?? '',
    resolverAddress,
    enabled: enabled_ && !!name,
  })
  const effectiveResolverAddress = effectiveResolver.data ?? resolverAddress

  const interfaceIds = useMemo(
    () =>
      interfaceNames.map((interfaceName) => RESOLVER_INTERFACE_IDS[interfaceName]) as TInterfaceIds,
    [interfaceNames],
  )

  const knownResolverData = useMemo(
    () => getKnownResolverData({ chainId, resolverAddress: effectiveResolverAddress }),
    [chainId, effectiveResolverAddress],
  )

  const enabled =
    enabled_ &&
    !effectiveResolver.isLoading &&
    !!effectiveResolverAddress &&
    interfaceNames.length > 0 &&
    !knownResolverData

  const {
    data: data_,
    isLoading,
    isFetching,
    status,
    isCachedData,
  } = useSupportedInterfaces<GetInterfaceIds<TInterfaceNames>>({
    address: effectiveResolverAddress,
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
    resolverAddress: effectiveResolverAddress,
    knownResolverData,
    isLoading: effectiveResolver.isLoading || isLoading,
    isFetching: effectiveResolver.isFetching || isFetching,
    status,
    isCachedData: effectiveResolver.isCachedData || isCachedData,
    errors: errors.length > 0 ? errors : undefined,
  }
}
