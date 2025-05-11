import { useRouter } from 'next/router'
import { ReactNode, useCallback, useEffect, useRef } from 'react'
import useTransition, { TransitionState } from 'react-transition-state'
import styled, { css, useTheme } from 'styled-components'
import { useAccount } from 'wagmi'

import { useRecentTransactions } from '@app/hooks/transactions/useRecentTransactions'
import { useInitial } from '@app/hooks/useInitial'
import { legacyFavouritesRoute, routes } from '@app/routes'
import { useBreakpoint } from '@app/utils/BreakpointProvider'

import ENSFull from '../assets/ENSFull.svg'
import ENSWithGradient from '../assets/ENSWithGradient.svg'
import BaseLink from './@atoms/BaseLink'
import { RouteItem } from './@atoms/RouteItem/RouteItem'
import { HeaderConnect } from './@molecules/ConnectButton/ConnectButton'
import Hamburger from './@molecules/Hamburger/Hamburger'
import { SearchInput } from './@molecules/SearchInput/SearchInput'
import { ConditionalWrapper } from './ConditionalWrapper'

const HeaderWrapper = styled.header(
  ({ theme }) => css`
    height: ${theme.space['12']};

    @media (max-width: ${theme.breakpoints.sm}px) {
      display: none;
    }
  `,
)

const LogoAnchor = styled.a(
  () => css`
    cursor: pointer;
    transition: all 0.15s ease-in-out;

    & > svg {
      vertical-align: bottom;
    }

    &:hover {
      filter: brightness(1.05);
      transform: translateY(-1px);
    }
  `,
)

const NavContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    flex-gap: ${theme.space['3']};
    gap: ${theme.space['3']};
    height: ${theme.space['12']};

    @media (min-width: ${theme.breakpoints.lg}px) {
      flex-gap: ${theme.space['6']};
      gap: ${theme.space['6']};
    }
  `,
)

const RouteContainer = styled.div<{ $state: TransitionState }>(
  ({ theme, $state }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    flex-gap: ${theme.space['1']};
    gap: ${theme.space['1']};
    transition:
      transform 0.15s ease-in-out,
      opacity 0.15s ease-in-out;
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    transform: translateX(125%);
    opacity: 0;

    @media (min-width: ${theme.breakpoints.lg}px) {
      flex-gap: ${theme.space['6']};
      gap: ${theme.space['6']};
      position: relative;
    }

    ${$state === 'entered' &&
    css`
      transform: translateX(0%);
      opacity: 1;
    `}
  `,
)

const RouteWrapper = styled.div(
  () => css`
    position: relative;
  `,
)

const SearchWrapper = styled.div<{ $state: TransitionState }>(
  ({ theme, $state }) => css`
    width: ${theme.space.full};
    max-width: ${theme.space['80']};
    & > div > div {
      max-width: ${theme.space.full};
      @media (min-width: ${theme.breakpoints.lg}px) {
        max-width: ${theme.space['80']};
      }
    }

    transition: margin 0.15s ease-in-out;
    margin-right: ${theme.space['24']};
    ${$state !== 'entered' &&
    css`
      margin-right: 0;
    `}
    @media (min-width: ${theme.breakpoints.lg}px) {
      margin-right: 0;
    }
  `,
)

const routesNoSearch = routes.filter(
  (route) => route.name !== 'search' && route.icon && !route.onlyDropdown && !route.disabled,
)

export const Header = () => {
  const { space } = useTheme()
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

  const pathnameWithoutQuery = router.asPath.split('?')[0]

  return (
    <HeaderWrapper id="header">
      <NavContainer>
        <ConditionalWrapper
          condition={pathnameWithoutQuery !== '/'}
          wrapper={(children) => (
            <BaseLink passHref href="/">
              <LogoAnchor data-testid="home-button">{children}</LogoAnchor>
            </BaseLink>
          )}
        >
          {pathnameWithoutQuery === '/' ? (
            <ENSFull height={space['12']} />
          ) : (
            <ENSWithGradient height={space['12']} />
          )}
        </ConditionalWrapper>
        {pathnameWithoutQuery !== '/' && breakpoints.sm && (
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
        <RouteWrapper>
          <RouteContainer
            data-testid="route-container"
            ref={routeContainerRef}
            $state={breakpoints.lg ? 'entered' : state}
          >
            {RouteItems}
          </RouteContainer>
        </RouteWrapper>
        <Hamburger />
        <HeaderConnect />
      </NavContainer>
    </HeaderWrapper>
  )
}
