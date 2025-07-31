import styled, { css } from 'styled-components'

import { Button, Card, Typography } from '@ensdomains/thorin'

import { DynamicAddressIcon } from '@app/assets/address/DynamicAddressIcon'
import { QuestionTooltip } from '@app/components/@molecules/QuestionTooltip/QuestionTooltip'

const StyledCard = styled(Card)(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space['4']};
    padding: ${theme.space['4']};
  `,
)

const SectionHeader = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: ${theme.space['2']};
  `,
)

const TitleRow = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    gap: ${theme.space['2']};
  `,
)

const NetworkRow = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${theme.space['3']} 0;
    border-bottom: 1px solid ${theme.colors.border};

    &:last-child {
      border-bottom: none;
    }
  `,
)

const NetworkInfo = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    gap: ${theme.space['3']};
  `,
)

const NetworkIcon = styled.div(
  ({ theme }) => css`
    width: ${theme.space['8']};
    height: ${theme.space['8']};
    display: flex;
    align-items: center;
    justify-content: center;
  `,
)

const NetworkActions = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    gap: ${theme.space['2']};
  `,
)

const ActionButton = styled.button<{ variant?: 'set' | 'remove' }>(
  ({ theme, variant = 'set' }) => css`
    width: ${theme.space['8']};
    height: ${theme.space['8']};
    border-radius: ${theme.radii.full};
    border: 1px solid ${theme.colors.border};
    background-color: ${variant === 'set' ? theme.colors.blue : theme.colors.background};
    color: ${variant === 'set' ? theme.colors.white : theme.colors.grey};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: ${theme.fontSizes.large};
    font-weight: bold;

    &:hover {
      opacity: 0.8;
    }
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
  const handleManage = () => {
    // TODO: Implement manage functionality
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
    <StyledCard>
      <SectionHeader>
        <TitleRow>
          <Typography fontVariant="headingFour">Network-specific primary names</Typography>
          <QuestionTooltip content="Network-specific primary names will override your default primary name on their specific network." />
        </TitleRow>
        <Button size="small" colorStyle="accentSecondary" onClick={handleManage}>
          Manage
        </Button>
      </SectionHeader>

      <Typography color="textSecondary" fontVariant="small">
        Network-specific primary names will override your default primary name on their specific
        network.
      </Typography>

      <div>
        {mockNetworkPrimaryNames.map((network) => (
          <NetworkRow key={network.id}>
            <NetworkInfo>
              <NetworkIcon>
                <DynamicAddressIcon name={network.icon} size="8" />
              </NetworkIcon>
              <Typography fontVariant="body" weight="bold">
                {network.name}
              </Typography>
            </NetworkInfo>
            <NetworkActions>
              {network.isSet ? (
                <ActionButton
                  variant="remove"
                  onClick={() => handleRemovePrimary(network.id)}
                  title="Remove primary name"
                >
                  −
                </ActionButton>
              ) : (
                <ActionButton
                  variant="set"
                  onClick={() => handleSetPrimary(network.id)}
                  title="Set as primary name"
                >
                  +
                </ActionButton>
              )}
            </NetworkActions>
          </NetworkRow>
        ))}
      </div>
    </StyledCard>
  )
}
