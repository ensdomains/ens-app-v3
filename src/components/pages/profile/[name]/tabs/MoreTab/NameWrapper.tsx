/* eslint-disable no-nested-ternary */
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { match, P } from 'ts-pattern'
import { Address } from 'viem'

import { GetOwnerReturnType, GetWrapperDataReturnType } from '@ensdomains/ensjs/public'
import { AlertSVG, CheckSVG, mq, Typography } from '@ensdomains/thorin'

import { cacheableComponentStyles } from '@app/components/@atoms/CacheableComponent'
import { DisabledButtonWithTooltip } from '@app/components/@molecules/DisabledButtonWithTooltip'
import { NameWrapperState } from '@app/hooks/fuses/useFusesStates'
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
  profile: Profile | undefined
  address?: Address
  isOwned: boolean
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

    ${mq.sm.min(css`
      padding: ${theme.space['6']};
    `)}
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
    border: ${theme.borderWidths.px} ${theme.borderStyles.solid} ${theme.colors.border};
    width: ${theme.space.full};
    font-weight: ${theme.fontWeights.bold};
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  `,
)

const ParentControlRecord = styled(Record)<{ $isPCCBurned: boolean }>(
  ({ theme, $isPCCBurned }) => css`
    background: ${$isPCCBurned ? theme.colors.greenSurface : theme.colors.yellowSurface};
    & > svg {
      color: ${$isPCCBurned ? theme.colors.green : theme.colors.yellow};
    }
  `,
)

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

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
  isOwned,
  address,
}: Props) => {
  const { t } = useTranslation('profile')

  const isPCCBurned = !!wrapperData?.fuses.parent?.PARENT_CANNOT_CONTROL

  const cannotUnwrap = !!wrapperData?.fuses.child.CANNOT_UNWRAP

  const isButtonDisplayed = isOwned && address

  const status = getFuseStateFromWrapperData(wrapperData)

  const isManager = ownerData?.owner === address
  const isRegistrant = ownerData?.registrant === address

  const canBeWrapped =
    _canBeWrapped &&
    !!address &&
    (ownerData?.ownershipLevel === 'registrar' ? isRegistrant : isManager)

  return (
    <Container>
      <HeaderContainer>
        <Typography fontVariant="headingFour">{t('tabs.more.token.nameWrapper')}</Typography>

        {isButtonDisplayed ? (
          isWrapped ? (
            cannotUnwrap ? (
              <DisabledButtonWithTooltip
                buttonText={t('tabs.more.token.unwrap')}
                content={t('tabs.more.token.unwrapWarning')}
                buttonId="cannot-unwrap-disabled-button"
                buttonWidth="max"
                placement="top"
              />
            ) : (
              <UnwrapButton status={status} {...{ name, ownerData }} />
            )
          ) : (
            <WrapButton {...{ profile, ownerData, canBeWrapped, name, isManager, isRegistrant }} />
          )
        ) : null}
      </HeaderContainer>
      {isOwned && canBeWrapped ? (
        <>{t('tabs.more.token.unwrappedText')}</>
      ) : (
        <TwoRows>
          <Record>{isWrapped ? 'Wrapped' : 'Unwrapped'}</Record>
          <ParentControlRecord $isPCCBurned={isPCCBurned}>
            {isPCCBurned ? 'Not parent-controllable' : 'Parent-controllable'}
            {isPCCBurned ? <CheckSVG /> : <AlertSVG />}
          </ParentControlRecord>
        </TwoRows>
      )}
    </Container>
  )
}
