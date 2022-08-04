import { useActiveRoute } from '@app/hooks/useActiveRoute'
import { getRoute } from '@app/routes'
import { Avatar } from '@ensdomains/thorin'
import { useRecentTransactions } from '@rainbow-me/rainbowkit'
import Link from 'next/link'
import styled, { css } from 'styled-components'
import { RouteItem } from './@atoms/RouteItem/RouteItem'
import { ConnectButtonWrapper } from './ConnectButton'

const AvatarWrapper = styled.div<{ $active: boolean }>(
  ({ theme, $active }) => css`
    position: relative;
    width: ${theme.space['10']};
    border: 2px solid ${$active ? theme.colors.accent : 'rgba(196, 196, 196, 1)'};
    background-color: ${$active ? theme.colors.accent : 'rgba(196, 196, 196, 1)'};
    border-radius: ${theme.radii.full};
  `,
)

const TabWrapper = styled.div(
  ({ theme }) => css`
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, ${theme.colors.background} 60%);
    padding: ${theme.space['6']} ${theme.space['4']};
  `,
)

const TabContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: ${theme.space['3']};
    border-radius: ${theme.radii.full};
    background-color: ${theme.colors.background};
    border: 1px solid rgba(0, 0, 0, 0.08);
    box-shadow: 0px 3px 24px ${theme.colors.borderTertiary};
    padding: ${theme.space['1.5']} ${theme.space['1.5']};
  `,
)

const TabItems = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-grow: 1;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
    gap: ${theme.space['3']};
    padding: 0 ${theme.space['1.5']};
  `,
)

const profileRoute = getRoute('profile')

export const TabBar = () => {
  const activeRoute = useActiveRoute()

  const transactions = useRecentTransactions()
  const pendingTransactions = transactions.filter((x) => x.status === 'pending')

  return (
    <>
      <TabWrapper id="tabbar">
        <TabContainer>
          <ConnectButtonWrapper isTabBar>
            {{
              hasAccount: ({ ensAvatar, zorb }) => (
                <TabItems>
                  <RouteItem route={getRoute('search')} />
                  <RouteItem route={getRoute('names')} />
                  <Link href={profileRoute.href} passHref>
                    <a>
                      <AvatarWrapper $active={activeRoute === 'profile'}>
                        <Avatar label={profileRoute.label} src={ensAvatar || zorb} />
                      </AvatarWrapper>
                    </a>
                  </Link>
                  <RouteItem route={getRoute('favourites')} />
                  <RouteItem route={getRoute('settings')} hasNotification={pendingTransactions.length > 0} />
                </TabItems>
              ),
              noAccountBefore: (
                <TabItems>
                  <RouteItem route={getRoute('search')} />
                  {/* Re-add when functionality for disconnected user settings */}
                  {/* <RouteItem route={getRoute('settings')} /> */}
                </TabItems>
              ),
            }}
          </ConnectButtonWrapper>
        </TabContainer>
      </TabWrapper>
    </>
  )
}
