import { useConnected } from '@app/hooks/useConnected'
import { Avatar } from '@ensdomains/thorin'
import { useRecentTransactions } from '@rainbow-me/rainbowkit'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ComponentType, useMemo } from 'react'
import styled, { css } from 'styled-components'
import CogSVG from '../assets/Cog.svg'
import GridSVG from '../assets/Grid.svg'
import HeartSVG from '../assets/Heart.svg'
import MagnifyingGlassSVG from '../assets/MagnifyingGlass.svg'
import { ConnectButtonWrapper } from './ConnectButton'

const AvatarWrapper = styled.div<{ $active: boolean }>`
  ${({ theme, $active }) => css`
    position: relative;
    width: ${theme.space['10']};
    border: 2px solid
      ${$active ? theme.colors.accent : 'rgba(196, 196, 196, 1)'};
    background-color: ${$active
      ? theme.colors.accent
      : 'rgba(196, 196, 196, 1)'};
    border-radius: ${theme.radii.full};
  `}
`

const LinkWrapper = styled.a<{ $hasNotification?: boolean }>`
  ${({ theme, $hasNotification }) => css`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${theme.space['12']};
    ${$hasNotification &&
    css`
      &::after {
        content: '';
        position: absolute;
        height: ${theme.space['4']};
        width: ${theme.space['4']};
        border: ${theme.space['0.5']} solid ${theme.colors.background};
        background-color: ${theme.colors.red};
        border-radius: ${theme.radii.full};
        top: calc(-1 * ${theme.space['2']});
        right: ${theme.space['0.5']};
      }
    `}
  `}
`

const IconContainer = styled.div<{ $active: boolean }>`
  ${({ theme, $active }) => css`
    color: ${$active ? theme.colors.accent : 'rgba(196, 196, 196, 1)'};
    width: ${theme.space['6']};
    height: ${theme.space['6']};
  `}
`

const Icon = ({
  as,
  tab,
  activeTab,
  hasNotification,
}: {
  tab: TabItem
  as: string | ComponentType<any>
  activeTab: AnyTab
  hasNotification?: boolean
}) => {
  return (
    <Link href={tab.href} passHref>
      <LinkWrapper $hasNotification={hasNotification}>
        <IconContainer $active={activeTab === tab.name} as={as} />
      </LinkWrapper>
    </Link>
  )
}
type TabItem = {
  name: Tab
  href: string
  label: string
}
type Tab = 'search' | 'names' | 'profile' | 'favourites' | 'settings'
type AnyTab = Tab | 'unknown'

const tabs: TabItem[] = [
  {
    name: 'search',
    href: '/',
    label: 'tabs.search',
  },
  {
    name: 'names',
    href: '/names',
    label: 'tabs.names',
  },
  {
    name: 'profile',
    href: '/my/profile',
    label: 'tabs.profile',
  },
  {
    name: 'favourites',
    href: '/my/favourites',
    label: 'tabs.favourites',
  },
  {
    name: 'settings',
    href: '/my/settings',
    label: 'tabs.settings',
  },
]

const TabWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
  ${({ theme }) => css`
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0) 0%,
      ${theme.colors.background} 60%
    );
    padding: ${theme.space['6']} ${theme.space['4']};
  `}
`

const TabContainer = styled.div<{ $connected: boolean }>`
  ${({ theme, $connected }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
    gap: ${theme.space['6']};
    border-radius: ${theme.radii.full};
    background-color: ${theme.colors.background};
    border: 1px solid rgba(0, 0, 0, 0.08);
    box-shadow: 0px 3px 24px ${theme.colors.borderTertiary};
    padding: ${theme.space['2']} ${theme.space['6']};
    ${!$connected &&
    css`
      padding-right: ${theme.space['2']};
    `}
  `}
`

const BottomPlaceholder = styled.div`
  ${({ theme }) => css`
    height: ${theme.space['28']};
  `}
`

export const TabBar = () => {
  const router = useRouter()
  const from = router.query.from as string
  const path = router.asPath
  const connected = useConnected()
  const activeTab: AnyTab = useMemo(
    () =>
      tabs.find(({ href, name }) => href === path || from === name)?.name ||
      'unknown',
    [path, from],
  )

  const transactions = useRecentTransactions()
  const pendingTransactions = transactions.filter((x) => x.status === 'pending')

  return (
    <>
      <BottomPlaceholder />
      <TabWrapper>
        <TabContainer $connected={connected}>
          <Icon activeTab={activeTab} tab={tabs[0]} as={MagnifyingGlassSVG} />
          {!connected && (
            <>
              <Icon activeTab={activeTab} tab={tabs[4]} as={CogSVG} />
              <div />
            </>
          )}
          <ConnectButtonWrapper isTabBar>
            {({ ensAvatar, zorb }) => (
              <>
                <Icon activeTab={activeTab} tab={tabs[1]} as={GridSVG} />
                <Link href={tabs[2].href} passHref>
                  <a>
                    <AvatarWrapper $active={activeTab === tabs[2].name}>
                      <Avatar label={tabs[2].label} src={ensAvatar || zorb} />
                    </AvatarWrapper>
                  </a>
                </Link>
                <Icon activeTab={activeTab} tab={tabs[3]} as={HeartSVG} />
                <Icon
                  activeTab={activeTab}
                  tab={tabs[4]}
                  as={CogSVG}
                  hasNotification={pendingTransactions.length > 0}
                />
              </>
            )}
          </ConnectButtonWrapper>
        </TabContainer>
      </TabWrapper>
    </>
  )
}
