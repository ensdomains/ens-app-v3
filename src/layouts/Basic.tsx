import ArrowLeftSVG from '@app/assets/ArrowLeft.svg'
import { Footer } from '@app/components/Footer'
import { HeaderText } from '@app/components/HeaderText'
import { LoadingOverlay } from '@app/components/LoadingOverlay'
import { useInitial } from '@app/hooks/useInitial'
import mq from '@app/mediaQuery'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { Button } from '@ensdomains/thorin'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import styled, { css } from 'styled-components'
import { Header } from '../components/Header'
import { TabBar } from '../components/TabBar'

const Container = styled.div`
  ${({ theme }) => css`
    padding: ${theme.space['5']} ${theme.space['4']};
    display: flex;
    flex-gap: ${theme.space['8']};
    gap: ${theme.space['8']};
    flex-direction: column;
    align-items: stretch;
    min-width: 100%;
    min-height: 100vh;
    ${mq.md.min`
      padding: ${theme.space['12']} ${theme.space['16']};
    `}
  `}
`

const LoadingContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`

const DesktopBackContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const ContentWrapper = styled.div`
  ${({ theme }) => css`
    max-width: ${theme.space['288']};
    width: 100%;
    align-self: center;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: ${theme.space['8']};
    flex-gap: ${theme.space['8']};
  `}
`

const BackArrow = styled.div`
  ${({ theme }) => css`
    width: ${theme.space['6']};
    height: ${theme.space['6']};
    display: block;
  `}
`

export const Basic = ({
  loading = false,
  children,
  title,
  heading,
  subheading,
}: {
  loading?: boolean
  children: React.ReactNode
  title?: string
  heading?: string
  subheading?: string
}) => {
  const router = useRouter()
  const initial = useInitial()
  const breakpoints = useBreakpoint()

  const HeaderItems = useMemo(() => {
    if (router.query.from) {
      return {
        leading: (
          <div data-testid="back-button">
            <Button
              onClick={() => router.back()}
              variant="transparent"
              shadowless
              size="extraSmall"
            >
              <BackArrow as={ArrowLeftSVG} />
            </Button>
          </div>
        ),
        trailing: heading && (
          <HeaderText align="right" title={heading} subtitle={subheading} />
        ),
      }
    }
    return {
      leading: heading && (
        <HeaderText align="left" title={heading} subtitle={subheading} />
      ),
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.from, heading, subheading])

  return (
    <Container>
      <Head>
        <title>{title ? `${title} ` : ''}ENS</title>
      </Head>
      <Header trailing={HeaderItems.trailing} leading={HeaderItems.leading} />
      <ContentWrapper>
        {!loading &&
          breakpoints.sm &&
          (HeaderItems.leading || HeaderItems.trailing) && (
            <DesktopBackContainer>
              {HeaderItems.leading}
              <div style={{ flexGrow: 1 }} />
              {HeaderItems.trailing}
            </DesktopBackContainer>
          )}
        {!router.isReady || loading ? (
          <LoadingContainer>
            <LoadingOverlay />
          </LoadingContainer>
        ) : (
          children
        )}
      </ContentWrapper>
      {!initial && (!breakpoints.sm ? <TabBar /> : <Footer />)}
    </Container>
  )
}
