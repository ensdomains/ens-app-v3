import dynamic from 'next/dynamic'

import { QuestionCircleSVG } from '@ensdomains/thorin'

export const textIcons = {
  description: dynamic(() => import('./TextBio.svg')),
  url: dynamic(() => import('./TextURL.svg')),
  location: dynamic(() => import('./TextLocation.svg')),
  name: dynamic(() => import('./TextName.svg')),
  publicKey: dynamic(() => import('./TextPublicKey.svg')),
}

export const DynamicTextIcon = ({
  name,
  showDefault = true,
  ...props
}: {
  name: keyof typeof textIcons | string
  showDefault?: boolean
  fill?: string
}) => {
  if (name in textIcons) {
    const key = name as keyof typeof textIcons
    const Icon = textIcons[key] as any
    return <Icon {...props} />
  }
  if (showDefault) {
    return <QuestionCircleSVG {...props} />
  }
  return null
}
