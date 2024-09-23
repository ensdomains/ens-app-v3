import { useTranslation } from 'react-i18next'
import { match, P } from 'ts-pattern'

import { Dialog } from '@ensdomains/thorin'

import { useAbilities } from '@app/hooks/abilities/useAbilities'
import { useAccountSafely } from '@app/hooks/account/useAccountSafely'
import { useDnsImportData } from '@app/hooks/ensjs/dns/useDnsImportData'
import { useNameType } from '@app/hooks/nameType/useNameType'
import { usePrimaryNameOrAddress } from '@app/hooks/reverseRecord/usePrimaryNameOrAddress'
import { useNameDetails } from '@app/hooks/useNameDetails'
import type { TransactionDialogPassthrough } from '@app/transaction/components/TransactionDialogManager'
import TransactionLoader from '@app/transaction/components/TransactionLoader'

import { createUserTransaction, type GenericUserTransaction } from '../../transaction'
import { makeTransferNameOrSubnameTransactionItem } from '../../transaction/utils/makeTransferNameOrSubnameTransactionItem'
import { checkCanSyncManager } from './utils/checkCanSyncManager'
import { ErrorView } from './views/ErrorView'
import { MainView } from './views/MainView'

type Data = {
  name: string
}

export type Props = {
  data: Data
} & TransactionDialogPassthrough

const SyncManager = ({ data: { name }, onDismiss, setStage, setTransactions }: Props) => {
  const { t } = useTranslation('transactionFlow')

  const account = useAccountSafely()
  const details = useNameDetails({ name })
  const nameType = useNameType(name)
  const abilities = useAbilities({ name })
  const primaryNameOrAddress = usePrimaryNameOrAddress({
    address: details?.ownerData?.owner!,
    shortenedAddressLength: 5,
    enabled: !!details?.ownerData?.owner,
  })

  const baseCanSynManager = checkCanSyncManager({
    address: account.address,
    nameType: nameType.data,
    registrant: details.ownerData?.registrant,
    owner: details.ownerData?.owner,
    dnsOwner: details.dnsOwner,
  })

  const syncType = nameType.data?.startsWith('dns') ? 'dns' : 'eth'
  const needsProof = nameType.data?.startsWith('dns') || !baseCanSynManager
  const dnsImportData = useDnsImportData({ name, enabled: needsProof })

  const canSyncEth =
    baseCanSynManager &&
    syncType === 'eth' &&
    !!abilities.data?.sendNameFunctionCallDetails?.sendManager?.contract
  const canSyncDNS = baseCanSynManager && syncType === 'dns' && !!dnsImportData.data
  const canSyncManager = canSyncEth || canSyncDNS

  const isLoading =
    !account ||
    details.isLoading ||
    abilities.isLoading ||
    nameType.isLoading ||
    primaryNameOrAddress.isLoading ||
    dnsImportData.isLoading

  const showWarning = nameType.data === 'dns-wrapped-2ld'

  const onClickNext = () => {
    const transactions = [
      canSyncDNS
        ? createUserTransaction('syncManager', {
            name,
            address: account.address!,
            dnsImportData: dnsImportData.data!,
          })
        : null,
      canSyncEth && account.address
        ? makeTransferNameOrSubnameTransactionItem({
            name,
            newOwnerAddress: account.address,
            sendType: 'sendManager',
            isOwnerOrManager: true,
            abilities: abilities.data!,
          })
        : null,
    ].filter(
      (
        transaction,
      ): transaction is
        | GenericUserTransaction<'syncManager'>
        | GenericUserTransaction<'transferName'>
        | GenericUserTransaction<'transferSubname'> => !!transaction,
    )

    if (transactions.length !== 1) return

    setTransactions(transactions)
    setStage('transaction')
  }

  return (
    <>
      <Dialog.Heading title={t('input.syncManager.title')} />
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
    </>
  )
}

export default SyncManager
