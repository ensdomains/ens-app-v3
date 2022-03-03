import { ApolloProvider } from '@apollo/client'
import getClient, { setupClient } from '@app/apollo/apolloClient'
import useReactiveVarListeners from '@app/hooks/useReactiveVarListeners'
import { BreakpointProvider } from '@app/utils/BreakpointProvider'
import { ThemeProvider } from '@ensdomains/thorin'
import '@ensdomains/thorin/styles'
import { appWithTranslation } from 'next-i18next'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import { createGlobalStyle } from 'styled-components'
import '../styles.css'

const GlobalStyle = createGlobalStyle`
html,
body {
  padding: 0;
  margin: 0;
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

const ApolloReactiveProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  useReactiveVarListeners()

  return <>{children}</>
}

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('@app/setup').then((setup) => setup.default(false))
    }
  }, [])

  setupClient()
  return (
    <>
      <GlobalStyle />
      <ApolloProvider {...{ client: getClient() }}>
        <ApolloReactiveProvider>
          <ThemeProvider>
            <BreakpointProvider queries={breakpoints}>
              <Component {...pageProps} />
            </BreakpointProvider>
          </ThemeProvider>
        </ApolloReactiveProvider>
      </ApolloProvider>
    </>
  )
}

export default appWithTranslation(MyApp)
