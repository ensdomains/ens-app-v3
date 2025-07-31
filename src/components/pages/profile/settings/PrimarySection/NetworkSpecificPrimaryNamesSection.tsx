import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, Typography } from '@ensdomains/thorin'

import { QuestionTooltip } from '@app/components/@molecules/QuestionTooltip/QuestionTooltip'

import { NetworkRowComponent } from './NetworkRow'

const NetworkSpecificSection = styled.div(
  ({ theme }) => css`
    border-top: 1px solid ${theme.colors.border};
    padding-top: ${theme.space['4']};
    margin-top: ${theme.space['4']};
    display: flex;
    flex-direction: column;
    gap: ${theme.space['4']};
  `,
)

const NetworkSectionHeader = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: ${theme.space['2']};
  `,
)

const NetworkTitleRow = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    gap: ${theme.space['2']};
  `,
)

// Mock data for network-specific primary names
const mockNetworkPrimaryNames = [
  {
    id: 'eth',
    name: 'domico.eth',
    network: 'Ethereum',
    icon: 'eth',
    isSet: true,
  },
  {
    id: 'base',
    name: 'domico.base.eth',
    network: 'Base',
    icon: 'base',
    isSet: false,
  },
]

export const NetworkSpecificPrimaryNamesSection = () => {
  const { t } = useTranslation('settings')

  const handleNetworkManage = () => {
    // TODO: Implement network-specific manage functionality
    console.log('Manage network-specific primary names')
  }

  const handleSetPrimary = (networkId: string) => {
    // TODO: Implement set primary functionality
    console.log(`Set primary name for ${networkId}`)
  }

  const handleRemovePrimary = (networkId: string) => {
    // TODO: Implement remove primary functionality
    console.log(`Remove primary name for ${networkId}`)
  }

  return (
    <NetworkSpecificSection>
      <NetworkSectionHeader>
        <NetworkTitleRow>
          <Typography fontVariant="headingFour">Network-specific primary names</Typography>
          <QuestionTooltip content="Network-specific primary names will override your default primary name on their specific network." />
        </NetworkTitleRow>
        <Button size="small" colorStyle="accentSecondary" onClick={handleNetworkManage} width="fit">
          Manage
        </Button>
      </NetworkSectionHeader>

      <Typography color="textSecondary" fontVariant="small">
        Network-specific primary names will override your default primary name on their specific
        network.
      </Typography>

      <div>
        {mockNetworkPrimaryNames.map((network) => (
          <NetworkRowComponent
            key={network.id}
            network={network}
          />
        ))}
      </div>
    </NetworkSpecificSection>
  )
}
