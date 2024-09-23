// import type { TOptions } from 'i18next'
// import type { WritableDraft } from 'immer/dist/internal'
// import type { ComponentProps } from 'react'
// import type { Address, Hash, Hex } from 'viem'

import type { Address } from 'viem'

import type { SourceChain } from '@app/constants/chains'

// import type { SourceChain, TargetChain } from '@app/constants/chains'
// import type { IntroComponentName } from '@app/transaction-flow/intro'

// import type { DataInputComponent, DataInputName } from './user/input'
// import type { IntroComponent } from './user/intro'
// import type { TransactionData, TransactionItemUnion, TransactionName } from './user/transaction'

// export type TransactionFlowStage = 'input' | 'intro' | 'transaction'
// export type StoredTransactionStatus =
//   | 'empty'
//   | 'waitingForUser'
//   | 'pending'
//   | 'success'
//   | 'reverted'
// export type StoredTransactionType = 'standard' | 'safe'

export type TransactionStoreIdentifiers = {
  sourceChainId: SourceChain['id']
  account: Address
}
// export type FlowId = string
// export type FlowKey = `["${FlowId}",${SourceChain['id']},"${Address}"]`
// type TransactionIndex = number
// export type TransactionId = `${TransactionName}-${TransactionIndex}`
// export type TransactionKey = `["${TransactionId}","${FlowId}",${SourceChain['id']},"${Address}"]`

// export type GenericDataInput<
//   name extends DataInputName = DataInputName,
//   data extends ComponentProps<DataInputComponent[name]> = ComponentProps<DataInputComponent[name]>,
// > = {
//   name: name
//   data: data
// }
// export type DataInput = {
//   [name in DataInputName]: GenericDataInput<name>
// }[DataInputName]

// type GenericDataIntro<
//   name extends IntroComponentName = IntroComponentName,
//   data extends ComponentProps<IntroComponent[name]> = ComponentProps<IntroComponent[name]>,
// > = {
//   name: name
//   data: data
// }

// export type DataIntro = {
//   [name in IntroComponentName]: GenericDataIntro<name>
// }[IntroComponentName]

// type StoredTranslationReference = [key: string, options?: TOptions]

// export type TransactionIntro = {
//   title: StoredTranslationReference
//   leadingLabel?: StoredTranslationReference
//   trailingLabel?: StoredTranslationReference
//   content: DataIntro
// }

// type EmptyStoredTransaction = {
//   status: 'empty'
//   currentHash: null
//   transactionType: null
//   transaction?: never
//   receipt?: never
//   search?: never
// }

// type WaitingForUserStoredTransaction = {
//   status: 'waitingForUser'
//   currentHash: null
//   transactionType: StoredTransactionType
//   transaction: {
//     input: Hex
//     timestamp: number
//     nonce: number
//   }
//   receipt?: never
// }

// type PendingStoredTransaction = {
//   status: 'pending'
//   currentHash: Hash
//   transactionType: StoredTransactionType
// }

// type SuccessStoredTransaction = {
//   status: 'success'
//   currentHash: Hash
//   transactionType: StoredTransactionType
// }

// type RevertedStoredTransaction = {
//   status: 'reverted'
//   currentHash: Hash
//   transactionType: StoredTransactionType
// }

// export type StoredTransactionIdentifiers = TransactionStoreIdentifiers & {
//   targetChainId: TargetChain['id']
//   flowId: FlowId
//   transactionId: TransactionId
// }

// type TransactionSubmission = {
//   input: Hex
//   timestamp: number
//   nonce: number
// }

// export type GenericStoredTransaction<
//   name extends TransactionName = TransactionName,
//   status extends StoredTransactionStatus = StoredTransactionStatus,
// > = StoredTransactionIdentifiers & {
//   name: name
//   data: TransactionData<name>
//   status: status
//   currentHash: Hash | null
//   transactionType: StoredTransactionType | null

//   submission?:
//     | {
//         input: Hex
//         timestamp: number
//         nonce: number
//       }
//     | {
//         timestamp: number
//       }
//   receipt?: {
//     // TODO(tate): idk what we need from this yet
//   }
//   search?: {
//     retries: number
//     status: 'searching' | 'found'
//   }
// } & (
//     | EmptyStoredTransaction
//     | WaitingForUserStoredTransaction
//     | PendingStoredTransaction
//     | SuccessStoredTransaction
//     | RevertedStoredTransaction
//   )

// export type StoredTransaction<
//   status extends StoredTransactionStatus = StoredTransactionStatus,
//   other = {},
// > = {
//   [action in TransactionName]: GenericStoredTransaction<action, status> & other
// }[TransactionName]

// export type StoredFlow = TransactionStoreIdentifiers & {
//   flowId: FlowId
//   transactionIds: TransactionId[]
//   currentTransactionIndex: number
//   currentStage: TransactionFlowStage
//   input?: DataInput
//   intro?: TransactionIntro
//   resumable?: boolean
//   requiresManualCleanup?: boolean
//   autoClose?: boolean
//   resumeLink?: string
//   disableBackgroundClick?: boolean
// }

// export type FlowInitialiserData = Omit<
//   StoredFlow,
//   'currentStage' | 'currentTransactionIndex' | 'transactionIds' | keyof TransactionStoreIdentifiers
// > & {
//   transactions: TransactionItemUnion[]
// }

// export type LastTransactionChange = StoredTransaction<StoredTransactionStatus>

// export type TransactionStoreData = {
//   flows: {
//     [flowKey: FlowKey]: StoredFlow | undefined
//   }
//   transactions: {
//     [transactionKey: TransactionKey]: StoredTransaction | undefined
//   }
//   current: {
//     flowId: string | null
//     sourceChainId: SourceChain['id'] | null
//     account: Address | null
//     _previousFlowId: string | null
//   }
//   lastTransactionChange: LastTransactionChange | null
//   _hasHydrated: boolean
// }

// export type WritableTransactionStoreData = WritableDraft<TransactionStoreData>

// export type TransactionList<status extends StoredTransactionStatus = StoredTransactionStatus> =
//   StoredTransaction<status>[]

// export type TransactionStoreFunctions = {
//   flow: {
//     helpers: {
//       getAllTransactionsComplete: (flow: StoredFlow) => boolean
//       getCanRemoveFlow: (flow: StoredFlow) => boolean
//       getNoTransactionsStarted: (flow: StoredFlow) => boolean
//     }
//     showInput: (
//       flowId: FlowId,
//       {
//         input,
//         disableBackgroundClick,
//       }: { input: GenericDataInput; disableBackgroundClick?: boolean },
//       identifiersOverride?: TransactionStoreIdentifiers,
//     ) => void
//     start: (flow: FlowInitialiserData, identifiersOverride?: TransactionStoreIdentifiers) => void
//     resume: (flowId: FlowId, identifiersOverride?: TransactionStoreIdentifiers) => void
//     resumeWithCheck: (
//       flowId: FlowId,
//       { push }: { push: (path: string) => void },
//       identifiersOverride?: TransactionStoreIdentifiers,
//     ) => void
//     getResumable: (flowId: FlowId, identifiersOverride?: TransactionStoreIdentifiers) => boolean
//     cleanupUnsafe: (flowId: FlowId, identifiersOverride?: TransactionStoreIdentifiers) => void
//     cleanup: (flowId: FlowId, identifiersOverride?: TransactionStoreIdentifiers) => void
//     setTransactions: (
//       flowId: FlowId,
//       transactions: TransactionItemUnion[],
//       identifiersOverride?: TransactionStoreIdentifiers,
//     ) => void
//     getTransactions: (
//       flowId: FlowId,
//       identifiersOverride?: TransactionStoreIdentifiers,
//     ) => TransactionList
//     getStageOrNull: (
//       flowId: FlowId,
//       identifiersOverride?: TransactionStoreIdentifiers,
//     ) => TransactionFlowStage | 'complete' | null
//     getFlowOrNull: (
//       flowId: FlowId,
//       identifiersOverride?: TransactionStoreIdentifiers,
//     ) => StoredFlow | null
//     current: {
//       setTransactions: (transactions: TransactionItemUnion[]) => void
//       setStage: ({ stage }: { stage: TransactionFlowStage }) => void
//       stop: () => void
//       selectedOrPrevious: () => { flow: StoredFlow | null; isPrevious: boolean }
//       attemptDismiss: () => void
//       incrementTransaction: () => void
//       resetTransactionIndex: () => void
//       getTransactions: () => TransactionList
//     }
//   }
//   transaction: {
//     setStatus: (identifiers: StoredTransactionIdentifiers, status: StoredTransactionStatus) => void
//     setHash: (identifiers: StoredTransactionIdentifiers, hash: Hash) => void
//     setSubmission: (
//       identifiers: StoredTransactionIdentifiers,
//       submission: TransactionSubmission & Pick<StoredTransaction, 'transactionType'>,
//     ) => void
//     getByStatus: <status extends StoredTransactionStatus>(status: status) => TransactionList<status>
//     getAll: () => TransactionList
//     getResumable: (transaction: StoredTransaction) => boolean
//   }
//   clear: () => void
//   _setHasHydrated: (hasHydrated: boolean) => void
// }

// export type NotificationQueueFunctions = {
//   notificationQueue: {
//     add: (transaction: StoredTransaction) => void
//     consume: () => StoredTransaction | null
//   }
// }

// type NotificationQueueData = {
//   notificationQueue: TransactionId[]
// }

// type PlainTransactionStore = {
//   _internal: TransactionStoreData
// } & TransactionStoreFunctions

// type PlainNotificationQueue = {
//   _internal: NotificationQueueData
// } & NotificationQueueFunctions

// export type TransactionStore = PlainTransactionStore & PlainNotificationQueue
