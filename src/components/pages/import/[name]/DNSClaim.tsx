import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useAccount } from 'wagmi'

import { Button, Card, Spinner, Typography, mq } from '@ensdomains/thorin'

import ArrowLeftSVG from '@app/assets/ArrowLeft.svg'
import { Spacer } from '@app/components/@atoms/Spacer'
import { HamburgerRoutes } from '@app/components/@molecules/HamburgerRoutes'
import { useRecentTransactions } from '@app/hooks/transactions/useRecentTransactions'
import useDNSOwner from '@app/hooks/useDNSOwner'
import { useRouterWithHistory } from '@app/hooks/useRouterWithHistory'
import { useValidate } from '@app/hooks/useValidate'
import { useBreakpoint } from '@app/utils/BreakpointProvider'

import { AddTextRecord } from './AddTextRecord'
import { ClaimComplete } from './ClaimComplete'
import { ClaimDomain } from './ClaimDomain'
import { EnableDNSSEC } from './EnableDNSSEC'
import { hasPendingTransaction, shouldShowSuccessPage } from './shared'
import { isDnsSecEnabled } from './utils'

const BackArrow = styled.div(
  ({ theme }) => css`
    width: ${theme.space['6']};
    height: ${theme.space['6']};
    display: block;
    color: ${theme.colors.greyPrimary};
  `,
)

const ContentContainer = styled.div`
  margin: 0;
  padding: 0;
  min-height: 0;
  height: min-content;
`

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

const Title = styled(Typography)(
  ({ theme }) => css`
    font-size: ${theme.fontSizes.extraLarge};
    line-height: ${theme.lineHeights.extraLarge};
  `,
)

const Container = styled.div`
  box-sizing: border-box;
  margin: 0 auto;
  grid-column: 1/-1;
  grid-auto-rows: 1fr;
`

const MainContentContainer = styled(Card)(
  ({ theme }) => css`
    width: 100%;
    ${mq.sm.min(css`
      padding: ${theme.space['6']} ${theme.space['18']};
      width: 620px;
    `)}
  `,
)

const LoadingContentContainer = styled(Card)(
  ({ theme }) => css`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    ${mq.sm.min(css`
      padding: ${theme.space['6']} ${theme.space['18']};
      width: 620px;
    `)}
  `,
)

const HeadingContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const BackContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`

const StyledTitle = styled(Title)(
  () => css`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 200px;

    ${mq.xs.min(css`
      width: 250px;
    `)}

    ${mq.sm.min(css`
      width: 500px;
    `)}
  `,
)

export default () => {
  const router = useRouterWithHistory()
  const breakpoints = useBreakpoint()
  const [currentStep, setCurrentStep] = useState(0)
  const [syncWarning, setSyncWarning] = useState(false)

  const { name, valid } = useValidate(router.query.name as string)
  const { dnsOwner } = useDNSOwner(name, valid)

  const transactions = useRecentTransactions()
  const { isConnected } = useAccount()
  const { t } = useTranslation('dnssec')

  useEffect(() => {
    const init = async () => {
      try {
        const hasDnsSecEnabled = await isDnsSecEnabled(name as string)
        if (!hasDnsSecEnabled) {
          setCurrentStep(0)
          return
        }
        if (hasPendingTransaction(transactions)) {
          setCurrentStep(2)
          return
        }
        setCurrentStep(1)
      } catch (e) {
        console.error('caught error: ', e)
      }
    }

    if (shouldShowSuccessPage(transactions)) {
      setCurrentStep(3)
    } else {
      init()
    }
  }, [dnsOwner, name, transactions])

  return (
    <Container>
      <HeadingContainer>
        <BackContainer>
          <Button
            onClick={() => router.push('/')}
            colorStyle="transparent"
            size="flexible"
            style={{ width: 50 }}
          >
            <BackArrow as={ArrowLeftSVG} />
          </Button>
          <ContentContainer>
            <TitleWrapper $invert={!!router.query.from}>
              <TitleContainer>
                <StyledTitle weight="bold">
                  {t('action.claim', { ns: 'common' })} {name}
                </StyledTitle>
              </TitleContainer>
            </TitleWrapper>
          </ContentContainer>
        </BackContainer>
        {!router.query.from && !breakpoints.md && <HamburgerRoutes />}
      </HeadingContainer>
      <Spacer $height="4" />
      {router.isReady ? (
        <MainContentContainer>
          {isConnected ? (
            <>
              {currentStep === 0 && <EnableDNSSEC {...{ currentStep, setCurrentStep, name }} />}
              {currentStep === 1 && (
                <AddTextRecord
                  {...{ currentStep, setCurrentStep, syncWarning, setSyncWarning, name }}
                />
              )}
              {currentStep === 2 && (
                <ClaimDomain {...{ currentStep, setCurrentStep, syncWarning, name }} />
              )}
              {currentStep === 3 && <ClaimComplete name={name} />}
            </>
          ) : (
            <Typography style={{ textAlign: 'center' }}>{t('general.connectWallet')}</Typography>
          )}
        </MainContentContainer>
      ) : (
        <LoadingContentContainer>
          <Spinner color="accent" size="large" />
        </LoadingContentContainer>
      )}
    </Container>
  )
}
