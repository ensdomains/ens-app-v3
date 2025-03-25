import { useEffect } from 'react'
import { useErrorBoundary, withErrorBoundary } from 'react-use-error-boundary'
import styled, { css } from 'styled-components'
import { useAccount, useSwitchChain } from 'wagmi'

import ErrorScreen from '@app/components/@atoms/ErrorScreen'
import { getSupportedChainById } from '@app/constants/chains'
import { useSetupIntercom } from '@app/hooks/useSetupIntercom'

import { Navigation } from './Navigation'

const Container = styled.div(
  ({ theme }) => css`
    --padding-size: ${theme.space['4']};
    padding: var(--padding-size);
    display: flex;
    flex-gap: ${theme.space['4']};
    gap: ${theme.space['4']};
    flex-direction: column;
    align-items: stretch;
    @supports (-webkit-touch-callout: none) {
      /*
        hack for iOS/iPadOS Safari
        width should always be 100% - total padding
       */
      width: calc(100% - calc(var(--padding-size) * 2));
      box-sizing: content-box;
    }
    @media (min-width: ${theme.breakpoints.sm}px) {
      --padding-size: ${theme.space['8']};
      gap: ${theme.space['6']};
      flex-gap: ${theme.space['6']};
    }
  `,
)

const ContentWrapper = styled.div(
  ({ theme }) => css`
    max-width: ${theme.space['192']};
    width: 100%;
    align-self: center;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: ${theme.space['4']};
    flex-gap: ${theme.space['4']};
  `,
)

const BottomPlaceholder = styled.div(
  ({ theme }) => css`
    height: ${theme.space['14']};
    @media (min-width: ${theme.breakpoints.sm}px) {
      height: ${theme.space['12']};
    }
  `,
)

const shouldSwitchChain = ({
  isConnected,
  hasProgrammaticChainSwitching,
  isPending,
  isError,
  chainId,
}: {
  isConnected: boolean
  hasProgrammaticChainSwitching: boolean
  isPending: boolean
  isError: boolean
  chainId?: number
}) =>
  isConnected &&
  hasProgrammaticChainSwitching &&
  !isPending &&
  !isError &&
  !getSupportedChainById(chainId)

export const Basic = withErrorBoundary(({ children }: { children: React.ReactNode }) => {
  const { chainId, connector, isConnected } = useAccount()
  const hasProgrammaticChainSwitching = Boolean(connector?.switchChain)
  const { switchChain, isPending, isError } = useSwitchChain()
  useSetupIntercom()

  const [error] = useErrorBoundary()

  useEffect(() => {
    if (
      shouldSwitchChain({ isConnected, hasProgrammaticChainSwitching, isPending, isError, chainId })
    ) {
      switchChain({ chainId: 1 })
    }
  }, [isConnected, hasProgrammaticChainSwitching, isPending, isError, chainId, switchChain])

  return (
    <Container className="min-safe">
      <Navigation />
      <ContentWrapper>
        {error ? <ErrorScreen errorType="application-error" /> : children}
      </ContentWrapper>
      <BottomPlaceholder />
    </Container>
  )
})
