import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, Tag, Typography, mq } from '@ensdomains/thorin'

import AeroplaneSVG from '@app/assets/Aeroplane.svg'
import { cacheableComponentStyles } from '@app/components/@atoms/CacheableComponent'
import { AvatarWithZorb } from '@app/components/AvatarWithZorb'
import { useChainId } from '@app/hooks/useChainId'
import useOwners from '@app/hooks/useOwners'
import { usePrimary } from '@app/hooks/usePrimary'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
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
      border-bottom: 1px solid ${theme.colors.borderSecondary};

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
    font-size: ${theme.fontSizes.base};
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
    <Link passHref href={`/address/${address}`}>
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
            {primary && <Typography>{shortenAddress(address)}</Typography>}
          </TextContainer>
        </OwnerDetailContainer>
        <Tag tone="accent">{t(label)}</Tag>
      </OwnerContainer>
    </Link>
  )
}

const Ownership = ({
  name,
  owners,
  canSend,
  isCachedData,
}: {
  name: string
  owners: ReturnType<typeof useOwners>
  canSend: boolean
  isCachedData: boolean
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
        <Typography>{t('tabs.more.ownership.label')}</Typography>
        <div>
          {canSend && (
            <Button
              size="small"
              prefix={<AeroplaneIcon as={AeroplaneSVG} />}
              onClick={handleSend}
              shadowless
            >
              {t('action.send', { ns: 'common' })}
            </Button>
          )}
        </div>
      </HeadingContainer>
      {owners.map((owner) => (
        <Owner key={`${owner.address}-${owner.label}`} {...owner} />
      ))}
    </Container>
  )
}

export default Ownership
