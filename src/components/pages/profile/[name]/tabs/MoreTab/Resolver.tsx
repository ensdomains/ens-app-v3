import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Tag, Typography, mq } from '@ensdomains/thorin'

import { cacheableComponentStyles } from '@app/components/@atoms/CacheableComponent'
import RecordItem from '@app/components/RecordItem'
import { useChainId } from '@app/hooks/useChainId'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { RESOLVER_ADDRESSES } from '@app/utils/constants'

import { TabWrapper } from '../../../TabWrapper'

const Container = styled(TabWrapper)(
  cacheableComponentStyles,
  ({ theme }) => css`
    width: 100%;
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

const HeadingContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    & > button {
      color: ${theme.colors.accent};
      font-weight: ${theme.fontWeights.bold};
      padding: 0 ${theme.space['2']};
    }
  `,
)

const InnerHeading = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: ${theme.space['4']};

    & > div:first-of-type {
      font-size: ${theme.fontSizes.headingThree};
      font-weight: ${theme.fontWeights.bold};
    }
  `,
)

const Resolver = ({
  name,
  canEdit,
  resolverAddress,
  isCachedData,
}: {
  name: string
  canEdit: boolean
  resolverAddress: string | undefined
  isCachedData: boolean
}) => {
  const { t } = useTranslation('profile')

  const chainId = useChainId()

  const { showDataInput } = useTransactionFlow()
  const handleEditClick = () => {
    showDataInput(`resolver-upgrade-${name}`, 'EditResolver', {
      name,
    })
  }

  const resolverAddressIndex = RESOLVER_ADDRESSES[`${chainId}`]?.indexOf(resolverAddress ?? '')
  const [resolverAddressType, tone] = useMemo(() => {
    if (resolverAddressIndex === -1) {
      return ['custom', 'secondary'] as const
    }
    if (resolverAddressIndex === 0) {
      return ['latest', 'green'] as const
    }
    return ['outdated', 'red'] as const
  }, [resolverAddressIndex])

  return (
    <Container $isCached={isCachedData}>
      <HeadingContainer>
        <InnerHeading>
          <Typography color="text" weight="bold">
            {t('tabs.more.resolver.label')}
          </Typography>
          <Tag tone={tone}>{t(`tabs.more.resolver.${resolverAddressType}`)}</Tag>
        </InnerHeading>
        {canEdit && (
          <button type="button" onClick={handleEditClick}>
            {t('action.edit', { ns: 'common' })}
          </button>
        )}
      </HeadingContainer>
      <RecordItem type="text" data-testid="resolver-address" value={resolverAddress || ''} />
    </Container>
  )
}

export default Resolver
