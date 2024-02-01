import dynamic from 'next/dynamic'
import { Dispatch } from 'react'
import type ConfettiT from 'react-confetti'
import styled, { css } from 'styled-components'

import { Button, mq, Typography } from '@ensdomains/thorin'

import MobileFullWidth from '@app/components/@atoms/MobileFullWidth'
import { Card } from '@app/components/Card'
import { useRouterWithHistory } from '@app/hooks/useRouterWithHistory'
import useWindowSize from '@app/hooks/useWindowSize'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'

import { DnsImportReducerAction, SelectedItemProperties } from '../useDnsImportReducer'

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

    ${mq.sm.min(css`
      padding: ${theme.space['6']} ${theme.space['18']};
      gap: ${theme.space['6']};
    `)}
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

    background-image: ${theme.colors.gradients.blue};
    /* stylelint-disable property-no-vendor-prefix */
    -webkit-background-clip: text;
    -moz-background-clip: text;
    background-clip: text;
    /* stylelint-enable property-no-vendor-prefix */

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

export const CompleteOnchain = ({
  dispatch,
  selected,
}: {
  dispatch: Dispatch<DnsImportReducerAction>
  selected: SelectedItemProperties
}) => {
  const router = useRouterWithHistory()
  const { width, height } = useWindowSize()

  const key = `importDnsName-${selected.name}`

  const { cleanupFlow } = useTransactionFlow()

  const cleanup = () => {
    cleanupFlow(key)
    dispatch({ name: 'clearItem', selected })
  }

  const goHome = () => {
    cleanup()
    router.push('/')
  }

  const goToProfile = () => {
    cleanup()
    router.push(`/profile/${selected.name}`)
  }

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
        <Title>Congratulations!</Title>
        <Typography style={{ display: 'inline' }} fontVariant="headingThree" weight="bold">
          You are now the owner of <SubtitleWithGradient>{selected.name}</SubtitleWithGradient>
        </Typography>
      </TitleContainer>
      <Typography>
        Your domain has been successfully claimed. You can now view and manage your name.
      </Typography>
      <ButtonContainer>
        <MobileFullWidth>
          <Button colorStyle="accentSecondary" onClick={goHome}>
            Claim another
          </Button>
        </MobileFullWidth>
        <MobileFullWidth>
          <Button data-testid="view-name" onClick={goToProfile}>
            View name
          </Button>
        </MobileFullWidth>
      </ButtonContainer>
    </StyledCard>
  )
}
