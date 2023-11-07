import { useConnectModal } from '@rainbow-me/rainbowkit'
import { forwardRef, Key, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { Address } from 'viem'
import { useDisconnect, useEnsAvatar } from 'wagmi'

import {
  Box,
  BoxProps,
  Button,
  CheckSVG,
  CogSVG,
  CopySVG,
  cssVars,
  ExitSVG,
  PersonSVG,
  Profile,
} from '@ensdomains/thorin'
import { DropdownItem } from '@ensdomains/thorin2/dist/types/components/molecules/Dropdown/Dropdown'

import { useAccountSafely } from '@app/hooks/account/useAccountSafely'
import { usePrimaryName } from '@app/hooks/ensjs/public/usePrimaryName'
import useHasPendingTransactions from '@app/hooks/transactions/useHasPendingTransactions'
import { useCopied } from '@app/hooks/useCopied'
import { useZorb } from '@app/hooks/useZorb'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { shortenAddress } from '@app/utils/utils'

import BaseLink from './@atoms/BaseLink'

const SectionDivider = forwardRef<HTMLElement, BoxProps>((props, ref) => (
  <Box
    {...props}
    ref={ref}
    width={`calc(100% + ${cssVars.space['4']})`}
    height="$px"
    bg="$border"
  />
))

type Props = {
  isTabBar?: boolean
  large?: boolean
  inHeader?: boolean
}

const calculateTestId = (isTabBar: boolean | undefined, inHeader: boolean | undefined) => {
  if (isTabBar) {
    return 'tabbar-connect-button'
  }
  if (!inHeader) {
    return 'body-connect-button'
  }
  return 'connect-button'
}

export const ConnectButton = ({ isTabBar, large, inHeader }: Props) => {
  const { t } = useTranslation('common')
  const breakpoints = useBreakpoint()
  const { openConnectModal } = useConnectModal()

  return (
    <Box
      position={isTabBar ? 'absolute' : 'relative'}
      alignSelf={isTabBar ? 'center' : 'unset'}
      justifySelf={isTabBar ? 'center' : 'unset'}
      right={isTabBar ? '$2' : 'unset'}
    >
      <Button
        data-testid={calculateTestId(isTabBar, inHeader)}
        onClick={() => openConnectModal?.()}
        size={breakpoints.sm || large ? 'medium' : 'small'}
        width={inHeader ? '$45' : undefined}
        shape="rounded"
        px={isTabBar ? { base: '$4', xs: '$8' } : undefined}
        fontSize="$body"
        borderRadius={large ? '$large' : undefined}
      >
        {t('wallet.connect')}
      </Button>
    </Box>
  )
}

const HeaderProfile = ({ address }: { address: Address }) => {
  const { t } = useTranslation('common')

  const { data: primary } = usePrimaryName({ address })
  const { data: avatar } = useEnsAvatar({ name: primary?.name })
  const zorb = useZorb(address, 'address')
  const { disconnect } = useDisconnect()
  const { copy, copied } = useCopied(300)
  const hasPendingTransactions = useHasPendingTransactions()

  return (
    <Profile
      address={address}
      ensName={primary?.beautifiedName}
      dropdownItems={
        [
          ...(primary?.name
            ? [
                {
                  label: t('wallet.myProfile'),
                  wrapper: (children: ReactNode, key: Key) => (
                    <BaseLink href="/my/profile" key={key}>
                      {children}
                    </BaseLink>
                  ),
                  as: 'a' as 'a',
                  color: 'text',
                  icon: <PersonSVG />,
                },
              ]
            : []),
          {
            label: t('navigation.settings'),
            color: 'text',
            wrapper: (children: ReactNode, key: Key) => (
              <BaseLink href="/my/settings" key={key}>
                {children}
              </BaseLink>
            ),
            as: 'a',
            icon: <CogSVG />,
            showIndicator: hasPendingTransactions,
          },
          <SectionDivider key="divider" />,
          {
            label: shortenAddress(address),
            color: 'text',
            onClick: () => copy(address),
            icon: copied ? <CheckSVG /> : <CopySVG />,
          },
          {
            label: t('wallet.disconnect'),
            color: 'red',
            onClick: () => disconnect(),
            icon: <ExitSVG />,
          },
        ] as DropdownItem[]
      }
      avatar={{
        src: avatar || zorb,
        decoding: 'sync',
        loading: 'eager',
        icon: avatar ? undefined : <PersonSVG />,
      }}
      size="medium"
      alignDropdown="left"
      data-testid="header-profile"
    />
  )
}

export const HeaderConnect = () => {
  const { address } = useAccountSafely()

  if (!address) {
    return <ConnectButton inHeader />
  }

  return <HeaderProfile address={address} />
}
