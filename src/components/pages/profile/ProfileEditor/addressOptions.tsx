import {
  DynamicAddressIcon,
  AddressIconType,
} from '@app/assets/address/DynamicAddressIcon'
import coinList from '@app/constants/coinList'
import supportedAddresses from '@app/constants/supportedAddresses.json'
import styled, { css } from 'styled-components'
import { Select } from '@ensdomains/thorin'
import { ComponentProps } from 'react'

const IconWrapper = styled.div(
  () => css`
    width: 22px;
    margin-right: -8px;
    margin-left: -8px;
    display: flex;
    align-items: center;
  `,
)

const UnsupportedAddressWrapper = styled.div(
  ({ theme }) => css`
    background-color: ${theme.colors.textTertiary};
    color: ${theme.colors.white};
    border-radius: ${theme.radii.large};
    font-size: 1rem;
    font-weight: ${theme.fontWeights.normal};
    letter-spacing: ${theme.letterSpacings['-0.01']};
    padding: ${theme.space['0.25']} ${theme.space['1.5']};
  `,
)

const addressOptions = coinList.reduce((acc, coin) => {
  if (supportedAddresses.includes(coin.toLowerCase())) {
    return [
      {
        value: coin,
        label: coin,
        prefix: (
          <IconWrapper>
            <DynamicAddressIcon name={coin.toLowerCase() as AddressIconType} />
          </IconWrapper>
        ),
      },
      ...acc,
    ]
  }
  return [
    ...acc,
    {
      value: coin,
      label: coin,
      prefix: <UnsupportedAddressWrapper>{coin}</UnsupportedAddressWrapper>,
    },
  ]
}, [] as ComponentProps<typeof Select>['options'])
export default addressOptions
