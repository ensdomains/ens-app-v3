import '@rainbow-me/rainbowkit/styles.css'
import { NextPage } from 'next'
import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import { ReactElement, ReactNode } from 'react'

import { setupAnalytics } from '@app/utils/analytics'

import '../styles.css'

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

setupAnalytics()

const DynamicAllTheThings = dynamic(() => import('@app/components/AllTheThings'), {
  loading: () => <p>Loading...</p>,
})

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page)

  return <DynamicAllTheThings {...{ getLayout, Component, pageProps }} />
}

export default MyApp
