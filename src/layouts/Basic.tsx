import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useErrorBoundary, withErrorBoundary } from 'react-use-error-boundary'
import styled, { css } from 'styled-components'
import { useNetwork, useSwitchNetwork } from 'wagmi'

import { mq } from '@ensdomains/thorin'

import FeedbackSVG from '@app/assets/Feedback.svg'
import ErrorScreen from '@app/components/@atoms/ErrorScreen'

import { Navigation } from './Navigation'

const Container = styled.div(
  ({ theme }) => css`
    padding: ${theme.space['4']};
    display: flex;
    flex-gap: ${theme.space['4']};
    gap: ${theme.space['4']};
    flex-direction: column;
    align-items: stretch;
    @supports (-webkit-touch-callout: none) {
      width: calc(100% - ${theme.space['8']});
      box-sizing: content-box;
      ${mq.sm.min(css`
        width: calc(100% - ${theme.space['32']});
      `)}
    }
    ${mq.sm.min(css`
      padding: ${theme.space['8']};
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

// const FeedbackButton = styled.div(
//   ({ theme }) => css`
//     z-index: 10000;
//     background: ${theme.colors.orange};
//     width: ${theme.space['11']};
//     height: ${theme.space['52']};
//     border-radius: ${theme.radii['2xLarge']} 0 0 ${theme.radii['2xLarge']};
//     position: fixed;
//     right: -${theme.space['2']};
//     top: 50vh;
//     transform: translateY(-50%);
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     cursor: pointer;
//     transition: all 0.15s ease-in-out;

//     svg {
//       width: ${theme.space['4']};
//       height: ${theme.space['4']};
//     }

//     /* stylelint-disable-next-line no-descending-specificity */
//     & > div {
//       margin-right: ${theme.space['2']};
//       display: flex;
//       flex-direction: row;
//       align-items: center;
//       justify-content: center;
//       gap: ${theme.space['2']};
//       min-width: ${theme.space['52']};
//       transform: rotate(90deg);
//     }

//     @media (hover: hover) {
//       &:hover {
//         right: 0;
//         background: ${theme.colors.orangeBright};
//       }
//       &:active {
//         right: -${theme.space['2']};
//       }
//     }
//     @media (hover: none) {
//       &:active {
//         right: 0;
//         background: ${theme.colors.orangeBright};
//       }
//     }
//   `,
// )

export const StyledFeedbackSVG = styled(FeedbackSVG)(() => css``)

export const Basic = withErrorBoundary(({ children }: { children: React.ReactNode }) => {
  const { chain: currentChain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork()
  const router = useRouter()
  const [error] = useErrorBoundary()

  useEffect(() => {
    if (
      currentChain &&
      !(currentChain?.id === 1 || currentChain?.id === 5 || currentChain?.id === 1337)
    ) {
      switchNetwork?.(1)
      router.push('/unsupportedNetwork')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChain?.id, router.pathname])

  return (
    <Container className="min-safe">
      {/* <FeedbackButton onClick={() => setHasFeedbackForm(true)}>
        <div>
          <FeedbackSVG />
          <Typography style={{ color: 'white' }}>Feedback</Typography>
        </div>
      </FeedbackButton> */}
      <Navigation />
      <ContentWrapper>
        {error ? <ErrorScreen errorType="application-error" /> : children}
      </ContentWrapper>
      <BottomPlaceholder />
    </Container>
  )
})
