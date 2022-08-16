import DismissDialogButton from '@app/components/@atoms/DismissDialogButton/DismissDialogButton'
import { InnerDialog } from '@app/components/@atoms/InnerDialog'
import styled, { css } from 'styled-components'
import { Button, Dialog } from '@ensdomains/thorin'
import { usePublicResolverAddress } from '@app/hooks/usePublicResolverAddress'
import { useProfile } from '@app/hooks/useProfile'
import TransactionLoader from '@app/transaction-flow/TransactionLoader'
import { useTranslation } from 'react-i18next'
import { TransactionDialogPassthrough } from '../../types'
import { makeTransactionItem } from '../../transaction/index'

const DismissButtonWrapper = styled.div(
  () => css`
    position: absolute;
    top: 0;
    right: 0;
  `,
)

type Data = {
  name: string
}

export type Props = { data: Data } & TransactionDialogPassthrough

const TransferProfile = ({ data, dispatch, onDismiss }: Props) => {
  const { t } = useTranslation('transactionFlow')
  const { address: resolverAddress, loading: resolverLoading } = usePublicResolverAddress()

  const { profile, loading } = useProfile(data.name)
  const oldResolverAddress = profile?.resolverAddress

  const handleReset = () => {
    if (!oldResolverAddress || !resolverAddress) return
    dispatch({
      name: 'setTransactions',
      payload: [
        makeTransactionItem('updateResolver', {
          name: data.name,
          resolver: resolverAddress,
          oldResolver: oldResolverAddress,
          contract: 'registry',
        }),
      ],
    })

    dispatch({
      name: 'setFlowStage',
      payload: 'transaction',
    })
  }

  const handleTransfer = () => {
    if (!resolverAddress || !oldResolverAddress) return
    dispatch({
      name: 'startFlow',
      key: `edit-profile-flow-${data.name}`,
      payload: {
        transactions: [
          makeTransactionItem('migrateProfile', { name: data.name }),
          makeTransactionItem('updateResolver', {
            name: data.name,
            resolver: resolverAddress,
            oldResolver: oldResolverAddress,
            contract: 'registry',
          }),
        ],
        resumable: true,
      },
    })
  }
  const footerLeading = (
    <Button variant="secondary" shadowless tone="grey" onClick={handleReset}>
      Reset
    </Button>
  )

  const footerTrailing = (
    <Button onClick={handleTransfer} shadowless>
      Transfer
    </Button>
  )

  if (resolverLoading || loading) return <TransactionLoader />
  return (
    <>
      <DismissButtonWrapper>
        <DismissDialogButton onClick={onDismiss} />
      </DismissButtonWrapper>
      <Dialog.Heading title={t('input.transferProfile.title')} />
      <InnerDialog>
        <p>{t('input.transferProfile.message1')}</p>
        <p>
          <strong>{t('input.transferProfile.message2')}</strong>
        </p>
      </InnerDialog>
      <Dialog.Footer leading={footerLeading} trailing={footerTrailing} />
    </>
  )
}

export default TransferProfile
