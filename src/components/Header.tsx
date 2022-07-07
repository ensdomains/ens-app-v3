import { useConnected } from '@app/hooks/useConnected'
import { routes } from '@app/routes'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { mq } from '@ensdomains/thorin'
import { useRecentTransactions } from '@rainbow-me/rainbowkit'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useRef } from 'react'
import useTransition, { TransitionState } from 'react-transition-state'
import styled, { css, useTheme } from 'styled-components'
import ENSFull from '../assets/ENSFull.svg'
import ENSWithGradient from '../assets/ENSWithGradient.svg'
import { HamburgerMenu } from './@atoms/HamburgerMenu'
import { RouteItem } from './@atoms/RouteItem/RouteItem'
import { SearchInput } from './@molecules/SearchInput/SearchInput'
import { ConditionalWrapper } from './ConditionalWrapper'
import { HeaderConnect } from './ConnectButton'

const HeaderWrapper = styled.header(
  () => css`
    height: min-content;
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
    ${mq.lg.min(css`
      flex-gap: ${theme.space['6']};
      gap: ${theme.space['6']};
    `)}
  `,
)

const RouteContainer = styled.div<{ $state: TransitionState }>(
  ({ theme, $state }) => css`
    width: min-content;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    flex-gap: ${theme.space['1']};
    gap: ${theme.space['1']};
    transition: transform 0.15s ease-in-out, display 0s linear 0.16s;
    display: none;

    ${mq.lg.min(css`
      flex-gap: ${theme.space['6']};
      gap: ${theme.space['6']};
    `)}

    ${$state === 'entered' &&
    css`
      display: flex;
    `}
  `,
)

const SearchWrapper = styled.div(
  ({ theme }) => css`
    width: ${theme.space.full};
  `,
)

const routesNoSearch = routes.filter(
  (route) => route.name !== 'search' && route.icon,
)

const dropdownRoutes = routes.filter(
  (route) => route.name !== 'search' && route.connected === false,
)

export const Header = () => {
  const { space } = useTheme()
  const router = useRouter()
  const connected = useConnected()
  const breakpoints = useBreakpoint()
  const transactions = useRecentTransactions()
  const pendingTransactions = transactions.filter((x) => x.status === 'pending')
  const searchWrapperRef = useRef<HTMLDivElement>(null)
  const routeContainerRef = useRef<HTMLDivElement>(null)
  const [state, toggle] = useTransition({
    timeout: {
      enter: 50,
      exit: 300,
    },
    mountOnEnter: true,
    unmountOnExit: true,
    initialEntered: true,
  })

  // eslint-disable-next-line no-nested-ternary
  const statefulRoutes = connected
    ? dropdownRoutes
    : breakpoints.lg
    ? dropdownRoutes.slice(3)
    : dropdownRoutes

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
            <Link passHref href="/">
              <LogoAnchor>{children}</LogoAnchor>
            </Link>
          )}
        >
          {router.asPath === '/' ? (
            <ENSFull height={space['12']} />
          ) : (
            <ENSWithGradient height={space['12']} />
          )}
        </ConditionalWrapper>
        {connected && (
          <HamburgerMenu align="left" dropdownItems={statefulRoutes} />
        )}
        {router.asPath !== '/' && breakpoints.md && (
          <>
            <VerticalLine />
            <SearchWrapper ref={searchWrapperRef}>
              <SearchInput size="large" />
            </SearchWrapper>
          </>
        )}
        {((connected && (breakpoints.lg || router.asPath === '/')) ||
          !connected) && <div style={{ flexGrow: 1 }} />}
        <RouteContainer
          ref={routeContainerRef}
          $state={breakpoints.lg ? 'entered' : state}
        >
          {/* eslint-disable-next-line no-nested-ternary */}
          {connected
            ? routesNoSearch.map((route) => (
                <RouteItem
                  key={route.name}
                  route={route}
                  asText={breakpoints.lg}
                  hasNotification={
                    route.name === 'settings' && pendingTransactions.length > 0
                  }
                />
              ))
            : breakpoints.lg
            ? dropdownRoutes
                .slice(0, 3)
                .map((route) => (
                  <RouteItem key={route.name} route={route} asText />
                ))
            : null}
        </RouteContainer>
        {!connected && <HamburgerMenu dropdownItems={statefulRoutes} />}
        {breakpoints.md && <HeaderConnect />}
      </NavContainer>
    </HeaderWrapper>
  )
}
