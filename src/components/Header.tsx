import { useRouter } from 'next/router'
import { forwardRef, ReactNode, useCallback, useEffect, useRef } from 'react'
import useTransition, { TransitionState } from 'react-transition-state'
import { useAccount } from 'wagmi'

import { Box, BoxProps, brightness, translateX, translateY } from '@ensdomains/thorin'

import { useRecentTransactions } from '@app/hooks/transactions/useRecentTransactions'
import { useInitial } from '@app/hooks/useInitial'
import { legacyFavouritesRoute, routes } from '@app/routes'
import { useBreakpoint } from '@app/utils/BreakpointProvider'

import ENSFull from '../assets/ENSFull.svg'
import ENSWithGradient from '../assets/ENSWithGradient.svg'
import BaseLink from './@atoms/BaseLink'
import { RouteItem } from './@atoms/RouteItem/RouteItem'
import Hamburger from './@molecules/Hamburger/Hamburger'
import { SearchInput } from './@molecules/SearchInput/SearchInput'
import { ConditionalWrapper } from './ConditionalWrapper'
import { HeaderConnect } from './ConnectButton'

const HeaderWrapper = (props: BoxProps) => (
  <Box {...props} as="header" height="$12" display={{ base: 'none', sm: 'initial' }} />
)

const LogoAnchor = forwardRef<HTMLElement, BoxProps>((props, ref) => (
  <Box
    {...props}
    as="a"
    ref={ref}
    cursor="pointer"
    transition="all 0.15s ease-in-out"
    filter={{ base: brightness(1), hover: brightness(1.05) }}
    transform={{ base: translateY(0), hover: translateY(-1) }}
  />
))

const NavContainer = (props: BoxProps) => (
  <Box
    {...props}
    display="flex"
    flexDirection="row"
    alignItems="center"
    gap={{ base: '$3', lg: '$6' }}
    height="$12"
  />
)

const RouteContainer = forwardRef<HTMLElement, BoxProps & { $state: TransitionState }>(
  ({ $state, ...props }, ref) => (
    <Box
      {...props}
      ref={ref}
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="flex-end"
      gap={{ base: '$1', lg: '$6' }}
      position={{ base: 'absolute', lg: 'relative' }}
      transition="transform 0.15s ease-in-out, opacity 0.15s ease-in-out"
      right="0"
      top="0"
      bottom="0"
      transform={translateX($state === 'entered' ? '0%' : '125%')}
      opacity={$state === 'entered' ? 1 : 0}
    />
  ),
)

const SearchWrapper = forwardRef<HTMLElement, BoxProps & { $state: TransitionState }>(
  ({ $state, ...props }, ref) => (
    <Box
      {...props}
      ref={ref}
      width="$full"
      backgroundColor="$red"
      maxWidth="$80"
      transition="margin 0.15s ease-in-out"
      marginRight={{ base: $state !== 'entered' ? '$0' : '$24', lg: '$0' }}
    />
  ),
)

// TODO: CHeck the div > div stuff
// const SearchWrapper2 = styled.div<{ $state: TransitionState }>(
//   ({ theme, $state }) => css`
//     width: ${theme.space.full};
//     max-width: ${theme.space['80']};
//     & > div > div {
//       max-width: ${theme.space.full};
//       ${mq.lg.min(css`
//         max-width: ${theme.space['80']};
//       `)}
//     }

//     transition: margin 0.15s ease-in-out;
//     margin-right: ${theme.space['24']};
//     ${$state !== 'entered' &&
//     css`
//       margin-right: 0;
//     `}
//     ${mq.lg.min(css`
//       margin-right: 0;
//     `)}
//   `,
// )

const routesNoSearch = routes.filter(
  (route) => route.name !== 'search' && route.icon && !route.onlyDropdown && !route.disabled,
)

export const Header = () => {
  const router = useRouter()
  const isInitial = useInitial()
  const { isConnected } = useAccount()
  const breakpoints = useBreakpoint()
  const transactions = useRecentTransactions()
  const pendingTransactions = transactions.filter((x) => x.status === 'pending')
  const searchWrapperRef = useRef<HTMLDivElement>(null)
  const routeContainerRef = useRef<HTMLDivElement>(null)
  const [state, toggle] = useTransition({
    timeout: {
      enter: 0,
      exit: 0,
    },
    mountOnEnter: true,
    unmountOnExit: true,
    initialEntered: true,
  })

  let RouteItems: ReactNode

  let routesNoSearchWithFavourites = routesNoSearch

  if (globalThis?.localStorage?.getItem('ensFavourites')) {
    routesNoSearchWithFavourites = [...routesNoSearchWithFavourites, legacyFavouritesRoute]
  }

  if (!isInitial && isConnected) {
    RouteItems = routesNoSearchWithFavourites.map((route) => (
      <RouteItem
        key={route.name}
        route={route}
        asText={breakpoints.lg}
        hasNotification={route.name === 'settings' && pendingTransactions.length > 0}
      />
    ))
  }

  const toggleRoutesShowing = useCallback(
    (evt: FocusEvent) => {
      if (evt.type === 'focusout') {
        toggle(true)
      } else {
        toggle(false)
      }
    },
    [toggle],
  )

  useEffect(() => {
    const searchWrapper = searchWrapperRef.current
    if (searchWrapper) {
      searchWrapper?.addEventListener('focusin', toggleRoutesShowing, false)
      searchWrapper?.addEventListener('focusout', toggleRoutesShowing, false)
    }
    return () => {
      searchWrapper?.removeEventListener('focusin', toggleRoutesShowing, false)
      searchWrapper?.addEventListener('focusout', toggleRoutesShowing, false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchWrapperRef.current])

  return (
    <HeaderWrapper id="header">
      <NavContainer>
        <ConditionalWrapper
          condition={router.asPath !== '/'}
          wrapper={(children) => (
            <BaseLink passHref href="/">
              <LogoAnchor data-testid="home-button">{children}</LogoAnchor>
            </BaseLink>
          )}
        >
          {router.asPath === '/' ? (
            <Box as={<ENSFull />} height="$12" verticalAlign="bottom" flex="0 0 auto" />
          ) : (
            <Box as={<ENSWithGradient />} height="$12" verticalAlign="bottom" />
          )}
        </ConditionalWrapper>
        {router.asPath !== '/' && breakpoints.sm && (
          <>
            <SearchWrapper
              data-testid="search-wrapper"
              ref={searchWrapperRef}
              $state={breakpoints.lg ? 'entered' : state}
            >
              <SearchInput size="medium" />
            </SearchWrapper>
          </>
        )}
        <div style={{ flexGrow: 1 }} />
        <Box position="relative">
          <RouteContainer
            data-testid="route-container"
            ref={routeContainerRef}
            $state={breakpoints.lg ? 'entered' : state}
          >
            {RouteItems}
          </RouteContainer>
        </Box>
        <Hamburger />
        <HeaderConnect />
      </NavContainer>
    </HeaderWrapper>
  )
}
