import { useRouter } from 'next/router'
import { ReactNode, useCallback, useEffect, useRef } from 'react'
import useTransition, { TransitionState } from 'react-transition-state'
import styled, { css, useTheme } from 'styled-components'
import { useAccount } from 'wagmi'

import { mq } from '@ensdomains/thorin'

import { useRecentTransactions } from '@app/hooks/transactions/useRecentTransactions'
import { useInitial } from '@app/hooks/useInitial'
import { routes } from '@app/routes'
import { useBreakpoint } from '@app/utils/BreakpointProvider'

import ENSFull from '../assets/ENSFull.svg'
import ENSWithGradient from '../assets/ENSWithGradient.svg'
import BaseLink from './@atoms/BaseLink'
import { HamburgerMenu } from './@atoms/HamburgerMenu'
import { RouteItem } from './@atoms/RouteItem/RouteItem'
import { SearchInput } from './@molecules/SearchInput/SearchInput'
import { ConditionalWrapper } from './ConditionalWrapper'
import { HeaderConnect } from './ConnectButton'

const HeaderWrapper = styled.header(
  () => css`
    height: min-content;
    ${mq.md.max(css`
      display: none;
    `)}
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

const VerticalLine = styled.div(
  ({ theme }) => css`
    width: 1px;
    height: ${theme.space['14']};
    background-color: ${theme.colors.borderSecondary};
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

    ${mq.md.min(css`
      height: ${theme.space['18']};
    `)}

    ${mq.lg.min(css`
      flex-gap: ${theme.space['6']};
      gap: ${theme.space['6']};
    `)}
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
    transition: transform 0.15s ease-in-out;
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    transform: translateX(125%);

    ${mq.lg.min(css`
      flex-gap: ${theme.space['6']};
      gap: ${theme.space['6']};
      position: relative;
    `)}

    ${$state === 'entered' &&
    css`
      transform: translateX(0%);
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
    & > div > div {
      max-width: ${theme.space.full};
      ${mq.lg.min(css`
        max-width: ${theme.space['96']};
      `)}
    }

    transition: margin 0.15s ease-in-out;
    margin-right: ${theme.space['32']};
    ${$state !== 'entered' &&
    css`
      margin-right: 0;
    `}
    ${mq.lg.min(css`
      margin-right: 0;
    `)}
  `,
)

const routesNoSearch = routes.filter((route) => route.name !== 'search' && route.icon)

const dropdownRoutes = routes.filter(
  (route) => route.name !== 'search' && route.connected === false,
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

  // eslint-disable-next-line no-nested-ternary
  const statefulRoutes = isConnected
    ? dropdownRoutes
    : breakpoints.lg
    ? dropdownRoutes.slice(4)
    : dropdownRoutes

  let RouteItems: ReactNode

  if (!isInitial && isConnected) {
    RouteItems = routesNoSearch.map((route) => (
      <RouteItem
        key={route.name}
        route={route}
        asText={breakpoints.lg}
        hasNotification={route.name === 'settings' && pendingTransactions.length > 0}
      />
    ))
  } else if (breakpoints.lg) {
    RouteItems = dropdownRoutes
      .slice(0, 4)
      .map((route) => <RouteItem key={route.name} route={route} asText />)
  } else {
    RouteItems = null
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
    <HeaderWrapper>
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
            <ENSFull height={space['12']} />
          ) : (
            <ENSWithGradient height={space['12']} />
          )}
        </ConditionalWrapper>
        {!isInitial && isConnected && <HamburgerMenu align="left" dropdownItems={statefulRoutes} />}
        {router.asPath !== '/' && breakpoints.md && (
          <>
            <VerticalLine />
            <SearchWrapper
              data-testid="search-wrapper"
              ref={searchWrapperRef}
              $state={breakpoints.lg ? 'entered' : state}
            >
              <SearchInput size="large" />
            </SearchWrapper>
          </>
        )}
        {(isInitial ||
          (isConnected && (breakpoints.lg || router.asPath === '/')) ||
          !isConnected) && <div style={{ flexGrow: 1 }} />}
        <RouteWrapper>
          <RouteContainer
            data-testid="route-container"
            ref={routeContainerRef}
            $state={breakpoints.lg ? 'entered' : state}
          >
            {RouteItems}
          </RouteContainer>
        </RouteWrapper>
        {!isInitial && !isConnected && <HamburgerMenu dropdownItems={statefulRoutes} />}
        <HeaderConnect />
      </NavContainer>
    </HeaderWrapper>
  )
}
