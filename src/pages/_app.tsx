import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { EthereumClient, modalConnectors } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'
import { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { ReactElement, ReactNode } from 'react'
import { I18nextProvider } from 'react-i18next'
import { ThemeProvider, createGlobalStyle } from 'styled-components'
import { WagmiConfig, chain, configureChains, createClient } from 'wagmi'
import { infuraProvider } from 'wagmi/providers/infura'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'

import { ThorinGlobalStyles, lightTheme as thorinLightTheme } from '@ensdomains/thorin'

import { Notifications } from '@app/components/Notifications'
import { TransactionStoreProvider } from '@app/hooks/transactions/TransactionStoreContext'
import { Basic } from '@app/layouts/Basic'
import { TransactionFlowProvider } from '@app/transaction-flow/TransactionFlowProvider'
import { BreakpointProvider } from '@app/utils/BreakpointProvider'
import { EnsProvider } from '@app/utils/EnsProvider'
import { makePersistent } from '@app/utils/persist'

import i18n from '../i18n'
import '../styles.css'

const GlobalStyle = createGlobalStyle`
  html,
  body {
    padding: 0;
    margin: 0;
  }

  *,
  ::before,
  ::after {
    font-family: Satoshi,
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      Roboto,
      Oxygen,
      Ubuntu,
      Cantarell,
      "Fira Sans",
      "Droid Sans",
      "Helvetica Neue",
      sans-serif;
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

// 1. Get projectID at https://cloud.walletconnect.com
// ToDo: Replace with own projectID
if (!process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID)
  throw new Error('You need to provide NEXT_PUBLIC_PROJECT_ID env variable')
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

const chains = [chain.goerli, chain.localhost]

const { provider } = configureChains(chains, [
  ...(process.env.NEXT_PUBLIC_PROVIDER
    ? [
        jsonRpcProvider({
          rpc: () => ({ http: process.env.NEXT_PUBLIC_PROVIDER! }),
        }),
      ]
    : [
        jsonRpcProvider({
          rpc: (c) => ({
            http: `https://web3.ens.domains/v1/${
              c.network === 'homestead' ? 'mainnet' : c.network
            }`,
          }),
        }),
        infuraProvider({ apiKey: '58a380d3ecd545b2b5b3dad5d2b18bf0' }),
      ]),
])

const connectors = modalConnectors({
  appName: 'ENS',
  chains,
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  queryClient,
  persister: null,
})

makePersistent(queryClient)

// 3. Configure modal ethereum client
const ethereumClient = new EthereumClient(wagmiClient, chains)

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page)

  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <WagmiConfig client={wagmiClient}>
          <Web3Modal
            projectId={projectId}
            theme="light"
            accentColor="default"
            ethereumClient={ethereumClient}
          />
          <TransactionStoreProvider>
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
          </TransactionStoreProvider>
        </WagmiConfig>
      </I18nextProvider>
    </QueryClientProvider>
  )
}

export default MyApp
