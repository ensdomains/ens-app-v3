import styled, { css } from 'styled-components'

import { Typography } from '@ensdomains/thorin'

import { DynamicNetworkIcon } from '@app/assets/network/DynamicNetworkIcon'
import { AvatarWithZorb } from '@app/components/AvatarWithZorb'

const NetworkRow = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${theme.space['3']} ${theme.space['4']};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.radii.large};
    margin-bottom: ${theme.space['2']};
    background-color: ${theme.colors.background};

    &:last-child {
      margin-bottom: 0;
    }
  `,
)

const NetworkInfo = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    gap: ${theme.space['3']};
    flex: 1;
    min-width: 0;
  `,
)

const ZorbContainer = styled.div(
  ({ theme }) => css`
    width: ${theme.space['8']};
    height: ${theme.space['8']};
    display: flex;
    align-items: center;
    justify-content: center;
  `,
)

const NetworkIcons = styled.div(
  () => css`
    display: flex;
    align-items: center;
    justify-content: center;
  `,
)

const NetworkIcon = styled.div(
  ({ theme }) => css`
    width: ${theme.space['8']};
    height: ${theme.space['8']};
    margin-left: -${theme.space['2']};
  `,
)

const NameText = styled.div(
  () => css`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
  `,
)

interface NetworkData {
  coinName: string
  coinType: number
  address: string
}

interface NetworkRowProps {
  name: string
  networks: NetworkData[]
}

export const NetworkRowComponent = ({ name, networks }: NetworkRowProps) => {
  return (
    <NetworkRow data-testid={`network-row-${name}`}>
      <NetworkInfo>
        <ZorbContainer>
          <AvatarWithZorb name={name} label={`${name} avatar`} size="8" />
        </ZorbContainer>
        <NameText>
          <Typography as="span" fontVariant="body" weight="bold">
            {name}
          </Typography>
        </NameText>
      </NetworkInfo>
      <NetworkIcons>
        {networks.map((network) => (
          <NetworkIcon data-testid={`network-icon-${name}-${network.coinName}`}>
            <DynamicNetworkIcon name={network.coinName?.replace(/-sep$/, '')} />
          </NetworkIcon>
        ))}
      </NetworkIcons>
    </NetworkRow>
  )
}
