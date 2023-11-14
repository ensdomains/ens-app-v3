/* eslint-disable @next/next/no-img-element */
import { useRouter } from 'next/router'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { match, P } from 'ts-pattern'
import { useEnsAvatar } from 'wagmi'

import {
  Avatar,
  Box,
  BoxProps,
  CrossSVG,
  cssVars,
  LeftChevronSVG,
  PersonSVG,
} from '@ensdomains/thorin'

import { useAccountSafely } from '@app/hooks/account/useAccountSafely'
import { usePrimaryName } from '@app/hooks/ensjs/public/usePrimaryName'
import useHasPendingTransactions from '@app/hooks/transactions/useHasPendingTransactions'
import { useZorb } from '@app/hooks/useZorb'
import { getDestination, getRoute, legacyFavouritesRoute } from '@app/routes'

import { DisconnectButton, RouteItem } from '../@atoms/RouteItem/RouteItem'
import { ConnectButton } from '../ConnectButton'
import { tabBarWidth, tabContainer } from './style.css'

const ExtraNavWrapper = ({ $isOpen, ...props }: BoxProps & { $isOpen: boolean }) => (
  <Box
    {...props}
    width={$isOpen ? `calc(${tabBarWidth} - ${cssVars.space['4']})` : '$10'}
    height="$10"
    display="flex"
    flexDirection="row"
    alignItems="center"
    justifyContent="flex-start"
    gap="$4"
    overflow="hidden"
    transition="width 0.15s ease-in-out"
  />
)

const AvatarWrapper = (props: BoxProps) => (
  <Box
    {...props}
    position="relative"
    overflow="hidden"
    minWidth="$10"
    width="$10"
    height="$10"
    backgroundColor="rgba(196, 196, 196, 1)"
    borderRadius="$full"
  />
)

const TabWrapper = (props: BoxProps) => (
  <Box
    {...props}
    position="fixed"
    display={{ base: 'flex', sm: 'none' }}
    flexDirection="row"
    alignItems="center"
    justifyContent="center"
    gap="$2"
    bottom="0"
    left="0"
    right="0"
    zIndex="100"
    background={`linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, ${cssVars.color.backgroundSecondary} 60%)`}
    padding="$4"
  />
)

const TabContainer = ({ $shrink, ...props }: BoxProps & { $shrink?: boolean }) => (
  <Box
    {...props}
    className={tabContainer[$shrink ? 'shrink' : 'normal']}
    width={tabBarWidth}
    height="$14"
    display="flex"
    alignItems="center"
    justifyContent="center"
    gap="$6"
    borderRadius="$full"
    bg="$background"
    border={`2px solid ${cssVars.color.border}`}
    paddingLeft="$2"
    overflow="hidden"
    position="relative"
    transition="width 0.15s ease-in-out"
  />
)

const TabItems = ({ $isConnected, ...props }: BoxProps & { $isConnected: boolean }) => (
  <Box
    {...props}
    position="absolute"
    right={$isConnected ? '0' : undefined}
    left={$isConnected ? undefined : '$4'}
    display="flex"
    flexGrow={1}
    flexDirection="row"
    alignItems="center"
    justifyContent="center"
    gap="$4"
    px="$1.5"
  />
)

const BackButton = (props: BoxProps) => (
  <Box
    {...props}
    as="button"
    width="$10"
    height="$10"
    border={`2px solid ${cssVars.color.border}`}
    borderRadius="$full"
    bg="$background"
    display="flex"
    alignItems="center"
    justifyContent="center"
    color="$grey"
  />
)

const profileRoute = getRoute('profile')

const TabBarProfile = ({
  address,
  isOpen,
  setIsOpen,
  name,
}: {
  address: string
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  name?: string
}) => {
  const router = useRouter()
  const { data: avatar } = useEnsAvatar({ name })
  const zorb = useZorb(address, 'address')
  const hasPendingTransactions = useHasPendingTransactions()

  const avatarIcon = match([isOpen, !!avatar])
    .with([true, P._], () => <CrossSVG />)
    .with([false, false], () => <PersonSVG />)
    .otherwise(() => undefined)

  return (
    <ExtraNavWrapper $isOpen={isOpen} id="tab-bar-nav">
      <AvatarWrapper onClick={() => setIsOpen((prev) => !prev)}>
        <Avatar label="" src={avatar || zorb} icon={avatarIcon} />
      </AvatarWrapper>
      {name && (
        <RouteItem
          route={profileRoute}
          active={router.asPath === getDestination(`/profile/${name}`)}
        />
      )}
      <RouteItem route={getRoute('settings')} hasNotification={hasPendingTransactions} />
      <DisconnectButton />
    </ExtraNavWrapper>
  )
}

export const TabBar = () => {
  const router = useRouter()

  const { address } = useAccountSafely()
  const primary = usePrimaryName({ address })

  const hasPrimary = !!primary.data?.name
  const hasBack = !!router.query.from

  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleRouteChange = () => {
      setIsOpen(false)
    }
    router.events.on('routeChangeStart', handleRouteChange)
    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [router.events])

  useEffect(() => {
    if (!address) {
      setIsOpen(false)
    }
  }, [address])

  return (
    <>
      <TabWrapper id="tabbar">
        {hasBack && (
          <BackButton onClick={() => router.back()}>
            <Box as={<LeftChevronSVG />} wh="$6" />
          </BackButton>
        )}
        <TabContainer $shrink={!!(address && ((isOpen && !hasPrimary) || !isOpen))}>
          <TabItems $isConnected={!!address}>
            <RouteItem route={getRoute('search')} />
            {address && (
              <>
                <RouteItem route={getRoute('names')} />
                {globalThis?.localStorage?.getItem('ensFavourites') && (
                  <RouteItem route={legacyFavouritesRoute} />
                )}
                <TabBarProfile
                  address={address}
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                  name={primary.data?.name}
                />
              </>
            )}
          </TabItems>
          {!address && <ConnectButton isTabBar />}
        </TabContainer>
      </TabWrapper>
    </>
  )
}
