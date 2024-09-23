import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Address } from 'viem'

import { useResolverStatus } from '@app/hooks/resolver/useResolverStatus'
import type { TransactionDialogPassthrough } from '@app/transaction/components/TransactionDialogManager'
import { useTransactionManager } from '@app/transaction/transactionManager'

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
  latestResolverAddress: Address
  oldResolverAddress: Address
  status: ReturnType<typeof useResolverStatus>['data']
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
  latestResolverAddress,
  oldResolverAddress,
  onDismiss,
  onDismissOverlay,
  setStage,
  setTransactions,
}: Props) => {
  const { t } = useTranslation('transactionFlow')
  const [selectedProfile, setSelectedProfile] = useState<SelectedProfile>('latest')
  const startFlow = useTransactionManager((s) => s.startFlow)

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
    setTransactions([
      {
        name: 'updateResolver',
        data: {
          name,
          contract: isWrapped ? 'nameWrapper' : 'registry',
          resolverAddress: latestResolverAddress,
        },
      },
    ])
    setStage('transaction')
  }

  const handleMigrateProfile = () => {
    startFlow({
      flowId: `migrate-profile-${name}`,
      intro: {
        title: ['input.profileEditor.intro.migrateProfile.title', { ns: 'transactionFlow' }],
        content: {
          name: 'GenericWithDescription',
          data: {
            description: t('input.profileEditor.intro.migrateProfile.description'),
          },
        },
      },
      transactions: [
        {
          name: 'migrateProfile',
          data: {
            name,
          },
        },
        {
          name: 'updateResolver',
          data: {
            name,
            contract: isWrapped ? 'nameWrapper' : 'registry',
            resolverAddress: latestResolverAddress,
          },
        },
      ],
    })
  }

  const handleResetProfile = () => {
    startFlow({
      flowId: `reset-profile-${name}`,
      intro: {
        title: ['input.profileEditor.intro.resetProfile.title', { ns: 'transactionFlow' }],
        content: {
          name: 'GenericWithDescription',
          data: {
            description: t('input.profileEditor.intro.resetProfile.description'),
          },
        },
      },
      transactions: [
        {
          name: 'resetProfile',
          data: {
            name,
            resolverAddress: latestResolverAddress,
          },
        },
        {
          name: 'updateResolver',
          data: {
            name,
            contract: isWrapped ? 'nameWrapper' : 'registry',
            resolverAddress: latestResolverAddress,
          },
        },
      ],
    })
  }

  const handleMigrateCurrentProfileToLatest = async () => {
    startFlow({
      flowId: `migrate-profile-with-reset-${name}`,
      intro: {
        title: ['input.profileEditor.intro.migrateCurrentProfile.title', { ns: 'transactionFlow' }],
        content: {
          name: 'GenericWithDescription',
          data: {
            description: t('input.profileEditor.intro.migrateCurrentProfile.description'),
          },
        },
      },
      transactions: [
        {
          name: 'migrateProfileWithReset',
          data: {
            name,
            resolverAddress: oldResolverAddress,
          },
        },
        {
          name: 'updateResolver',
          data: {
            name,
            contract: isWrapped ? 'nameWrapper' : 'registry',
            resolverAddress: latestResolverAddress,
          },
        },
      ],
    })
  }

  const viewsMap: { [key in View]: any } = {
    migrateRegistry: <MigrateRegistryView name={name} onCancel={onDismiss} />,
    invalidResolver: <InvalidResolverView onConfirm={handleUpdateResolver} onCancel={onDismiss} />,
    migrateProfileSelector: (
      <MigrateProfileSelectorView
        name={name}
        currentResolverAddress={oldResolverAddress}
        latestResolverAddress={latestResolverAddress}
        hasCurrentProfile={!!status?.hasProfile}
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
        hasProfile={!!status?.hasProfile}
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
