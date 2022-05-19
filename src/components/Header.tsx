import { useConnected } from '@app/hooks/useConnected'
import mq from '@app/mediaQuery'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styled, { css, useTheme } from 'styled-components'
import ENSFull from '../assets/ENSFull.svg'
import ENSWithGradient from '../assets/ENSWithGradient.svg'
import { ConditionalWrapper } from './ConditionalWrapper'
import { HeaderConnect } from './ConnectButton'
import { HamburgerMenu } from './HamburgerMenu'
import { LanugageDropdown } from './LanguageDropdown'
import { SearchInput } from './SearchInput'
import { StyledNavLink } from './StyledNavLink'

const publicRoutes = [
  { href: '/', disabled: false, label: 'navigation.home' },
  { href: '/about', disabled: true, label: 'navigation.about' },
  { href: '/developers', disabled: true, label: 'navigation.developers' },
  {
    label: 'navigation.community',
    disabled: true,
    href: '/community',
  },
  {
    label: 'navigation.help',
    disabled: true,
    href: '/help',
  },
  {
    label: 'navigation.governance',
    disabled: true,
    href: '/governance',
  },
  {
    label: 'navigation.docs',
    disabled: true,
    href: '/docs',
  },
]

const connectedRoutes = [
  {
    label: 'navigation.connected.favourites',
    disabled: true,
    href: '/favourites',
  },
  { label: 'navigation.connected.myNames', disabled: false, href: '/names' },
]

const HeaderWrapper = styled.header<{
  $isHome: boolean
  $hasCustomItems: boolean
}>`
  ${({ theme, $isHome, $hasCustomItems }) => css`
    ${$hasCustomItems
      ? `
      height: min-content;
    `
      : `
      height: ${theme.space['16']};
    `}
    ${!$isHome &&
    mq.medium.min`
      margin-bottom: ${theme.space['6']};
    `}
  `}
`

const LogoAnchor = styled.a`
  cursor: pointer;
  transition: all 0.15s ease-in-out;

  & > svg {
    vertical-align: bottom;
  }

  &:hover {
    filter: brightness(1.05);
    transform: translateY(-1px);
  }
`

const VerticalLine = styled.div`
  ${({ theme }) => `
  width: 1px;
  height: ${theme.space['14']};
  background-color: ${theme.colors.borderSecondary};
  `}
`

const NavContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  ${({ theme }) => css`
    flex-gap: ${theme.space['3']};
    gap: ${theme.space['3']};
    ${mq.small.min`
      flex-gap: ${theme.space['6']};
      gap: ${theme.space['6']};
    `}
  `}
`

export const Header = ({
  leading,
  trailing,
}: {
  leading?: React.ReactNode
  trailing?: React.ReactNode
}) => {
  const router = useRouter()
  const breakpoints = useBreakpoint()
  const connected = useConnected()
  const { space } = useTheme()
  const { t } = useTranslation('common')
  const dropdownRoutes = breakpoints.sm
    ? [
        publicRoutes[0],
        ...(connected ? connectedRoutes : []),
        ...publicRoutes.slice(1),
      ]
    : publicRoutes.slice(1)
  const alwaysVisibleRoutes = breakpoints.lg ? dropdownRoutes.splice(0, 3) : []

  return (
    <HeaderWrapper
      $hasCustomItems={!!(leading || trailing)}
      $isHome={router.asPath === '/'}
    >
      <NavContainer>
        {leading || (
          <>
            <ConditionalWrapper
              condition={router.asPath !== '/'}
              wrapper={(children) => (
                <Link passHref href="/">
                  <LogoAnchor>{children}</LogoAnchor>
                </Link>
              )}
            >
              {breakpoints.sm && router.asPath === '/' ? (
                <ENSFull height={space['12']} />
              ) : (
                <ENSWithGradient height={space['12']} />
              )}
            </ConditionalWrapper>
            <LanugageDropdown />
            {router.asPath !== '/' && breakpoints.md && (
              <>
                <VerticalLine />
                <SearchInput size="large" />
              </>
            )}
          </>
        )}
        <div style={{ flexGrow: 1 }} />
        {trailing || (
          <>
            {alwaysVisibleRoutes.map((route) => (
              <StyledNavLink
                disabled={route.disabled}
                key={route.href}
                href={route.href}
              >
                {t(route.label)}
              </StyledNavLink>
            ))}
            <HamburgerMenu
              dropdownItems={dropdownRoutes.map((route) => ({
                ...route,
                label: t(route.label),
              }))}
            />
            {breakpoints.sm && <HeaderConnect />}
          </>
        )}
      </NavContainer>
    </HeaderWrapper>
  )
}
