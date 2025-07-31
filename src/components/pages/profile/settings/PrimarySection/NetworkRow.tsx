import styled, { css } from 'styled-components'

import { Typography } from '@ensdomains/thorin'

import { AvatarWithZorb } from '@app/components/AvatarWithZorb'
import { DynamicAddressIcon } from '@app/assets/address/DynamicAddressIcon'

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

const NetworkIcon = styled.div(
  ({ theme }) => css`
    width: ${theme.space['8']};
    height: ${theme.space['8']};
    display: flex;
    align-items: center;
    justify-content: center;
  `,
)

interface NetworkData {
  id: string
  name: string
  network: string
  icon: string
  isSet: boolean
}

interface NetworkRowProps {
  network: NetworkData
  onSetPrimary?: (networkId: string) => void
  onRemovePrimary?: (networkId: string) => void
}

export const NetworkRowComponent = ({ network }: NetworkRowProps) => {
  return (
    <NetworkRow>
      <NetworkInfo>
        <ZorbContainer>
          <AvatarWithZorb name={network.name} label={`${network.name} avatar`} size="8" />
        </ZorbContainer>
        <Typography fontVariant="body" weight="bold">
          {network.name}
        </Typography>
      </NetworkInfo>
      <NetworkIcon>
        <DynamicAddressIcon name={network.icon} size="8" />
      </NetworkIcon>
    </NetworkRow>
  )
}