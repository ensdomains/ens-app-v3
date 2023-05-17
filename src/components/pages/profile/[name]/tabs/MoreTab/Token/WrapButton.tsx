import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { checkIsDecrypted } from '@ensdomains/ensjs/utils/labels'

import { useHasGlobalError } from '@app/hooks/errors/useHasGlobalError'
import { useAccountSafely } from '@app/hooks/useAccountSafely'
import { useChainId } from '@app/hooks/useChainId'
import { DetailedProfile } from '@app/hooks/useNameDetails'
import useWrapperApprovedForAll from '@app/hooks/useWrapperApprovedForAll'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { makeIntroItem } from '@app/transaction-flow/intro'
import { makeTransactionItem } from '@app/transaction-flow/transaction'
import { GenericTransaction, TransactionFlowItem } from '@app/transaction-flow/types'
import { ReturnedENS } from '@app/types'
import { NAMEWRAPPER_AWARE_RESOLVERS } from '@app/utils/constants'

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
  const chainId = useChainId()

  const hasOwnerData = !!ownerData
  const isOwner = ownerData?.owner === address
  const isRegistrant = ownerData?.registrant === address
  const resolverAddress = profile?.resolverAddress

  const _canBeWrapped =
    canBeWrapped &&
    !!address &&
    (ownerData?.ownershipLevel === 'registrar' ? isRegistrant : isOwner)

  const hasExistingRecords = useMemo(() => {
    if (profile?.records) {
      if (Object.keys(profile.records.coinTypes || {}).length > 0) return true
      if (Object.keys(profile.records.texts || {}).length > 0) return true
      if (profile.records.contentHash) return true
      if (profile.records.abi) return true
    }
    return false
  }, [profile])
  const isUsingWrapperAwareResolver = useMemo(() => {
    if (NAMEWRAPPER_AWARE_RESOLVERS[String(chainId)].includes(resolverAddress!)) return true
    return false
  }, [chainId, resolverAddress])

  const isSubdomain = name.split('.').length > 2
  const { approvedForAll, isLoading: approvalLoading } = useWrapperApprovedForAll(
    address!,
    !_canBeWrapped && isSubdomain,
  )

  const { createTransactionFlow, resumeTransactionFlow, getResumable, prepareDataInput } =
    useTransactionFlow()
  const showUnknownLabelsInput = prepareDataInput('UnknownLabels')
  const resumable = getResumable(`wrapName-${name}`)

  const handleWrapClick = () => {
    if (resumable) return resumeTransactionFlow(`wrapName-${name}`)
    if (hasOwnerData) {
      const transactions: GenericTransaction[] = [
        makeTransactionItem('wrapName', {
          name,
        }),
      ]
      if (isOwner) {
        if (hasExistingRecords && !isUsingWrapperAwareResolver) {
          transactions.unshift(
            makeTransactionItem('migrateProfile', {
              name,
            }),
          )
        }

        if (isSubdomain && !approvedForAll) {
          transactions.unshift(
            makeTransactionItem('approveNameWrapper', {
              address: address!,
            }),
          )
        }
      } else if (!isSubdomain && hasExistingRecords && !isUsingWrapperAwareResolver) {
        transactions.push(
          makeTransactionItem('migrateProfile', {
            name,
            resolverAddress,
          }),
        )
      }
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
  }

  if (!_canBeWrapped || hasGlobalError) return null

  return (
    <BaseWrapButton
      data-testid="wrap-name-btn"
      disabled={approvalLoading}
      onClick={handleWrapClick}
    >
      {t('tabs.more.token.wrapName')}
    </BaseWrapButton>
  )
}

export default WrapButton
