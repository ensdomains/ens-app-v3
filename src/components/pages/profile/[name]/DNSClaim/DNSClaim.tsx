import { useRouter } from 'next/router'
import styled, { css } from 'styled-components'
import { useState, useCallback } from 'react'

import { Button, Skeleton, mq, Typography, Card } from '@ensdomains/thorin'
import ArrowLeftSVG from '@app/assets/ArrowLeft.svg'
import { LeadingHeading } from '@app/components/LeadingHeading'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { HamburgerRoutes } from '@app/components/@molecules/HamburgerRoutes'
import { Spacer } from '@app/components/@atoms/Spacer'

const BackArrow = styled.div(
  ({ theme }) => css`
    width: ${theme.space['6']};
    height: ${theme.space['6']};
    display: block;
  `,
)

const HeadingItems = styled.div<{ $spacing: string }>(
  ({ theme, $spacing }) => css`
    grid-column: span 1;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
    gap: ${theme.space['5']};
    align-self: center;
    align-items: center;
    min-height: ${theme.space['15']};
    ${mq.md.min(css`
      min-height: ${theme.space['10']};
      grid-column: span 2;
      grid-template-columns: ${$spacing};
    `)}
  `,
)

const CustomLeadingHeading = styled(LeadingHeading)(
  ({ theme }) => `
    
  `,
)

const ContentContainer = styled.div<{ $multiColumn?: boolean }>(
  ({ $multiColumn }) => css`
    margin: 0;
    padding: 0;
    min-height: 0;
    height: min-content;
    ${$multiColumn &&
    mq.sm.min(css`
      grid-column: span 2;
    `)}
  `,
)

const TitleContainer = styled.div(
  () => css`
    display: flex;
    flex-direction: column;
    justify-content: center;
  `,
)

const TitleWrapper = styled.div<{ $invert: boolean }>(
  ({ $invert }) => css`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;

    ${TitleContainer} {
      align-items: flex-start;
    }

    ${$invert &&
    css`
      flex-direction: row-reverse;

      ${TitleContainer} {
        align-items: flex-end;
      }
    `}
  `,
)

const spacing = '270px 2fr'

const title = 'title'
const subtitle = 'subtitle'

const Title = styled(Typography)(
  ({ theme }) => css`
    font-size: ${theme.fontSizes.extraLarge};
    line-height: ${theme.lineHeights.normal};
  `,
)

const Subtitle = styled(Typography)(
  ({ theme }) => css`
    line-height: ${theme.lineHeights.normal};
    color: ${theme.colors.textTertiary};
  `,
)

const alwaysShowSubtitle = false

const Container = styled.div(
  ({ theme }) => css`
    width: 500px;
    margin: 0 auto;
    grid-column: 1/-1;
    grid-auto-rows: 1fr;
  `,
)

const MainContentContainer = styled(Card)(
  ({ theme }) => css`
    width: 100%;
  `,
)

const HeadingContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
  `,
)

const StepContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: ${theme.space['2']};
  `,
)

type StepType = 'notStarted' | 'inProgress' | 'completed'

const StepItem = styled.div<{ $type: StepType }>(
  ({ theme, $type }) => css`
    border-radius: ${theme.radii.full};
    width: ${theme.space['3.5']};
    height: ${theme.space['3.5']};
    ${$type === 'notStarted' &&
    css`
      border: ${theme.borderWidths['0.5']} ${theme.borderStyles.solid}
        ${theme.colors.borderSecondary};
    `}
    ${$type === 'inProgress' &&
    css`
      border: ${theme.borderWidths['0.5']} ${theme.borderStyles.solid} ${theme.colors.accent};
    `}
    ${$type === 'completed' &&
    css`
      background-color: ${theme.colors.accent};
    `}
  `,
)

const AddTextRecord = ({ currentStep }) => {
  return <div>Add Text records</div>
}

const ClaimDomain = ({ currentStep }) => {
  return <div>Claim Domain</div>
}

const ButtonContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  `,
)

export default () => {
  const router = useRouter()
  const breakpoints = useBreakpoint()

  const [currentStep, setCurrentStep] = useState(0)

  console.log('router:', router.query.name)

  return (
    <Container>
      <HeadingContainer>
        {router.query.from && (
          <div data-testid="back-button">
            <Button
              onClick={() => router.back()}
              variant="transparent"
              shadowless
              size="extraSmall"
            >
              <BackArrow as={ArrowLeftSVG} />
            </Button>
          </div>
        )}
        <ContentContainer>
          <TitleWrapper $invert={!!router.query.from}>
            <TitleContainer>
              <Title weight="bold">Claim {router.query.name}</Title>
              {subtitle && (!breakpoints.md || alwaysShowSubtitle) && (
                <Subtitle weight="bold">{subtitle}</Subtitle>
              )}
            </TitleContainer>
          </TitleWrapper>
        </ContentContainer>
        {!router.query.from && !breakpoints.md && <HamburgerRoutes />}
      </HeadingContainer>
      <Spacer $height={4} />
      <MainContentContainer>
        {currentStep === 0 && <EnableDNSSEC {...{ currentStep }} />}
        {currentStep === 1 && <AddTextRecord {...{ currentStep }} />}
        {currentStep === 2 && <ClaimDomain {...{ currentStep }} />}
      </MainContentContainer>
    </Container>
  )
}
