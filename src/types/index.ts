import type { ENS } from '@ensdomains/ensjs'
import type { PopulatedTransaction } from 'ethers'
import { ReactNode } from 'react'

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

export type TransactionPreStepFunction = (
  resumeToStep: number,
) => TransactionPreStepObject

export type TxStateType = {
  data: TransactionSubmission[]
  preSteps?: TransactionPreStepFunction
}

export type StepStorageItem = {
  currentStep: number
  currentStepComplete: boolean
} & TxStateType

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
