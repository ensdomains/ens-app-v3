import CoinSVG from '@app/assets/Coin.svg'

import { DynamicAddressIconName, dynamicAddressIcons } from './dynamicAddressIcons'

export const DynamicAddressIcon = ({
  name,
  showDefault = true,
  ...props
}: JSX.IntrinsicAttributes & {
  name: DynamicAddressIconName | string
  showDefault?: boolean
}) => {
  if (name.toLowerCase() in dynamicAddressIcons) {
    const key = name.toLowerCase() as DynamicAddressIconName
    const Icon = dynamicAddressIcons[key]
    return <Icon {...props} />
  }
  if (showDefault) {
    return <CoinSVG {...props} />
  }
  return null
}
