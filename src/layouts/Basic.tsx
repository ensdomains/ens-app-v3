import { Footer } from '@app/components/Footer'
import { LoadingOverlay } from '@app/components/LoadingOverlay'
import { useInitial } from '@app/hooks/useInitial'
import mq from '@app/mediaQuery'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import Head from 'next/head'
import styled, { css } from 'styled-components'
import { Header } from '../components/Header'
import { TabBar } from '../components/TabBar'

const Container = styled.div`
  ${({ theme }) => css`
    padding: ${theme.space['10']} ${theme.space['8']};
    display: flex;
    flex-gap: ${theme.space['8']};
    gap: ${theme.space['8']};
    flex-direction: column;
    align-items: stretch;
    min-width: 100%;
    min-height: 100vh;
    ${mq.small.min`
      padding: ${theme.space['12']} ${theme.space['16']};
    `}
  `}
`

const LoadingContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`

export const Basic = ({
  loading = false,
  children,
  title,
  leading,
  trailing,
}: {
  loading?: boolean
  children: React.ReactNode
  title?: string
  leading?: React.ReactNode
  trailing?: React.ReactNode
}) => {
  const initial = useInitial()
  const breakpoints = useBreakpoint()

  return (
    <Container>
      <Head>
        <title>{title ? `${title} ` : ''}ENS</title>
      </Head>
      <Header trailing={trailing} leading={leading} />
      <LoadingContainer>
        {loading ? <LoadingOverlay /> : children}
      </LoadingContainer>
      {!initial && (!breakpoints.sm ? <TabBar /> : <Footer />)}
    </Container>
  )
}
