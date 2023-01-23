import dynamic from 'next/dynamic'

import { QuestionCircleSVG } from '@ensdomains/thorin'

export type AddressIconType = keyof typeof addressIconTypes

export const addressIconTypes = {
  btc: dynamic(() => import('./AddressBitcoin.svg')),
  bnb: dynamic(() => import('./AddressBNB.svg')),
  eth: dynamic(() => import('./AddressEthereum.svg')),
  doge: dynamic(() => import('./AddressDoge.svg')),
  ltc: dynamic(() => import('./AddressLitecoin.svg')),
  dot: dynamic(() => import('./AddressPolkadot.svg')),
  sol: dynamic(() => import('./AddressSolana.svg')),
}

export const DynamicAddressIcon = ({
  name,
  showDefault = true,
  ...props
}: JSX.IntrinsicAttributes & {
  name: AddressIconType | string
  showDefault?: boolean
}) => {
  if (name.toLowerCase() in addressIconTypes) {
    const key = name.toLowerCase() as AddressIconType
    const Icon = addressIconTypes[key] as any
    return <Icon {...props} />
  }
  if (showDefault) {
    return <QuestionCircleSVG {...props} />
  }
  return null
}
