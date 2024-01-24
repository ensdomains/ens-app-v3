import Head from 'next/head'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useAccount } from 'wagmi'

import { Card, mq, Spinner, Typography } from '@ensdomains/thorin'

import { Spacer } from '@app/components/@atoms/Spacer'
import Hamburger from '@app/components/@molecules/Hamburger/Hamburger'
import { useDnsSecEnabled } from '@app/hooks/dns/useDnsSecEnabled'
import { useDnsOwner } from '@app/hooks/ensjs/dns/useDnsOwner'
import { useRecentTransactions } from '@app/hooks/transactions/useRecentTransactions'
import { useRouterWithHistory } from '@app/hooks/useRouterWithHistory'
import { useValidate } from '@app/hooks/useValidate'
import { useBreakpoint } from '@app/utils/BreakpointProvider'

import { AddTextRecord } from './AddTextRecord'
import { ClaimComplete } from './ClaimComplete'
import { ClaimDomain } from './ClaimDomain'
import { EnableDNSSEC } from './EnableDNSSECOld'
import { hasPendingTransaction, shouldShowSuccessPage } from './shared'

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

const BackContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: ${theme.space['2']};

    & > button {
      padding: ${theme.space['2']};

      & > svg {
        width: ${theme.space['6']};
        height: ${theme.space['6']};
      }
    }
  `,
)

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
  const { address, isConnected } = useAccount()

  const { name = '', isValid } = useValidate({ input: router.query.name as string })
  const transactions = useRecentTransactions()
  const { t } = useTranslation('dnssec')

  const {
    data: isDnsSecEnabled,
    isLoading: isDnsSecEnabledLoading,
    refetch: refetchDnsSecEnabled,
    isRefetching: isDnsSecEnabledRefetching,
  } = useDnsSecEnabled({
    name,
  })

  const {
    data: dnsOwner,
    isLoading: isDnsOwnerLoading,
    error: dnsOwnerError,
    refetch: refetchDnsOwner,
    isRefetching: isDnsOwnerRefetching,
  } = useDnsOwner({ name, enabled: isValid })
  const syncWarning = dnsOwner !== address

  const [currentStep, setCurrentStep] = useState(0)
  const incrementStep = useCallback(
    () =>
      setCurrentStep((x) => {
        if (x === 0 && isDnsSecEnabled) return 1
        return Math.min(x + 1, 3)
      }),
    [isDnsSecEnabled],
  )
  const decrementStep = () => setCurrentStep((x) => Math.max(x - 1, 0))

  const [isInitialized, setIsInitialized] = useState(false)
  useEffect(() => {
    const init = async () => {
      try {
        if (!isDnsSecEnabled) return
        if (hasPendingTransaction(transactions)) return setCurrentStep(2)
        if (dnsOwner !== address) return setCurrentStep(1)
        setCurrentStep(2)
      } catch (e) {
        console.error('caught error: ', e)
      } finally {
        setIsInitialized(true)
      }
    }

    if (shouldShowSuccessPage(transactions)) {
      setCurrentStep(3)
    } else if (
      !!name &&
      isConnected &&
      !!address &&
      !isDnsSecEnabledLoading &&
      !isDnsOwnerLoading &&
      !isInitialized
    ) {
      init()
    }
  }, [
    isDnsSecEnabled,
    isDnsSecEnabledLoading,
    dnsOwner,
    isDnsOwnerLoading,
    name,
    address,
    isConnected,
    transactions,
    setIsInitialized,
    isInitialized,
  ])

  if (!router.isReady) return null
  return (
    <Container>
      <Head>
        <title>{t('title', { name: name || '' })}</title>
      </Head>
      <HeadingContainer>
        <BackContainer>
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
        {!breakpoints.sm && <Hamburger />}
      </HeadingContainer>
      <Spacer $height="4" />
      {router.isReady ? (
        <MainContentContainer>
          {isConnected ? (
            <>
              {currentStep === 0 && (
                <EnableDNSSEC
                  {...{
                    refetch: refetchDnsSecEnabled,
                    isLoading: isDnsSecEnabledLoading || isDnsSecEnabledRefetching,
                    incrementStep,
                    currentStep,
                    setCurrentStep,
                    name,
                  }}
                />
              )}
              {currentStep === 1 && (
                <AddTextRecord
                  {...{
                    dnsOwner,
                    refetch: refetchDnsOwner,
                    isLoading: isDnsOwnerLoading || isDnsOwnerRefetching,
                    error: dnsOwnerError,
                    incrementStep,
                    decrementStep,
                    currentStep,
                    syncWarning,
                    name,
                  }}
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
