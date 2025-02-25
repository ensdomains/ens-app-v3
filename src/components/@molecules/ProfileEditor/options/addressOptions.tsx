import { ComponentProps } from 'react'
import styled, { css } from 'styled-components'

import { Select } from '@ensdomains/thorin'

import { DynamicAddressIcon } from '@app/assets/address/DynamicAddressIcon'
import coinsWithIcons from '@app/constants/coinsWithIcons.json'
import coinsWithoutIcons from '@app/constants/coinsWithoutIcons.json'
import { formSafeKey } from '@app/utils/editor'
import { camelToConstant } from '@app/utils/name'

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
    background-color: ${theme.colors.grey};
    color: ${theme.colors.backgroundPrimary};
    border-radius: ${theme.radii.large};
    font-size: 1rem;
    font-weight: ${theme.fontWeights.normal};
    letter-spacing: ${theme.letterSpacings['-0.01']};
    padding: ${theme.space['0.25']} ${theme.space['1.5']};
  `,
)

const coinsWithIconsOptions = coinsWithIcons.map((coin) => ({
  value: formSafeKey(coin),
  label: camelToConstant(coin),
  node: <AddressWrapper>{coin}</AddressWrapper>,
  prefix: (
    <IconWrapper>
      <DynamicAddressIcon name={coin.toLowerCase()} />
    </IconWrapper>
  ),
}))

const coinsWithoutIconsOptions = coinsWithoutIcons.map((coin) => ({
  value: formSafeKey(coin),
  label: camelToConstant(coin),
  node: <UnsupportedAddressWrapper>{coin.toUpperCase()}</UnsupportedAddressWrapper>,
}))

const addressOptions = [...coinsWithIconsOptions, ...coinsWithoutIconsOptions] as ComponentProps<
  typeof Select
>['options']
export default addressOptions
