import { QueryObserverResult } from '@tanstack/react-query'
import { GetWalletClientArgs } from '@wagmi/core'
import { useWalletClient as useWalletClient_ } from 'wagmi'

import { QueryConfig, WalletClientWithAccount } from '@app/types'

type UseWalletClientConfig<TWalletClient extends WalletClientWithAccount> = Omit<
  QueryConfig<TWalletClient, Error>,
  'cacheTime' | 'staleTime' | 'enabled'
> &
  GetWalletClientArgs

type UseQueryResult<TData, TError> = Pick<
  QueryObserverResult<TData, TError>,
  | 'data'
  | 'error'
  | 'fetchStatus'
  | 'isError'
  | 'isFetched'
  | 'isFetchedAfterMount'
  | 'isFetching'
  | 'isLoading'
  | 'isRefetching'
  | 'isSuccess'
  | 'refetch'
> & {
  isIdle: boolean
  status: 'idle' | 'loading' | 'success' | 'error'
  internal: Pick<
    QueryObserverResult,
    | 'dataUpdatedAt'
    | 'errorUpdatedAt'
    | 'failureCount'
    | 'isLoadingError'
    | 'isPaused'
    | 'isPlaceholderData'
    | 'isPreviousData'
    | 'isRefetchError'
    | 'isStale'
    | 'remove'
  >
}

export const useWalletClientWithAccount = useWalletClient_ as <
  TWalletClient extends WalletClientWithAccount,
>({
  chainId,
  onError,
  onSettled,
  onSuccess,
}?: UseWalletClientConfig<TWalletClient>) => UseQueryResult<TWalletClient, Error>
