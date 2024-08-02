import { QueryFunctionContext } from '@tanstack/react-query'

import { CoinName, coinNameToTypeMap } from '@ensdomains/address-encoder'
import { isEvmCoinType } from '@ensdomains/address-encoder/utils'

import { SupportedAddress, supportedAddresses } from '@app/constants/supportedAddresses'
import { useQueryOptions } from '@app/hooks/useQueryOptions'
import { CreateQueryKey, QueryConfig } from '@app/types'
import { getIsCachedData } from '@app/utils/getIsCachedData'
import { prepareQueryOptions } from '@app/utils/prepareQueryOptions'
import { useQuery } from '@app/utils/query/useQuery'

type UseCoinChainParameters = {
  coinName?: string
}

type CoinBlockExplorer = {
  id: number
  name: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
  blockExplorers: {
    default: {
      name: string
      url: string
      apiUrl?: string
    }
  }
}

type UseCoinChainReturnType = CoinBlockExplorer | null

type UseCoinChainConfig = QueryConfig<UseCoinChainReturnType, Error>

type QueryKey<TParams extends UseCoinChainParameters> = CreateQueryKey<
  TParams,
  'getCoinChain',
  'independent'
>

const isSupportedCoinName = (coinName: string): coinName is SupportedAddress =>
  supportedAddresses.includes(coinName as SupportedAddress)

const isEvmCoinName = (coinName: string): boolean => {
  const coinType = coinNameToTypeMap[coinName as CoinName]
  return !!coinType && isEvmCoinType(coinType)
}

export const getCoinChainQueryFn = async <TParams extends UseCoinChainParameters>({
  queryKey: [{ coinName }],
}: QueryFunctionContext<QueryKey<TParams>>): Promise<UseCoinChainReturnType> => {
  if (!coinName) throw new Error('name is required')

  if (isSupportedCoinName(coinName)) {
    const supportedBlockExplorers = (await import(
      '../../constants/blockExplorers/supported.json'
    ).then((m) => m.default)) as { [key in SupportedAddress]: CoinBlockExplorer }
    return supportedBlockExplorers[coinName] || null
  }

  if (isEvmCoinName(coinName)) {
    const evmBlockExplorers = await import('../../constants/blockExplorers/evm.json').then(
      (m) => m.default as { [key: string]: CoinBlockExplorer },
    )
    return evmBlockExplorers[coinName] || null
  }

  const otherBlockExplorers = await import('../../constants/blockExplorers/other.json').then(
    (m) => m.default as { [key: string]: CoinBlockExplorer },
  )
  return otherBlockExplorers[coinName] || null
}

export const useCoinChain = <TParams extends UseCoinChainParameters>({
  enabled = true,
  gcTime,
  staleTime,
  scopeKey,
  ...params
}: TParams & UseCoinChainConfig) => {
  const initialOptions = useQueryOptions({
    params,
    scopeKey,
    functionName: 'getCoinChain',
    queryDependencyType: 'independent',
    queryFn: getCoinChainQueryFn,
  })

  const preparedOptions = prepareQueryOptions({
    queryKey: initialOptions.queryKey,
    queryFn: initialOptions.queryFn,
    enabled: enabled && !!params.coinName,
    gcTime,
    staleTime,
  })

  const query = useQuery(preparedOptions)

  return {
    ...query,
    refetchIfEnabled: preparedOptions.enabled ? query.refetch : () => {},
    isCachedData: getIsCachedData(query),
  }
}
