import mq from '@app/mediaQuery'
import { Button, EthTransparentInvertedSVG, Profile } from '@ensdomains/thorin'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import styled, { css } from 'styled-components'
import { useDisconnect } from 'wagmi'

const StyledIconEthTransparentInverted = styled(EthTransparentInvertedSVG)`
  ${({ theme }) => css`
    color: white;
    display: block;
    margin-right: calc(${theme.space['2']} * -1);
    margin-left: calc(${theme.space['2']} * -1);
    height: ${theme.space['4']};
    width: ${theme.space['4']};
    ${mq.small.min`
      height: ${theme.space['6']};
      width: ${theme.space['6']};
    `}
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
}

export const ConnectButtonWrapper = ({
  isTabBar,
  children,
}: {
  isTabBar?: boolean
  children: (renderProps: AccountRenderProps) => React.ReactNode
}) => {
  const { t } = useTranslation('common')

  return (
    <ConnectButton.Custom>
      {({ account, openConnectModal }) =>
        !account ? (
          <Button
            onClick={() => openConnectModal()}
            prefix={
              <StyledIconEthTransparentInverted size={isTabBar ? '4' : '6'} />
            }
            variant="action"
            size={isTabBar ? 'small' : 'medium'}
            shape={isTabBar ? 'circle' : 'square'}
          >
            {t('profile.connect')}
          </Button>
        ) : (
          children(account)
        )
      }
    </ConnectButton.Custom>
  )
}

export const HeaderConnect = () => {
  const router = useRouter()
  const { t } = useTranslation('common')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { disconnect } = useDisconnect()

  return (
    <ConnectButtonWrapper>
      {({ address, ensName, ensAvatar }) => (
        <Profile
          address={address}
          ensName={ensName}
          dropdownItems={[
            {
              label: t('profile.myProfile'),
              onClick: () => router.push('/profile/me'),
            },
            {
              label: t('profile.disconnect'),
              color: 'red',
              onClick: () => disconnect(),
            },
          ]}
          avatar={ensAvatar}
          size="medium"
          alignDropdown="right"
        />
      )}
    </ConnectButtonWrapper>
  )
}
