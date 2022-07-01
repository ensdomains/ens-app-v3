import {
  DynamicAddressIcon,
  AddressIconType,
} from '@app/assets/address/DynamicAddressIcon'
import coinList from '@app/constants/coinList'
import supportedAddresses from '@app/constants/supportedAddresses.json'
import styled, { css } from 'styled-components'

const IconWrapper = styled.div(
  () => css`
    width: 22px;
    margin-right: -8px;
    margin-left: -8px;
    display: flex;
    align-items: center;
  `,
)

const coinOptions = coinList.reduce((acc, coin) => {
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
    },
  ]
}, [] as { value: string; label: string; prefix?: React.ReactNode }[])
export default coinOptions
