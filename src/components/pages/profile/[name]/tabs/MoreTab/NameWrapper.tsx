import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { match, P } from 'ts-pattern'

import { GetOwnerReturnType, GetWrapperDataReturnType } from '@ensdomains/ensjs/public'
import { AlertSVG, Button, CheckSVG, mq, Typography } from '@ensdomains/thorin'

import { cacheableComponentStyles } from '@app/components/@atoms/CacheableComponent'
import type { NameWrapperState } from '@app/hooks/fuses/useFusesStates'
import type { Profile } from '@app/types'

import { TabWrapper } from '../../../TabWrapper'

type Props = {
  name: string
  isWrapped: boolean
  canBeWrapped: boolean
  ownerData?: GetOwnerReturnType
  wrapperData?: GetWrapperDataReturnType
  profile: Profile | undefined
  isConnected: boolean
  isOwned: boolean
}

const getFuseStateFromWrapperData = (wrapperData?: GetWrapperDataReturnType): NameWrapperState =>
  match(wrapperData)
    .with(P.nullish, () => 'unwrapped' as const)
    .with({ fuses: { child: { CANNOT_UNWRAP: true } } }, () => 'locked' as const)
    .with({ fuses: { parent: { PARENT_CANNOT_CONTROL: true } } }, () => 'emancipated' as const)
    .otherwise(() => 'wrapped')

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

export const NameWrapper = ({
  name,
  isWrapped,
  ownerData,
  wrapperData,
  canBeWrapped,
  profile,
  isConnected,
  isOwned,
}: Props) => {
  const { t } = useTranslation('profile')
  const status: NameWrapperState = getFuseStateFromWrapperData(wrapperData)

  const isPCCBurned = !!wrapperData?.fuses.parent?.PARENT_CANNOT_CONTROL

  return (
    <Container>
      <HeaderContainer>
        <Typography fontVariant="headingFour">{t('tabs.more.token.nameWrapper')}</Typography>
        {isOwned && isConnected && (
          <Button width="max">
            {t(canBeWrapped ? 'tabs.more.token.wrapName' : 'tabs.more.token.unwrap')}
          </Button>
        )}
      </HeaderContainer>
      {isOwned && !isWrapped ? (
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
