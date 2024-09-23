import { queryOptions } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { BaseError } from 'viem'

import { Dialog, Helper, Typography } from '@ensdomains/thorin'

import WalletSVG from '@app/assets/Wallet.svg'
import { Outlink } from '@app/components/Outlink'
import { useQueryOptions } from '@app/hooks/useQueryOptions'
import type {
  GenericStoredTransaction,
  StoredTransactionStatus,
} from '@app/transaction/slices/createTransactionSlice'
import { useTransactionManager } from '@app/transaction/transactionManager'
import type { UserTransactionName } from '@app/transaction/user/transaction'
import { TransactionDisplayItem } from '@app/types'
import { getReadableError } from '@app/utils/errors'
import { useQuery } from '@app/utils/query/useQuery'
import { createEtherscanLink } from '@app/utils/utils'

import { DisplayItems } from '../../DisplayItems'
import { TransactionModalActionButton } from './ActionButton'
import { BackButton } from './BackButton'
import { LoadBar } from './LoadBar'
import { getTransactionErrorQueryFn } from './query'
import { useManagedTransaction } from './useManagedTransaction'

const WalletIcon = styled.svg(
  ({ theme }) => css`
    width: ${theme.space['12']};
  `,
)

const MessageTypography = styled(Typography)(
  () => css`
    text-align: center;
  `,
)

function useCreateSubnameRedirect(
  shouldTrigger: boolean,
  subdomain?: TransactionDisplayItem['value'],
) {
  useEffect(() => {
    if (shouldTrigger && typeof subdomain === 'string') {
      setTimeout(() => {
        window.location.href = `/${subdomain}`
      }, 1000)
    }
  }, [shouldTrigger, subdomain])
}

type TransactionStageModalProps<name extends UserTransactionName = UserTransactionName> = {
  currentTransactionIndex: number
  transactionCount: number
  transaction: GenericStoredTransaction<name>
  displayItems: TransactionDisplayItem[]
  backToInput: boolean
  onDismiss: () => void
}

export type DialogStatus = Exclude<StoredTransactionStatus, 'empty' | 'waitingForUser'> | 'confirm'

const MiddleContent = ({
  dialogStatus,
  sendTime,
}: {
  dialogStatus: DialogStatus
  sendTime: number | undefined
}) => {
  const { t } = useTranslation()

  if (dialogStatus !== 'confirm') return <LoadBar dialogStatus={dialogStatus} sendTime={sendTime} />

  return (
    <>
      <WalletIcon as={WalletSVG} />
      <MessageTypography>{t('transaction.dialog.confirm.message')}</MessageTypography>
    </>
  )
}

export const TransactionStageModal = <name extends UserTransactionName = UserTransactionName>({
  currentTransactionIndex,
  transactionCount,
  transaction,
  displayItems,
  backToInput,
  onDismiss,
}: TransactionStageModalProps<name>) => {
  const { t } = useTranslation()

  const incrementTransaction = useTransactionManager((s) => s.incrementCurrentFlowTransactionIndex)

  const {
    transactionError,
    requestError,
    canEnableTransactionRequest,
    isTransactionRequestCachedData,
    request,
    requestLoading,
    sendTransaction,
    transactionLoading,
  } = useManagedTransaction(transaction)

  useCreateSubnameRedirect(
    transaction.status === 'success' && currentTransactionIndex + 1 === transactionCount,
    displayItems.find((i) => i.label === 'subname' && i.type === 'name')?.value,
  )

  const FilledDisplayItems = useMemo(
    () => <DisplayItems displayItems={[...(displayItems || [])]} />,
    [displayItems],
  )

  const stepStatus = useMemo(() => {
    if (transaction.status === 'success') {
      return 'completed'
    }
    return 'inProgress'
  }, [transaction.status])

  const initialErrorOptions = useQueryOptions({
    params: {
      hash: transaction.currentHash,
      status: transaction.status,
      targetChainId: transaction.targetChainId,
    },
    functionName: 'getTransactionError',
    queryDependencyType: 'standard',
    queryFn: getTransactionErrorQueryFn,
  })

  const preparedErrorOptions = queryOptions({
    queryKey: initialErrorOptions.queryKey,
    queryFn: initialErrorOptions.queryFn,
  })

  const { data: upperError } = useQuery({
    ...preparedErrorOptions,
    enabled: !!transaction && !!transaction.currentHash && transaction.status === 'reverted',
  })

  const lowerError = useMemo(() => {
    if (transaction.status === 'success') return null
    if (transaction.status === 'pending') return null
    if (transaction.status === 'waitingForUser') return null
    const err = transactionError || requestError
    if (!err) return null
    if (!(err instanceof BaseError)) {
      if ('message' in err) return err.message
      return t('transaction.error.unknown')
    }
    const readableError = getReadableError(err)
    return readableError || err.shortMessage
  }, [t, transaction.status, transactionError, requestError])

  const actionButton = (
    <TransactionModalActionButton
      canEnableTransactionRequest={canEnableTransactionRequest}
      currentTransactionIndex={currentTransactionIndex}
      transactionCount={transactionCount}
      incrementTransaction={incrementTransaction}
      isTransactionRequestCachedData={isTransactionRequestCachedData}
      onDismiss={onDismiss}
      requestExists={!!request}
      requestErrorExists={!!requestError}
      requestLoading={requestLoading}
      sendTransaction={() => sendTransaction(request!)}
      status={transaction.status}
      transactionLoading={transactionLoading}
    />
  )

  const backButton = <BackButton status={transaction.status} backToInput={backToInput} />

  console.log(transaction.status)

  const dialogStatus = (() => {
    switch (transaction.status) {
      case 'empty':
      case 'waitingForUser':
        return 'confirm'
      default:
        return transaction.status
    }
  })()

  return (
    <>
      <Dialog.Heading title={t(`transaction.dialog.${dialogStatus}.title`)} />
      <Dialog.Content data-testid="transaction-modal-inner">
        <MiddleContent dialogStatus={dialogStatus} sendTime={transaction.submission?.timestamp} />
        {upperError && <Helper type="error">{t(upperError)}</Helper>}
        {FilledDisplayItems}
        {transaction.currentHash && (
          <Outlink
            href={createEtherscanLink({
              data: transaction.currentHash,
              chainId: transaction.targetChainId,
            })}
          >
            {t('transaction.viewEtherscan')}
          </Outlink>
        )}
        {lowerError && <Helper type="error">{lowerError}</Helper>}
      </Dialog.Content>
      <Dialog.Footer
        currentStep={currentTransactionIndex}
        stepCount={transactionCount > 1 ? transactionCount : undefined}
        stepStatus={stepStatus}
        leading={backButton}
        trailing={actionButton}
      />
    </>
  )
}
