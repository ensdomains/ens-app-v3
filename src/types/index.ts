import { ComponentProps } from 'react'
import type { TFunction } from 'react-i18next'
import type {
  Account,
  Address,
  Hex,
  PublicClient,
  TransactionReceipt,
  Transport,
  WalletClient
} from 'viem'

import { ChainWithEns } from '@ensdomains/ensjs/dist/types/contracts/consts'
import { GetRecordsReturnType } from '@ensdomains/ensjs/public'
import { Helper, Space } from '@ensdomains/thorin'
import { UseQueryOptions } from '@tanstack/react-query'

export type Profile = Partial<GetRecordsReturnType<{ name: string; records: { abi: true; contentHash: true; coins: string[]; texts: string[]; } }>>

export type TextRecord = NonNullable<Profile['texts']>[number]

export type AddressRecord = NonNullable<Profile['coins']>[number]

export type RecordItem = TextRecord | AddressRecord

interface TransactionDisplayItemBase {
  label: string
  fade?: boolean
  shrink?: boolean
  useRawLabel?: boolean
}

export interface TransactionDisplayItemSingle extends TransactionDisplayItemBase {
  type?: 'name' | 'subname' | 'address' | undefined
  value: string
}

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

export type TransactionDisplayItemTypes = 'name' | 'address' | 'list' | 'records'

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
  publicClient: PublicClientWithChain
  walletClient: WalletClientWithAccount
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

export type OwnerArray = {
  address: string
  label: string
  description: string
  canTransfer: boolean
  transferType?: 'manager' | 'owner'
  testId: string
}[]

export type MinedData = TransactionReceipt & {
  timestamp: number
}

export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

export type PublicClientWithChain = PublicClient<Transport, ChainWithEns>
export type WalletClientWithAccount = WalletClient<Transport, ChainWithEns, Account>

export type QueryConfig<TData, TError, TSelectData = TData> = Pick<
  UseQueryOptions<TData, TError, TSelectData>,
  | 'cacheTime'
  | 'enabled'
  | 'isDataEqual'
  | 'staleTime'
  | 'structuralSharing'
  | 'suspense'
  | 'onError'
  | 'onSettled'
  | 'onSuccess'
> & {
  /** Scope the cache to a given context. */
  scopeKey?: string
}