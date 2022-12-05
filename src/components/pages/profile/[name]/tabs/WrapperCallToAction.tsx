import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useAccount } from 'wagmi'

import { Button, Typography, mq } from '@ensdomains/thorin'

import { NightSky } from '@app/assets/NightSky'
import SparklesSVG from '@app/assets/Sparkles.svg'
import { Card } from '@app/components/Card'
import { useNameDetails } from '@app/hooks/useNameDetails'
import useWrapperApprovedForAll from '@app/hooks/useWrapperApprovedForAll'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { makeIntroItem } from '@app/transaction-flow/intro'
import { makeTransactionItem } from '@app/transaction-flow/transaction'
import { GenericTransaction } from '@app/transaction-flow/types'

const Container = styled(Card)(
  ({ theme }) => css`
    flex-direction: column;
    align-items: center;
    gap: ${theme.space['3']};
    padding: ${theme.space['3']};

    ${mq.md.min(css`
      flex-direction: row;
      padding-right: ${theme.space['5']};
    `)}
  `,
)

const InnerContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: ${theme.space.full};

    padding: 0 ${theme.space['2']};
    padding-top: ${theme.space['1']};

    ${mq.md.min(css`
      flex-grow: 1;
      flex-direction: row-reverse;
      justify-content: flex-end;
      gap: ${theme.space['6']};
      padding: ${theme.space['2']};
    `)}
  `,
)

const Heading = styled(Typography)(
  ({ theme }) => css`
    color: ${theme.colors.background};
    line-height: ${theme.lineHeights.normal};
  `,
)

const Subheading = styled(Typography)(
  ({ theme }) => css`
    color: ${theme.colors.background};
    opacity: 0.8;
  `,
)

const Sparkles = styled.svg(
  ({ theme }) => css`
    width: ${theme.space['12']};
    height: ${theme.space['12']};
  `,
)

const TextContainer = styled.div(
  () => css`
    width: fit-content;
  `,
)

const UpgradeButton = styled(Button)(
  ({ theme }) => css`
    background: ${theme.colors.backgroundTertiary};
    color: ${theme.colors.foreground};
    &:hover {
      background: ${theme.colors.background};
    }
    ${mq.md.min(css`
      max-width: ${theme.space['64']};
      height: ${theme.space.full};
    `)}
  `,
)

export const WrapperCallToAction = ({ name }: { name: string }) => {
  const { t } = useTranslation('profile')

  const { address } = useAccount()
  const { ownerData, profile, isLoading: isNameDetailsLoading } = useNameDetails(name)
  const hasOwnerData = !!ownerData && !isNameDetailsLoading
  const isOwner = ownerData?.owner === address
  const resolverAddress = profile?.resolverAddress

  const hasExistingRecords = useMemo(() => {
    if (profile?.records) {
      if (profile.records.contentHash) return true
      if (Object.keys(profile.records.coinTypes || {}).length > 0) return true
      if (Object.keys(profile.records.texts || {}).length > 0) return true
    }
    return false
  }, [profile])

  const isSubdomain = name.split('.').length > 2
  const { approvedForAll, isLoading: approvalLoading } = useWrapperApprovedForAll(
    address!,
    isSubdomain,
  )

  const { createTransactionFlow, resumeTransactionFlow, getResumable } = useTransactionFlow()
  const resumable = getResumable(`wrapName-${name}`)

  const handleUpgradeClick = () => {
    if (resumable) return resumeTransactionFlow(`wrapName-${name}`)
    if (hasOwnerData) {
      const transactions: GenericTransaction[] = [
        makeTransactionItem('wrapName', {
          name,
        }),
      ]
      if (isOwner) {
        if (hasExistingRecords) {
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
      } else if (!isSubdomain && hasExistingRecords) {
        transactions.push(
          makeTransactionItem('migrateProfile', {
            name,
            resolverAddress,
          }),
        )
      }
      return createTransactionFlow(`wrapName-${name}`, {
        transactions,
        resumable: true,
        intro: {
          title: t('details.wrap.startTitle'),
          content: makeIntroItem('WrapName', { name }),
        },
      })
    }
  }

  return (
    <NightSky>
      <Container data-testid="wrapper-cta-container">
        <InnerContainer>
          <TextContainer>
            <Heading variant="extraLarge" weight="bold">
              {t('details.wrap.boxTitle')}
            </Heading>
            <Subheading>{t('details.wrap.boxDescription')}</Subheading>
          </TextContainer>
          <Sparkles as={SparklesSVG} />
        </InnerContainer>
        <UpgradeButton
          data-testid="wrapper-cta-button"
          disabled={approvalLoading}
          shadowless
          onClick={handleUpgradeClick}
        >
          {resumable ? t('details.wrap.resumeLabel') : t('details.wrap.startLabel')}
        </UpgradeButton>
      </Container>
    </NightSky>
  )
}
