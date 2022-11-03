import { useNetwork, useSwitchNetwork } from '@web3modal/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import styled, { css } from 'styled-components'

import { mq } from '@ensdomains/thorin'

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
    height: ${theme.space['16']};
    ${mq.md.min(
      css`
        display: none;
      `,
    )}
  `,
)

export const Basic = ({ children }: { children: React.ReactNode }) => {
  const { network: currentChain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork()
  const router = useRouter()

  // ToDo: Revisit. This is a temporary fix to switch to the correct network when the user is on the wrong network
  useEffect(() => {
    if (currentChain && !(currentChain?.chain?.id === 5 || currentChain?.chain?.id === 1337)) {
      console.log('Basic Check', currentChain)
      switchNetwork?.({ chainId: 5 })
      // router.push('/unsupportedNetwork')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChain, router.pathname])

  return (
    <Container className="min-safe">
      <Navigation />
      <ContentWrapper>{children}</ContentWrapper>
      <BottomPlaceholder />
      <Footer />
    </Container>
  )
}
