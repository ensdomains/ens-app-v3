import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { Address } from 'viem'

import { useContractAddress } from '@app/hooks/chain/useContractAddress'
import type { useResolverStatus } from '@app/hooks/resolver/useResolverStatus'
import { useReverseRegistryName } from '@app/hooks/reverseRecord/useReverseRegistryName'
import { makeIntroItem } from '@app/transaction-flow/intro/index'
import { createTransactionItem, TransactionItem } from '@app/transaction-flow/transaction'
import { TransactionIntro } from '@app/transaction-flow/types'
import { emptyAddress } from '@app/utils/constants'

import {
  checkRequiresSetPrimaryNameTransaction,
  checkRequiresUpdateEthAddressTransaction,
  checkRequiresUpdateResolverTransaction,
  getIntroTranslation,
  IntroType,
} from './utils'

type Inputs = {
  address?: Address
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

  const reverseRegistryName = useReverseRegistryName({ address: address!, enabled: _enabled })
  const latestResolverAddress = useContractAddress({ contract: 'ensPublicResolver' })

  const { isLoading, isFetching } = reverseRegistryName

  const isActive = _enabled && !isLoading && !isFetching

  const callBack = useMemo(() => {
    if (!isActive) return undefined
    return (name: string) => {
      let introType: IntroType = 'updateEthAddress'
      const transactions: (
        | TransactionItem<'setPrimaryName'>
        | TransactionItem<'updateResolver'>
        | TransactionItem<'updateEthAddress'>
      )[] = []

      if (
        checkRequiresSetPrimaryNameTransaction({
          reverseRegistryName: reverseRegistryName.data || '',
          name,
        })
      ) {
        transactions.push(createTransactionItem('setPrimaryName', { name, address }))
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
          createTransactionItem('updateResolver', {
            name,
            contract: isWrapped ? 'nameWrapper' : 'registry',
            resolverAddress: latestResolverAddress,
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
          createTransactionItem('updateEthAddress', {
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
              } as TransactionIntro,
            }
          : {}

      if (transactions.length === 0) return null
      return {
        transactions,
        ...introItem,
      }
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
