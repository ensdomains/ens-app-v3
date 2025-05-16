import { useConnectModal } from '@getpara/rainbowkit'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import type { Address } from 'viem'
import { useConnections, useDisconnect, useEnsAvatar } from 'wagmi'

import { Button, PersonSVG, Profile } from '@ensdomains/thorin'

import { useAccountSafely } from '@app/hooks/account/useAccountSafely'
import { usePrimaryName } from '@app/hooks/ensjs/public/usePrimaryName'
import useHasPendingTransactions from '@app/hooks/transactions/useHasPendingTransactions'
import { useCopied } from '@app/hooks/useCopied'
import { useRouterWithHistory } from '@app/hooks/useRouterWithHistory'
import { useZorb } from '@app/hooks/useZorb'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { ensAvatarConfig } from '@app/utils/query/ipfsGateway'
import { hasParaConnection } from '@app/utils/utils'

import { getDropdownItems } from './utils'

const StyledButtonWrapper = styled.div<{ $isTabBar?: boolean; $large?: boolean }>(
  ({ theme, $isTabBar, $large }) => [
    $isTabBar
      ? css`
          position: absolute;
          align-self: center;
          justify-self: center;

          right: ${theme.space['2']};

          & button {
            padding: 0 ${theme.space['4']};
            width: ${theme.space.full};
            height: ${theme.space['10']};
            border-radius: ${theme.radii.full};
            font-size: ${theme.fontSizes.body};
            @media (min-width: ${theme.breakpoints.xs}px) {
              padding: 0 ${theme.space['8']};
            }
          }
        `
      : css`
          position: relative;
          & button {
            /* border-radius: ${theme.radii['2xLarge']}; */
          }
          ${$large &&
          css`
            width: 100%;
            & button {
              border-radius: ${theme.radii.large};
            }
          `}
        `,
  ],
)

const PersonOverlay = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: center;

    z-index: 1;

    background: rgba(0, 0, 0, 0.25);

    svg {
      color: ${theme.colors.background};
    }
  `,
)

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
    <StyledButtonWrapper $large={large} $isTabBar={isTabBar}>
      <Button
        data-testid={calculateTestId(isTabBar, inHeader)}
        onClick={() => {
          openConnectModal?.()
        }}
        size={breakpoints.sm || large ? 'medium' : 'small'}
        width={inHeader ? '45' : undefined}
        shape="rounded"
      >
        {t('wallet.connect')}
      </Button>
    </StyledButtonWrapper>
  )
}

const HeaderProfile = ({ address }: { address: Address }) => {
  const { t } = useTranslation('common')

  const { data: primary } = usePrimaryName({ address })
  const { data: avatar } = useEnsAvatar({ ...ensAvatarConfig, name: primary?.name })
  const zorb = useZorb(address, 'address')

  const router = useRouterWithHistory()

  const { disconnect } = useDisconnect({
    mutation: {
      onSuccess: () => {
        router.push('/')
      },
    },
  })
  const { copy, copied } = useCopied(300)
  const hasPendingTransactions = useHasPendingTransactions()

  const connections = useConnections()
  const isParaConnected = hasParaConnection(connections)

  return (
    <Profile
      address={address}
      ensName={primary?.beautifiedName}
      dropdownItems={getDropdownItems({
        primary,
        disconnect,
        copy,
        copied,
        hasPendingTransactions,
        isParaConnected,
        t,
        address,
      })}
      avatar={{
        src: avatar || zorb,
        decoding: 'sync',
        loading: 'eager',
        icon: avatar
          ? undefined
          : () => (
              <PersonOverlay>
                <PersonSVG />
              </PersonOverlay>
            ),
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
