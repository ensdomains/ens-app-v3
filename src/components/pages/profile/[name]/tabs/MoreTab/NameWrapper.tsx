import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { match, P } from 'ts-pattern'
import { Address } from 'viem'

import { GetOwnerReturnType, GetWrapperDataReturnType } from '@ensdomains/ensjs/public'
import { AlertSVG, CheckSVG, LockSVG, Typography } from '@ensdomains/thorin'

import { cacheableComponentStyles } from '@app/components/@atoms/CacheableComponent'
import { DisabledButtonWithTooltip } from '@app/components/@molecules/DisabledButtonWithTooltip'
import { QuestionTooltip } from '@app/components/@molecules/QuestionTooltip/QuestionTooltip'
import type { NameWrapperState } from '@app/hooks/fuses/useFusesStates'
import type { Profile } from '@app/types'

import { TabWrapper } from '../../../TabWrapper'
import UnwrapButton from './Token/UnwrapButton'
import WrapButton from './Token/WrapButton'

type Props = {
  name: string
  isWrapped: boolean
  canBeWrapped: boolean
  ownerData?: GetOwnerReturnType
  wrapperData?: GetWrapperDataReturnType
  profile?: Profile
  address?: Address
}

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

const TwoRows = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    gap: ${theme.space['4']};
    justify-content: space-between;
  `,
)

const Record = styled.div(
  ({ theme }) => css`
    padding: ${theme.space[3]};
    background: ${theme.colors.greenSurface};
    border-radius: ${theme.radii.input};
    width: ${theme.space.full};
    color: ${theme.colors.text};
    font-weight: ${theme.fontWeights.bold};
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    & > svg {
      color: ${theme.colors.green};
    }
  `,
)

const ParentControlRecord = styled(Record)<{ $isPCC: boolean }>(
  ({ theme, $isPCC }) => css`
    background: ${$isPCC ? theme.colors.greenSurface : theme.colors.yellowSurface};
    & > svg {
      color: ${$isPCC ? theme.colors.green : theme.colors.yellow};
    }
  `,
)

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const Header = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    gap: ${theme.space[2]};
  `,
)

const getFuseStateFromWrapperData = (wrapperData?: GetWrapperDataReturnType): NameWrapperState =>
  match(wrapperData)
    .with(P.nullish, () => 'unwrapped' as const)
    .with({ fuses: { child: { CANNOT_UNWRAP: true } } }, () => 'locked' as const)
    .with({ fuses: { parent: { PARENT_CANNOT_CONTROL: true } } }, () => 'emancipated' as const)
    .otherwise(() => 'wrapped')

export const NameWrapper = ({
  name,
  isWrapped,
  ownerData,
  wrapperData,
  canBeWrapped: _canBeWrapped,
  profile,
  address,
}: Props) => {
  const { t } = useTranslation('profile')

  const status = getFuseStateFromWrapperData(wrapperData)

  const isManager = ownerData?.owner === address
  const isRegistrant = ownerData?.registrant === address

  const isOwned = ownerData?.ownershipLevel === 'registrar' ? isRegistrant : isManager

  const isButtonDisplayed = isOwned && !!address

  const canBeWrapped = _canBeWrapped && !!address && isOwned

  const isPCC = !!wrapperData?.fuses?.parent?.PARENT_CANNOT_CONTROL

  return (
    <Container>
      <HeaderContainer>
        <Header>
          <Typography fontVariant="headingFour">{t('tabs.more.token.nameWrapper')}</Typography>
          <QuestionTooltip content={t('tabs.more.token.tooltip')} />
        </Header>

        {match({ isButtonDisplayed, isWrapped, status })
          .with({ isButtonDisplayed: true, isWrapped: true, status: 'locked' }, () => (
            <DisabledButtonWithTooltip
              buttonText={t('tabs.more.token.unwrap')}
              content={t('tabs.more.token.unwrapWarning')}
              buttonId="cannot-unwrap-disabled-button"
              buttonWidth="max"
              placement="top"
            />
          ))
          .with({ isButtonDisplayed: true, isWrapped: true }, () => (
            <UnwrapButton status={status} {...{ name, ownerData }} />
          ))
          .with({ isButtonDisplayed: true, isWrapped: false }, () => (
            <WrapButton {...{ profile, ownerData, canBeWrapped, name, isManager, isRegistrant }} />
          ))
          .with({ isButtonDisplayed: false, isWrapped: false }, () => null)
          .otherwise(() => null)}
      </HeaderContainer>

      {match({ ownedAndCanWrap: isOwned && canBeWrapped, isWrapped })
        .with({ ownedAndCanWrap: true }, () => <>{t('tabs.more.token.unwrappedText')}</>)
        .with({ ownedAndCanWrap: false, isWrapped: true }, () => (
          <TwoRows>
            <Record data-testid="namewrapper-status">
              {t('tabs.more.token.status.wrapped')}
              {status === 'locked' ? (
                <LockSVG height="16" width="16" data-testid="namewrapper-lock-icon" />
              ) : (
                <CheckSVG height="16" width="16" data-testid="namewrapper-check-icon" />
              )}
            </Record>
            <ParentControlRecord data-testid="pcc-status" $isPCC={isPCC}>
              {isPCC ? (
                <>
                  {t('tabs.more.token.pcc.not-controllable')}{' '}
                  <CheckSVG height="16" width="16" data-testid="npc-icon" />
                </>
              ) : (
                <>
                  {t('tabs.more.token.pcc.controllable')}{' '}
                  <AlertSVG height="16" width="16" data-testid="pcc-icon" />
                </>
              )}
            </ParentControlRecord>
          </TwoRows>
        ))
        .with({ ownedAndCanWrap: false, isWrapped: false }, () => (
          <TwoRows>
            <Record data-testid="namewrapper-status">
              {t('tabs.more.token.status.unwrapped')}
            </Record>
          </TwoRows>
        ))
        .otherwise(() => null)}
    </Container>
  )
}
