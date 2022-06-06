import mq from '@app/mediaQuery'
import { zorbImageDataURI } from '@app/utils/gradient'
import { Button, EthTransparentInvertedSVG, Profile } from '@ensdomains/thorin'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useRouter } from 'next/router'
import type { TFunction } from 'react-i18next'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useDisconnect } from 'wagmi'

const StyledIconEthTransparentInverted = styled(EthTransparentInvertedSVG)`
  ${({ theme }) => css`
    color: white;
    display: block;
    margin-right: calc(${theme.space['2']} * -1);
    margin-left: calc(${theme.space['2']} * -1);
    height: ${theme.space['5']};
    width: ${theme.space['5']};
    ${mq.sm.min`
      height: ${theme.space['6']};
      width: ${theme.space['6']};
    `}
  `}
`

const StyledButtonWrapper = styled.div<{ $isTabBar?: boolean }>`
  ${({ theme, $isTabBar }) =>
    $isTabBar &&
    css`
      flex-grow: 1;
      & button {
        width: ${theme.space.full};
        border-radius: ${theme.radii.full};
      }
    `}
`

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
  children: (renderProps: AccountRenderProps) => React.ReactNode
}) => {
  const router = useRouter()
  const { t } = useTranslation('common')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { disconnect } = useDisconnect()

  return (
    <ConnectButton.Custom>
      {({ account, openConnectModal }) =>
        !account ? (
          <StyledButtonWrapper $isTabBar={isTabBar}>
            <Button
              onClick={() => openConnectModal()}
              prefix={<StyledIconEthTransparentInverted />}
              variant="action"
              size="medium"
            >
              {t('wallet.connect')}
            </Button>
          </StyledButtonWrapper>
        ) : (
          children({
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
      {({ address, ensName, ensAvatar, router, t, disconnect, zorb }) => (
        <Profile
          address={address}
          ensName={ensName}
          dropdownItems={[
            {
              label: t('wallet.myProfile'),
              onClick: () => router.push('/my/profile'),
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
      )}
    </ConnectButtonWrapper>
  )
}
