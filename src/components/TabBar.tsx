import Link from 'next/link'
import { useRouter } from 'next/router'
import { ComponentType, useMemo } from 'react'
import styled from 'styled-components'
import CogSVG from '../assets/Cog.svg'
import GridSVG from '../assets/Grid.svg'
import HeartSVG from '../assets/Heart.svg'
import MagnifyingGlassSVG from '../assets/MagnifyingGlass.svg'
import { AvatarWithZorb } from './AvatarWithZorb'
import { ConnectButtonWrapper } from './ConnectButton'

const AvatarWrapper = styled.div<{ $active: boolean }>`
  ${({ theme, $active }) => `
  position: relative;
  border: 2px solid ${$active ? theme.colors.accent : 'rgba(196, 196, 196, 1)'};
  background-color: ${$active ? theme.colors.accent : 'rgba(196, 196, 196, 1)'};
  border-radius: ${theme.radii.full};
  `}
`

const LinkWrapper = styled.a`
  height: 24px;
  width: 24px;
`

const IconContainer = styled.div<{ $active: boolean }>`
  color: ${({ theme, $active }) =>
    $active ? theme.colors.accent : 'rgba(196, 196, 196, 1)'};
`

const Icon = ({
  as,
  tab,
  activeTab,
}: {
  tab: TabItem
  as: string | ComponentType<any>
  activeTab: AnyTab
}) => {
  return (
    <Link href={tab.href} passHref>
      <LinkWrapper>
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
    href: '/profile',
    label: 'tabs.profile',
  },
  {
    name: 'favourites',
    href: '/favourites',
    label: 'tabs.favourites',
  },
  {
    name: 'settings',
    href: '/settings',
    label: 'tabs.settings',
  },
]

const TabWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
  ${({ theme }) => `
  background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, ${theme.colors.background} 60%);
  padding: ${theme.space['6']} ${theme.space['4']};
  `}
`

const TabContainer = styled.div`
  ${({ theme }) => `
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-radius: ${theme.radii.full};
  background-color: ${theme.colors.background};
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0px 3px 24px ${theme.colors.borderTertiary};
  padding: ${theme.space['2']} ${theme.space['8']};
  `}
`

const BottomPlaceholder = styled.div`
  ${({ theme }) => `
  height: ${theme.space['28']};
  `}
`

export const TabBar = () => {
  const router = useRouter()
  const from = router.query.from as string
  const path = router.pathname
  const activeTab: AnyTab = useMemo(
    () =>
      tabs.find(({ href, name }) => href === path || from === name)?.name ||
      'unknown',
    [path, from],
  )

  return (
    <>
      <BottomPlaceholder />
      <TabWrapper>
        <TabContainer>
          <Icon activeTab={activeTab} tab={tabs[0]} as={MagnifyingGlassSVG} />
          <ConnectButtonWrapper>
            {({ ensAvatar, address }) => (
              <>
                <Icon activeTab={activeTab} tab={tabs[1]} as={GridSVG} />
                <Link href={tabs[2].href} passHref>
                  <a>
                    <AvatarWrapper $active={activeTab === tabs[2].name}>
                      <AvatarWithZorb
                        label={tabs[2].label}
                        src={ensAvatar}
                        address={address}
                      />
                    </AvatarWrapper>
                  </a>
                </Link>
                <Icon activeTab={activeTab} tab={tabs[3]} as={HeartSVG} />
                <Icon activeTab={activeTab} tab={tabs[4]} as={CogSVG} />
              </>
            )}
          </ConnectButtonWrapper>
        </TabContainer>
      </TabWrapper>
    </>
  )
}
