import type { ENS } from '@ensdomains/ensjs'
import type { ContractTransaction } from 'ethers'

export type Profile = NonNullable<Awaited<ReturnType<ENS['getProfile']>>>

export type Name = NonNullable<Awaited<ReturnType<ENS['getNames']>>>[0]

export type TransactionDisplayItem = {
  type?: 'name' | 'address'
  label: string
  value: string
}

export type TransactionSubmission = {
  generateTx: () => Promise<ContractTransaction | undefined>
  onDismiss?: (success?: boolean) => void
  onSuccess?: () => void
  dismissBtnLabel?: string
  completeBtnLabel?: string
  completeTitle?: string
  actionName: string
  displayItems: TransactionDisplayItem[]
}
