import { RainbowKitProvider } from '@usecapsule/rainbowkit'
import { ComponentProps } from 'react'

import { capsuleClient, capsuleIntegratedProps } from './capsuleWallet'

type RainbowKitProviderProps = ComponentProps<typeof RainbowKitProvider>

export const RainbowKitWithCapsuleProvider = (props: RainbowKitProviderProps) => {
  return (
    <RainbowKitProvider
      {...props}
      // @ts-ignore
      capsule={capsuleClient}
      capsuleIntegratedProps={capsuleIntegratedProps}
    />
  )
}
