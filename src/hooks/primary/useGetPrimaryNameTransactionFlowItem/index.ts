import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useResolverStatus } from '@app/hooks/resolver/useResolverStatus'
import { useReverseRegistryName } from '@app/hooks/reverseRecord/useReverseRegistryName'
import { useContractAddress } from '@app/hooks/useContractAddress'
import { makeIntroItem } from '@app/transaction-flow/intro/index'
import { makeTransactionItem } from '@app/transaction-flow/transaction'
import { GenericTransaction, TransactionFlowItem } from '@app/transaction-flow/types'
import { emptyAddress } from '@app/utils/constants'

import {
  IntroType,
  checkRequiresSetPrimaryNameTransaction,
  checkRequiresUpdateEthAddressTransaction,
  checkRequiresUpdateResolverTransaction,
  getIntroTranslation,
} from './utils'

type Inputs = {
  address?: string
  isWrapped?: boolean
  reverseRegistryName?: string
  profileAddress?: string
  resolverAddress?: string
  resolverStatus?: ReturnType<typeof useResolverStatus>['data']
}

type Options = {
  enabled?: boolean
}

export const useGetPrimaryNameTransactionFlowItem = (
  { address, isWrapped, profileAddress, resolverAddress, resolverStatus }: Inputs,
  options: Options = {},
) => {
  const { t } = useTranslation('transactionFlow')

  const _enabled = (options.enabled ?? true) && !!address

  const reverseRegistryName = useReverseRegistryName({ enabled: _enabled })
  const latestResolverAddress = useContractAddress('PublicResolver')

  const { isLoading, isFetching } = reverseRegistryName

  const isActive = _enabled && !isLoading && !isFetching

  const callBack = useMemo(() => {
    if (!isActive) return undefined
    return (name: string) => {
      let introType: IntroType = 'updateEthAddress'
      const transactions: GenericTransaction[] = []

      if (
        checkRequiresSetPrimaryNameTransaction({
          reverseRegistryName: reverseRegistryName.data,
          name,
        })
      ) {
        transactions.push(makeTransactionItem('setPrimaryName', { name, address }))
      }

      if (
        checkRequiresUpdateResolverTransaction({
          resolvedAddress: profileAddress,
          address,
          isResolverAuthorized: resolverStatus?.isAuthorized,
        })
      ) {
        introType =
          !resolverAddress || resolverAddress === emptyAddress ? 'noResolver' : 'invalidResolver'
        transactions.unshift(
          makeTransactionItem('updateResolver', {
            name,
            contract: isWrapped ? 'nameWrapper' : 'registry',
            resolver: latestResolverAddress,
          }),
        )
      }

      if (
        checkRequiresUpdateEthAddressTransaction({
          resolvedAddress: profileAddress,
          address,
          isResolverAuthorized: resolverStatus?.isAuthorized,
          isLatestResolverEthAddressSetToAddress: resolverStatus?.hasMigratedRecord,
        })
      ) {
        transactions.unshift(
          makeTransactionItem('updateEthAddress', {
            name,
            address,
            latestResolver: !resolverStatus?.isAuthorized,
          }),
        )
      }

      const introItem =
        transactions.length > 1
          ? {
              resumeable: true,
              intro: {
                title: [getIntroTranslation(introType, 'title'), { ns: 'transactionFlow' }],
                content: makeIntroItem('GenericWithDescription', {
                  description: t(getIntroTranslation(introType, 'description')),
                }),
              },
            }
          : {}

      if (transactions.length === 0) return null
      return {
        transactions,
        ...introItem,
      } as TransactionFlowItem
    }
  }, [
    isActive,
    isWrapped,
    latestResolverAddress,
    address,
    profileAddress,
    reverseRegistryName.data,
    resolverAddress,
    resolverStatus?.hasMigratedRecord,
    resolverStatus?.isAuthorized,
    t,
  ])

  return {
    callBack,
    isLoading,
    isFetching,
  }
}
