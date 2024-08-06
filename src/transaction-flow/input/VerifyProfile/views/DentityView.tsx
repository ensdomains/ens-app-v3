import { Dispatch } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { Hash } from 'viem'

import { Button, Dialog, Helper, Typography } from '@ensdomains/thorin'

import TrashSVG from '@app/assets/Trash.svg'
import { createTransactionItem } from '@app/transaction-flow/transaction'
import { TransactionFlowAction } from '@app/transaction-flow/types'

import { CenteredTypography } from '../../ProfileEditor/components/CenteredTypography'
import { createDentityAuthUrl } from '../utils/createDentityUrl'

const DeleteButton = styled.button(
  ({ theme }) => css`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: ${theme.space['2']};
    padding: ${theme.space['3']};
    margin: -${theme.space['3']} 0 0 0;

    color: ${theme.colors.redPrimary};
    transition:
      color 0.2s,
      transform 0.2s;
    cursor: pointer;

    svg {
      width: ${theme.space['4']};
      height: ${theme.space['4']};
      display: block;
    }

    &:hover {
      color: ${theme.colors.redBright};
      transform: translateY(-1px);
    }
  `,
)

const FooterWrapper = styled.div(
  () => css`
    margin-top: -12px;
    width: 100%;
  `,
)

export const DentityView = ({
  name,
  address,
  verified,
  resolverAddress,
  onBack,
  dispatch,
}: {
  name: string
  address: Hash
  verified: boolean
  resolverAddress: Hash
  onBack?: () => void
  dispatch: Dispatch<TransactionFlowAction>
}) => {
  const { t } = useTranslation('transactionFlow')

  // Clear transactions before going back
  const onBackAndCleanup = () => {
    dispatch({
      name: 'setTransactions',
      payload: [],
    })
    onBack?.()
  }

  const onRemoveVerification = () => {
    dispatch({
      name: 'setTransactions',
      payload: [
        createTransactionItem('removeVerificationRecord', {
          name,
          verifier: 'dentity',
          resolverAddress,
        }),
      ],
    })
    dispatch({
      name: 'setFlowStage',
      payload: 'transaction',
    })
  }

  return (
    <>
      <Dialog.Heading title={t('input.verifyProfile.dentity.title')} />
      <Dialog.Content>
        <CenteredTypography>{t('input.verifyProfile.dentity.description')}</CenteredTypography>
        <Helper>{t('input.verifyProfile.dentity.helper')}</Helper>
        {verified && (
          <DeleteButton
            onClick={onRemoveVerification}
            data-testid="remove-verification-button-Dentity"
          >
            <TrashSVG />
            <Typography fontVariant="bodyBold" color="inherit">
              {t('input.verifyProfile.dentity.remove')}
            </Typography>
          </DeleteButton>
        )}
      </Dialog.Content>
      <FooterWrapper>
        <Dialog.Footer
          leading={
            <Button onClick={onBackAndCleanup} colorStyle="accentSecondary">
              {t('action.back', { ns: 'common' })}
            </Button>
          }
          trailing={
            <Button as="a" href={createDentityAuthUrl({ name, address })} target="_blank">
              {t('input.verifyProfile.dentity.link')}
            </Button>
          }
        />
      </FooterWrapper>
    </>
  )
}
