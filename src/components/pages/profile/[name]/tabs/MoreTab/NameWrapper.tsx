import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { match, P } from 'ts-pattern'

import { GetOwnerReturnType, GetWrapperDataReturnType } from '@ensdomains/ensjs/public'
import { mq, RecordItem, Typography } from '@ensdomains/thorin'

import { cacheableComponentStyles } from '@app/components/@atoms/CacheableComponent'
import { NameWrapperState } from '@app/hooks/fuses/useFusesStates'
import { Profile } from '@app/types'

import { TabWrapper } from '../../../TabWrapper'

type Props = {
  name: string
  isWrapped: boolean
  canBeWrapped: boolean
  ownerData?: GetOwnerReturnType
  wrapperData?: GetWrapperDataReturnType
  profile: Profile | undefined
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
  `,
)

export const NameWrapper = ({
  name,
  isWrapped,
  ownerData,
  wrapperData,
  canBeWrapped,
  profile,
}: Props) => {
  const { t } = useTranslation('profile')
  const status: NameWrapperState = getFuseStateFromWrapperData(wrapperData)

  return (
    <Container>
      <Typography fontVariant="headingFour">{t('tabs.more.token.nameWrapper')}</Typography>
      <TwoRows>
        <RecordItem value={t(`tabs.more.token.status.${status}`)}>
          {t(`tabs.more.token.status.${status}`)}
        </RecordItem>
        <div>some div</div>
      </TwoRows>
    </Container>
  )
}
