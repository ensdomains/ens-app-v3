import { BreakpointProvider } from '@app/utils/BreakpointProvider'
import { EnsProvider } from '@app/utils/EnsProvider'
import type { DefaultTheme } from '@ensdomains/thorin'
import { ThorinGlobalStyles } from '@ensdomains/thorin'
import {
  Chain,
  connectorsForWallets,
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { providers } from 'ethers'
import { appWithTranslation } from 'next-i18next'
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from 'react-query'
import { createGlobalStyle, ThemeProvider } from 'styled-components'
import { chain, WagmiProvider } from 'wagmi'
import '../styles.css'

const theme: DefaultTheme = {
  mode: 'light',
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
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
}

const infuraId = '58a380d3ecd545b2b5b3dad5d2b18bf0'

const provider = ({ chainId }: { chainId?: number }) =>
  process.env.NEXT_PUBLIC_PROVIDER
    ? new providers.JsonRpcProvider(process.env.NEXT_PUBLIC_PROVIDER, chainId)
    : new providers.InfuraProvider(chainId, infuraId)

const chains: Chain[] = [
  { ...chain.mainnet, name: 'Ethereum' },
  { ...chain.ropsten, name: 'Ropsten' },
]

const wallets = getDefaultWallets({
  chains,
  infuraId,
  appName: 'ENS',
  jsonRpcUrl: ({ chainId }) =>
    chains.find((x) => x.id === chainId)?.rpcUrls?.[0] ??
    chain.mainnet.rpcUrls[0],
})

const connectors = connectorsForWallets(wallets)

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
      <RainbowKitProvider chains={chains}>
        <WagmiProvider autoConnect connectors={connectors} provider={provider}>
          <EnsProvider>
            <ThemeProvider theme={theme}>
              <BreakpointProvider queries={breakpoints}>
                <GlobalStyle />
                <ThorinGlobalStyles />
                <Component {...pageProps} />
              </BreakpointProvider>
            </ThemeProvider>
          </EnsProvider>
        </WagmiProvider>
      </RainbowKitProvider>
    </QueryClientProvider>
  )
}

export default appWithTranslation(MyApp)
