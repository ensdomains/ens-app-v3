import { QuestionCircleSVG } from '@ensdomains/thorin'

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
    return <QuestionCircleSVG {...props} />
  }
  return null
}
