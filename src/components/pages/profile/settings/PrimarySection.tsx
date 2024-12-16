import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, Card, CrossSVG, PersonPlusSVG, Skeleton, Typography } from '@ensdomains/thorin'

import { AvatarWithLink } from '@app/components/@molecules/AvatarWithLink/AvatarWithLink'
import { DisabledButtonWithTooltip } from '@app/components/@molecules/DisabledButtonWithTooltip'
import { useAccountSafely } from '@app/hooks/account/useAccountSafely'
import { usePrimaryName } from '@app/hooks/ensjs/public/usePrimaryName'
import { useBasicName } from '@app/hooks/useBasicName'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { useHasGraphError } from '@app/utils/SyncProvider/SyncProvider'

const SkeletonFiller = styled.div(
  ({ theme }) => css`
    width: ${theme.space.full};
    border-radius: ${theme.radii['2xLarge']};
  `,
)

const NoNameContainer = styled.div(
  ({ theme }) => css`
    display: grid;
    grid:
      'title title' auto
      'description description' auto
      'button button' auto
      / 1fr 1fr;
    grid-row-gap: ${theme.space['4']};

    @media (min-width: ${theme.breakpoints.sm}px) {
      grid:
        'title button' auto
        'description description' auto
        / 1fr 1fr;
    }
  `,
)

const NoNameTitle = styled(Typography)(
  ({ theme }) => css`
    grid-area: title;
    @media (min-width: ${theme.breakpoints.sm}px) {
      line-height: ${theme.space['10']};
    }
  `,
)

const NoNameButton = styled(Button)(
  ({ theme }) => css`
    grid-area: button;
    @media (min-width: ${theme.breakpoints.sm}px) {
      width: fit-content;
      justify-self: end;
    }
  `,
)

const NoNameDisabledButtonContainer = styled.div(
  ({ theme }) => css`
    grid-area: button;
    @media (min-width: ${theme.breakpoints.sm}px) {
      width: fit-content;
      justify-self: end;
    }
  `,
)

const NoNameDescription = styled(Typography)(
  () => css`
    grid-area: description;
  `,
)

const PrimaryNameContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${theme.space['4']};
    @media (min-width: ${theme.breakpoints.sm}px) {
      flex-direction: row;
      gap: ${theme.space['6']};
    }
  `,
)

const PrimaryNameInfo = styled.div(
  ({ theme }) => css`
    display: flex;
    width: 100%;
    position: relative;
    flex-direction: column;
    align-items: center;
    flex: 1;
    overflow: hidden;
    > div {
      width: 100%;
      text-align: center;
    }
    @media (min-width: ${theme.breakpoints.sm}px) {
      align-items: flex-start;
      > div {
        text-align: left;
      }
    }
  `,
)

const AvatarContainer = styled.div(
  ({ theme }) => css`
    width: ${theme.space['26']};
    height: ${theme.space['26']};
    @media (min-width: ${theme.breakpoints.sm}px) {
      order: -1;
    }
  `,
)

const ActionsContainer = styled.div(
  ({ theme }) => css`
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: ${theme.space['2']};
    @media (min-width: ${theme.breakpoints.sm}px) {
      flex-direction: column-reverse;
      width: ${theme.space['40']};
    }
  `,
)

export const PrimarySection = () => {
  const { t } = useTranslation('settings')

  const { address } = useAccountSafely()
  const { usePreparedDataInput } = useTransactionFlow()
  const showSelectPrimaryNameInput = usePreparedDataInput('SelectPrimaryName')
  const showResetPrimaryNameInput = usePreparedDataInput('ResetPrimaryName')

  const primary = usePrimaryName({ address })

  const { truncatedName, isLoading: basicLoading } = useBasicName({
    name: primary.data?.name,
    normalised: true,
  })

  const { data: hasGraphError, isLoading: hasGraphErrorLoading } = useHasGraphError()

  const isLoading = basicLoading || primary.isLoading

  const changePrimary = () => {
    showSelectPrimaryNameInput(`changePrimary-${address}`, {
      address: address!,
    })
  }

  const resetPrimary = () => {
    if (!address) return
    showResetPrimaryNameInput(`resetPrimary-${address}`, {
      name: primary.data?.name!,
      address,
    })
  }

  return (
    <Skeleton loading={isLoading} as={SkeletonFiller as any}>
      <Card>
        {primary.data?.name ? (
          <PrimaryNameContainer data-testid="primary-name-section">
            <PrimaryNameInfo>
              <Typography fontVariant="bodyBold" color="grey">
                {t('section.primary.title')}
              </Typography>
              <Typography data-testid="primary-name-label" fontVariant="headingTwo" ellipsis>
                {truncatedName}
              </Typography>
            </PrimaryNameInfo>
            <AvatarContainer>
              <AvatarWithLink name={primary.data?.name} label="primary name avatar" />
            </AvatarContainer>
            <ActionsContainer>
              {hasGraphError ? (
                <>
                  <DisabledButtonWithTooltip
                    buttonId="disabled-reset-primary-name-button"
                    buttonText={t('action.remove', { ns: 'common' })}
                    content={t('errors.networkError.blurb', { ns: 'common' })}
                    prefix={CrossSVG}
                    size="medium"
                    mobilePlacement="top"
                    loading={hasGraphErrorLoading}
                  />
                  <DisabledButtonWithTooltip
                    buttonId="disabled-change-primary-name-button"
                    buttonText={t('action.change', { ns: 'common' })}
                    content={t('errors.networkError.blurb', { ns: 'common' })}
                    prefix={PersonPlusSVG}
                    size="medium"
                    mobilePlacement="top"
                    loading={hasGraphErrorLoading}
                  />
                </>
              ) : (
                <>
                  <Button
                    data-testid="reset-primary-name-button"
                    prefix={CrossSVG}
                    colorStyle="redSecondary"
                    disabled={hasGraphErrorLoading}
                    loading={hasGraphErrorLoading}
                    onClick={resetPrimary}
                  >
                    {t('action.remove', { ns: 'common' })}
                  </Button>
                  <Button
                    data-testid="change-primary-name-button"
                    prefix={PersonPlusSVG}
                    disabled={hasGraphErrorLoading}
                    loading={hasGraphErrorLoading}
                    onClick={changePrimary}
                  >
                    {t('action.change', { ns: 'common' })}
                  </Button>
                </>
              )}
            </ActionsContainer>
          </PrimaryNameContainer>
        ) : (
          <NoNameContainer data-testid="no-primary-name-section">
            <NoNameTitle fontVariant="headingFour">{t('section.primary.title')}</NoNameTitle>
            {hasGraphError ? (
              <NoNameDisabledButtonContainer>
                <DisabledButtonWithTooltip
                  buttonId="disabled-set-primary-name-button"
                  buttonText={t('section.primary.choosePrimaryName')}
                  size="small"
                  content={t('errors.networkError.blurb', { ns: 'common' })}
                  prefix={PersonPlusSVG}
                  mobilePlacement="top"
                  loading={hasGraphErrorLoading}
                />
              </NoNameDisabledButtonContainer>
            ) : (
              <>
                <NoNameButton
                  data-testid="set-primary-name-button"
                  size="small"
                  prefix={PersonPlusSVG}
                  loading={hasGraphErrorLoading}
                  disabled={hasGraphErrorLoading}
                  onClick={changePrimary}
                >
                  {t('section.primary.choosePrimaryName')}
                </NoNameButton>
              </>
            )}
            <NoNameDescription>{t('section.primary.noNameDescription')}</NoNameDescription>
          </NoNameContainer>
        )}
      </Card>
    </Skeleton>
  )
}
