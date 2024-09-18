import type { TOptions } from 'i18next'
import type { WritableDraft } from 'immer/dist/internal'
import type { ComponentProps } from 'react'
import type { Address, Hash, Hex } from 'viem'

import type { SupportedChain } from '@app/constants/chains'
import type { IntroComponentName } from '@app/transaction-flow/intro'

import type { DataInputComponent, DataInputName } from './user/input'
import type { TransactionData, TransactionName } from './user/transaction'

export type TransactionFlowStage = 'input' | 'intro' | 'transaction'
export type StoredTransactionStatus =
  | 'empty'
  | 'waitingForUser'
  | 'pending'
  | 'success'
  | 'reverted'
export type StoredTransactionType = 'standard' | 'safe'

export type TransactionStoreIdentifiers = {
  chainId: SupportedChain['id']
  account: Address
}
export type FlowId = string
export type FlowKey = `["${FlowId}",${SupportedChain['id']},"${Address}"]`
export type TransactionId = string
export type TransactionKey =
  `["${TransactionId}","${FlowKey}",${SupportedChain['id']},"${Address}"]`

export type GenericDataInput<
  name extends DataInputName = DataInputName,
  data extends ComponentProps<DataInputComponent[name]> = ComponentProps<DataInputComponent[name]>,
> = {
  name: name
  data: data
}

type GenericIntro<
  name extends IntroComponentName = IntroComponentName,
  // TODO(tate): add correct type for data
  data extends {} = {},
> = {
  name: name
  data: data
}

type StoredTranslationReference = [key: string, options?: TOptions]

export type TransactionIntro = {
  title: StoredTranslationReference
  leadingLabel?: StoredTranslationReference
  trailingLabel?: StoredTranslationReference
  content: GenericIntro
}

type EmptyStoredTransaction = {
  status: 'empty'
  currentHash: null
  transactionType: null
  transaction?: never
  receipt?: never
  search?: never
}

type WaitingForUserStoredTransaction = {
  status: 'waitingForUser'
  currentHash: null
  transactionType: StoredTransactionType
  transaction: {
    input: Hex
    timestamp: number
    nonce: number
  }
  receipt?: never
}

type PendingStoredTransaction = {
  status: 'pending'
  currentHash: Hash
  transactionType: StoredTransactionType
}

type SuccessStoredTransaction = {
  status: 'success'
  currentHash: Hash
  transactionType: StoredTransactionType
}

type RevertedStoredTransaction = {
  status: 'reverted'
  currentHash: Hash
  transactionType: StoredTransactionType
}

export type StoredTransactionIdentifiers = TransactionStoreIdentifiers & {
  flowId: FlowId
  transactionId: TransactionId
}

type TransactionSubmission = {
  input: Hex
  timestamp: number
  nonce: number
}

export type GenericStoredTransaction<
  name extends TransactionName = TransactionName,
  status extends StoredTransactionStatus = StoredTransactionStatus,
> = StoredTransactionIdentifiers & {
  name: name
  data: TransactionData<name>
  status: status
  currentHash: Hash | null
  transactionType: StoredTransactionType | null

  submission?:
    | {
        input: Hex
        timestamp: number
        nonce: number
      }
    | {
        timestamp: number
      }
  receipt?: {
    // TODO(tate): idk what we need from this yet
  }
  search?: {
    retries: number
    status: 'searching' | 'found'
  }
} & (
    | EmptyStoredTransaction
    | WaitingForUserStoredTransaction
    | PendingStoredTransaction
    | SuccessStoredTransaction
    | RevertedStoredTransaction
  )

export type StoredTransaction<
  status extends StoredTransactionStatus = StoredTransactionStatus,
  other = {},
> = {
  [action in TransactionName]: GenericStoredTransaction<action, status> & other
}[TransactionName]

export type StoredFlow = TransactionStoreIdentifiers & {
  flowId: FlowId
  transactionIds: string[]
  currentTransaction: number
  currentStage: TransactionFlowStage
  input?: GenericDataInput
  intro?: TransactionIntro
  resumable?: boolean
  requiresManualCleanup?: boolean
  autoClose?: boolean
  resumeLink?: string
  disableBackgroundClick?: boolean
}

export type LastTransactionChange = StoredTransaction<StoredTransactionStatus>

export type TransactionStoreData = {
  flows: {
    [flowKey: FlowKey]: StoredFlow | undefined
  }
  transactions: {
    [transactionKey: TransactionKey]: StoredTransaction | undefined
  }
  lastTransactionChange: LastTransactionChange | null
  current: {
    flowId: string | null
    chainId: SupportedChain['id'] | null
    account: Address | null
    _previousFlowId: string | null
  }
}

export type WritableTransactionStoreData = WritableDraft<TransactionStoreData>

export type TransactionList<status extends StoredTransactionStatus = StoredTransactionStatus> =
  StoredTransaction<status>[]

export type TransactionStoreFunctions = {
  flow: {
    helpers: {
      getAllTransactionsComplete: (flow: StoredFlow) => boolean
      getCanRemoveFlow: (flow: StoredFlow) => boolean
      getNoTransactionsStarted: (flow: StoredFlow) => boolean
    }
    showInput: (
      flowId: string,
      {
        input,
        disableBackgroundClick,
      }: { input: GenericDataInput; disableBackgroundClick?: boolean },
      identifiersOverride?: TransactionStoreIdentifiers,
    ) => void
    start: (
      flowId: string,
      flow: Omit<
        StoredFlow,
        'currentStage' | 'currentTransaction' | keyof TransactionStoreIdentifiers
      >,
      identifiersOverride?: TransactionStoreIdentifiers,
    ) => void
    resume: (flowId: string, identifiersOverride?: TransactionStoreIdentifiers) => void
    resumeWithCheck: (
      flowId: string,
      { push }: { push: (path: string) => void },
      identifiersOverride?: TransactionStoreIdentifiers,
    ) => void
    getResumable: (flowId: string, identifiersOverride?: TransactionStoreIdentifiers) => boolean
    cleanup: (flowId: string, identifiersOverride?: TransactionStoreIdentifiers) => void
    current: {
      setTransactions: (
        transactions: {
          [name in TransactionName]: {
            name: name
            data: TransactionData<name>
          }
        }[TransactionName][],
      ) => void
      setStage: ({ stage }: { stage: TransactionFlowStage }) => void
      stop: () => void
      selectedOrPrevious: () => { flow: StoredFlow | null; isPrevious: boolean }
      attemptDismiss: () => void
      incrementTransaction: () => void
      resetTransactionIndex: () => void
      getTransactions: () => TransactionList
    }
  }
  transaction: {
    setStatus: (identifiers: StoredTransactionIdentifiers, status: StoredTransactionStatus) => void
    setHash: (identifiers: StoredTransactionIdentifiers, hash: Hash) => void
    setSubmission: (
      identifiers: StoredTransactionIdentifiers,
      submission: TransactionSubmission & Pick<StoredTransaction, 'transactionType'>,
    ) => void
    getByStatus: <status extends StoredTransactionStatus>(status: status) => TransactionList<status>
    getAll: () => TransactionList
  }
}

export type TransactionStore = {
  _internal: TransactionStoreData
} & TransactionStoreFunctions
