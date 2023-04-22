import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useAccount } from 'wagmi'

import { checkIsDecrypted } from '@ensdomains/ensjs/utils/labels'
import { Button, Typography, mq } from '@ensdomains/thorin'

import { NightSky } from '@app/assets/NightSky'
import SparklesSVG from '@app/assets/Sparkles.svg'
import { Card } from '@app/components/Card'
import { useChainId } from '@app/hooks/useChainId'
import { useNameDetails } from '@app/hooks/useNameDetails'
import useWrapperApprovedForAll from '@app/hooks/useWrapperApprovedForAll'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { makeIntroItem } from '@app/transaction-flow/intro'
import { makeTransactionItem } from '@app/transaction-flow/transaction'
import { GenericTransaction, TransactionFlowItem } from '@app/transaction-flow/types'
import { NAMEWRAPPER_AWARE_RESOLVERS } from '@app/utils/constants'

const Container = styled(Card)(
  ({ theme }) => css`
    flex-direction: column;
    align-items: center;
    gap: ${theme.space['3']};
    padding: ${theme.space['3']};

    ${mq.sm.min(css`
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

    ${mq.sm.min(css`
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
    line-height: ${theme.lineHeights.body};
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
    background: rgba(255, 255, 255, 0.25);
    color: ${theme.colors.backgroundPrimary};
    &:hover {
      background: rgba(255, 255, 255, 0.45);
    }
    ${mq.sm.min(css`
      max-width: 40%;
    `)}
  `,
)

export const WrapperCallToAction = ({ name }: { name: string }) => {
  const { t } = useTranslation('profile')

  const { address } = useAccount()
  const chainId = useChainId()
  const { ownerData, profile, isLoading: isNameDetailsLoading } = useNameDetails(name)
  const hasOwnerData = !!ownerData && !isNameDetailsLoading
  const isOwner = ownerData?.owner === address
  const resolverAddress = profile?.resolverAddress

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
    isSubdomain,
  )

  const { createTransactionFlow, resumeTransactionFlow, getResumable, prepareDataInput } =
    useTransactionFlow()
  const showUnknownLabelsInput = prepareDataInput('UnknownLabels')
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

  return (
    <NightSky>
      <Container data-testid="wrapper-cta-container">
        <InnerContainer>
          <TextContainer>
            <Heading fontVariant="extraLargeBold">{t('details.wrap.boxTitle')}</Heading>
            <Subheading>{t('details.wrap.boxDescription')}</Subheading>
          </TextContainer>
          <Sparkles as={SparklesSVG} />
        </InnerContainer>
        <UpgradeButton
          data-testid="wrapper-cta-button"
          disabled={approvalLoading}
          size="medium"
          onClick={handleUpgradeClick}
        >
          {resumable ? t('details.wrap.resumeLabel') : t('details.wrap.startLabel')}
        </UpgradeButton>
      </Container>
    </NightSky>
  )
}
