import { Router } from 'next/router'
import posthog from 'posthog-js'
import { PostHogProvider as PostHogProviderBase } from 'posthog-js/react'
import { ReactNode, useEffect } from 'react'
import { useAccountEffect } from 'wagmi'

import { CookieConsentBanner } from '@app/components/CookieConsentBanner'

import { sendEvent } from './events'

function isProduction() {
  if (typeof window !== 'undefined') {
    return !!window.location.host.match('ens.domains')
  }
}

export const PostHogProvider = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      return
    }

    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      person_profiles: 'identified_only', // or 'always' to create profiles for anonymous users as well
      // Enable debug mode in development
      loaded: (posthogInstance) => {
        if (!isProduction()) {
          posthogInstance.debug()
        }
      },
    })

    const handleRouteChange = () => posthog?.capture('$pageview')

    Router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      Router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [])

  useAccountEffect({
    onConnect(data) {
      posthog.identify(
        data.address,
        {
          address: data.address,
        },
        {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          initial_address: data.address,
        },
      )

      posthog.register({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        wallet_address: data.address,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        chain_id: data.chainId,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        wallet_connector: data.connector.name,
      })

      sendEvent('wallet:connect', {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        wallet_address: data.address,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        chain_id: data.chainId,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        wallet_connector: data.connector.name,
      })
    },
    onDisconnect() {
      sendEvent('wallet:disconnect')
      posthog.reset()
    },
  })

  return (
    <PostHogProviderBase client={posthog}>
      {children}
      <CookieConsentBanner />
    </PostHogProviderBase>
  )
}
