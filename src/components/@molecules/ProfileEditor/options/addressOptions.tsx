import { ComponentProps } from 'react'
import styled, { css } from 'styled-components'

import { Select } from '@ensdomains/thorin'

import { DynamicAddressIcon } from '@app/assets/address/DynamicAddressIcon'
import supportedAddresses from '@app/constants/supportedAddresses.json'
import unsupportedAddresses from '@app/constants/unsupportedAddresses.json'
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
    color: ${theme.colors.backgroundPrimary};
    border-radius: ${theme.radii.large};
    font-size: 1rem;
    font-weight: ${theme.fontWeights.normal};
    letter-spacing: ${theme.letterSpacings['-0.01']};
    padding: ${theme.space['0.25']} ${theme.space['1.5']};
  `,
)

const supportedAddressOptions = supportedAddresses.map((coin) => ({
  value: formSafeKey(coin.toUpperCase()),
  label: coin.toUpperCase(),
  node: <AddressWrapper>{coin}</AddressWrapper>,
  prefix: (
    <IconWrapper>
      <DynamicAddressIcon name={coin.toLowerCase()} />
    </IconWrapper>
  ),
}))

const unSupporedAddresssOptions = unsupportedAddresses.map((coin) => ({
  value: formSafeKey(coin.toUpperCase()),
  label: coin.toUpperCase(),
  node: <UnsupportedAddressWrapper>{coin.toUpperCase}</UnsupportedAddressWrapper>,
}))

const addressOptions = [...supportedAddressOptions, ...unSupporedAddresssOptions] as ComponentProps<
  typeof Select
>['options']
export default addressOptions
