import { Footer } from '@app/components/Footer'
import { LoadingOverlay } from '@app/components/LoadingOverlay'
import mq from '@app/mediaQuery'
import { tokens } from '@ensdomains/thorin'
import Head from 'next/head'
import styled from 'styled-components'
import { Header } from '../components/Header'

const Container = styled.div`
  padding: ${tokens.space['10']} ${tokens.space['8']};
  display: flex;
  flex-gap: ${tokens.space['8']};
  gap: ${tokens.space['8']};
  flex-direction: column;
  align-items: stretch;
  min-width: 100%;
  min-height: 100vh;
  ${mq.small.min`
    padding: ${tokens.space['12']} ${tokens.space['16']};
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
}: {
  loading?: boolean
  children: React.ReactNode
  title?: string
}) => {
  return (
    <Container>
      <Head>
        <title>{title ? `${title} ` : ''}ENS</title>
      </Head>
      <Header />
      <LoadingContainer>
        {loading ? <LoadingOverlay /> : children}
      </LoadingContainer>

      <Footer />
    </Container>
  )
}
