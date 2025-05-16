import { lightTheme, RainbowKitProvider, Theme } from '@getpara/rainbowkit'
import { ComponentProps, useEffect, useState } from 'react'

import { lightTheme as thorinLightTheme } from '@ensdomains/thorin'

import { loadPara } from './loadPara'

type RainbowKitProviderProps = ComponentProps<typeof RainbowKitProvider>

const rainbowKitTheme: Theme = {
  ...lightTheme({
    accentColor: thorinLightTheme.colors.accent,
    borderRadius: 'medium',
  }),
  fonts: {
    body: 'Satoshi, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
  },
}

export const RainbowKitWithParaProvider = (props: RainbowKitProviderProps) => {
  const [paraData, setPara] = useState<Awaited<ReturnType<typeof loadPara>> | null>(null)

  // Dynamically load para
  useEffect(() => {
    loadPara().then(setPara)
  }, [])

  return (
    <RainbowKitProvider
      theme={rainbowKitTheme}
      {...props}
      para={paraData?.paraClient}
      paraIntegratedProps={paraData?.paraModalProps}
    />
  )
}
