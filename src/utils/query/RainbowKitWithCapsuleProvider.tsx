import { lightTheme, RainbowKitProvider, Theme } from '@usecapsule/rainbowkit'
import { ComponentProps, useEffect, useState } from 'react'

import { lightTheme as thorinLightTheme } from '@ensdomains/thorin'

import { hslToHex } from '../utils'
import { loadCapsule } from './loadCapsule'

type RainbowKitProviderProps = ComponentProps<typeof RainbowKitProvider>

const rainbowKitTheme: Theme = {
  ...lightTheme({
    accentColor: hslToHex(thorinLightTheme.colors.accent),
    borderRadius: 'medium',
  }),
  fonts: {
    body: 'Satoshi, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
  },
}

export const RainbowKitWithCapsuleProvider = (props: RainbowKitProviderProps) => {
  const [capsuleData, setCapsule] = useState<Awaited<ReturnType<typeof loadCapsule>> | null>(null)

  useEffect(() => {
    loadCapsule().then(setCapsule)
  }, [])

  return (
    <RainbowKitProvider
      theme={rainbowKitTheme}
      {...props}
      capsule={capsuleData?.capsuleClient}
      capsuleIntegratedProps={capsuleData?.capsuleModalProps}
    />
  )
}
