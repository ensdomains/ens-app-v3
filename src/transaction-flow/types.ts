import { Button, Dialog } from '@ensdomains/thorin'
import { ComponentProps, Dispatch, ReactNode } from 'react'
import { DataInputComponent } from './input'
import { makeTransactionItem } from './transaction'

export type TransactionFlowStage = 'input' | 'intro' | 'transaction'

export type TransactionStage = 'confirm' | 'wallet' | 'sent'

type GenericDataInput = {
  name: keyof DataInputComponent
  data: any
}

export type TransactionFlow = {
  key: string
  input?: GenericDataInput
  intro?: any
  transactions: ReturnType<typeof makeTransactionItem>[]
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

export type TransactionDialogAction =
  | {
      name: 'setLeadingProps'
      payload: TransactionDialogProps['leading']
    }
  | {
      name: 'setTrailingProps'
      payload: TransactionDialogProps['trailing']
    }
  | {
      name: 'setOpen'
      payload: boolean
    }
  | {
      name: 'setChildren'
      payload: any
    }
  | {
      name: 'addLeadingProps'
      payload: Partial<TransactionDialogProps['leading']>
    }
  | {
      name: 'addTrailingProps'
      payload: Partial<TransactionDialogProps['trailing']>
    }
  | {
      name: 'setupInputStage'
      payload: {
        children: () => ReactNode
        trailing: () => void
      }
    }

export type TransactionDialogProps = ComponentProps<typeof Dialog> & {
  variant: 'actionable'
  children: () => ReactNode
  leading: ComponentProps<typeof Button>
  trailing: ComponentProps<typeof Button>
}

export type TransactionDialogPassthrough = {
  dispatch: Dispatch<TransactionFlowAction>
  dispatchDialog: Dispatch<TransactionDialogAction>
}
