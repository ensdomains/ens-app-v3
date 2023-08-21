import type { TransactionReceipt } from '@ethersproject/providers'
import { ComponentProps } from 'react'
import type { TFunction } from 'react-i18next'
import {
  Account,
  Address,
  Hex,
  PublicClient,
  Transport,
  WalletClient
} from 'viem'

import { ChainWithEns } from '@ensdomains/ensjs/dist/types/contracts/consts'
import { GetRecordsReturnType } from '@ensdomains/ensjs/public'
import { DecodedContentHash } from '@ensdomains/ensjs/utils/contentHash'
import { Helper, Space } from '@ensdomains/thorin'

export type Profile = GetRecordsReturnType<{ name: string; records: { abi: true; contentHash: true; coins: string[]; texts: string[]; } }>

export type ProfileRecords = GetRecordsReturnType<{ name: string; records: { abi: true; contentHash: true; coins: string[]; texts: string[]; } }>

export type TextRecord = NonNullable<ProfileRecords['texts']>[number]

export type AddressRecord = NonNullable<ProfileRecords['coins']>[number]

export type ContentHash = string | DecodedContentHash | undefined | null

export type Name = NonNullable<Awaited<ReturnType<ENS['getNames']>>>[0]

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

type PublicInterface<Type> = { [Key in keyof Type]: Type[Key] }

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

export type PublicENS = PublicInterface<ENS>

export type HelperProps = ComponentProps<typeof Helper>
export type ReturnedENS = { [key in keyof PublicENS]: Awaited<ReturnType<PublicENS[key]>> }

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

export type AllChildFuses = Required<ChildFuses['options']>

export type EthAddress = string

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
