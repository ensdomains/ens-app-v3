import { DynamicAddressIcon } from '@app/assets/address/DynamicAddressIcon'
import { DynamicContentHashIcon } from '@app/assets/contentHash/DynamicContentHashIcon'
import { DynamicSocialIcon } from '@app/assets/social/DynamicSocialIcon'
import { DynamicTextIcon } from '@app/assets/text/DynamicTextIcon'

type Props = {
  name: string
  group?: string
  showDefault?: boolean
}
export const DynamicIcon = ({ group, name, showDefault = true }: Props) => {
  if (group === 'address') return <DynamicAddressIcon name={name} showDefault={showDefault} />
  if (group === 'website') return <DynamicContentHashIcon name={name} showDefault={showDefault} />
  if (group === 'social') return <DynamicSocialIcon name={name} showDefault={showDefault} />
  return <DynamicTextIcon name={name} showDefault={showDefault} />
}
