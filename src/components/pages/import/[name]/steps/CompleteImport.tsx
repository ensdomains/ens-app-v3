import dynamic from 'next/dynamic'
import type ConfettiT from 'react-confetti'
import { Trans, useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, Helper, Typography } from '@ensdomains/thorin'

import MobileFullWidth from '@app/components/@atoms/MobileFullWidth'
import { Card } from '@app/components/Card'
import { useAddressRecord } from '@app/hooks/ensjs/public/useAddressRecord'
import { useRouterWithHistory } from '@app/hooks/useRouterWithHistory'
import useWindowSize from '@app/hooks/useWindowSize'

import { DnsImportReducerDataItem, SelectedItemProperties } from '../useDnsImportReducer'

const StyledCard = styled(Card)(
  ({ theme }) => css`
    max-width: 780px;
    margin: 0 auto;
    text-align: center;
    flex-direction: column;
    gap: ${theme.space['4']};
    padding: ${theme.space['4']};
    canvas {
      max-width: ${theme.space.full};
    }

    @media (min-width: ${theme.breakpoints.sm}px) {
      padding: ${theme.space['6']} ${theme.space['18']};
      gap: ${theme.space['6']};
    }
  `,
)

const ButtonContainer = styled.div(
  ({ theme }) => css`
    width: ${theme.space.full};
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: ${theme.space['2']};
  `,
)

const TitleContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: ${theme.space['2']};
  `,
)

const Title = styled(Typography)(
  ({ theme }) => css`
    font-size: ${theme.fontSizes.headingOne};
    font-weight: 800;
    line-height: ${theme.lineHeights.headingOne};
  `,
)

const SubtitleWithGradient = styled(Typography)(
  ({ theme }) => css`
    display: inline;

    font-size: ${theme.fontSizes.headingThree};
    font-weight: bold;

    background: ${theme.colors.blueGradient};
    /* stylelint-disable property-no-vendor-prefix */
    -webkit-background-clip: text;
    -moz-background-clip: text;
    background-clip: text;
    /* stylelint-enable property-no-vendor-prefix */
    color: transparent;

    b {
      -webkit-text-fill-color: transparent;
      -moz-text-fill-color: transparent;
      color: transparent;
      line-height: 100%;
    }
  `,
)

const Confetti = dynamic(() =>
  import('react-confetti').then((mod) => mod.default as typeof ConfettiT),
)

export const CompleteImport = ({
  selected,
  item,
}: {
  selected: SelectedItemProperties
  item: DnsImportReducerDataItem
}) => {
  const { t } = useTranslation('dnssec', { keyPrefix: 'steps.complete' })

  const router = useRouterWithHistory()
  const { width, height } = useWindowSize()

  const { data: addressRecord } = useAddressRecord({
    name: selected.name,
    enabled: item.type === 'onchain',
  })

  const isImport = item.type === 'offchain' || addressRecord?.value !== selected.address
  const addKeyPrefix = (key: string) => (isImport ? `import.${key}` : `claim.${key}`)

  const goHome = () => router.push('/')

  const goToProfile = () => router.push(`/profile/${selected.name}`)

  return (
    <StyledCard>
      <Confetti
        width={width}
        height={height}
        recycle={false}
        colors={[
          '#49B393',
          '#5298FF',
          '#5854D6',
          '#5AC8FA',
          '#AF52DE',
          '#D55555',
          '#FF2D55',
          '#FF9500',
          '#FFCC00',
        ]}
        pieceWidth={{ min: 10, max: 20 }}
        pieceHeight={{ min: 20, max: 50 }}
        pieceShape="Square"
        gravity={0.25}
        initialVelocityY={20}
      />
      <TitleContainer>
        <Title>{t('title')}</Title>
        <Typography style={{ display: 'inline' }} fontVariant="headingThree" weight="bold">
          <Trans
            t={t}
            i18nKey={addKeyPrefix('subtitle')}
            components={{
              gradient: <SubtitleWithGradient />,
            }}
            values={{
              name: selected.name,
            }}
          />
        </Typography>
      </TitleContainer>
      <Typography>{t(addKeyPrefix('description'))}</Typography>
      {item.type === 'offchain' && <Helper>{t('import.warning')}</Helper>}
      <ButtonContainer>
        <MobileFullWidth>
          <Button colorStyle="accentSecondary" onClick={goHome}>
            {t('action.claimAnother')}
          </Button>
        </MobileFullWidth>
        <MobileFullWidth>
          <Button data-testid="view-name" onClick={goToProfile}>
            {t('action.viewName')}
          </Button>
        </MobileFullWidth>
      </ButtonContainer>
    </StyledCard>
  )
}
