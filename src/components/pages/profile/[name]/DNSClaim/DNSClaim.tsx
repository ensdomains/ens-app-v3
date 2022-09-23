import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'

import { Button, Card, Typography, mq } from '@ensdomains/thorin'

import ArrowLeftSVG from '@app/assets/ArrowLeft.svg'
import { Spacer } from '@app/components/@atoms/Spacer'
import { HamburgerRoutes } from '@app/components/@molecules/HamburgerRoutes'
import { useNameDetails } from '@app/hooks/useNameDetails'
import { useBreakpoint } from '@app/utils/BreakpointProvider'

import { AddTextRecord } from './AddTextRecord'
import { ClaimComplete } from './ClaimComplete'
import { ClaimDomain } from './ClaimDomain'
import { EnableDNSSEC } from './EnableDNSSEC'
import { isDnsSecEnabled } from './utils'

const BackArrow = styled.div(
  ({ theme }) => css`
    width: ${theme.space['6']};
    height: ${theme.space['6']};
    display: block;
  `,
)

const ContentContainer = styled.div(
  ({ theme }) => css`
    margin: 0;
    padding: 0;
    min-height: 0;
    height: min-content;
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
    width: 650px;
    box-sizing: border-box;
    margin: 0 auto;
    grid-column: 1/-1;
    grid-auto-rows: 1fr;
  `,
)

const MainContentContainer = styled(Card)(
  ({ theme }) => css`
    width: 100%;
    padding: 25px 75px;
  `,
)

const HeadingContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
  `,
)

export default () => {
  const router = useRouter()
  const breakpoints = useBreakpoint()
  const [currentStep, setCurrentStep] = useState(0)
  const [syncWarning, setSyncWarning] = useState(false)
  const { dnsOwner } = useNameDetails(router.query.name as string)

  const { name } = router.query

  useEffect(() => {
    const init = async () => {
      try {
        const hasDnsSecEnabled = await isDnsSecEnabled(name)
        if (!hasDnsSecEnabled) {
          setCurrentStep(0)
          return
        }
        setCurrentStep(1)
      } catch (e) {
        console.error('caught error: ', e)
      }
    }
    const transactionKey = localStorage.getItem('latestImportTransactionKey')
    if (transactionKey) {
      setCurrentStep(3)
    } else {
      init()
    }
  }, [dnsOwner, name])

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
        {currentStep === 0 && <EnableDNSSEC {...{ currentStep, setCurrentStep }} />}
        {currentStep === 1 && (
          <AddTextRecord {...{ currentStep, setCurrentStep, syncWarning, setSyncWarning }} />
        )}
        {currentStep === 2 && <ClaimDomain {...{ currentStep, setCurrentStep, syncWarning }} />}
        {currentStep === 3 && <ClaimComplete {...{ currentStep, setCurrentStep }} />}
      </MainContentContainer>
    </Container>
  )
}
