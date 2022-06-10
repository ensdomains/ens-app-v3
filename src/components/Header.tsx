import { useConnected } from '@app/hooks/useConnected'
import { routes } from '@app/routes'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { mq } from '@ensdomains/thorin'
import { useRecentTransactions } from '@rainbow-me/rainbowkit'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styled, { css, useTheme } from 'styled-components'
import ENSFull from '../assets/ENSFull.svg'
import ENSWithGradient from '../assets/ENSWithGradient.svg'
import { HamburgerMenu } from './@atoms/HamburgerMenu'
import { RouteItem } from './@atoms/RouteItem'
import { ConditionalWrapper } from './ConditionalWrapper'
import { HeaderConnect } from './ConnectButton'
import { SearchInput } from './SearchInput'

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
    ${mq.sm.min(css`
      flex-gap: ${theme.space['6']};
      gap: ${theme.space['6']};
    `)}
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
          <HamburgerMenu align="left" dropdownItems={dropdownRoutes} />
        )}
        {router.asPath !== '/' && breakpoints.md && (
          <>
            <VerticalLine />
            <SearchInput size="large" />
          </>
        )}
        <div style={{ flexGrow: 1 }} />
        {connected &&
          routesNoSearch.map((route) => (
            <RouteItem
              key={route.name}
              route={route}
              asText
              hasNotification={
                route.name === 'settings' && pendingTransactions.length > 0
              }
            />
          ))}
        {!connected && <HamburgerMenu dropdownItems={dropdownRoutes} />}
        {breakpoints.sm && <HeaderConnect />}
      </NavContainer>
    </HeaderWrapper>
  )
}
