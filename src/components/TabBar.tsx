import { Avatar } from '@ensdomains/thorin'
import { zorbImageDataURI } from '@zoralabs/zorb'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ComponentProps, ComponentType, useMemo } from 'react'
import styled from 'styled-components'
import CogSVG from '../assets/Cog.svg'
import GridSVG from '../assets/Grid.svg'
import HeartSVG from '../assets/Heart.svg'
import MagnifyingGlassSVG from '../assets/MagnifyingGlass.svg'
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
  href,
  as,
  active,
}: {
  href: string
  as: string | ComponentType<any>
  active: boolean
}) => {
  return (
    <Link href={href} passHref>
      <LinkWrapper>
        <IconContainer $active={active} as={as} />
      </LinkWrapper>
    </Link>
  )
}

type Tab = 'search' | 'names' | 'profile' | 'favourites' | 'settings'
type AnyTab = Tab | 'unknown'

const tabs: {
  name: Tab
  href: string
  label: string
}[] = [
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
  ${({ theme }) => `
  background: linear-gradient(180deg, ${theme.colors.background}, 0) 0%, ${theme.colors.background} 50%);
  padding: ${theme.space['8']} ${theme.space['4']};
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
  padding: ${theme.space['4']} ${theme.space['8']};
  `}
`

const BottomPlaceholder = styled.div`
  ${({ theme }) => `
  height: ${theme.space['28']};
  `}
`

const AvatarWithZorb = ({
  src,
  address,
  ...props
}: ComponentProps<typeof Avatar> & { address: string }) => {
  const zorbImg = useMemo(() => zorbImageDataURI(address), [address])
  return <Avatar {...props} src={src || zorbImg} />
}

export const TabBar = () => {
  const router = useRouter()
  const path = router.pathname
  const activeTab: AnyTab =
    tabs.filter(({ href }) => path.startsWith(href))[0]?.name || 'unknown'

  return (
    <>
      <BottomPlaceholder />
      <TabWrapper>
        <TabContainer>
          <Icon
            active={activeTab === 'search'}
            href="/"
            as={MagnifyingGlassSVG}
          />
          <ConnectButtonWrapper>
            {({ ensAvatar, address }) => (
              <>
                <Icon
                  active={activeTab === 'names'}
                  href="/names"
                  as={GridSVG}
                />
                <Link href="/profile" passHref>
                  <a>
                    <AvatarWrapper $active={activeTab === 'profile'}>
                      <AvatarWithZorb
                        label="profile"
                        src={ensAvatar}
                        address={address}
                      />
                    </AvatarWrapper>
                  </a>
                </Link>
                <Icon
                  active={activeTab === 'favourites'}
                  href="/favourites"
                  as={HeartSVG}
                />
                <Icon
                  active={activeTab === 'settings'}
                  href="/settings"
                  as={CogSVG}
                />
              </>
            )}
          </ConnectButtonWrapper>
        </TabContainer>
      </TabWrapper>
    </>
  )
}
