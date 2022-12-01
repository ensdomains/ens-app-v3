import dynamic from 'next/dynamic'

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
  ...props
}: JSX.IntrinsicAttributes & {
  name: AddressIconType | string
}) => {
  if (name in addressIconTypes) {
    const key = name as AddressIconType
    const Icon = addressIconTypes[key] as any
    return <Icon {...props} />
  }
  const Icon = dynamic(() => import('../Question.svg')) as any
  return <Icon {...props} />
}
