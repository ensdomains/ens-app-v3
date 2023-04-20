import { useMemo, useState } from 'react'

import { useResolverStatus } from '@app/hooks/useResolverStatus'
import { makeTransactionItem } from '@app/transaction-flow/transaction'
import { TransactionDialogPassthrough } from '@app/transaction-flow/types'

import { InvalidResolverView } from './views/InvalidResolverView'
import { MigrateProfileSelectorView } from './views/MigrateProfileSelectorView.tsx'
import { MigrateRegistryView } from './views/MigrateRegistryView'
import { NoResolverView } from './views/NoResolverView'
import { ResetProfileView } from './views/ResetProfileView'
import { ResolverNotNameWrapperAwareView } from './views/ResolverNotNameWrapperAwareView'
import { ResolverOutOfDateView } from './views/ResolverOutOfDateView'
import { ResolverOutOfSyncView } from './views/ResolverOutOfSyncView'
import { TransferOrResetProfileView } from './views/TransferOrResetProfileView'
import { UpdateResolverOrResetProfileView } from './views/UpdateResolverOrResetProfileView'

export type SelectedProfile = 'latest' | 'current' | 'reset'

type Props = {
  name: string
  isWrapped: boolean
  resumable?: boolean
  hasOldRegistry?: boolean
  hasMigratedProfile?: boolean
  hasNoResolver?: boolean
  latestResolver: string
  oldResolver: string
  status: ReturnType<typeof useResolverStatus>['status']
  onDismissOverlay: () => void
} & TransactionDialogPassthrough

type View =
  | 'invalidResolver'
  | 'migrateProfileSelector'
  | 'migrateRegistry'
  | 'noResolver'
  | 'resetProfile'
  | 'resolverNotNameWrapperAware'
  | 'resolverOutOfDate'
  | 'resolverOutOfSync'
  | 'transferOrResetProfile'
  | 'updateResolverOrResetProfile'

const ResolverWarningOverlay = ({
  name,
  status,
  isWrapped,
  hasOldRegistry = false,
  latestResolver,
  oldResolver,
  dispatch,
  onDismiss,
  onDismissOverlay,
}: Props) => {
  const [selectedProfile, setSelectedProfile] = useState<SelectedProfile>('latest')

  const flow: View[] = useMemo(() => {
    if (hasOldRegistry) return ['migrateRegistry']
    if (!status?.hasResolver) return ['noResolver']
    if (!status?.isNameWrapperAware && isWrapped) return ['resolverNotNameWrapperAware']
    if (!status?.hasValidResolver) return ['invalidResolver']
    if (status?.hasMigratedProfile && status.isMigratedProfileEqual)
      return ['resolverOutOfSync', 'updateResolverOrResetProfile', 'resetProfile']
    if (status?.hasMigratedProfile) return ['resolverOutOfSync', 'migrateProfileSelector']
    return ['resolverOutOfDate', 'transferOrResetProfile', 'resetProfile']
  }, [
    hasOldRegistry,
    isWrapped,
    status?.hasResolver,
    status?.isNameWrapperAware,
    status?.hasValidResolver,
    status?.hasMigratedProfile,
    status?.isMigratedProfileEqual,
  ])

  const [index, setIndex] = useState(0)
  const view = flow[index]

  const onIncrement = () => {
    if (flow[index + 1]) setIndex(index + 1)
  }

  const onDecrement = () => {
    if (flow[index - 1]) setIndex(index - 1)
  }

  const handleUpdateResolver = () => {
    dispatch({
      name: 'setTransactions',
      payload: [
        makeTransactionItem('updateResolver', {
          name,
          contract: isWrapped ? 'nameWrapper' : 'registry',
          resolver: latestResolver,
        }),
      ],
    })
    dispatch({
      name: 'setFlowStage',
      payload: 'transaction',
    })
  }

  const handleMigrateProfile = () => {
    dispatch({
      name: 'setTransactions',
      payload: [
        makeTransactionItem('migrateProfile', {
          name,
        }),
        makeTransactionItem('updateResolver', {
          name,
          contract: isWrapped ? 'nameWrapper' : 'registry',
          resolver: latestResolver,
        }),
      ],
    })
    dispatch({
      name: 'setFlowStage',
      payload: 'transaction',
    })
  }

  const handleResetProfile = () => {
    dispatch({
      name: 'setTransactions',
      payload: [
        ...(status?.hasMigratedProfile
          ? [
              makeTransactionItem('updateProfile', {
                name,
                records: {
                  clearRecords: true,
                },
                resolver: latestResolver,
              }),
            ]
          : []),
        makeTransactionItem('updateResolver', {
          name,
          contract: isWrapped ? 'nameWrapper' : 'registry',
          resolver: latestResolver,
        }),
      ],
    })
    dispatch({
      name: 'setFlowStage',
      payload: 'transaction',
    })
  }

  const viewsMap: { [key in View]: any } = {
    migrateRegistry: <MigrateRegistryView name={name} onCancel={onDismiss} />,
    invalidResolver: <InvalidResolverView onConfirm={handleUpdateResolver} onCancel={onDismiss} />,
    migrateProfileSelector: (
      <MigrateProfileSelectorView
        name={name}
        currentResolver={oldResolver}
        latestResolver={latestResolver}
        selected={selectedProfile}
        onChangeSelected={setSelectedProfile}
        onBack={onDecrement}
        onNext={() => {
          if (selectedProfile === 'latest') handleUpdateResolver()
          else if (selectedProfile === 'current') alert()
          else handleResetProfile()
        }}
      />
    ),
    noResolver: <NoResolverView />,
    resetProfile: <ResetProfileView onBack={onDecrement} onNext={handleResetProfile} />,
    resolverNotNameWrapperAware: <ResolverNotNameWrapperAwareView />,
    resolverOutOfDate: (
      <ResolverOutOfDateView
        onSkip={onDismissOverlay}
        onCancel={onDismiss}
        onConfirm={onIncrement}
      />
    ),
    resolverOutOfSync: (
      <ResolverOutOfSyncView onSkip={onDismissOverlay} onCancel={onDismiss} onNext={onIncrement} />
    ),
    transferOrResetProfile: (
      <TransferOrResetProfileView
        selected={selectedProfile}
        onChangeSelected={setSelectedProfile}
        onBack={onDecrement}
        onNext={() => {
          if (selectedProfile === 'reset') onIncrement()
          else handleMigrateProfile()
        }}
      />
    ),
    updateResolverOrResetProfile: (
      <UpdateResolverOrResetProfileView
        selected={selectedProfile}
        onChangeSelected={setSelectedProfile}
        onBack={onDecrement}
        onNext={() => {
          if (selectedProfile === 'reset') onIncrement()
          else handleUpdateResolver()
        }}
      />
    ),
  }

  return viewsMap[view]
}

export default ResolverWarningOverlay
