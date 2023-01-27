import dynamic from 'next/dynamic'

import { QuestionCircleSVG } from '@ensdomains/thorin'

export type ContentHashIconType = keyof typeof contentHashIconTypes

export const contentHashIconTypes = {
  ipfs: dynamic(() => import('./ContentHashIPFS.svg')),
  skynet: dynamic(() => import('./skynet.svg')),
  onion: dynamic(() => import('./onion.svg')),
  swarm: dynamic(() => import('./swarm.svg')),
  arweave: dynamic(() => import('./arweave.svg')),
}

export const DynamicContentHashIcon = ({
  name,
  showDefault = true,
  ...props
}: JSX.IntrinsicAttributes & {
  name: ContentHashIconType | string
  showDefault?: boolean
}) => {
  if (name in contentHashIconTypes) {
    const Icon = contentHashIconTypes[name as ContentHashIconType]
    return <Icon {...props} />
  }
  if (showDefault) {
    return <QuestionCircleSVG {...props} />
  }
  return null
}
