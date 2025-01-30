import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { match, P } from 'ts-pattern'

import { Button, Typography } from '@ensdomains/thorin'

import { cacheableComponentStyles } from '@app/components/@atoms/CacheableComponent'
import { DisabledButtonWithTooltip } from '@app/components/@molecules/DisabledButtonWithTooltip'
import RecordItem from '@app/components/RecordItem'
import { useResolver } from '@app/hooks/ensjs/public/useResolver'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { emptyAddress } from '@app/utils/constants'
import { useHasGraphError } from '@app/utils/SyncProvider/SyncProvider'

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

    @media (min-width: ${theme.breakpoints.sm}px) {
      padding: ${theme.space['6']};
    }
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

const ButtonStack = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    gap: ${theme.space['4']};

    @media (max-width: 640px) {
      flex-direction: column;
    }
  `,
)

const Resolver = ({
  name,
  canEditResolver,
  canEdit,
  resolverAddress,
  isCachedData,
  canEditResolverError,
}: {
  name: string
  canEditResolver: boolean
  canEdit: boolean
  resolverAddress: string | undefined
  isCachedData: boolean
  canEditResolverError?: string
}) => {
  const { t } = useTranslation('profile')

  const { md } = useBreakpoint()

  const { data: hasGraphError, isLoading: hasGraphErrorLoading } = useHasGraphError()

  const { usePreparedDataInput } = useTransactionFlow()
  const showEditResolverInput = usePreparedDataInput('EditResolver')
  const handleEditClick = () => {
    showEditResolverInput(`resolver-upgrade-${name}`, {
      name,
    })
  }

  const resolverQuery = useResolver({
    name,
    enabled: !resolverAddress || resolverAddress === emptyAddress,
  })

  const registryOrSubgraphResolverAddress = match([resolverAddress, resolverQuery.data])
    .with(
      [P.union(emptyAddress, P.nullish), P._],
      ([, registryAddress]) => registryAddress || emptyAddress,
    )
    .otherwise(([subgraphResolver]) => subgraphResolver || emptyAddress)

  return (
    <Container $isCached={isCachedData}>
      <HeadingContainer>
        <InnerHeading>
          <Typography color="text" fontVariant="headingFour" weight="bold">
            {t('tabs.more.resolver.label')}
          </Typography>
        </InnerHeading>
      </HeadingContainer>
      <ButtonStack>
        <RecordItem
          type="text"
          data-testid="resolver-address"
          value={registryOrSubgraphResolverAddress || ''}
        />
        {canEdit && !hasGraphError && (
          <>
            {canEditResolver ? (
              <Button
                colorStyle="accentSecondary"
                size="small"
                type="button"
                width={md ? 'max' : 'full'}
                onClick={handleEditClick}
                data-testid="edit-resolver-button"
                loading={hasGraphErrorLoading}
                disabled={hasGraphErrorLoading}
              >
                {t('action.edit', { ns: 'common' })}
              </Button>
            ) : (
              <DisabledButtonWithTooltip
                {...{
                  buttonId: 'set-resolver-disabled-button',
                  content: t(`errors.${canEditResolverError || 'default'}`),
                  buttonText: 'Edit',
                  mobileWidth: 150,
                  buttonWidth: '15',
                  mobileButtonWidth: 'initial',
                  colorStyle: 'disabled',
                  loading: hasGraphErrorLoading,
                }}
              />
            )}
          </>
        )}
      </ButtonStack>
    </Container>
  )
}

export default Resolver
