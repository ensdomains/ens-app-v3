import type { TransactionFlowAction } from '@app/transaction-flow/types'
import type { ENS } from '@ensdomains/ensjs'
import type { JsonRpcSigner } from '@ethersproject/providers'
import { PopulatedTransaction } from 'ethers'
import { Dispatch } from 'react'

export type Profile = NonNullable<Awaited<ReturnType<ENS['getProfile']>>>

export type Name = NonNullable<Awaited<ReturnType<ENS['getNames']>>>[0]

interface TransactionDisplayItemBase {
  label: string
  fade?: boolean
  shrink?: boolean
  useRawLabel?: boolean
}

export interface TransactionDisplayItemSingle extends TransactionDisplayItemBase {
  type?: 'name' | 'address'
  value: string
}

export interface TransactionDisplayItemList extends TransactionDisplayItemBase {
  type?: 'list'
  value: string[]
}

export type TransactionDisplayItem<T> = T extends 'name' | 'address'
  ? TransactionDisplayItemSingle
  : TransactionDisplayItemList

export type TransactionDisplayItemTypes = 'name' | 'address' | 'list'

type PublicInterface<T> = { [K in keyof T]: T[K] }

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
}
export type PublicENS = PublicInterface<ENS>

export interface Transaction<Data> {
  displayItems: (data: any) => TransactionDisplayItem<TransactionDisplayItemTypes>[]
  transaction: (signer: JsonRpcSigner, ens: PublicENS, data: Data) => Promise<PopulatedTransaction>
  onDismiss?: (dispatch: Dispatch<TransactionFlowAction>) => () => void
  dismissBtnLabel?: string
}
