import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useAccount } from 'wagmi'

import { Banner, Button, mq, Typography } from '@ensdomains/thorin'

import { createTransactionItem } from '@app/transaction-flow/transaction'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'

const StyledButton = styled(Button)(
  ({ theme }) => css`
    width: 100%;

    ${mq.md.min(css`
      width: auto;
      margin-top: -25px;
    `)}
  `,
)

const Container = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space['4']};

    ${mq.md.min(css`
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    `)}
  `,
)

const handleSyncClick =
  (
    resumable: boolean,
    resumeTransactionFlow: ReturnType<typeof useTransactionFlow>['resumeTransactionFlow'],
    createTransactionFlow: ReturnType<typeof useTransactionFlow>['createTransactionFlow'],
    key: string,
    normalisedName: string,
  ) =>
  () => {
    if (resumable) resumeTransactionFlow(key)
    return createTransactionFlow(key, {
      transactions: [createTransactionItem('syncWrappedExpiry', { name: normalisedName })],
    })
  }

export const NameExpiryDesyncBanner = ({ normalisedName }: { normalisedName: string }) => {
  const { t } = useTranslation('profile', { keyPrefix: 'banner.expiryDesync' })

  const { isConnected } = useAccount()
  const { createTransactionFlow, resumeTransactionFlow, getResumable } = useTransactionFlow()

  const key = `wrapExpirySync-${normalisedName}`
  const resumable = getResumable(key)

  const _handleSyncClick = handleSyncClick(
    resumable,
    resumeTransactionFlow,
    createTransactionFlow,
    key,
    normalisedName,
  )

  return (
    <Banner alert="error" title={t('title')}>
      <Container>
        <Typography>{t('description')}</Typography>
        {isConnected ? (
          <StyledButton colorStyle="redPrimary" onClick={_handleSyncClick}>
            {t('actionLabel')}
          </StyledButton>
        ) : null}
      </Container>
    </Banner>
  )
}
