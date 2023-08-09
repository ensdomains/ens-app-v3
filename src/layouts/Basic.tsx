import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useErrorBoundary, withErrorBoundary } from 'react-use-error-boundary'
import { useIntercom } from 'react-use-intercom'
import styled, { css } from 'styled-components'
import { useNetwork, useSwitchNetwork } from 'wagmi'

import { mq } from '@ensdomains/thorin'

import FeedbackSVG from '@app/assets/Feedback.svg'
import ErrorScreen from '@app/components/@atoms/ErrorScreen'

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
      // hack for iOS/iPadOS Safari
      // width should always be 100% - total padding
      width: calc(100% - calc(var(--padding-size) * 2));
      box-sizing: content-box;
    }
    ${mq.sm.min(css`
      --padding-size: ${theme.space['8']};
      gap: ${theme.space['6']};
      flex-gap: ${theme.space['6']};
    `)}
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
    ${mq.sm.min(
      css`
        height: ${theme.space['12']};
      `,
    )}
  `,
)

export const StyledFeedbackSVG = styled(FeedbackSVG)(() => css``)

export const Basic = withErrorBoundary(({ children }: { children: React.ReactNode }) => {
  const { chain: currentChain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork()
  const router = useRouter()
  const [error] = useErrorBoundary()
  const { boot } = useIntercom()

  useEffect(() => {
    boot()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (
      currentChain &&
      !(
        currentChain?.id === 1 ||
        currentChain?.id === 5 ||
        currentChain?.id === 11155111 ||
        currentChain?.id === 1337
      )
    ) {
      switchNetwork?.(1)
      router.push('/unsupportedNetwork')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChain?.id, router.pathname])

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
