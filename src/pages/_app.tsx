import { BreakpointProvider } from '@app/utils/BreakpointProvider'
import { EnsProvider } from '@app/utils/EnsProvider'
import {
  lightTheme as thorinLightTheme,
  ThorinGlobalStyles,
} from '@ensdomains/thorin'
import {
  getDefaultWallets,
  lightTheme,
  RainbowKitProvider,
  Theme,
} from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { appWithTranslation } from 'next-i18next'
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from 'react-query'
import { createGlobalStyle, ThemeProvider } from 'styled-components'
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi'
import { infuraProvider } from 'wagmi/providers/infura'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
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
  min-height: 100vh;
}

a {
  color: inherit;
  text-decoration: none;
}

* {
  box-sizing: border-box;
  font-feature-settings: "ss01" on, "ss03" on;
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
    infuraProvider({ infuraId: '58a380d3ecd545b2b5b3dad5d2b18bf0' }),
    jsonRpcProvider({ rpc: () => ({ http: 'https://cloudflare-eth.com/' }) }),
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

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider theme={rainbowKitTheme} chains={chains}>
          <EnsProvider>
            <ThemeProvider theme={thorinLightTheme}>
              <BreakpointProvider queries={breakpoints}>
                <GlobalStyle />
                <ThorinGlobalStyles />
                <Component {...pageProps} />
              </BreakpointProvider>
            </ThemeProvider>
          </EnsProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  )
}

export default appWithTranslation(MyApp)
