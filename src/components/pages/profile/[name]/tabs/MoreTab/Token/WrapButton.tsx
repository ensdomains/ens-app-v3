import { useTranslation } from 'react-i18next'

import { checkIsDecrypted } from '@ensdomains/ensjs/utils/labels'

import { useHasGlobalError } from '@app/hooks/errors/useHasGlobalError'
import { useResolverStatus } from '@app/hooks/resolver/useResolverStatus'
import { useAccountSafely } from '@app/hooks/useAccountSafely'
import { DetailedProfile } from '@app/hooks/useNameDetails'
import useWrapperApprovedForAll from '@app/hooks/useWrapperApprovedForAll'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { makeIntroItem } from '@app/transaction-flow/intro'
import { makeTransactionItem } from '@app/transaction-flow/transaction'
import { GenericTransaction, TransactionFlowItem } from '@app/transaction-flow/types'
import { ReturnedENS } from '@app/types'

import BaseWrapButton from './BaseWrapButton'

type Props = {
  name: string
  canBeWrapped: boolean
  ownerData: ReturnedENS['getOwner']
  profile: DetailedProfile | undefined
}

const WrapButton = ({ name, ownerData, profile, canBeWrapped }: Props) => {
  const { t } = useTranslation('profile')

  const hasGlobalError = useHasGlobalError()
  const { address } = useAccountSafely()
  const resolverStatus = useResolverStatus(name)

  const hasOwnerData = !!ownerData
  const isManager = ownerData?.owner === address
  const isRegistrant = ownerData?.registrant === address

  const shouldMigrate =
    !resolverStatus.data?.isMigratedProfileEqual && !resolverStatus.data?.isNameWrapperAware
  const resolverAddress = profile?.resolverAddress

  const _canBeWrapped =
    canBeWrapped &&
    !!address &&
    (ownerData?.ownershipLevel === 'registrar' ? isRegistrant : isManager)

  const isSubdomain = name.split('.').length > 2
  const { approvedForAll, isLoading: approvalLoading } = useWrapperApprovedForAll(
    address!,
    isSubdomain,
    _canBeWrapped,
  )

  const { createTransactionFlow, resumeTransactionFlow, getResumable, prepareDataInput } =
    useTransactionFlow()
  const showUnknownLabelsInput = prepareDataInput('UnknownLabels')
  const resumable = getResumable(`wrapName-${name}`)

  const handleWrapClick = () => {
    if (!hasOwnerData) return
    if (resumable) return resumeTransactionFlow(`wrapName-${name}`)

    const isManagerAndShouldMigrate = isManager && shouldMigrate
    const isRegistrantAndShouldMigrate = !isManager && isRegistrant && shouldMigrate
    const needsApproval = isManager && isSubdomain && !approvedForAll

    const transactions: GenericTransaction[] = [
      ...(needsApproval
        ? [
            makeTransactionItem('approveNameWrapper', {
              address: address!,
            }),
          ]
        : []),
      ...(isManagerAndShouldMigrate
        ? [
            makeTransactionItem('migrateProfile', {
              name,
            }),
          ]
        : []),
      makeTransactionItem('wrapName', {
        name,
      }),
      ...(isRegistrantAndShouldMigrate
        ? [makeTransactionItem('migrateProfile', { name, resolverAddress })]
        : []),
    ]

    const transactionFlowItem: TransactionFlowItem = {
      transactions,
      resumable: true,
      intro: {
        title: ['details.wrap.startTitle', { ns: 'profile' }],
        content: makeIntroItem('WrapName', { name }),
      },
    }

    const key = `wrapName-${name}`
    if (!checkIsDecrypted(name))
      return showUnknownLabelsInput(key, {
        name,
        key,
        transactionFlowItem,
      })
    return createTransactionFlow(key, transactionFlowItem)
  }

  const isLoading = approvalLoading || resolverStatus.isLoading

  if (!_canBeWrapped || hasGlobalError) return null

  return (
    <BaseWrapButton data-testid="wrap-name-btn" disabled={isLoading} onClick={handleWrapClick}>
      {t('tabs.more.token.wrapName')}
    </BaseWrapButton>
  )
}

export default WrapButton
