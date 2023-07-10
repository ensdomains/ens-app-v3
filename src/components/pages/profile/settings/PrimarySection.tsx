import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, Card, CrossSVG, PersonPlusSVG, Skeleton, Typography, mq } from '@ensdomains/thorin'

import { AvatarWithLink } from '@app/components/@molecules/AvatarWithLink/AvatarWithLink'
import { DisabledButtonWithTooltip } from '@app/components/@molecules/DisabledButtonWithTooltip'
import { useHasGlobalError } from '@app/hooks/errors/useHasGlobalError'
import { useAccountSafely } from '@app/hooks/useAccountSafely'
import { useBasicName } from '@app/hooks/useBasicName'
import { usePrimary } from '@app/hooks/usePrimary'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'

const SkeletonFiller = styled.div(
  ({ theme }) => css`
    width: ${theme.space.full};
    border-radius: ${theme.radii['2xLarge']};
  `,
)

const NoNameContainer = styled.div(({ theme }) => [
  css`
    display: grid;
    grid:
      'title title' auto
      'description description' auto
      'button button' auto
      / 1fr 1fr;
    grid-row-gap: ${theme.space['4']};
  `,
  mq.sm.min(css`
    grid:
      'title button' auto
      'description description' auto
      / 1fr 1fr;
  `),
])

const NoNameTitle = styled(Typography)(({ theme }) => [
  css`
    grid-area: title;
  `,
  mq.sm.min(css`
    line-height: ${theme.space['10']};
  `),
])

const NoNameButton = styled(Button)(() => [
  css`
    grid-area: button;
  `,
  mq.sm.min(css`
    width: fit-content;
    justify-self: end;
  `),
])

const NoNameDisabledButtonContainer = styled.div(() => [
  css`
    grid-area: button;
  `,
  mq.sm.min(css`
    width: fit-content;
    justify-self: end;
  `),
])

const NoNameDescription = styled(Typography)(
  () => css`
    grid-area: description;
  `,
)

const PrimaryNameContainer = styled.div(({ theme }) => [
  css`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${theme.space['4']};
  `,
  mq.sm.min(css`
    flex-direction: row;
    gap: ${theme.space['6']};
  `),
])

const PrimaryNameInfo = styled.div(() => [
  css`
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
  `,
  mq.sm.min(css`
    align-items: flex-start;
    > div {
      text-align: left;
    }
  `),
])

const AvatarContainer = styled.div(({ theme }) => [
  css`
    width: ${theme.space['26']};
    height: ${theme.space['26']};
  `,
  mq.sm.min(css`
    order: -1;
  `),
])

const ActionsContainer = styled.div(({ theme }) => [
  css`
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: ${theme.space['2']};
  `,
  mq.sm.min(css`
    flex-direction: column-reverse;
    width: ${theme.space['40']};
  `),
])

export const PrimarySection = () => {
  const { t } = useTranslation('settings')

  const { address } = useAccountSafely()
  const { prepareDataInput } = useTransactionFlow()
  const showSelectPrimaryNameInput = prepareDataInput('SelectPrimaryName')
  const showResetPrimaryNameInput = prepareDataInput('ResetPrimaryName')

  const primary = usePrimary(address!, !address)

  const { truncatedName, isLoading: basicLoading } = useBasicName(primary.data?.name, {
    normalised: true,
    skipGraph: false,
  })

  const hasGlobalError = useHasGlobalError()

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
              {hasGlobalError ? (
                <>
                  <DisabledButtonWithTooltip
                    buttonId="disabled-reset-primary-name-button"
                    buttonText={t('action.remove', { ns: 'common' })}
                    content={t('errors.networkError.blurb', { ns: 'common' })}
                    prefix={<CrossSVG />}
                    size="medium"
                    mobilePlacement="top"
                  />
                  <DisabledButtonWithTooltip
                    buttonId="disabled-change-primary-name-button"
                    buttonText={t('action.change', { ns: 'common' })}
                    content={t('errors.networkError.blurb', { ns: 'common' })}
                    prefix={<PersonPlusSVG />}
                    size="medium"
                    mobilePlacement="top"
                  />
                </>
              ) : (
                <>
                  <Button
                    data-testid="reset-primary-name-button"
                    prefix={<CrossSVG />}
                    colorStyle="redSecondary"
                    onClick={resetPrimary}
                  >
                    {t('action.remove', { ns: 'common' })}
                  </Button>
                  <Button
                    data-testid="change-primary-name-button"
                    prefix={<PersonPlusSVG />}
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
            {hasGlobalError ? (
              <NoNameDisabledButtonContainer>
                <DisabledButtonWithTooltip
                  buttonId="disabled-set-primary-name-button"
                  buttonText={t('section.primary.choosePrimaryName')}
                  size="small"
                  content={t('errors.networkError.blurb', { ns: 'common' })}
                  prefix={<PersonPlusSVG />}
                  mobilePlacement="top"
                />
              </NoNameDisabledButtonContainer>
            ) : (
              <>
                <NoNameButton
                  data-testid="set-primary-name-button"
                  size="small"
                  prefix={<PersonPlusSVG />}
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
