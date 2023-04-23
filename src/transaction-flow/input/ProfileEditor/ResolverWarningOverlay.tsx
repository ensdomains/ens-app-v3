import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useResolverStatus } from '@app/hooks/useResolverStatus'
import { makeIntroItem } from '@app/transaction-flow/intro'
import { makeTransactionItem } from '@app/transaction-flow/transaction'
import { TransactionDialogPassthrough } from '@app/transaction-flow/types'

import { InvalidResolverView } from './views/InvalidResolverView'
import { MigrateProfileSelectorView } from './views/MigrateProfileSelectorView.tsx'
import { MigrateProfileWarningView } from './views/MigrateProfileWarningView'
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
  | 'migrateProfileWarning'
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
  const { t } = useTranslation('transactionFlow')
  const [selectedProfile, setSelectedProfile] = useState<SelectedProfile>('latest')

  const flow: View[] = useMemo(() => {
    if (hasOldRegistry) return ['migrateRegistry']
    if (!status?.hasResolver) return ['noResolver']
    if (!status?.hasValidResolver) return ['invalidResolver']
    if (!status?.isNameWrapperAware && isWrapped) return ['resolverNotNameWrapperAware']
    if (!status?.isAuthorized) return ['invalidResolver']
    if (status?.hasMigratedProfile && status.isMigratedProfileEqual)
      return ['resolverOutOfSync', 'updateResolverOrResetProfile', 'resetProfile']
    if (status?.hasMigratedProfile)
      return [
        'resolverOutOfSync',
        'migrateProfileSelector',
        ...(selectedProfile === 'current'
          ? (['migrateProfileWarning'] as View[])
          : (['resetProfile'] as View[])),
      ]
    return ['resolverOutOfDate', 'transferOrResetProfile']
  }, [
    hasOldRegistry,
    isWrapped,
    status?.hasResolver,
    status?.isNameWrapperAware,
    status?.hasValidResolver,
    status?.isAuthorized,
    status?.hasMigratedProfile,
    status?.isMigratedProfileEqual,
    selectedProfile,
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
      name: 'startFlow',
      key: `migrate-profile-${name}`,
      payload: {
        intro: {
          title: ['input.profileEditor.intro.migrateProfile.title', { ns: 'transactionFlow' }],
          content: makeIntroItem('GenericWithDescription', {
            description: t('input.profileEditor.intro.migrateProfile.description'),
          }),
        },
        transactions: [
          makeTransactionItem('migrateProfile', {
            name,
          }),
          makeTransactionItem('updateResolver', {
            name,
            contract: isWrapped ? 'nameWrapper' : 'registry',
            resolver: latestResolver,
          }),
        ],
      },
    })
  }

  const handleResetProfile = () => {
    dispatch({
      name: 'startFlow',
      key: `reset-profile-${name}`,
      payload: {
        intro: {
          title: ['input.profileEditor.intro.resetProfile.title', { ns: 'transactionFlow' }],
          content: makeIntroItem('GenericWithDescription', {
            description: t('input.profileEditor.intro.resetProfile.description'),
          }),
        },
        transactions: [
          makeTransactionItem('resetProfile', {
            name,
            resolver: latestResolver,
          }),
          makeTransactionItem('updateResolver', {
            name,
            contract: isWrapped ? 'nameWrapper' : 'registry',
            resolver: latestResolver,
          }),
        ],
      },
    })
  }

  const handleMigrateCurrentProfileToLatest = async () => {
    dispatch({
      name: 'startFlow',
      key: `migrate-profile-with-reset-${name}`,
      payload: {
        intro: {
          title: [
            'input.profileEditor.intro.migrateCurrentProfile.title',
            { ns: 'transactionFlow' },
          ],
          content: makeIntroItem('GenericWithDescription', {
            description: t('input.profileEditor.intro.migrateCurrentProfile.description'),
          }),
        },
        transactions: [
          makeTransactionItem('migrateProfileWithReset', {
            name,
            resolver: latestResolver,
          }),
          makeTransactionItem('updateResolver', {
            name,
            contract: isWrapped ? 'nameWrapper' : 'registry',
            resolver: latestResolver,
          }),
        ],
      },
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
        hasCurrentProfile={status?.hasProfile}
        selected={selectedProfile}
        onChangeSelected={setSelectedProfile}
        onBack={onDecrement}
        onNext={() => {
          if (selectedProfile === 'latest') handleUpdateResolver()
          else onIncrement()
        }}
      />
    ),
    migrateProfileWarning: (
      <MigrateProfileWarningView
        onBack={onDecrement}
        onNext={handleMigrateCurrentProfileToLatest}
      />
    ),
    noResolver: <NoResolverView onCancel={onDismiss} onConfirm={handleUpdateResolver} />,
    resetProfile: <ResetProfileView onBack={onDecrement} onNext={handleResetProfile} />,
    resolverNotNameWrapperAware: (
      <ResolverNotNameWrapperAwareView
        selected={selectedProfile}
        hasProfile={status?.hasProfile}
        onChangeSelected={setSelectedProfile}
        onCancel={onDismiss}
        onNext={() => {
          if (selectedProfile === 'reset' || !status?.hasProfile) handleUpdateResolver()
          else handleMigrateProfile()
        }}
      />
    ),
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
          if (selectedProfile === 'reset') handleUpdateResolver()
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
