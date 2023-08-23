import { Trans, useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, Dialog, Helper, Typography } from '@ensdomains/thorin'

import { InnerDialog } from '@app/components/@atoms/InnerDialog'
import useDNSProof from '@app/hooks/useDNSProof'
import { makeTransactionItem } from '@app/transaction-flow/transaction'
import { TransactionDialogPassthrough } from '@app/transaction-flow/types'
import { shortenAddress } from '@app/utils/utils'

const Description = styled.div(
  () => css`
    text-align: center;
  `,
)

type Data = {
  name: string
  manager: `0x${string}`
}

export type Props = {
  data: Data
} & TransactionDialogPassthrough

const SyncManager = ({ data: { name, manager }, dispatch, onDismiss }: Props) => {
  const { t } = useTranslation('transactionFlow')
  const showWarning = true

  const canShow = true
  const canSend = true
  const { data, isLoading } = useDNSProof(name, !canShow || canSend)

  const onClickNext = () => {
    dispatch({
      name: 'setTransactions',
      payload: [
        makeTransactionItem('syncManager', {
          name,
          address: manager,
          proverResult: data,
        }),
      ],
    })
    dispatch({ name: 'setFlowStage', payload: 'transaction' })
  }

  if (isLoading) return null
  return (
    <>
      <Dialog.Heading title={t('input.syncManager.title')} />
      <InnerDialog>
        <Description>
          <Typography color="text">
            <Trans
              t={t}
              i18nKey="input.syncManager.description"
              values={{ manager: shortenAddress('0x70997970C51812dc3A010C7d01b50e0d17dc79C8') }}
            />
          </Typography>
        </Description>
        {showWarning && <Helper type="warning">{t('input.syncManager.warning')}</Helper>}
        <Dialog.Footer
          leading={
            <Button colorStyle="accentSecondary" onClick={onDismiss}>
              Cancel
            </Button>
          }
          trailing={<Button onClick={onClickNext}>Next</Button>}
        />
      </InnerDialog>
    </>
  )
}

export default SyncManager
