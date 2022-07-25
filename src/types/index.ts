import type { ENS } from '@ensdomains/ensjs'
import type { PopulatedTransaction } from 'ethers'
import React, { ReactNode } from 'react'

import common from '@public/locales/en/common.json'
import { useEns } from '@app/utils/EnsProvider'
import { JsonRpcSigner } from '@ethersproject/providers'
import { NewTransaction } from '@rainbow-me/rainbowkit/dist/transactions/transactionStore'

export type Profile = NonNullable<Awaited<ReturnType<ENS['getProfile']>>>

export type Name = NonNullable<Awaited<ReturnType<ENS['getNames']>>>[0]

export type TransactionDisplayItem = {
  type?: 'name' | 'address'
  label: string
  value: string
  fade?: boolean
  shrink?: boolean
  useRawLabel?: boolean
}

export type TransactionSubmission = {
  transaction: PopulatedTransaction
  onDismiss?: (success?: boolean) => void
  onSuccess?: () => void
  dismissBtnLabel?: string
  completeBtnLabel?: string
  completeTitle?: string
  actionName: string
  displayItems: TransactionDisplayItem[]
}

export type TransactionPreStepObject = {
  title: string
  leadingLabel?: string
  trailingLabel?: string
  content: ReactNode
  steps: string[]
}

export type TransactionPreStepFunction = (resumeToStep: number) => TransactionPreStepObject

export type TxStateType = {
  data: TransactionSubmission[]
  preSteps?: TransactionPreStepFunction
}

export type StepStorageItem = {
  currentStep: number
  currentStepComplete: boolean
} & TxStateType

export interface TransactionState {
  isOpen: boolean
  steps: Array<TransactionStep | MiningStep | InfoStep>
  currentStep: number
  canAdvance: boolean
}

interface InfoItem {
  label: keyof typeof common.transaction.itemLabel
  value: string
}

type TransactionType = 'updateResolver'
type StepStatus = 'notStarted' | 'inProgress' | 'completed'

interface Step {
  type: 'transaction' | 'mining' | 'info'
  title: string
  description: string
  stepStatus: StepStatus
  content: React.FC<{ state: TransactionState; dispatch: DispatchFn }>
  error: string | null
  infoItems: InfoItem[]
  buttons: {
    leading: {
      type: string
      clickHandler: (arg: { dispatch: DispatchFn }) => () => void
    }
    trailing: {
      type: string
      clickHandler: (arg: {
        signer: JsonRpcSigner
        ens: ReturnType<typeof useEns>
        currentStep: Step
        addTransaction: (tx: NewTransaction) => void
        dispatch: DispatchFn
        estimatedGas: number | undefined
      }) => () => void
    } | null
  }
  transactionHash?: PopulatedTransaction
  transactionInfo?: any
}

export interface TransactionStep extends Step {
  type: 'transaction'
  transactionType: TransactionType
  gasEstimator: (arg: {
    currentStep: object
    signer: JsonRpcSigner
    ens: ReturnType<typeof useEns>
  }) => number
}

export interface MiningStep extends Step {
  type: 'mining'
}

export interface InfoStep extends Step {
  type: 'info'
}

export type FlowStep = TransactionStep | MiningStep | InfoStep

export enum TransactionActionTypes {
  openModal,
  setSteps,
  setCurrentStep,
  increaseStep,
  decreaseStep,
  setCanAdvance,
  setUpdateResolverTransactionInfo,
  setUpdateResolverCompletionInfo,
  setStepStatus,
  cancelFlow,
  updateStepTitle,
  updateStep,
  setStepError,
  updateState,
}

export type Action =
  | { type: TransactionActionTypes.openModal }
  | { type: TransactionActionTypes.setSteps; payload: Array<Partial<FlowStep>> }
  | { type: TransactionActionTypes.setCurrentStep; payload: number }
  | { type: TransactionActionTypes.increaseStep }
  | { type: TransactionActionTypes.decreaseStep }
  | { type: TransactionActionTypes.setCanAdvance; payload: boolean }
  | {
      type: TransactionActionTypes.setUpdateResolverTransactionInfo
      payload: { currentResolver: string; newResolver: string; name: string }
    }
  | {
      type: TransactionActionTypes.setUpdateResolverCompletionInfo
      payload: PopulatedTransaction
    }
  | {
      type: TransactionActionTypes.setStepStatus
      payload: StepStatus
    }
  | {
      type: TransactionActionTypes.cancelFlow
    }
  | {
      type: TransactionActionTypes.updateStepTitle
      payload: string
    }
  | {
      type: TransactionActionTypes.updateStep
      payload: Omit<Partial<Step>, 'type'>
    }
  | {
      type: TransactionActionTypes.setStepError
      payload: string
    }
  | {
      type: TransactionActionTypes.updateState
      payload: any
    }

export interface DispatchFn {
  (action: Action): void
}
