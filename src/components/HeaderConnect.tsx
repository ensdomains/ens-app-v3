import mq from '@app/mediaQuery'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import {
  Button,
  EthTransparentInvertedSVG,
  Profile,
  tokens,
} from '@ensdomains/thorin'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import { useDisconnect } from 'wagmi'

const StyledIconEthTransparentInverted = styled(EthTransparentInvertedSVG)`
  color: white;
  display: block;
  margin-right: calc(${tokens.space['2']} * -1);
  margin-left: calc(${tokens.space['2']} * -1);
  height: ${tokens.space['4']};
  width: ${tokens.space['4']};
  ${mq.small.min`
    height: ${tokens.space['6']};
    width: ${tokens.space['6']};
  `}
`

export const HeaderConnect = () => {
  const router = useRouter()
  const breakpoints = useBreakpoint()
  const { t } = useTranslation('common')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { disconnect } = useDisconnect()

  return (
    <ConnectButton.Custom>
      {({ account, openConnectModal }) =>
        !account ? (
          <Button
            onClick={() => openConnectModal()}
            prefix={
              <StyledIconEthTransparentInverted size={{ xs: '4', sm: '6' }} />
            }
            variant="action"
            size={breakpoints.sm ? 'medium' : 'small'}
          >
            {t('profile.connect')}
          </Button>
        ) : (
          <Profile
            address={account.address}
            ensName={account.ensName}
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
            avatar={account.ensAvatar}
            size={breakpoints.sm ? 'medium' : 'small'}
            alignDropdown="right"
          />
        )
      }
    </ConnectButton.Custom>
  )
}
