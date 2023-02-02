import type { PopulatedTransaction } from '@ethersproject/contracts'
import type { JsonRpcSigner } from '@ethersproject/providers'
import { ComponentProps } from 'react'
import type { TFunction } from 'react-i18next'

import type { ChildFuses, ENS } from '@ensdomains/ensjs'
import { Helper, Space } from '@ensdomains/thorin'

export type Profile = NonNullable<Awaited<ReturnType<ENS['getProfile']>>>

export type ProfileRecords = NonNullable<Profile['records']>

export type RecordItem = NonNullable<ProfileRecords['texts']>[number]

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

export interface Transaction<Data> {
  displayItems: (data: any, t: TFunction<'translation', undefined>) => TransactionDisplayItem[]
  transaction: (signer: JsonRpcSigner, ens: PublicENS, data: Data) => Promise<PopulatedTransaction>
  helper?: (data: any, t: TFunction<'translation', undefined>) => undefined | HelperProps
  backToInput?: boolean
}

export type AllChildFuses = Required<ChildFuses['options']>

export type EthAddress = string

export type CurrencyUnit = 'eth' | 'fiat'
export type FiatUnit = 'usd'
export type CurrencyDisplay = 'eth' | FiatUnit

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
