import clsx from 'clsx'
import { useRouter } from 'next/router'
import { PropsWithChildren, useEffect } from 'react'
import { useErrorBoundary, withErrorBoundary } from 'react-use-error-boundary'
import { useIntercom } from 'react-use-intercom'
import { useNetwork, useSwitchNetwork } from 'wagmi'

import { Box } from '@ensdomains/thorin'

import ErrorScreen from '@app/components/@atoms/ErrorScreen'

import { container } from './basicStyles.css'
import { Navigation } from './Navigation'

const Container = (props: PropsWithChildren<{}>) => (
  <Box
    {...props}
    className={clsx(container, 'min-safe')}
    display="flex"
    gap={{ base: '$4', sm: '$6' }}
    flexDirection="column"
    alignItems="stretch"
  />
)

const ContentWrapper = (props: PropsWithChildren<{}>) => (
  <Box
    {...props}
    maxWidth="$192"
    width="$full"
    alignSelf="center"
    flexGrow="1"
    display="flex"
    flexDirection="column"
    gap="$4"
  />
)

const BottomPlaceholder = (props: PropsWithChildren<{}>) => (
  <Box {...props} height={{ base: '$14', sm: '$12' }} />
)

export const Basic = withErrorBoundary(({ children }: { children: React.ReactNode }) => {
  const { chain: currentChain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork()
  const router = useRouter()
  const [error] = useErrorBoundary()
  const { boot } = useIntercom()

  useEffect(() => {
    // Do not initialise with uid and email without implementing identity verification first
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
    <Container>
      <Navigation />
      <ContentWrapper>
        {error ? <ErrorScreen errorType="application-error" /> : children}
      </ContentWrapper>
      <BottomPlaceholder />
    </Container>
  )
})
