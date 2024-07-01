import { TOptions } from 'i18next'
import { ComponentProps, Dispatch, ReactNode } from 'react'
import { Hash } from 'viem'

import { Button, Dialog, Helper } from '@ensdomains/thorin'

import { Transaction } from '@app/hooks/transactions/transactionStore'
import { MinedData, TransactionDisplayItem } from '@app/types'

import type { DataInputComponent } from './input'
import type { IntroComponentName } from './intro'
import type { TransactionData, TransactionItem, TransactionName } from './transaction'

export type TransactionFlowStage = 'input' | 'intro' | 'transaction'

export type TransactionStage = 'confirm' | 'sent' | 'complete' | 'failed'

type GenericDataInput = {
  name: keyof DataInputComponent
  data: any
}

export type GenericTransaction<
  TName extends TransactionName = TransactionName,
  TData extends TransactionData<TName> = TransactionData<TName>,
> = {
  name: TName
  data: TData
  hash?: Hash
  sendTime?: number
  finaliseTime?: number
  stage?: TransactionStage
  minedData?: MinedData
}

type GenericIntro = {
  name: IntroComponentName
  data: any
}

type StoredTranslationReference = [key: string, options?: TOptions]

export type TransactionIntro = {
  title: StoredTranslationReference
  leadingLabel?: StoredTranslationReference
  trailingLabel?: StoredTranslationReference
  content: GenericIntro
}

export type TransactionFlowItem = {
  input?: GenericDataInput
  intro?: TransactionIntro
  transactions: readonly GenericTransaction[] | GenericTransaction[]
  resumable?: boolean
  requiresManualCleanup?: boolean
  autoClose?: boolean
  resumeLink?: string
  disableBackgroundClick?: boolean
}

export type BaseInternalTransactionFlowItem = TransactionFlowItem & {
  currentTransaction: number
  currentFlowStage: TransactionFlowStage
}

export type InternalTransactionFlowItem =
  | BaseInternalTransactionFlowItem
  | (BaseInternalTransactionFlowItem & {
      currentFlowStage: 'input'
      input: GenericDataInput
    })

export type InternalTransactionFlow = {
  selectedKey: string | null
  items: { [key: string]: InternalTransactionFlowItem }
}

export type TransactionFlowAction =
  | {
      name: 'showDataInput'
      payload: {
        input: GenericDataInput
        disableBackgroundClick?: boolean
      }
      key: string
    }
  | {
      name: 'startFlow'
      payload: TransactionFlowItem
      key: string
    }
  | {
      name: 'resumeFlow'
      key: string
    }
  | {
      name: 'resumeFlowWithCheck'
      key: string
      payload: {
        push: (path: string) => void
      }
    }
  | {
      name: 'setTransactions'
      payload: {
        [key in TransactionName]: {
          name: key
          data: TransactionData<key>
        }
      }[TransactionName][]
    }
  | {
      name: 'setFlowStage'
      payload: TransactionFlowStage
    }
  | {
      name: 'stopFlow'
    }
  | {
      name: 'setTransactionStage'
      payload: TransactionStage
    }
  | {
      name: 'setTransactionHash'
      payload: { hash: Hash; key: string }
    }
  | {
      name: 'setTransactionHashFromUpdate'
      payload: { hash: Hash; key: string }
    }
  | {
      name: 'incrementTransaction'
    }
  | {
      name: 'cleanupTransaction'
      payload: string
    }
  | {
      name: 'forceCleanupTransaction'
      payload: string
    }
  | {
      name: 'setTransactionStageFromUpdate'
      payload: Transaction
    }
  | {
      name: 'resetTransactionStep'
    }
  | {
      name: 'setFailedTransaction'
      payload: Transaction
    }

export type TransactionDialogProps = ComponentProps<typeof Dialog> & {
  variant: 'actionable'
  children: () => ReactNode
  leading: ComponentProps<typeof Button>
  trailing: ComponentProps<typeof Button>
}

export type TransactionDialogPassthrough = {
  dispatch: Dispatch<TransactionFlowAction>
  onDismiss: () => void
  transactions?: readonly TransactionItem[] | TransactionItem[]
}

export type ManagedDialogProps = {
  dispatch: Dispatch<TransactionFlowAction>
  onDismiss: () => void
  transaction: GenericTransaction
  actionName: string
  txKey: string | null
  currentStep: number
  stepCount: number
  displayItems: TransactionDisplayItem[]
  helper?: ComponentProps<typeof Helper>
  backToInput: boolean
}

export type GetUniqueTransactionParameters = Pick<ManagedDialogProps, 'txKey' | 'currentStep'> & {
  transaction: Pick<GenericTransaction, 'name' | 'data'>
}

export type UniqueTransaction<TName extends TransactionName = TransactionName> = {
  key: string
  step: number
  name: TName
  data: TransactionData<TName>
}
