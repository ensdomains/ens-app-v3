import mq from '@app/mediaQuery'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { tokens } from '@ensdomains/thorin'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import ENSFull from '../assets/ENSFull.svg'
import ENSWithGradient from '../assets/ENSWithGradient.svg'
import { ConditionalWrapper } from './ConditionalWrapper'
import { HamburgerMenu } from './HamburgerMenu'
import { HeaderConnect } from './HeaderConnect'
import { LanugageDropdown } from './LanguageDropdown'
import { SearchInput } from './SearchInput'
import { StyledNavLink } from './StyledNavLink'

const AlwaysShownRoutes = [
  { href: '/', label: 'navigation.home' },
  { href: '/about', disabled: true, label: 'navigation.about' },
  { href: '/developers', disabled: true, label: 'navigation.developers' },
]

const DropdownRoutes = [
  {
    label: 'navigation.community',
    href: '/community',
    disabled: true,
  },
  {
    label: 'navigation.help',
    href: '/help',
    disabled: true,
  },
  {
    label: 'navigation.governance',
    href: '/governance',
    disabled: true,
  },
  {
    label: 'navigation.docs',
    href: '/docs',
    disabled: true,
  },
]

const HeaderWrapper = styled.header<{ $isHome: boolean }>`
  height: ${tokens.space['16']};
  ${({ $isHome }) =>
    !$isHome &&
    mq.medium.min`
    margin-bottom:  ${tokens.space['12']};
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
  width: 1px;
  height: ${tokens.space['14']};
  background-color: ${({ theme }) => tokens.colors[theme.mode].borderSecondary};
`

const NavContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-gap: ${tokens.space['3']};
  gap: ${tokens.space['3']};
  ${mq.small.min`
    flex-gap: ${tokens.space['6']};
    gap: ${tokens.space['6']};
  `}
`

export const Header = () => {
  const router = useRouter()
  const breakpoints = useBreakpoint()
  const { t } = useTranslation('common')

  return (
    <HeaderWrapper $isHome={router.asPath === '/'}>
      <NavContainer>
        <ConditionalWrapper
          condition={router.asPath !== '/'}
          wrapper={(children) => (
            <Link passHref href="/">
              <LogoAnchor>{children}</LogoAnchor>
            </Link>
          )}
        >
          {breakpoints.sm && router.asPath === '/' ? (
            <ENSFull height={tokens.space['12']} />
          ) : (
            <ENSWithGradient height={tokens.space['12']} />
          )}
        </ConditionalWrapper>
        <LanugageDropdown />
        {router.asPath !== '/' && breakpoints.md && (
          <>
            <VerticalLine />
            <SearchInput size="large" />
          </>
        )}
        <div style={{ flexGrow: 1 }} />
        {breakpoints.lg &&
          AlwaysShownRoutes.map((route) => (
            <StyledNavLink
              disabled={route.disabled}
              key={route.href}
              href={route.href}
            >
              {t(route.label)}
            </StyledNavLink>
          ))}
        <HamburgerMenu
          dropdownItems={(!breakpoints.lg
            ? [...AlwaysShownRoutes, ...DropdownRoutes]
            : DropdownRoutes
          ).map((route) => ({ ...route, label: t(route.label) }))}
        />
        <HeaderConnect />
      </NavContainer>
    </HeaderWrapper>
  )
}
