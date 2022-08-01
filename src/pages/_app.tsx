import { Notifications } from '@app/components/Notifications'
import { Basic } from '@app/layouts/Basic'
import { TransactionFlowProvider } from '@app/transaction-flow/TransactionFlowProvider'
import { BreakpointProvider } from '@app/utils/BreakpointProvider'
import { EnsProvider } from '@app/utils/EnsProvider'
import { lightTheme as thorinLightTheme, ThorinGlobalStyles } from '@ensdomains/thorin'
import { getDefaultWallets, lightTheme, RainbowKitProvider, Theme } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { ReactElement, ReactNode } from 'react'
import { I18nextProvider } from 'react-i18next'
import { QueryClient, QueryClientProvider } from 'react-query'
import { createGlobalStyle, ThemeProvider } from 'styled-components'
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi'
import { infuraProvider } from 'wagmi/providers/infura'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import i18n from '../i18n'
import '../styles.css'

const rainbowKitTheme: Theme = {
  ...lightTheme({
    accentColor: thorinLightTheme.colors.accent,
    borderRadius: 'medium',
  }),
  fonts: {
    body: 'Satoshi, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
  },
}

const GlobalStyle = createGlobalStyle`
html,
body {
  padding: 0;
  margin: 0;
}

*, ::before, ::after {
  font-family: Satoshi, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
}

body {
  background: radial-gradient(50% 50% at 50% 50%, rgba(82, 152, 255, 0.062) 0%, rgba(255, 255, 255, 0) 100%), #F7F7F7;
}

body, .min-safe {
  min-height: 100vh;
  /* stylelint-disable-next-line value-no-vendor-prefix */
  @supports (-webkit-touch-callout: none) {
    /* stylelint-disable-next-line value-no-vendor-prefix */
    min-height: -webkit-fill-available;
  }
}

a {
  color: inherit;
  text-decoration: none;
}

* {
  box-sizing: border-box;
  font-feature-settings: "ss01" on, "ss03" on;
  /* stylelint-disable-next-line property-no-vendor-prefix */
  -moz-font-feature-settings: "ss01" on, "ss03" on;
}
`

const breakpoints = {
  xs: '(min-width: 360px)',
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
}

const { provider, chains } = configureChains(
  [chain.mainnet, chain.ropsten],
  [
    ...(process.env.NEXT_PUBLIC_PROVIDER
      ? [
          jsonRpcProvider({
            rpc: () => ({ http: process.env.NEXT_PUBLIC_PROVIDER! }),
          }),
        ]
      : []),
    jsonRpcProvider({
      rpc: () => ({ http: 'https://web3.ens.domains/v1/mainnet' }),
    }),
    infuraProvider({ infuraId: '58a380d3ecd545b2b5b3dad5d2b18bf0' }),
  ],
)

const { connectors } = getDefaultWallets({
  appName: 'ENS',
  chains,
})

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page)

  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <WagmiConfig client={wagmiClient}>
          <RainbowKitProvider theme={rainbowKitTheme} chains={chains}>
            <EnsProvider>
              <ThemeProvider theme={thorinLightTheme}>
                <BreakpointProvider queries={breakpoints}>
                  <GlobalStyle />
                  <ThorinGlobalStyles />
                  <TransactionFlowProvider>
                    <Notifications />
                    <Basic>{getLayout(<Component {...pageProps} />)}</Basic>
                  </TransactionFlowProvider>
                </BreakpointProvider>
              </ThemeProvider>
            </EnsProvider>
          </RainbowKitProvider>
        </WagmiConfig>
      </QueryClientProvider>
    </I18nextProvider>
  )
}

export default MyApp
