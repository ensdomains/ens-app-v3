import { QuestionCircleSVG } from '@ensdomains/thorin'

import { DynamicNetworkIconName, dynamicNetworkIcons } from './dynamicNetworkIcons'

export const DynamicNetworkIcon = ({
  name,
  showDefault = true,
  ...props
}: JSX.IntrinsicAttributes & {
  name: DynamicNetworkIconName | string
  showDefault?: boolean
}) => {
  if (name.toLowerCase() in dynamicNetworkIcons) {
    const key = name.toLowerCase() as DynamicNetworkIconName
    const Icon = dynamicNetworkIcons[key]
    return <Icon {...props} />
  }
  if (showDefault) {
    return <QuestionCircleSVG {...props} />
  }
  return null
}
