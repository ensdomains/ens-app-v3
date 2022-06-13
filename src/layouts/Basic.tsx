import { Footer } from '@app/components/Footer'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { mq } from '@ensdomains/thorin'
import { useRouter } from 'next/router'
import styled, { css } from 'styled-components'
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
    min-height: 100vh;
    ${mq.md.min(css`
      padding: ${theme.space['12']} ${theme.space['16']};
    `)}
  `,
)

const ContentWrapper = styled.div(
  ({ theme }) => css`
    max-width: ${theme.space['288']};
    width: 100%;
    align-self: center;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: ${theme.space['8']};
    flex-gap: ${theme.space['8']};
  `,
)

const BottomPlaceholder = styled.div(
  ({ theme }) => css`
    height: ${theme.space['28']};
  `,
)

export const Basic = ({ children }: { children: React.ReactNode }) => {
  const { isReady } = useRouter()
  const breakpoints = useBreakpoint()

  return (
    <Container>
      <Navigation />
      <ContentWrapper>{children}</ContentWrapper>
      {isReady && !breakpoints.md ? <BottomPlaceholder /> : <Footer />}
    </Container>
  )
}
