import { Key, ReactNode } from 'react'
import styled, { css } from 'styled-components'
import { Address } from 'viem'

import { CheckSVG, CogSVG, CopySVG, ExitSVG, PersonSVG, WalletSVG } from '@ensdomains/thorin'
import type { DropdownItem } from '@ensdomains/thorin/dist/types/components/molecules/Dropdown/Dropdown'

import { shortenAddress } from '@app/utils/utils'

import BaseLink from '../../@atoms/BaseLink'

const SectionDivider = styled.div(
  ({ theme }) => css`
    width: calc(100% + ${theme.space['4']});
    height: 1px;
    background-color: ${theme.colors.border};
  `,
)

export const getDropdownItems = ({
  primary,
  disconnect,
  copy,
  copied,
  hasPendingTransactions,
  isParaConnected,
  t,
  address,
}: {
  primary: any
  disconnect: any
  copy: any
  copied: any
  hasPendingTransactions: any
  isParaConnected: boolean
  t: any
  address: Address
}): DropdownItem[] =>
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
    ...(isParaConnected
      ? [
          {
            label: t('wallet.myWallet'),
            color: 'text',
            icon: WalletSVG,
            wrapper: (children: ReactNode, key: Key) => (
              <a
                href="https://connect.getpara.com/"
                key={key}
                target="_blank"
                rel="noreferrer"
                style={{ width: '100%' }}
              >
                {children}
              </a>
            ),
          },
        ]
      : []),
    {
      label: t('wallet.disconnect'),
      color: 'red',
      onClick: () => disconnect(),
      icon: ExitSVG,
    },
  ] as DropdownItem[]
