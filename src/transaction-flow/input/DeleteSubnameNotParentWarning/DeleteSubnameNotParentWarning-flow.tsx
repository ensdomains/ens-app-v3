import { Trans, useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { Address } from 'viem'

import { Button, Dialog, mq } from '@ensdomains/thorin'

import { TransComponentName } from '@app/components/@atoms/Name2/Name'
import { usePrimaryNameOrAddress } from '@app/hooks/reverseRecord/usePrimaryNameOrAddress'
import { useNameDetails } from '@app/hooks/useNameDetails'
import { useOwners } from '@app/hooks/useOwners'
import { createTransactionItem } from '@app/transaction-flow/transaction'
import TransactionLoader from '@app/transaction-flow/TransactionLoader'
import { TransactionDialogPassthrough } from '@app/transaction-flow/types'
import { parentName } from '@app/utils/name'

import { CenterAlignedTypography } from '../RevokePermissions/components/CenterAlignedTypography'

const MessageContainer = styled(CenterAlignedTypography)(({ theme }) => [
  css`
    width: 100%;
    position: relative;
    overflow: hidden;
  `,
  mq.sm.min(css`
    width: calc(80vw - 2 * ${theme.space['6']});
    max-width: ${theme.space['128']};
  `),
])

type Data = {
  name: string
  contract: 'registry' | 'nameWrapper'
}

export type Props = {
  data: Data
} & TransactionDialogPassthrough

const DeleteSubnameNotParentWarning = ({ data, dispatch, onDismiss }: Props) => {
  const { t } = useTranslation('transactionFlow')

  const {
    ownerData: parentOwnerData,
    wrapperData: parentWrapperData,
    dnsOwner,
    isLoading: parentBasicLoading,
  } = useNameDetails({ name: parentName(data.name) })

  const [ownerTarget] = useOwners({
    ownerData: parentOwnerData!,
    wrapperData: parentWrapperData!,
    dnsOwner,
  })
  const { data: parentPrimaryOrAddress, isLoading: parentPrimaryLoading } = usePrimaryNameOrAddress(
    {
      address: ownerTarget?.address as Address,
      enabled: !!ownerTarget,
    },
  )
  const isLoading = parentBasicLoading || parentPrimaryLoading

  const handleDelete = () => {
    dispatch({
      name: 'setTransactions',
      payload: [
        createTransactionItem('deleteSubname', {
          name: data.name,
          contract: data.contract,
          method: 'setRecord',
        }),
      ],
    })
    dispatch({ name: 'setFlowStage', payload: 'transaction' })
  }

  if (isLoading) return <TransactionLoader />

  return (
    <>
      <Dialog.Heading title={t('input.deleteSubnameNotParentWarning.title')} alert="error" />
      <MessageContainer>
        <Trans
          i18nKey="input.deleteSubnameNotParentWarning.message"
          ns="transactionFlow"
          components={{
            b: <strong />,
            nameComponent: <TransComponentName type="wrap" wrapLines={2} minInitialWidth={100} />,
          }}
          values={{
            ownershipTerm: t(ownerTarget.label, { ns: 'common' }).toLocaleLowerCase(),
            parentOwner: parentPrimaryOrAddress.nameOrAddr,
          }}
        />
      </MessageContainer>
      <Dialog.Footer
        leading={
          <Button colorStyle="accentSecondary" onClick={onDismiss}>
            {t('action.cancel', { ns: 'common' })}
          </Button>
        }
        trailing={
          <Button
            colorStyle="redPrimary"
            onClick={handleDelete}
            data-testid="delete-subname-not-parent-button"
          >
            {t('action.understand', { ns: 'common' })}
          </Button>
        }
      />
    </>
  )
}

export default DeleteSubnameNotParentWarning
