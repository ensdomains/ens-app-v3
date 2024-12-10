import { useConnectModal } from '@rainbow-me/rainbowkit'
import { Key, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import type { Address } from 'viem'
import { useDisconnect, useEnsAvatar } from 'wagmi'

import { Button, CheckSVG, CogSVG, CopySVG, ExitSVG, PersonSVG, Profile } from '@ensdomains/thorin'
import { DropdownItem } from '@ensdomains/thorin/dist/types/components/molecules/Dropdown/Dropdown'

import { useAccountSafely } from '@app/hooks/account/useAccountSafely'
import { usePrimaryName } from '@app/hooks/ensjs/public/usePrimaryName'
import useHasPendingTransactions from '@app/hooks/transactions/useHasPendingTransactions'
import { useCopied } from '@app/hooks/useCopied'
import { useRouterWithHistory } from '@app/hooks/useRouterWithHistory'
import { useZorb } from '@app/hooks/useZorb'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { ensAvatarConfig } from '@app/utils/query/ipfsGateway'
import { shortenAddress } from '@app/utils/utils'

import BaseLink from './@atoms/BaseLink'

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

const SectionDivider = styled.div(
  ({ theme }) => css`
    width: calc(100% + ${theme.space['4']});
    height: 1px;
    background-color: ${theme.colors.border};
  `,
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
        onClick={() => openConnectModal?.()}
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
                  icon: PersonSVG,
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
            icon: CogSVG,
            showIndicator: hasPendingTransactions,
          },
          <SectionDivider key="divider" />,
          {
            label: shortenAddress(address),
            color: 'text',
            onClick: () => copy(address),
            icon: copied ? CheckSVG : CopySVG,
          },
          {
            label: t('wallet.disconnect'),
            color: 'red',
            onClick: () => disconnect(),
            icon: ExitSVG,
          },
        ] as DropdownItem[]
      }
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
