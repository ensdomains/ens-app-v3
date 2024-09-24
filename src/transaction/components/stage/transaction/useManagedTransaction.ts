import { queryOptions, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useConnectorClient, useSendTransaction } from 'wagmi'

import { useInvalidateOnBlock } from '@app/hooks/chain/useInvalidateOnBlock'
import { useIsSafeApp } from '@app/hooks/useIsSafeApp'
import { useQueryOptions } from '@app/hooks/useQueryOptions'
import type { GenericStoredTransaction } from '@app/transaction/slices/createTransactionSlice'
import type { UserTransactionName } from '@app/transaction/user/transaction'
import type { ConfigWithEns } from '@app/types'
import { getIsCachedData } from '@app/utils/getIsCachedData'

import {
  createTransactionRequestQueryFn,
  getTransactionIdentifiersWithData,
  transactionMutateHandler,
  transactionSuccessHandler,
} from './query'

export const useManagedTransaction = <name extends UserTransactionName = UserTransactionName>(
  transaction: GenericStoredTransaction<name>,
) => {
  const { data: isSafeApp, isLoading: safeAppStatusLoading } = useIsSafeApp()
  const { data: connectorClient } = useConnectorClient<ConfigWithEns>()

  const transactionIdentifiers = useMemo(
    () => getTransactionIdentifiersWithData(transaction),
    [transaction],
  )

  // if not all unique identifiers are defined, there could be incorrect cached data
  const isUniquenessDefined = useMemo(
    // number check is for if step = 0
    () => Object.values(transactionIdentifiers).every((val) => typeof val === 'number' || !!val),
    [transactionIdentifiers],
  )

  const canEnableTransactionRequest = useMemo(
    () =>
      !!transaction &&
      !!connectorClient?.account &&
      !safeAppStatusLoading &&
      !(transaction.status === 'pending' || transaction.status === 'success') &&
      isUniquenessDefined,
    [transaction, connectorClient?.account, safeAppStatusLoading, isUniquenessDefined],
  )

  const initialOptions = useQueryOptions({
    params: transactionIdentifiers,
    functionName: 'createTransactionRequest',
    queryDependencyType: 'standard',
    queryFn: createTransactionRequestQueryFn,
  })

  const preparedOptions = queryOptions({
    queryKey: initialOptions.queryKey,
    queryFn: initialOptions.queryFn({ connectorClient, isSafeApp }),
  })

  const transactionRequestQuery = useQuery({
    ...preparedOptions,
    enabled: canEnableTransactionRequest,
    refetchOnMount: 'always',
  })

  const { data: request, isLoading: requestLoading, error: requestError } = transactionRequestQuery
  const isTransactionRequestCachedData = getIsCachedData(transactionRequestQuery)

  useInvalidateOnBlock({
    enabled: canEnableTransactionRequest && process.env.NEXT_PUBLIC_ETH_NODE !== 'anvil',
    queryKey: preparedOptions.queryKey,
  })

  const {
    isPending: transactionLoading,
    error: transactionError,
    sendTransaction,
  } = useSendTransaction({
    mutation: {
      onMutate: transactionMutateHandler({ transactionIdentifiers, isSafeApp: isSafeApp! }),
      onSuccess: transactionSuccessHandler(transactionIdentifiers),
    },
  })

  return {
    request,
    requestLoading,
    requestError,
    isTransactionRequestCachedData,
    canEnableTransactionRequest,
    transactionLoading,
    transactionError,
    sendTransaction,
  }
}
