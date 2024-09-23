import { useTranslation } from 'react-i18next'

import { GetOwnerReturnType } from '@ensdomains/ensjs/public'
import { checkIsDecrypted } from '@ensdomains/ensjs/utils'

import { useAccountSafely } from '@app/hooks/account/useAccountSafely'
import { useResolverStatus } from '@app/hooks/resolver/useResolverStatus'
import { useWrapperApprovedForAll } from '@app/hooks/useWrapperApprovedForAll'
import type { FlowInitialiserData } from '@app/transaction/slices/createFlowSlice'
import { useTransactionManager } from '@app/transaction/transactionManager'
import { usePreparedDataInput } from '@app/transaction/usePreparedDataInput'
import { createUserTransaction } from '@app/transaction/user/transaction'
import { Profile } from '@app/types'
import { useHasGraphError } from '@app/utils/SyncProvider/SyncProvider'

import BaseWrapButton from './BaseWrapButton'

type Props = {
  name: string
  canBeWrapped: boolean
  ownerData: GetOwnerReturnType | undefined
  profile: Profile | undefined
  isManager: boolean
  isRegistrant: boolean
}

const WrapButton = ({ name, ownerData, profile, canBeWrapped, isManager, isRegistrant }: Props) => {
  const { t } = useTranslation('profile')

  const { data: hasGraphError, isLoading: hasGraphErrorLoading } = useHasGraphError()
  const { address } = useAccountSafely()
  const resolverStatus = useResolverStatus({ name })

  const hasOwnerData = !!ownerData

  const shouldMigrate =
    !resolverStatus.data?.isMigratedProfileEqual && !resolverStatus.data?.isNameWrapperAware
  const resolverAddress = profile?.resolverAddress

  const isSubname = name.split('.').length > 2
  const { data: approvedForAll, isLoading: isApprovalLoading } = useWrapperApprovedForAll({
    address: address!,
    isSubname,
    canBeWrapped,
  })

  const flowId = `wrapName-${name}`

  const getResumable = useTransactionManager((s) => s.isFlowResumable)
  const resumeFlow = useTransactionManager((s) => s.resumeFlow)
  const startFlow = useTransactionManager((s) => s.startFlow)

  const showUnknownLabelsInput = usePreparedDataInput('UnknownLabels')
  const resumable = getResumable(flowId)

  const handleWrapClick = () => {
    if (!hasOwnerData) return
    if (resumable) return resumeFlow(flowId)

    const isManagerAndShouldMigrate = isManager && shouldMigrate
    const isRegistrantAndShouldMigrate = !isManager && isRegistrant && shouldMigrate
    const needsApproval = isManager && isSubname && !approvedForAll

    const transactions = [
      ...(needsApproval
        ? [
            createUserTransaction('approveNameWrapper', {
              address: address!,
            }),
          ]
        : []),
      ...(isManagerAndShouldMigrate
        ? [
            createUserTransaction('migrateProfile', {
              name,
            }),
          ]
        : []),
      createUserTransaction('wrapName', {
        name,
      }),
      ...(isRegistrantAndShouldMigrate
        ? [createUserTransaction('migrateProfile', { name, resolverAddress })]
        : []),
    ]

    const flow = {
      flowId,
      transactions,
      resumable: true,
      intro: {
        title: ['details.wrap.startTitle', { ns: 'profile' }],
        content: {
          name: 'WrapName',
          data: { name },
        },
      },
    } satisfies FlowInitialiserData

    const key = `wrapName-${name}`
    if (!checkIsDecrypted(name))
      return showUnknownLabelsInput(key, {
        name,
        flow,
      })
    return startFlow(flow)
  }

  const isLoading = isApprovalLoading || resolverStatus.isLoading || hasGraphErrorLoading

  if (!canBeWrapped || hasGraphError) return null

  return (
    <BaseWrapButton
      data-testid="wrap-name-btn"
      disabled={isLoading}
      loading={isLoading}
      onClick={handleWrapClick}
    >
      {t('tabs.more.token.wrapName')}
    </BaseWrapButton>
  )
}

export default WrapButton
