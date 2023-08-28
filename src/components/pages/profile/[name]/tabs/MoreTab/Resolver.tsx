import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Typography, mq } from '@ensdomains/thorin'

import { cacheableComponentStyles } from '@app/components/@atoms/CacheableComponent'
import { DisabledButtonWithTooltip } from '@app/components/@molecules/DisabledButtonWithTooltip'
import RecordItem from '@app/components/RecordItem'
import { useHasGlobalError } from '@app/hooks/errors/useHasGlobalError'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'

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

    ${mq.sm.min(css`
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
      font-size: ${theme.fontSizes.headingFour};
      font-weight: ${theme.fontWeights.bold};
    }
  `,
)

const Resolver = ({
  name,
  canEditResolver,
  canEdit,
  resolverAddress,
  isCachedData,
}: {
  name: string
  isWrapped: boolean
  canEditResolver: boolean
  canEdit: boolean
  resolverAddress: string | undefined
  isCachedData: boolean
}) => {
  const { t } = useTranslation('profile')

  const hasGlobalError = useHasGlobalError()

  const { prepareDataInput } = useTransactionFlow()
  const showEditResolverInput = prepareDataInput('EditResolver')
  const handleEditClick = () => {
    showEditResolverInput(`resolver-upgrade-${name}`, {
      name,
    })
  }

  return (
    <Container $isCached={isCachedData}>
      <HeadingContainer>
        <InnerHeading>
          <Typography color="text" fontVariant="headingFour" weight="bold">
            {t('tabs.more.resolver.label')}
          </Typography>
        </InnerHeading>
        {canEdit && !hasGlobalError && (
          <>
            {canEditResolver ? (
              <button
                style={{ cursor: 'pointer' }}
                type="button"
                onClick={handleEditClick}
                data-testid="edit-resolver-button"
              >
                {t('action.edit', { ns: 'common' })}
              </button>
            ) : (
              <DisabledButtonWithTooltip
                {...{
                  buttonId: 'set-resolver-disabled-button',
                  content: t(`errors.permissionRevoked`),
                  buttonText: 'Edit',
                  mobileWidth: 150,
                  buttonWidth: '15',
                  mobileButtonWidth: 'initial',
                  colorStyle: 'transparent',
                }}
              />
            )}
          </>
        )}
      </HeadingContainer>
      <RecordItem type="text" data-testid="resolver-address" value={resolverAddress || ''} />
    </Container>
  )
}

export default Resolver
