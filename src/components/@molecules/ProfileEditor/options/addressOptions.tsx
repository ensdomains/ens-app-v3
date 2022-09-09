import { DynamicAddressIcon, AddressIconType } from '@app/assets/address/DynamicAddressIcon'
import coinList from '@app/constants/coinList'
import supportedAddresses from '@app/constants/supportedAddresses.json'
import styled, { css } from 'styled-components'
import { Select } from '@ensdomains/thorin'
import { ComponentProps } from 'react'
import { formSafeKey } from '@app/utils/editor'

const IconWrapper = styled.div(
  () => css`
    width: 22px;
    display: flex;
    align-items: center;
  `,
)

const AddressWrapper = styled.div(
  ({ theme }) => css`
    font-weight: ${theme.fontWeights.bold};
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
        value: formSafeKey(coin),
        label: coin,
        node: <AddressWrapper>{coin}</AddressWrapper>,
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
      value: formSafeKey(coin),
      label: coin,
      node: <UnsupportedAddressWrapper>{coin}</UnsupportedAddressWrapper>,
    },
  ]
}, [] as ComponentProps<typeof Select>['options'])
export default addressOptions
