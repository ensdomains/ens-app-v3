import { UseInfiniteQueryOptions, UseQueryOptions } from '@tanstack/react-query'
import { ComponentProps } from 'react'
import type { TFunction } from 'react-i18next'
import type { Account, Address, Client, Hex, TransactionReceipt, Transport } from 'viem'

import { GetRecordsReturnType } from '@ensdomains/ensjs/public'
import { GetSubgraphRecordsReturnType } from '@ensdomains/ensjs/subgraph'
import {
  ChildFuseReferenceType,
  ChildFuses,
  ParentFuseReferenceType,
  ParentFuses,
} from '@ensdomains/ensjs/utils'
import { Helper, Space } from '@ensdomains/thorin'

import { SupportedChain } from '@app/constants/chains'
import type { wagmiConfig } from '@app/utils/query/wagmi'

export type Profile = Partial<
  GetRecordsReturnType &
    Pick<NonNullable<GetSubgraphRecordsReturnType>, 'isMigrated' | 'createdAt'> & {
      address: Address | undefined
    }
>

export type TextRecord = NonNullable<Profile['texts']>[number]

export type AddressRecord = NonNullable<Profile['coins']>[number]

export type RecordItem = TextRecord | AddressRecord

interface TransactionDisplayItemBase {
  label: string
  fade?: boolean
  shrink?: boolean
  useRawLabel?: boolean
}

export type TransactionDisplayItemSingle =
  | (TransactionDisplayItemBase & {
      type?: 'name' | 'subname' | 'address' | undefined
      value: string
    })
  | (TransactionDisplayItemBase & {
      type: 'duration'
      value: {
        duration: string
        newExpiry?: string
      }
    })

export interface TransactionDisplayItemList extends TransactionDisplayItemBase {
  type: 'list'
  value: string[]
}

export interface TransactionDisplayItemRecords extends TransactionDisplayItemBase {
  type: 'records'
  value: [string, string | undefined][]
}

export type TransactionDisplayItem =
  | TransactionDisplayItemSingle
  | TransactionDisplayItemList
  | TransactionDisplayItemRecords

export type TransactionDisplayItemTypes = 'name' | 'address' | 'list' | 'records' | 'duration'

export type AvatarEditorType = {
  avatar?: string
}

export type ProfileEditorType = {
  _avatar?: File
  avatar?: string
  banner?: string
  website?: string
  general: {
    [key: string]: string
  }
  accounts: {
    [key: string]: string
  }
  address: {
    [key: string]: string
  }
  other: {
    [key: string]: string
  }
} & AvatarEditorType

export type HelperProps = ComponentProps<typeof Helper>

export type BasicTransactionRequest = {
  to: Address
  data: Hex
  value?: bigint
}

export type TransactionFunctionParameters<TData> = {
  client: ClientWithEns
  connectorClient: ConnectorClientWithEns
  data: TData
}

export interface Transaction<TData> {
  displayItems: (data: TData, t: TFunction<'translation', undefined>) => TransactionDisplayItem[]
  transaction: (
    params: TransactionFunctionParameters<TData>,
  ) => Promise<BasicTransactionRequest> | BasicTransactionRequest
  helper?: (data: TData, t: TFunction<'translation', undefined>) => undefined | HelperProps
  backToInput?: boolean
}

export type ExtractTransactionData<TTransaction> = TTransaction extends Transaction<infer TData>
  ? TData
  : never

export type UserTheme = 'light' | 'dark'
// fiat is placeholder for now, not actually implemented
export type UserFiat = 'usd' | 'eur' | 'gbp' | 'aud'
export type UserCurrency = 'eth' | 'fiat'
export type CurrencyDisplay = UserFiat | 'eth'

export type UserConfig = {
  theme: UserTheme
  fiat: UserFiat
  currency: UserCurrency
}

export type QuerySpace =
  | Space
  | {
      min: Space
      xs?: Space
      sm?: Space
      md?: Space
      lg?: Space
    }

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>
    }
  : T

export type OwnerItem = {
  address: Address
  label: string
  description: string
  canTransfer: boolean
  transferType?: 'manager' | 'owner'
  testId: string
}

export type OwnerArray = OwnerItem[]

export type MinedData = TransactionReceipt & {
  timestamp: number
}

export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

export type ConnectorClientWithEns = Client<Transport, SupportedChain, Account>
export type ConfigWithEns = typeof wagmiConfig
export type ClientWithEns = ReturnType<ConfigWithEns['getClient']>

export type QueryConfig<TData, TError, TSelectData = TData> = Pick<
  UseQueryOptions<TData, TError, TSelectData>,
  'gcTime' | 'enabled' | 'staleTime'
> & {
  /** Scope the cache to a given context. */
  scopeKey?: string
}
export type InfiniteQueryConfig<TData, TError, TSelectData = TData> = Pick<
  UseInfiniteQueryOptions<TData, TError, TSelectData>,
  'gcTime' | 'enabled' | 'staleTime'
> & {
  /** Scope the cache to a given context. */
  scopeKey?: string
}
export type BaseQueryKeyParameters = { chainId: number; address: Address | undefined }
export type QueryDependencyType = 'standard' | 'graph' | 'independent'
export type CreateQueryKey<
  TParams extends {},
  TFunctionName extends string,
  TQueryDependencyType extends QueryDependencyType,
> = TQueryDependencyType extends 'graph'
  ? readonly [
      params: TParams,
      chainId: SupportedChain['id'],
      address: Address | undefined,
      scopeKey: string | undefined,
      functionName: TFunctionName,
      graphKey: 'graph',
    ]
  : readonly [
      params: TParams,
      chainId: TQueryDependencyType extends 'independent' ? undefined : SupportedChain['id'],
      address: TQueryDependencyType extends 'independent' ? undefined : Address | undefined,
      scopeKey: string | undefined,
      functionName: TFunctionName,
    ]
export type GenericQueryKey<
  TQueryDependencyType extends QueryDependencyType = QueryDependencyType,
> = CreateQueryKey<object, string, TQueryDependencyType>

/**
 * Makes {@link TKeys} optional in {@link TType} while preserving type inference.
 */
// s/o trpc (https://github.com/trpc/trpc/blob/main/packages/server/src/types.ts#L6)
export type PartialBy<TType, TKeys extends keyof TType> = Partial<Pick<TType, TKeys>> &
  Omit<TType, TKeys>

export type AnyFuseKey = ParentFuseReferenceType['Key'] | ChildFuseReferenceType['Key']
export type CurrentChildFuses = { -readonly [k in keyof ChildFuses]: boolean }
export type CurrentParentFuses = { -readonly [k in keyof ParentFuses]: boolean }
export type CurrentAnyFuses = CurrentChildFuses & CurrentParentFuses
