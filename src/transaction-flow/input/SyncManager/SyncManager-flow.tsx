import { useTranslation } from 'react-i18next'
import { P, match } from 'ts-pattern'

import { Dialog } from '@ensdomains/thorin'

import { InnerDialog } from '@app/components/@atoms/InnerDialog'
import { useAbilities } from '@app/hooks/abilities/useAbilities'
import { useAccountSafely } from '@app/hooks/useAccountSafely'
import useDNSProof from '@app/hooks/useDNSProof'
import { useNameDetails } from '@app/hooks/useNameDetails'
import { useNameType } from '@app/hooks/useNameType'
import TransactionLoader from '@app/transaction-flow/TransactionLoader'
import { makeTransactionItem } from '@app/transaction-flow/transaction'
import { TransactionDialogPassthrough } from '@app/transaction-flow/types'

import { usePrimaryNameOrAddress } from '../../../hooks/reverseRecord/usePrimaryNameOrAddress'
import { checkCanSyncManager } from './utils/checkCanSyncManager'
import { ErrorView } from './views/ErrorView'
import { MainView } from './views/MainView'

type Data = {
  name: string
}

export type Props = {
  data: Data
} & TransactionDialogPassthrough

const SyncManager = ({ data: { name }, dispatch, onDismiss }: Props) => {
  const { t } = useTranslation('transactionFlow')

  const account = useAccountSafely()
  const details = useNameDetails(name)
  const nameType = useNameType(name)
  const abilities = useAbilities(name)
  const primaryNameOrAddress = usePrimaryNameOrAddress(details?.ownerData?.owner, 5)

  const baseCanSynManager = checkCanSyncManager({
    address: account.address,
    nameType: nameType.data,
    registrant: details.ownerData?.registrant,
    owner: details.ownerData?.owner,
    dnsOwner: details.dnsOwner,
  })

  const syncType = nameType.data?.startsWith('dns') ? 'dns' : 'eth'
  const needsProof = nameType.data?.startsWith('dns') || !baseCanSynManager
  const proof = useDNSProof(name, !needsProof)

  const canSyncEth =
    baseCanSynManager &&
    syncType === 'eth' &&
    !!abilities.data?.sendNameFunctionCallDetails?.sendManager?.contract
  const canSyncDNS = baseCanSynManager && syncType === 'dns' && !!proof.data
  const canSyncManager = canSyncEth || canSyncDNS

  const isLoading =
    !account ||
    details.isLoading ||
    abilities.isLoading ||
    nameType.isLoading ||
    primaryNameOrAddress.isLoading ||
    proof.isLoading

  const showWarning = nameType.data === 'dns-wrapped-2ld'

  const onClickNext = () => {
    const transactions = [
      canSyncDNS
        ? makeTransactionItem('syncManager', {
            name,
            address: account.address!,
            proverResult: proof.data,
          })
        : null,
      canSyncEth &&
      account.address &&
      abilities.data?.sendNameFunctionCallDetails?.sendManager?.contract
        ? makeTransactionItem('transferName', {
            name,
            newOwner: account.address,
            sendType: 'sendManager',
            contract: abilities.data?.sendNameFunctionCallDetails?.sendManager?.contract,
            reclaim: abilities.data?.sendNameFunctionCallDetails?.sendManager?.method === 'reclaim',
          })
        : null,
    ].filter((transaction) => !!transaction)

    if (transactions.length !== 1) return

    dispatch({
      name: 'setTransactions',
      payload: transactions,
    })
    dispatch({ name: 'setFlowStage', payload: 'transaction' })
  }

  return (
    <>
      <Dialog.Heading title={t('input.syncManager.title')} />
      <InnerDialog style={{ minHeight: '100px' }}>
        {match([isLoading, canSyncManager])
          .with([true, P._], () => <TransactionLoader />)
          .with([false, true], () => (
            <MainView
              manager={primaryNameOrAddress.data.nameOrAddr}
              showWarning={showWarning}
              onCancel={onDismiss}
              onConfirm={onClickNext}
            />
          ))
          .with([false, false], () => <ErrorView onCancel={onDismiss} />)
          .otherwise(() => null)}
      </InnerDialog>
    </>
  )
}

export default SyncManager
