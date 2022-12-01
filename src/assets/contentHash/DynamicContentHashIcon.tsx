import dynamic from 'next/dynamic'

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
  ...props
}: JSX.IntrinsicAttributes & {
  name: ContentHashIconType | string
}) => {
  if (name in contentHashIconTypes) {
    const Icon = contentHashIconTypes[name as ContentHashIconType]
    return <Icon {...props} />
  }
  const Icon = dynamic(() => import('../Question.svg'))
  return <Icon {...props} />
}
