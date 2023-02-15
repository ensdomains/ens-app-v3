import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useAccount, useQueryClient } from 'wagmi'

import { Button, Helper, Tag, Typography, mq } from '@ensdomains/thorin'

import AeroplaneSVG from '@app/assets/Aeroplane.svg'
import BaseLink from '@app/components/@atoms/BaseLink'
import { cacheableComponentStyles } from '@app/components/@atoms/CacheableComponent'
import { DisabledButtonWithTooltip } from '@app/components/@molecules/DisabledButtonWithTooltip'
import { AvatarWithZorb } from '@app/components/AvatarWithZorb'
import { useChainId } from '@app/hooks/useChainId'
import useDNSProof from '@app/hooks/useDNSProof'
import useOwners from '@app/hooks/useOwners'
import { usePrimary } from '@app/hooks/usePrimary'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { makeIntroItem } from '@app/transaction-flow/intro'
import { makeTransactionItem } from '@app/transaction-flow/transaction'
import { shortenAddress } from '@app/utils/utils'

import { TabWrapper } from '../../../TabWrapper'

const Container = styled(TabWrapper)(
  cacheableComponentStyles,
  ({ theme }) => css`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
    overflow: hidden;

    & > * {
      border-bottom: 1px solid ${theme.colors.border};

      &:last-child {
        border-bottom: none;
      }
    }
  `,
)

const HeadingContainer = styled.div(
  ({ theme }) => css`
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    padding: ${theme.space['4']};

    font-weight: ${theme.fontWeights.bold};
    font-size: ${theme.fontSizes.headingThree};

    ${mq.md.min(css`
      padding: ${theme.space['6']};
    `)}
  `,
)

const AeroplaneIcon = styled.svg(
  ({ theme }) => css`
    display: block;
    width: ${theme.space['4']};
    height: ${theme.space['4']};
  `,
)

const OwnerContainer = styled.div(
  ({ theme }) => css`
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    padding: ${theme.space['4']};

    transition: background-color 0.2s ease-in-out;

    &:hover {
      background-color: ${theme.colors.backgroundSecondary};
    }

    ${mq.md.min(css`
      padding: ${theme.space['4']} ${theme.space['6']};
    `)}
  `,
)

const Name = styled(Typography)(
  ({ theme }) => css`
    color: ${theme.colors.text};
    font-weight: ${theme.fontWeights.bold};
    font-size: ${theme.fontSizes.body};
  `,
)

const TextContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 0;

    & > div:last-of-type {
      font-size: ${theme.fontSizes.small};
      color: ${theme.colors.textTertiary};
    }
  `,
)

const OwnerDetailContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: ${theme.space['2']};
  `,
)

const Owner = ({ address, label }: ReturnType<typeof useOwners>[0]) => {
  const { t } = useTranslation('common')
  const { name: primary } = usePrimary(address)
  const network = useChainId()

  return (
    <BaseLink passHref href={`/address/${address}`}>
      <OwnerContainer as="a">
        <OwnerDetailContainer>
          <AvatarWithZorb
            label={primary || address}
            address={address}
            name={primary || undefined}
            size="10"
            network={network}
          />
          <TextContainer>
            <Name ellipsis data-testid={`owner-button-name-${label}`}>
              {primary || shortenAddress(address)}
            </Name>
            {primary && (
              <Typography data-testid={`owner-button-address-${label}`}>
                {shortenAddress(address)}
              </Typography>
            )}
          </TextContainer>
        </OwnerDetailContainer>
        <Tag colorStyle="accentSecondary">{t(label)}</Tag>
      </OwnerContainer>
    </BaseLink>
  )
}

const DNSOwnerSectionContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
    gap: ${theme.space['4']};
    padding: ${theme.space['4']};

    ${mq.md.min(css`
      padding: ${theme.space['6']};
    `)}
  `,
)

const ButtonsContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    gap: ${theme.space['4']};
  `,
)

const DNSOwnerSection = ({
  name,
  owners,
  canSend,
  isWrapped,
}: {
  name: string
  owners: ReturnType<typeof useOwners>
  canSend: boolean
  isWrapped: boolean
}) => {
  const { address } = useAccount()
  const { t } = useTranslation('profile')
  const { createTransactionFlow } = useTransactionFlow()
  const { resetQueries } = useQueryClient()

  const canShow = useMemo(() => {
    let hasMatchingAddress = false
    let hasMismatchingAddress = false
    let hasDNSOwner = false
    for (const owner of owners) {
      if (owner.address === address) {
        hasMatchingAddress = true
      } else {
        hasMismatchingAddress = true
      }
      if (owner.label === 'name.dnsOwner') {
        hasDNSOwner = true
      }
    }
    return hasMatchingAddress && hasMismatchingAddress && hasDNSOwner
  }, [owners, address])

  const { data, isLoading } = useDNSProof(name, !canShow || canSend)

  const handleSyncManager = () => {
    const currentManager = owners.find((owner) => owner.label === 'name.manager')

    createTransactionFlow(`sync-manager-${name}-${address}`, {
      intro: {
        title: t('tabs.more.ownership.dnsOwnerWarning.syncManager'),
        content: makeIntroItem('SyncManager', { isWrapped, manager: currentManager!.address }),
      },
      transactions: [
        makeTransactionItem('syncManager', { address: address!, name, proverResult: data! }),
      ],
    })
  }

  const handleRefresh = () => {
    resetQueries({ exact: true, queryKey: ['getDNSOwner', name] })
  }

  if (!canShow) return null

  return (
    <DNSOwnerSectionContainer>
      <Helper type="warning" alignment="horizontal">
        {t(`tabs.more.ownership.dnsOwnerWarning.${canSend ? 'isManager' : 'isDnsOwner'}`)}
      </Helper>
      <ButtonsContainer>
        <Button width="auto" colorStyle="accentSecondary" onClick={handleRefresh}>
          Refresh DNS
        </Button>
        {!canSend && (
          <Button width="auto" onClick={handleSyncManager} loading={isLoading} disabled={!data}>
            {t('tabs.more.ownership.dnsOwnerWarning.syncManager')}
          </Button>
        )}
      </ButtonsContainer>
    </DNSOwnerSectionContainer>
  )
}

const Ownership = ({
  name,
  owners,
  canSend,
  canSendError,
  isCachedData,
  isWrapped,
}: {
  name: string
  owners: ReturnType<typeof useOwners>
  canSend: boolean
  canSendError?: string
  isCachedData: boolean
  isWrapped: boolean
}) => {
  const { t } = useTranslation('profile')

  const { showDataInput } = useTransactionFlow()

  const handleSend = () => {
    showDataInput(`send-name-${name}`, 'SendName', {
      name,
    })
  }

  return (
    <Container $isCached={isCachedData}>
      <HeadingContainer>
        <Typography fontVariant="headingThree">{t('tabs.more.ownership.label')}</Typography>
        <div>
          {canSend && (
            <Button
              size="small"
              prefix={<AeroplaneIcon as={AeroplaneSVG} />}
              onClick={handleSend}
              data-testid="send-name-button"
            >
              {t('action.send', { ns: 'common' })}
            </Button>
          )}
          {!canSend && canSendError && (
            <DisabledButtonWithTooltip
              {...{
                content: t(`errors.${canSendError}`),
                buttonId: 'send-name-disabled-button',
                buttonText: t('action.send', { ns: 'common' }),
                mobileWidth: 150,
                buttonWidth: 'initial',
                mobileButtonWidth: 'initial',
                prefix: <AeroplaneIcon as={AeroplaneSVG} />,
              }}
            />
          )}
        </div>
      </HeadingContainer>
      {owners.map((owner) => (
        <Owner key={`${owner.address}-${owner.label}`} {...owner} />
      ))}
      <DNSOwnerSection {...{ name, owners, canSend, isWrapped }} />
    </Container>
  )
}

export default Ownership
