import { lightTheme, RainbowKitProvider, Theme } from '@usecapsule/rainbowkit'
import { ComponentProps } from 'react'

import { capsuleClient, capsuleIntegratedProps } from './capsuleWallet'

type RainbowKitProviderProps = ComponentProps<typeof RainbowKitProvider>

const rainbowKitTheme: Theme = {
  ...lightTheme({
    // accentColor: thorinLightTheme.colors.accent, // requires a hex string color but thorinLightTheme returns a hsl string
    borderRadius: 'medium',
  }),
  fonts: {
    body: 'Satoshi, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
  },
}

export const RainbowKitWithCapsuleProvider = (props: RainbowKitProviderProps) => {
  return (
    <RainbowKitProvider
      theme={rainbowKitTheme}
      {...props}
      // @ts-ignore
      capsule={capsuleClient}
      capsuleIntegratedProps={capsuleIntegratedProps}
    />
  )
}
