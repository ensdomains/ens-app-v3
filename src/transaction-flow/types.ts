import { TransactionDisplayItem } from '@app/types'
import { ENS } from '@ensdomains/ensjs'
import { Button, Dialog } from '@ensdomains/thorin'
import { ComponentProps, Dispatch, ReactNode } from 'react'
import { DataInputComponent } from './input'
import { makeTransactionItem, TransactionName } from './transaction'

export type PublicENS = Pick<ENS, keyof ENS>

export type TransactionFlowStage = 'input' | 'intro' | 'transaction'

export type TransactionStage = 'confirm' | 'wallet' | 'sent'

type GenericDataInput = {
  name: keyof DataInputComponent
  data: any
}

type GenericTransaction = {
  name: TransactionName
  data: any
}

export type TransactionIntro = {
  title: string
  leadingLabel?: string
  trailingLabel?: string
  content: ReactNode
}

export type TransactionFlow = {
  key: string
  input?: GenericDataInput
  intro?: TransactionIntro
  transactions: GenericTransaction[]
  resumable?: boolean
}

export type BaseInternalTransactionFlow = TransactionFlow & {
  currentTransaction: number
  currentFlowStage: TransactionFlowStage
}

export type InternalTransactionFlow =
  | BaseInternalTransactionFlow
  | (BaseInternalTransactionFlow & {
      currentFlowStage: 'input'
      input: GenericDataInput
    })
  | {
      key: null
    }

export type TransactionFlowAction =
  | {
      name: 'showDataInput'
      payload: {
        input: GenericDataInput
        key: string
      }
    }
  | {
      name: 'startFlow'
      payload: TransactionFlow
    }
  | {
      name: 'resumeFlow'
      payload: string
    }
  | {
      name: 'setTransactions'
      payload: ReturnType<typeof makeTransactionItem>[]
    }
  | {
      name: 'setFlowStage'
      payload: TransactionFlowStage
    }
  | {
      name: 'stopFlow'
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
}

export type ManagedDialogProps = {
  transaction: GenericTransaction
  onDismiss?: (success?: boolean) => void
  onSuccess?: () => void
  dismissBtnLabel?: string
  completeBtnLabel?: string
  completeTitle?: string
  actionName: string
  displayItems: TransactionDisplayItem[]
}

export type TransactionIntroFunction = (resumeToStep: number) => TransactionIntro
