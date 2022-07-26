import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { zorbImageDataURI } from '@app/utils/gradient'
import { Button, mq, Profile } from '@ensdomains/thorin'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { TFunction } from 'react-i18next'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useDisconnect } from 'wagmi'

const StyledButtonWrapper = styled.div<{ $isTabBar?: boolean }>(({ theme, $isTabBar }) =>
  $isTabBar
    ? css`
        align-self: flex-end;
        justify-self: flex-end;
        & button {
          padding: 0 ${theme.space['4']};
          width: ${theme.space.full};
          height: ${theme.space['12']};
          border-radius: ${theme.radii.full};
          font-size: ${theme.fontSizes.base};
          ${mq.xs.min(css`
            padding: 0 ${theme.space['8']};
          `)}
        }
      `
    : css`
        & button {
          border-radius: ${theme.radii['2xLarge']};
        }
      `,
)

export type AccountRenderProps = {
  address: string
  balanceDecimals?: number
  balanceFormatted?: string
  balanceSymbol?: string
  displayBalance?: string
  displayName: string
  ensAvatar?: string
  ensName?: string
  hasPendingTransactions: boolean
  disconnect: () => void
  router: ReturnType<typeof useRouter>
  t: TFunction
  zorb: string
}

export const ConnectButtonWrapper = ({
  isTabBar,
  children,
}: {
  isTabBar?: boolean
  children: {
    hasAccount: (renderProps: AccountRenderProps) => React.ReactNode
    noAccountBefore?: React.ReactNode
    noAccountAfter?: React.ReactNode
  }
}) => {
  const router = useRouter()
  const { t } = useTranslation('common')
  const breakpoints = useBreakpoint()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { disconnect } = useDisconnect()

  return (
    <ConnectButton.Custom>
      {({ account, openConnectModal }) =>
        !account ? (
          <>
            {children.noAccountBefore}
            <StyledButtonWrapper $isTabBar={isTabBar}>
              <Button
                data-testid="connect-button"
                onClick={() => openConnectModal()}
                variant="primary"
                size={breakpoints.md ? 'medium' : 'extraSmall'}
              >
                {t('wallet.connect')}
              </Button>
            </StyledButtonWrapper>
          </>
        ) : (
          children.hasAccount({
            ...account,
            disconnect,
            router,
            t,
            zorb: zorbImageDataURI(account.address, 'address'),
          })
        )
      }
    </ConnectButton.Custom>
  )
}

export const HeaderConnect = () => {
  return (
    <ConnectButtonWrapper>
      {{
        hasAccount: ({ address, ensName, ensAvatar, t, disconnect, zorb }) => (
          <Profile
            address={address}
            ensName={ensName}
            dropdownItems={[
              {
                label: t('wallet.myProfile'),
                wrapper: (children, key) => (
                  <Link href="/my/profile" key={key}>
                    {children}
                  </Link>
                ),
                as: 'a',
                color: 'text',
              },
              {
                label: t('wallet.disconnect'),
                color: 'red',
                onClick: () => disconnect(),
              },
            ]}
            avatar={ensAvatar || zorb}
            size="medium"
            alignDropdown="right"
          />
        ),
      }}
    </ConnectButtonWrapper>
  )
}
