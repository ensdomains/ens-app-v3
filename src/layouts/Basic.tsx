import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import { useNetwork, useSwitchNetwork } from 'wagmi'

import { Dialog, Typography, mq } from '@ensdomains/thorin'

import FeedbackSVG from '@app/assets/Feedback.svg'
import { Footer } from '@app/components/Footer'

import { Navigation } from './Navigation'

const Container = styled.div(
  ({ theme }) => css`
    padding: ${theme.space['5']} ${theme.space['4']};
    display: flex;
    flex-gap: ${theme.space['8']};
    gap: ${theme.space['8']};
    flex-direction: column;
    align-items: stretch;
    min-width: 100%;
    ${mq.md.min(css`
      padding: ${theme.space['12']} ${theme.space['16']};
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
    height: ${theme.space['16']};
    ${mq.md.min(
      css`
        display: none;
      `,
    )}
  `,
)

const StyledDialog = styled(Dialog)(
  () => css`
    height: 80vh;

    & > div {
      padding: 0;
    }

    & > div > div {
      height: 100%;
      gap: 0;
    }

    ${mq.sm.min(css`
      max-width: 70vw;
      width: 60vw;
      height: 90vh;

      & > div {
        max-width: 60vw;
        width: 60vw;
        height: 90vh;
        padding: 0;
      }
      & > div > div {
        max-width: 60vw;
        height: 90vh;
      }
    `)}
  `,
)

const FeedbackButton = styled.div<{ $isShown: boolean }>(
  ({ $isShown }) => css`
    z-index: 10000;
    background: #f6a93c;
    width: 140px;
    height: 50px;
    border-radius: 25px 0 0 25px;
    position: fixed;
    right: ${$isShown ? '0' : '-90'}px;
    top: 45vh;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    cursor: pointer;
    transition: right 0.3s ease-in-out;
  `,
)

export const StyledFeedbackSVG = styled(FeedbackSVG)(() => css``)

export const Basic = ({ children }: { children: React.ReactNode }) => {
  const { chain: currentChain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork()
  const router = useRouter()
  const [isShown, setIsShown] = useState(false)
  const [hasFeedbackForm, setHasFeedbackForm] = useState(false)

  useEffect(() => {
    if (currentChain && !(currentChain?.id === 5 || currentChain?.id === 1337)) {
      switchNetwork?.(5)
      router.push('/unsupportedNetwork')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChain?.id, router.pathname])

  return (
    <Container className="min-safe">
      <FeedbackButton
        onMouseEnter={() => setIsShown(true)}
        onMouseLeave={() => setIsShown(false)}
        $isShown={isShown}
        onClick={() => setHasFeedbackForm(true)}
      >
        <StyledFeedbackSVG />
        <Typography style={{ color: 'white' }}>Feedback</Typography>
      </FeedbackButton>
      <Navigation />
      <ContentWrapper>{children}</ContentWrapper>
      <BottomPlaceholder />
      <Footer />
      <StyledDialog
        open={hasFeedbackForm}
        variant="actionable"
        onDismiss={() => setHasFeedbackForm(false)}
      >
        <iframe
          title="Moonpay Checkout"
          width="100%"
          height="100%"
          style={{ borderRadius: 25 }}
          src={`https://docs.google.com/forms/d/e/1FAIpQLSfAVFlV7LC2oCEBtZEK0uKpAU32-eYyY307Ji07wyGSFaZU8Q/viewform?usp=pp_url&entry.435573398=${router.asPath}`}
          id="moonpayIframe"
        />
      </StyledDialog>
    </Container>
  )
}
